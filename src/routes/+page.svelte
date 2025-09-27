<script lang="ts">
  import CollectStep from "$lib/components/steps/CollectStep.svelte";
  import PrioritizeStep from "$lib/components/steps/PrioritizeStep.svelte";
  import ExecuteStep from "$lib/components/steps/ExecuteStep.svelte";
  import { tasksStore } from "$lib/store/tasks.svelte";
  import { fileUploadStore } from "$lib/store/file-upload.svelte";
  import { Lightbulb } from "@lucide/svelte";
  import { fade, fly } from "svelte/transition";

  // Global drag event handlers
  function handleGlobalDragEnter(event: DragEvent) {
    if (event.dataTransfer?.types.includes("Files")) {
      fileUploadStore.setDragging(true);
    }
  }

  function handleGlobalDragLeave(event: DragEvent) {
    // Hide drop zone when dragging leaves the window
    if (event.clientX === 0 && event.clientY === 0) {
      fileUploadStore.setDragging(false);
    }
  }

  function handleGlobalDragOver(event: DragEvent) {
    event.preventDefault();
  }

  function handleGlobalDrop(event: DragEvent) {
    event.preventDefault();

    // If we're in dragging state and there's a file, handle the upload
    if (fileUploadStore.isDragging) {
      const file = event.dataTransfer?.files[0];
      if (file) {
        tasksStore.handleFileSelect(file);
      }
    }

    fileUploadStore.setDragging(false);
  }
</script>

<svelte:window
  ondragenter={handleGlobalDragEnter}
  ondragleave={handleGlobalDragLeave}
  ondragover={handleGlobalDragOver}
  ondrop={handleGlobalDrop}
/>

<main class="container relative z-10 mx-auto px-4 py-8 max-w-4xl">
  <!-- Single Main Card -->
  <div class="card">
    <div class="card-body pb-0">
      <!-- Header with status -->
      <div class="text-center space-y-3">
        <div class="flex items-center justify-center gap-1">
          <Lightbulb size={20} class="text-theme-500" />
          <h1
            class="text-2xl font-bold text-theme-500 flex items-center gap-2"
          >
            {#if tasksStore.currentStep === "collect"}
              <span in:fade={{ duration: 300 }}>有什么想法？</span>
            {:else if tasksStore.currentStep === "prioritize"}
              <span in:fade={{ duration: 300 }}>选择最重要的任务</span>
            {:else}
              <span in:fade={{ duration: 300 }}>开始第一步</span>
            {/if}
          </h1>
        </div>
        <p class="text-gray-600 max-w-2xl mx-auto">
          {#if tasksStore.currentStep === "collect"}
            <span in:fade={{ duration: 300, delay: 100 }}>最近有什么想做，但还没开始去做的事情？</span>
          {:else if tasksStore.currentStep === "prioritize"}
            <span in:fade={{ duration: 300, delay: 100 }}>如果这里有很多事情要做，那不妨挑一个现在最想开始的</span>
          {:else}
            <span in:fade={{ duration: 300, delay: 100 }}>很好！现在让我们把大任务分解成可执行的第一步。记住，万事开头易！</span>
          {/if}
        </p>
      </div>

      {#if tasksStore.currentStep === "collect"}
        <div in:fly={{ y: 30, duration: 600 }}>
          <CollectStep />
        </div>
      {:else if tasksStore.currentStep === "prioritize"}
        <div in:fly={{ y: 30, duration: 600 }}>
          <PrioritizeStep />
        </div>
      {:else if tasksStore.currentStep === "execute"}
        <div in:fly={{ y: 30, duration: 600 }}>
          <ExecuteStep />
        </div>
      {/if}
    </div>
  </div>

</main>
