// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	namespace NodeJS {
		interface ProcessEnv {
			CLOUDFLARE_ACCOUNT_ID: string;
			CLOUDFLARE_API_TOKEN: string;
			CLOUDFLARE_R2_ACCESS_KEY_ID: string;
			CLOUDFLARE_R2_SECRET_ACCESS_KEY: string;
		}
	}
}

export {};
