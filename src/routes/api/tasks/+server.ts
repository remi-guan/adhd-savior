import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { TaskInputSchema, TaskResponseSchema } from '$lib/schemas';
import { generateTaskMetadataPrompt } from '$lib/prompts';
import { generateResponse } from '$lib/openai';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    
    // Validate input with Zod
    const validatedInput = TaskInputSchema.parse(body);
    
    // Generate task metadata using AI
    console.log('生成任务元数据:', validatedInput.tasks);
    
    const aiResponse = await generateResponse({
      systemPrompt: generateTaskMetadataPrompt,
      input: `请为以下任务生成元数据：${JSON.stringify(validatedInput.tasks)}`
    });
    
    // Validate response
    const validatedResponse = TaskResponseSchema.parse(aiResponse);
    
    return json(validatedResponse);
  } catch (error) {
    console.error('Task API error:', error);
    
    if (error instanceof Error && 'issues' in error) {
      return json({ error: '输入数据验证失败', details: error.issues }, { status: 400 });
    }
    
    return json({ error: '生成任务元数据时发生错误' }, { status: 500 });
  }
};
