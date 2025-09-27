<script lang="ts">
	import { tasksStore } from "$lib/store/tasks.svelte";
	import { Target, Lightbulb, PartyPopper, Check, ChevronDown, ChevronUp, ArrowLeft, RotateCcw } from "@lucide/svelte";
	import * as LucideIcons from "@lucide/svelte";
	import { Confetti } from "svelte-confetti";
	import { slide, fade } from "svelte/transition";
	
	let showConfetti = $state(false);
	let isCompleted = $state(false);
	let showTips = $state(false);
	let showBackSection = $state(false);
	let hoverTimeout: ReturnType<typeof setTimeout> | null = null;
	let isMobile = $state(false);

	// Detect if device supports hover (desktop) or not (mobile/touch)
	$effect(() => {
		if (typeof window !== 'undefined') {
			isMobile = !window.matchMedia('(hover: hover)').matches;
		}
	});
	
	// Helper function to get Lucide icon component
	function getLucideIcon(iconName: string) {
		// @ts-ignore - Dynamic icon access
		return LucideIcons[iconName] || LucideIcons.Star;
	}

	// Handle completion with confetti
	function handleCompletion() {
		if (isCompleted) return;
		
		// Trigger confetti effect
		showConfetti = true;
		isCompleted = true;
		
		// Mark task as completed in the store
		if (tasksStore.selectedTask) {
			tasksStore.markTaskCompleted(tasksStore.selectedTask);
		}
		
		// Hide confetti after duration
		setTimeout(() => {
			showConfetti = false;
		}, 5000);
		
		console.log("任务完成！🎉");
	}

	// Toggle tips visibility
	function toggleTips() {
		showTips = !showTips;
	}

	// Toggle back section visibility
	function toggleBackSection() {
		showBackSection = !showBackSection;
	}

	// Handle hover enter for stable hover effect (desktop only)
	function handleHoverEnter() {
		if (isMobile) return; // Skip hover on mobile
		
		if (hoverTimeout) {
			clearTimeout(hoverTimeout);
			hoverTimeout = null;
		}
		if (!showBackSection) {
			showBackSection = true;
		}
	}

	// Handle hover leave with delay for stability (desktop only)
	function handleHoverLeave() {
		if (isMobile) return; // Skip hover on mobile
		
		if (hoverTimeout) {
			clearTimeout(hoverTimeout);
		}
		hoverTimeout = setTimeout(() => {
			if (showBackSection) {
				showBackSection = false;
			}
		}, 300); // 300ms delay for stability
	}

	// Handle touch/click for mobile devices
	function handleMobileToggle() {
		if (isMobile) {
			toggleBackSection();
		}
	}

	// Go back to prioritize step
	function goBackToPrioritize() {
		tasksStore.goBackToPrioritize();
	}
</script>

<!-- Task Execution Phase -->
<div class="space-y-2">
	{#if tasksStore.selectedTask}
		{@const IconComponent = getLucideIcon(tasksStore.selectedTask.icon)}
		<!-- Main Execution Card -->
		<div class="border border-gray-200 relative bg-white rounded-xl overflow-hidden transition-all px-4 py-6 max-w-4xl mx-auto min-h-[300px] flex flex-col"
			style="background: linear-gradient(135deg, {tasksStore.selectedTask.color}08, {tasksStore.selectedTask.color}04);">
			
			<!-- Decorative elements -->
			<div class="absolute top-0 right-0 w-32 h-32 opacity-10" style="background: radial-gradient(circle, {tasksStore.selectedTask.color} 0%, transparent 70%);"></div>
			<div class="absolute bottom-0 left-0 w-24 h-24 opacity-5" style="background: radial-gradient(circle, {tasksStore.selectedTask.color} 0%, transparent 70%);"></div>
			
			<!-- Floating visual effects -->
			<div 
				class="absolute right-6 top-6 h-3 w-3 animate-pulse rounded-full opacity-30"
				style="background-color: {tasksStore.selectedTask.color}; animation-delay: 0.5s;"
			></div>
			<div 
				class="absolute right-12 top-12 h-2 w-2 animate-pulse rounded-full opacity-25"
				style="background-color: {tasksStore.selectedTask.color}; animation-delay: 1.5s;"
			></div>

			<!-- Content Section -->
			<div class="relative z-10 flex-1 flex flex-col">
				<!-- Selected Task Header -->
				<div class="flex items-start gap-6 mb-8">
					<div
						class="w-16 h-16 rounded-xl flex items-center justify-center text-white font-semibold flex-shrink-0 shadow-lg"
						style="background: linear-gradient(135deg, {tasksStore.selectedTask.color}, {tasksStore.selectedTask.color}dd);"
					>
						<IconComponent size={28} />
					</div>
					<div class="flex-1">
						<div class="flex items-center gap-3 mb-3">
							<span class="text-sm px-3 py-1.5 rounded-full text-white font-medium shadow-sm" style="background-color: {tasksStore.selectedTask.color};">
								{tasksStore.selectedTask.category}
							</span>
						</div>
						<h3 class="font-bold text-2xl text-gray-800 leading-tight mb-2">{tasksStore.selectedTask.task}</h3>
						<p class="text-gray-600 leading-relaxed">{tasksStore.selectedTask.encouragement}</p>
					</div>
				</div>

				{#if tasksStore.firstSuggestion}
					<!-- First Step Suggestion Section -->
					<div class="backdrop-blur-sm p-2 mb-6">
						<div class="flex items-center gap-3 mb-4 justify-between">
              <div class="flex items-center gap-3"> 
                <h4 class="font-bold text-lg text-gray-800 flex-1">可以从这里开始</h4>
              </div>
							{#if tasksStore.firstSuggestion.estimatedTime}
								<span class="text-sm px-3 py-1 bg-theme-100 text-theme-700 rounded-full font-medium">
									大约{tasksStore.firstSuggestion.estimatedTime}
								</span>
							{/if}
						</div>
						<p class="leading-relaxed mb-6 md:mb-4 {isCompleted ? 'text-gray-400 line-through' : 'text-gray-700'}">
							{tasksStore.firstSuggestion.suggestion}
						</p>

						{#if tasksStore.firstSuggestion.tips && tasksStore.firstSuggestion.tips.length > 0}
							<div class="border-t border-gray-200/50 pt-4">
								<button
									class="flex items-center gap-2 mb-3 w-full text-left hover:bg-gray-50/50 rounded-lg p-2 -m-2 transition-colors cursor-pointer"
									onclick={toggleTips}
								>
									<Lightbulb size={18} class="text-theme-500" />
									<h5 class="font-semibold text-gray-800 flex-1">实用小贴士</h5>
									{#if showTips}
										<ChevronUp size={18} class="text-gray-500" />
									{:else}
										<ChevronDown size={18} class="text-gray-500" />
									{/if}
								</button>
								{#if showTips}
									<div 
										class="grid grid-cols-1"
										transition:slide={{ duration: 300 }}
									>
										{#each tasksStore.firstSuggestion.tips as tip}
											<div class="flex items-start gap-3 p-1 bg-white/40 rounded-lg">
												<span class="w-2 h-2 rounded-full mt-2 flex-shrink-0" style="background-color: {tasksStore.selectedTask.color};"></span>
												<span class="text-gray-700 leading-relaxed">{tip}</span>
											</div>
										{/each}
									</div>
								{/if}
							</div>
						{/if}
					</div>
				{/if}
			</div>

				<!-- Completion Button -->
				<div class="flex flex-col items-center mt-auto space-y-4">
					{#if !isCompleted}
						<button
							class="px-8 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-theme-600 hover:text-white hover:border-theme-600 transition-all duration-300 flex items-center gap-3 cursor-pointer"
							onclick={handleCompletion}
						>
							我已完成！
						</button>
					{:else}
						<div class="flex items-center gap-3 text-green-600 font-semibold text-lg">
							<Check size={24} class="text-green-600" />
							我已完成！
						</div>
					{/if}
				</div>
		</div>
	{/if}

  <!-- Back to task selection section -->
  <div class="text-center space-y-4 mt-4" in:fade={{ delay: 500, duration: 400 }}>
    <div class="max-w-md mx-auto space-y-3">
      {#if isCompleted}
        <p class="text-gray-600 leading-relaxed">
          恭喜完成第一步！后续步骤也会非常简单
        </p>
        <button
          class="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
          onclick={goBackToPrioritize}
        >
          <ArrowLeft size={18} />
          选择下一个任务
        </button>
      {:else}
        <!-- Collapsible section toggle -->
        <div class="flex justify-center">
          <div
            class="inline-block"
            role="button"
            tabindex="0"
            onmouseenter={handleHoverEnter}
            onmouseleave={handleHoverLeave}
            ontouchstart={handleMobileToggle}
          >
            <button
              class="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-2 -m-2"
              onclick={isMobile ? undefined : toggleBackSection}
            >
              {#if showBackSection}
                <ChevronUp size={22} />
              {:else}
                <ChevronDown size={22} />
              {/if}
            </button>
          </div>
        </div>
        
        {#if showBackSection}
          <div 
            transition:slide={{ duration: 300 }}
            role="region"
            onmouseenter={handleHoverEnter}
            onmouseleave={handleHoverLeave}
          >
            <p class="text-gray-600 leading-relaxed mb-3">
              觉得这个任务不太合适？没关系，可以换一个试试
            </p>
            <button
              class="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 cursor-pointer"
              onclick={goBackToPrioritize}
            >
              <ArrowLeft size={18} />
              重新选择任务
            </button>
            
            <!-- Mobile-only close hint -->
            {#if isMobile}
              <p class="text-xs text-gray-400 text-center mt-3">
                再次点击上方箭头可收起
              </p>
            {/if}
          </div>
        {/if}
      {/if}
    </div>
  </div>
</div>

<!-- Fullscreen Confetti Effect -->
{#if showConfetti}
	<div style="
		position: fixed;
		top: -50px;
		left: 0;
		height: 100vh;
		width: 100vw;
		display: flex;
		justify-content: center;
		overflow: hidden;
		pointer-events: none;
		z-index: 9999;
	">
		<Confetti
			x={[-5, 5]}
			y={[0, 0.1]}
			delay={[500, 2000]}
			infinite
			duration={5000}
			amount={200}
			fallDistance="100vh"
			colorArray={['#10b981', '#059669', '#047857', '#34d399', '#6ee7b7', '#a7f3d0']}
		/>
	</div>
{/if}
