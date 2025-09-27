<script lang="ts">
	import { fileUploadStore } from '$lib/store/file-upload.svelte';
	import { tasksStore } from '$lib/store/tasks.svelte';
	import { extractTasksFromText } from '$lib/api';
	import { toast } from 'svelte-5-french-toast';
	
	let { 
		placeholder = "输入你最近的思维想法，或拖拽你的代办清单图片到这里..."
	}: {
		placeholder?: string;
	} = $props();

	let inputValue = $state('');
	let isGenerating = $state(false);

	function handleFileInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			tasksStore.handleFileSelect(file);
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
	}

	async function handleGenerateTasks() {
		if (!inputValue.trim() || isGenerating) return;

		isGenerating = true;

		try {
			const result = await extractTasksFromText(inputValue.trim());
			if (result.success) {
				toast.success(`成功提取了 ${result.data.tasks.length} 个任务！`, {
					icon: '🎉'
				});
				tasksStore.handleTasksExtracted(result.data.tasks);
				inputValue = ''; // Clear input after successful extraction
			} else {
				toast.error(result.error || '提取任务失败，请重试');
			}
		} catch (err) {
			toast.error('处理文本时发生错误');
			console.error('Text extract error:', err);
		} finally {
			isGenerating = false;
		}
	}
</script>

<div class="relative w-full max-w-2xl mx-auto">
	<!-- Hidden file input -->
	<input
		type="file"
		accept="image/*"
		onchange={handleFileInput}
		class="hidden"
		id="thoughts-file-input"
		disabled={fileUploadStore.isUploading}
	/>

	<!-- Main input container -->
	<div class="relative">
		<div 
			class="w-full border border-gray-300 rounded-md shadow-xs
				{fileUploadStore.isDragging ? 'border-theme-400 bg-theme-50 border-2 border-dashed' : ''}"
			role="button"
			tabindex="-1"
			ondragover={handleDragOver}
		>
			
			{#if fileUploadStore.isDragging}
				<!-- Drop zone content -->
				<div class="flex flex-col items-center justify-center w-full text-center py-16">
					<div class="w-12 h-12 mb-4 rounded-full bg-theme-100 flex items-center justify-center">
						<svg class="w-6 h-6 text-theme-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
						</svg>
					</div>
					<h3 class="text-lg font-semibold text-theme-800 mb-2">释放以上传图片</h3>
					<p class="text-sm text-theme-600">AI将自动提取图片中的待办事项</p>
				</div>
			{:else}
				<!-- Normal input content -->
				<div class="p-2">
					<!-- Text input area -->
					<div class="flex items-start mb-4">
						<!-- Text input -->
						<textarea
							bind:value={inputValue}
							placeholder={placeholder}
							class="flex-1 outline-none text-gray-700 placeholder-gray-500 resize-none min-h-[1.5rem] max-h-48 leading-6 border-none p-2"
							disabled={fileUploadStore.isUploading || isGenerating}
							rows="2"
							oninput={(e) => {
								const target = e.target as HTMLTextAreaElement;
								target.style.height = 'auto';
								target.style.height = target.scrollHeight + 'px';
							}}
							onkeydown={(e) => {
								if (e.key === 'Enter' && !e.shiftKey) {
									e.preventDefault();
									handleGenerateTasks();
								}
							}}
						></textarea>
					</div>

					<!-- Bottom buttons -->
					<div class="flex items-center justify-between">
						<!-- Left side - Camera button -->
						<button
							type="button"
							onclick={() => document.getElementById('thoughts-file-input')?.click()}
							class="flex items-center justify-center p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
							disabled={fileUploadStore.isUploading || isGenerating}
							aria-label="上传图片"
						>
							{#if fileUploadStore.isUploading}
								<div class="w-5 h-5 border-2 border-theme-500 border-t-transparent rounded-full animate-spin"></div>
							{:else}
								<!-- Camera icon -->
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
								</svg>
							{/if}
						</button>

						<!-- Right side - Submit button -->
						<button
							type="button"
							onclick={handleGenerateTasks}
							class="flex items-center justify-center px-4 py-2 bg-theme-500 text-white rounded-lg hover:bg-theme-600 transition-colors disabled:opacity-50"
							disabled={!inputValue.trim() || fileUploadStore.isUploading || isGenerating}
						>
							{#if isGenerating}
								<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
								生成中...
							{:else}
								生成任务
							{/if}
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
