<script lang="ts">
	import { uploadAndExtractTasks } from '$lib/api';
	import { tasksStore } from '$lib/store/tasks.svelte';
	import { toast } from 'svelte-5-french-toast';
	
	let { 
		accept = 'image/*',
		maxSize = 10 * 1024 * 1024 // 10MB
	}: {
		accept?: string;
		maxSize?: number;
	} = $props();

	let uploading = $state(false);

	async function handleFileSelect(file: File) {
		if (!file) return;

		// Validate file size
		if (file.size > maxSize) {
			toast.error(`文件太大，请选择小于 ${Math.round(maxSize / 1024 / 1024)}MB 的图片`);
			return;
		}

		uploading = true;

		try {
			// Extract tasks from image
			const result = await uploadAndExtractTasks(file);
			if (result.success) {
				toast.success(`成功提取了 ${result.data.tasks.length} 个任务！`, {
					icon: '🎉'
				});
				tasksStore.handleTasksExtracted(result.data.tasks);
			} else {
				toast.error(result.error || '处理图片失败，请重试');
			}
		} catch (err) {
			toast.error('上传失败，请重试');
			console.error('Upload error:', err);
		} finally {
			uploading = false;
		}
	}

	function handleFileInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			handleFileSelect(file);
		}
	}

</script>

<div class="w-full max-w-md mx-auto">
	<!-- File input -->
	<input
		type="file"
		{accept}
		onchange={handleFileInput}
		class="hidden"
		id="file-input"
		disabled={uploading}
	/>

	<!-- Drop zone -->
	<label
		for="file-input"
		class="block w-full p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors
			border-gray-300 hover:border-theme-300 bg-white/50
			{uploading ? 'cursor-not-allowed opacity-50' : ''}"
	>
		<div class="text-center">
			{#if uploading}
				<div class="loading loading-spinner loading-lg mx-auto mb-4"></div>
				<p class="text-gray-600">
					正在分析图片中的待办事项...
				</p>
			{:else}
				<svg class="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
				</svg>
				<p class="text-gray-600 mb-2">
					拖拽图片到这里或点击上传
				</p>
				<p class="text-sm text-gray-500">
					支持 JPG、PNG、WebP、GIF 格式，最大 {Math.round(maxSize / 1024 / 1024)}MB
				</p>
			{/if}
		</div>
	</label>
</div>
