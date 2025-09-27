import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { FirstSuggestionInputSchema, FirstSuggestionResponseSchema } from '$lib/schemas';
import { generateFirstSuggestionPrompt } from '$lib/prompts';
import { generateResponse } from '$lib/openai';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    
    // Validate input with Zod
    const validatedInput = FirstSuggestionInputSchema.parse(body);
    
    // Generate first suggestion using AI
    console.log('生成首个任务建议:', validatedInput.task);
    
    const aiResponse = await generateResponse({
      systemPrompt: generateFirstSuggestionPrompt,
      input: `请为以下任务生成第一步建议：${validatedInput.task}`
    });
    
    // Validate response
    const validatedResponse = FirstSuggestionResponseSchema.parse(aiResponse);
    
    return json(validatedResponse);
  } catch (error) {
    console.error('First suggestion API error:', error);
    
    if (error instanceof Error && 'issues' in error) {
      return json({ error: '输入数据验证失败', details: error.issues }, { status: 400 });
    }
    
    return json({ error: '生成首个建议时发生错误' }, { status: 500 });
  }
};
