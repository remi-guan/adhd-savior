import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ImageUploadResponseSchema } from '$lib/schemas';
import { extractTasksFromImagePrompt } from '$lib/prompts';
import { generateResponse } from '$lib/openai';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const POST: RequestHandler = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return json({ error: '没有上传文件' }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return json({ 
        error: '不支持的文件类型，请上传 JPEG、PNG、WebP 或 GIF 图片' 
      }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return json({ 
        error: '文件太大，请上传小于 10MB 的图片' 
      }, { status: 400 });
    }

    // Convert File to base64 for AI processing
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const imageBase64 = `data:${file.type};base64,${base64}`;

    // Extract tasks from image using AI
    console.log('从图片提取任务...');
    const aiResponse = await generateResponse({
      systemPrompt: extractTasksFromImagePrompt,
      input: '请从这张图片中提取所有的任务',
      imageUrl: imageBase64
    });

    // Validate AI response
    const validatedResponse = ImageUploadResponseSchema.parse(aiResponse);

    return json(validatedResponse);

  } catch (error) {
    console.error('Upload error:', error);
    
    if (error instanceof Error) {
      return json({ 
        error: '上传失败',
        details: error.message 
      }, { status: 500 });
    }
    
    return json({ error: '上传时发生未知错误' }, { status: 500 });
  }
};
