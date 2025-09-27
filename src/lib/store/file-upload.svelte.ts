import { uploadAndExtractTasks } from '$lib/api';
import { toast } from 'svelte-5-french-toast';

// File upload store using Svelte 5 runes
export function createFileUploadStore() {
	let isDragging = $state(false);
	let isUploading = $state(false);
	let extractedTasks = $state<string[]>([]);

	async function handleFileUpload(file: File, onComplete?: (tasks: string[]) => void) {
		if (!file || !file.type.startsWith('image/')) {
			toast.error('请选择有效的图片文件');
			return;
		}

		isUploading = true;
		isDragging = false;

		try {
			const result = await uploadAndExtractTasks(file);
			if (result.success) {
				extractedTasks = result.data.tasks;
				toast.success(`成功提取了 ${result.data.tasks.length} 个任务！`, {
					icon: '🎉'
				});
				onComplete?.(result.data.tasks);
			} else {
				toast.error(result.error || '处理图片失败，请重试');
			}
		} catch (err) {
			toast.error('处理图片时发生错误');
			console.error('Upload error:', err);
		} finally {
			isUploading = false;
		}
	}

	function setDragging(dragging: boolean) {
		isDragging = dragging;
	}

	function reset() {
		isDragging = false;
		isUploading = false;
		extractedTasks = [];
	}

	return {
		// State getters
		get isDragging() { return isDragging; },
		get isUploading() { return isUploading; },
		get extractedTasks() { return extractedTasks; },

		// Actions
		handleFileUpload,
		setDragging,
		reset
	};
}

// Create and export the store instance
export const fileUploadStore = createFileUploadStore();
