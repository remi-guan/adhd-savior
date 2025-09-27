import axios from 'axios';
import type { 
  TaskInput, 
  TaskResponse, 
  ImageUploadResponse,
  TextExtractInput,
  TextExtractResponse,
  FirstSuggestionInput,
  FirstSuggestionResponse,
  CongratsInput,
  CongratsResponse
} from './schemas';

// Create axios instance with default config
const api = axios.create({
  baseURL: '/api',
  timeout: 30000, // 30 seconds timeout for image uploads
  headers: {
    'Content-Type': 'application/json'
  }
});

// API response type helper
type ApiResponse<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
  details?: string;
};

/**
 * Centralized error handler for API requests
 * @param error - The caught error
 * @param defaultMessage - Default error message to show
 * @param context - Context for logging (function name)
 * @returns Standardized error response
 */
function handleApiError(error: unknown, defaultMessage: string, context: string): ApiResponse<never> {
  console.error(`${context} error:`, error);
  
  if (axios.isAxiosError(error) && error.response) {
    const errorData = error.response.data;
    return {
      success: false,
      error: errorData?.error || defaultMessage,
      details: errorData?.details
    };
  }
  
  return {
    success: false,
    error: '网络错误，请检查网络连接'
  };
}

/**
 * Generic API request wrapper
 * @param endpoint - API endpoint path
 * @param data - Request data
 * @param options - Additional axios options
 * @param defaultErrorMessage - Default error message
 * @param context - Context for error logging
 * @returns Promise with API response
 */
async function makeApiRequest<TResponse, TInput = unknown>(
  endpoint: string,
  data: TInput,
  options: { headers?: Record<string, string> } = {},
  defaultErrorMessage: string,
  context: string
): Promise<ApiResponse<TResponse>> {
  try {
    const response = await api.post<TResponse>(endpoint, data, options);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error, defaultErrorMessage, context);
  }
}

/**
 * Generate task metadata for a list of tasks
 * @param tasks - Array of task strings
 * @returns Promise with task metadata including icons, colors, and encouragement
 */
export async function generateTaskMeta(tasks: string[]): Promise<ApiResponse<TaskResponse>> {
  const input: TaskInput = { tasks };
  return makeApiRequest<TaskResponse, TaskInput>(
    '/tasks',
    input,
    {},
    '生成任务元数据失败',
    'Task meta'
  );
}

/**
 * Upload an image file and extract tasks from it
 * @param file - The image file to upload and process
 * @returns Promise with extracted tasks
 */
export async function uploadAndExtractTasks(file: File): Promise<ApiResponse<ImageUploadResponse>> {
  const formData = new FormData();
  formData.append('file', file);

  return makeApiRequest<ImageUploadResponse, FormData>(
    '/upload',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
    '上传和提取任务失败',
    'Upload and extract'
  );
}

/**
 * Extract tasks from text input
 * @param text - The text containing thoughts and ideas
 * @returns Promise with extracted tasks
 */
export async function extractTasksFromText(text: string): Promise<ApiResponse<TextExtractResponse>> {
  const input: TextExtractInput = { text };
  return makeApiRequest<TextExtractResponse, TextExtractInput>(
    '/extract-text',
    input,
    {},
    '从文本提取任务失败',
    'Text extract'
  );
}

/**
 * Generate first step suggestion for a task
 * @param task - The task name
 * @returns Promise with first step suggestion and tips
 */
export async function generateFirstSuggestion(task: string): Promise<ApiResponse<FirstSuggestionResponse>> {
  const input: FirstSuggestionInput = { task };
  return makeApiRequest<FirstSuggestionResponse, FirstSuggestionInput>(
    '/first-suggestion',
    input,
    {},
    '生成建议失败',
    'First suggestion'
  );
}

/**
 * Generate congratulations message for completing a task
 * @param task - The task name
 * @param timeSpent - Optional time spent in minutes
 * @returns Promise with congratulations message and next step suggestion
 */
export async function generateCongrats(
  task: string,
  timeSpent?: number
): Promise<ApiResponse<CongratsResponse>> {
  const input: CongratsInput = { task, timeSpent };
  return makeApiRequest<CongratsResponse, CongratsInput>(
    '/congrats',
    input,
    {},
    '生成祝贺消息失败',
    'Congrats'
  );
}

