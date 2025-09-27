import { generateTaskMeta, generateFirstSuggestion } from '$lib/api';
import { fileUploadStore } from './file-upload.svelte';
import { toast } from 'svelte-5-french-toast';
import type { TaskItem, FirstSuggestionResponse } from '$lib/schemas';

export type StepType = "collect" | "prioritize" | "execute";

// Tasks store using Svelte 5 runes
export function createTasksStore() {
	let currentStep = $state<StepType>("collect");
	let tasks = $state<string[]>([]);
	let newTask = $state("");
	let taskMetas = $state<TaskItem[]>([]);
	let selectedTask = $state<TaskItem | null>(null);
	let firstSuggestion = $state<FirstSuggestionResponse | null>(null);
	let loading = $state(false);

	function addTask() {
		if (newTask.trim()) {
			tasks = [...tasks, newTask.trim()];
			newTask = "";
		}
	}

	function removeTask(index: number) {
		tasks = tasks.filter((_, i) => i !== index);
	}

	async function generateMetas() {
		if (tasks.length === 0) return;

		loading = true;
		try {
			const result = await generateTaskMeta(tasks);
			if (result.success) {
				taskMetas = result.data.tasks;
				currentStep = "prioritize";
				toast.success('任务卡片生成完成！选择一个开始吧 ✨');
			} else {
				toast.error('生成任务卡片失败，请重试');
			}
		} catch (err) {
			toast.error('生成任务卡片时发生错误');
			console.error('Generate metas error:', err);
		} finally {
			loading = false;
		}
	}

	async function selectTask(meta: TaskItem) {
		selectedTask = meta;
		loading = true;

		try {
			const result = await generateFirstSuggestion(meta.task);
			if (result.success) {
				firstSuggestion = result.data;
				currentStep = "execute";
				toast.success('已为你准备好第一步建议！');
			} else {
				toast.error('生成建议失败，请重试');
			}
		} catch (err) {
			toast.error('生成建议时发生错误');
			console.error('Select task error:', err);
		} finally {
			loading = false;
		}
	}

	function handleTasksExtracted(extractedTasks: string[]) {
		// Add extracted tasks to tasks list
		tasks = [...tasks, ...extractedTasks];
	}

	async function handleFileSelect(file: File) {
		await fileUploadStore.handleFileUpload(file, handleTasksExtracted);
	}

	function resetFlow() {
		currentStep = "collect";
		tasks = [];
		taskMetas = [];
		selectedTask = null;
		firstSuggestion = null;
		newTask = "";
		fileUploadStore.reset();
	}

	function setNewTask(value: string) {
		newTask = value;
	}

	function goBackToPrioritize() {
		currentStep = "prioritize";
		selectedTask = null;
		firstSuggestion = null;
	}

	function markTaskCompleted(taskToComplete: TaskItem) {
		taskMetas = taskMetas.map(task => 
			task.task === taskToComplete.task 
				? { ...task, completed: true }
				: task
		);
		
		// If the completed task is currently selected, also update selectedTask
		if (selectedTask && selectedTask.task === taskToComplete.task) {
			selectedTask = { ...selectedTask, completed: true };
		}
	}

	return {
		// State getters
		get currentStep() { return currentStep; },
		get tasks() { return tasks; },
		get taskMetas() { return taskMetas; },
		get selectedTask() { return selectedTask; },
		get firstSuggestion() { return firstSuggestion; },
		get loading() { return loading; },

		// Two-way bindable state
		get newTask() { return newTask; },
		set newTask(value: string) { newTask = value; },

		// Actions
		addTask,
		removeTask,
		generateMetas,
		selectTask,
		handleTasksExtracted,
		handleFileSelect,
		resetFlow,
		setNewTask,
		goBackToPrioritize,
		markTaskCompleted
	};
}

// Create and export the store instance
export const tasksStore = createTasksStore();
