import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { CongratsInputSchema, CongratsResponseSchema } from '$lib/schemas';
import { generateCongratsPrompt } from '$lib/prompts';
import { generateResponse } from '$lib/openai';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    
    // Validate input with Zod
    const validatedInput = CongratsInputSchema.parse(body);
    
    // Generate congratulations using AI
    console.log('生成祝贺消息:', validatedInput.task);
    
    const inputText = `任务: ${validatedInput.task}${validatedInput.timeSpent ? `，花费时间: ${validatedInput.timeSpent}分钟` : ''}`;
    
    const aiResponse = await generateResponse({
      systemPrompt: generateCongratsPrompt,
      input: inputText
    });
    
    // Validate response
    const validatedResponse = CongratsResponseSchema.parse(aiResponse);
    
    return json(validatedResponse);
  } catch (error) {
    console.error('Congrats API error:', error);
    
    if (error instanceof Error && 'issues' in error) {
      return json({ error: '输入数据验证失败', details: error.issues }, { status: 400 });
    }
    
    return json({ error: '生成祝贺消息时发生错误' }, { status: 500 });
  }
};
