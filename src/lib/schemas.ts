import { z } from 'zod';

export const TaskInputSchema = z.object({
  tasks: z.array(z.string())
});

export const TaskItemSchema = z.object({
  task: z.string(),
  category: z.string(),
  icon: z.string().describe('Lucide icon name'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, '颜色必须是有效的十六进制颜色代码'),
  encouragement: z.string().optional().describe('积极的鼓励文本'),
  completed: z.boolean().optional().describe('是否完成')
});

export const TaskResponseSchema = z.object({
  tasks: z.array(TaskItemSchema)
});

// First suggestion schemas
export const FirstSuggestionInputSchema = z.object({
  task: z.string().min(1, '任务不能为空')
});

export const FirstSuggestionResponseSchema = z.object({
  suggestion: z.string(),
  estimatedTime: z.string().optional(),
  tips: z.array(z.string()).optional()
});

// Image upload with task extraction
export const ImageUploadResponseSchema = z.object({
  tasks: z.array(z.string())
});

// Text-based task extraction
export const TextExtractInputSchema = z.object({
  text: z.string().min(1, '文本不能为空')
});

export const TextExtractResponseSchema = z.object({
  tasks: z.array(z.string())
});

export const CongratsInputSchema = z.object({
  task: z.string().min(1, '任务不能为空'),
  timeSpent: z.number().optional().describe('花费的时间（分钟）')
});

export const CongratsResponseSchema = z.object({
  message: z.string(),
  nextStepSuggestion: z.string().optional(),
  motivationalQuote: z.string().optional()
});

// Type exports
export type TaskInput = z.infer<typeof TaskInputSchema>;
export type TaskItem = z.infer<typeof TaskItemSchema>;
export type TaskResponse = z.infer<typeof TaskResponseSchema>;
export type FirstSuggestionInput = z.infer<typeof FirstSuggestionInputSchema>;
export type FirstSuggestionResponse = z.infer<typeof FirstSuggestionResponseSchema>;
export type ImageUploadResponse = z.infer<typeof ImageUploadResponseSchema>;
export type TextExtractInput = z.infer<typeof TextExtractInputSchema>;
export type TextExtractResponse = z.infer<typeof TextExtractResponseSchema>;
export type CongratsInput = z.infer<typeof CongratsInputSchema>;
export type CongratsResponse = z.infer<typeof CongratsResponseSchema>;

// Schema for file upload
export const UploadResponseSchema = z.object({
  success: z.boolean(),
  url: z.url(),
  fileName: z.string(),
  fileSize: z.number(),
  fileType: z.string()
});

export const UploadErrorSchema = z.object({
  error: z.string(),
  details: z.string().optional()
});

export type UploadResponse = z.infer<typeof UploadResponseSchema>;
export type UploadError = z.infer<typeof UploadErrorSchema>;
