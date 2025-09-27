<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import logo from '$lib/assets/logo.png';
	import { Toaster } from 'svelte-5-french-toast';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>EasyStart - ADHD任务启动助手</title>
</svelte:head>

<div class="relative min-h-screen bg-gradient-to-br from-theme-100 to-[#DBEEEF] to-50%">
	<!-- Animated background elements -->
	<div class="fixed inset-0 overflow-hidden">
		<div class="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-gradient-to-br from-theme-200 to-theme-300 opacity-30 blur-3xl"></div>
		<div class="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-gradient-to-br from-yellow-200 to-theme-200 opacity-40 blur-2xl"></div>
		<div class="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-gradient-to-br from-theme-300 to-red-300 opacity-25 blur-2xl"></div>
		<div class="absolute right-1/4 top-1/4 h-32 w-32 rotate-45 rounded-2xl bg-gradient-to-br from-theme-400 to-theme-500 opacity-20 blur-xl"></div>
		<div class="left-1/6 absolute bottom-1/3 h-24 w-24 rotate-12 rounded-full bg-gradient-to-br from-yellow-300 to-theme-400 opacity-15 blur-lg"></div>
		<div class="right-1/6 absolute top-1/2 h-20 w-20 rotate-45 bg-gradient-to-br from-theme-300 to-theme-400 opacity-20 blur-lg"></div>
		<div class="absolute bottom-1/4 right-1/3 h-16 w-16 rotate-12 rounded-lg bg-gradient-to-br from-red-300 to-theme-300 opacity-25 blur-md"></div>
	</div>

	<!-- Header -->
	<header class="bg-white fixed w-full z-50 shadow-sm">
		<div class="container max-w-screen-xl mx-auto flex justify-start items-center p-3">
			<div class="flex items-center gap-3">
				<img src={logo} alt="EasyStart Logo" class="h-10 w-auto" />
				<div class="flex flex-col">
					<span class="text-2xl font-bold">
						<span class="text-[#23457f]">START</span>
						<span class="text-[#a5cc52]">SIMPLE</span>
					</span>
				</div>
			</div>
		</div>
	</header>

	<!-- Main content -->
	<div class="relative z-10 pt-20">
		{@render children?.()}
	</div>
	
	<!-- Toast notifications -->
	<Toaster />
</div>
