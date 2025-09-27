import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { TextExtractInputSchema, TextExtractResponseSchema } from '$lib/schemas';
import { extractTasksFromTextPrompt } from '$lib/prompts';
import { generateResponse } from '$lib/openai';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    
    // Validate input with Zod
    const validatedInput = TextExtractInputSchema.parse(body);
    
    // Extract tasks from text using AI
    console.log('从文本提取任务:', validatedInput.text);
    
    const aiResponse = await generateResponse({
      systemPrompt: extractTasksFromTextPrompt,
      input: `请从以下文字中提取任务：${validatedInput.text}`
    });
    
    // Validate response
    const validatedResponse = TextExtractResponseSchema.parse(aiResponse);
    
    return json(validatedResponse);
  } catch (error) {
    console.error('Text extract API error:', error);
    
    if (error instanceof Error && 'issues' in error) {
      return json({ error: '输入数据验证失败', details: error.issues }, { status: 400 });
    }
    
    return json({ error: '从文本提取任务时发生错误' }, { status: 500 });
  }
};
