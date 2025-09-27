<script lang="ts">
	import ThoughtsToTaskInput from "$lib/components/ThoughtsToTaskInput.svelte";
	import { tasksStore } from "$lib/store/tasks.svelte";
	import { fileUploadStore } from "$lib/store/file-upload.svelte";
	import { ListTodo, Sparkles, WandSparkles, X } from "@lucide/svelte";
</script>

<!-- Google-style input -->
<div class="space-y-6">
	<ThoughtsToTaskInput />

	{#if tasksStore.tasks.length > 0}
		<div class="space-y-4 max-w-2xl mx-auto mt-12">
			<div class="flex items-center justify-center gap-2 text-lg">
				<ListTodo size={18} class="text-theme-500" />
				<h4 class="font-semibold text-theme-500">
					当前任务列表
				</h4>
			</div>
			<div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
				{#each tasksStore.tasks as task, index}
					<div
						class="flex items-center justify-between p-4 border-b border-gray-300 last:border-b-0 hover:bg-gray-50 transition-colors group py-2"
					>
						<div class="flex items-center gap-3 flex-1">
							<div class="w-2 h-2 bg-theme-400 rounded-full flex-shrink-0"></div>
							<span class="text-gray-700 text-sm leading-relaxed">{task}</span>
						</div>
						<button
							class="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded-full text-red-500 hover:text-red-600"
							onclick={() => tasksStore.removeTask(index)}
							aria-label="删除任务"
						>
							<X size={16} />
						</button>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<!-- Manual task input -->
<div class="space-y-4 mt-8">
	<div class="flex gap-2 max-w-2xl mx-auto">
		<input
			type="text"
			placeholder="或者手动输入任务..."
			class="input input-bordered flex-1"
			bind:value={tasksStore.newTask}
			onkeydown={(e) => e.key === "Enter" && tasksStore.addTask()}
		/>
		<button
			class="btn bg-theme-500 hover:bg-theme-600 text-white border-none"
			onclick={tasksStore.addTask}
			disabled={!tasksStore.newTask.trim()}
		>
			添加
		</button>
	</div>

	<!-- Generate Button -->
	{#if tasksStore.tasks.length > 0}
		<div class="flex justify-center">
			<button
				class="btn bg-theme-500 hover:bg-theme-600 text-white border-none px-8 py-3 text-md transition-all"
				onclick={tasksStore.generateMetas}
				disabled={tasksStore.loading}
			>
				<Sparkles size={18} class="mr-2" />
				{#if tasksStore.loading}
					<span class="loading loading-spinner loading-sm"></span>
					AI正在分析任务...
				{:else}
					生成任务优先级建议
				{/if}
			</button>
		</div>
	{/if}
</div>
