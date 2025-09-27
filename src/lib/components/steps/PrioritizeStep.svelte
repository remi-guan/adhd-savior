<script lang="ts">
	import { tasksStore } from "$lib/store/tasks.svelte";
	import { LoaderCircle, Check, ArrowLeft, PartyPopper } from "@lucide/svelte";
	import { fade } from "svelte/transition";
	import * as LucideIcons from "@lucide/svelte";
	
	// Helper function to get Lucide icon component
	function getLucideIcon(iconName: string) {
		// @ts-ignore - Dynamic icon access
		return LucideIcons[iconName] || LucideIcons.Star;
	}

	// Check if all tasks are completed
	let allTasksCompleted = $derived(tasksStore.taskMetas.length > 0 && tasksStore.taskMetas.every(task => task.completed));

	// Go back to collect step to start over
	function startOver() {
		tasksStore.resetFlow();
	}
</script>

<!-- Task Prioritization Phase -->
<div class="space-y-6">
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
		{#each tasksStore.taskMetas as meta}
			{@const IconComponent = getLucideIcon(meta.icon)}
			<button
				class="border border-gray-200 relative bg-white rounded-xl overflow-hidden transition-all text-left p-6 min-h-[180px] flex flex-col justify-between {meta.completed ? 'cursor-default opacity-75' : 'cursor-pointer hover:shadow-xl hover:scale-102 group'}"
				style="background: linear-gradient(135deg, {meta.color}08, {meta.color}04);"
				onclick={meta.completed ? undefined : () => tasksStore.selectTask(meta)}
				disabled={tasksStore.loading || meta.completed}
			>
				<!-- Decorative elements -->
				<div class="absolute top-0 right-0 w-20 h-20 opacity-10" style="background: radial-gradient(circle, {meta.color} 0%, transparent 70%);"></div>
				<div class="absolute bottom-0 left-0 w-16 h-16 opacity-5" style="background: radial-gradient(circle, {meta.color} 0%, transparent 70%);"></div>
				
				<!-- Floating visual effects -->
				<div 
					class="absolute right-4 top-4 h-2 w-2 animate-pulse rounded-full opacity-30"
					style="background-color: {meta.color}; animation-delay: 0.5s;"
				></div>
				<div 
					class="absolute right-8 top-8 h-1.5 w-1.5 animate-pulse rounded-full opacity-25"
					style="background-color: {meta.color}; animation-delay: 1.5s;"
				></div>
				
				<!-- Content Section -->
				<div class="relative z-10 flex-1 flex flex-col justify-between">
					<!-- Header with icon and category -->
					<div class="flex items-start gap-3 mb-4">
						<div
							class="w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold flex-shrink-0 shadow-lg group-hover:scale-102 transition-transform"
							style="background: linear-gradient(135deg, {meta.color}, {meta.color}dd);"
						>
							<IconComponent size={20} />
						</div>
						<div class="flex-1 min-w-0">
							<span class="text-xs px-3 py-1.5 rounded-full text-white font-medium shadow-sm" style="background-color: {meta.color};">
								{meta.category}
							</span>
						</div>
					</div>
					
					<!-- Task title -->
					<h4 class="font-bold text-lg text-gray-800 leading-tight group-hover:text-gray-900 transition-colors">{meta.task}</h4>
					
					<!-- Encouragement text -->
					<div>
						<p class="text-gray-600 leading-relaxed">
							{meta.encouragement}
						</p>
					</div>
				</div>
				
				<!-- Hover effect overlay -->
				<div class="absolute inset-0 bg-gradient-to-br from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
				
				<!-- Completed overlay -->
				{#if meta.completed}
					<div 
						class="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-xl"
					>
						<div class="flex flex-col items-center gap-3">
							<Check size={64} class="text-green-500" />
							<p class="font-semibold text-lg text-green-600">已完成</p>
						</div>
					</div>
				{/if}
			</button>
		{/each}
	</div>
	
	<!-- All Tasks Completed Congratulations -->
	{#if allTasksCompleted}
		<div class="text-center space-y-6 mt-8" in:fade={{ delay: 300, duration: 400 }}>
			<div class="max-w-md mx-auto space-y-4">
				<div class="flex justify-center mb-4">
					<PartyPopper size={48} class="text-green-500" />
				</div>
				<h3 class="font-bold text-2xl text-gray-800">恭喜你！</h3>
				<p class="text-gray-600 leading-relaxed">
					所有任务都已完成！你做得非常棒！
				</p>
				<p class="text-sm text-gray-500">
					想要添加更多任务继续保持高效吗？
				</p>
				<button
					class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-theme-600 text-white font-medium hover:bg-theme-700 transition-all duration-200 shadow-sm"
					onclick={startOver}
				>
					<ArrowLeft size={18} />
					添加更多任务
				</button>
			</div>
		</div>
	{/if}
	
	<!-- Loading Overlay -->
	{#if tasksStore.loading}
		<div 
			class="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-xl"
			in:fade={{ duration: 200 }}
			out:fade={{ duration: 200 }}
		>
			<div class="flex flex-col items-center gap-4 p-8">
				<div class="relative">
					<LoaderCircle size={32} class="text-theme-500 animate-spin" />
					<div class="absolute inset-0 rounded-full border-2 border-theme-200 animate-pulse"></div>
				</div>
				<div class="text-center space-y-2">
					<p class="font-semibold text-gray-800">正在准备第一步建议...</p>
					<p class="text-sm text-gray-600">这可能需要几秒钟时间</p>
				</div>
			</div>
		</div>
	{/if}
</div>
