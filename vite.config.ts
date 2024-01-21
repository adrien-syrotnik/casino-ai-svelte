import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
// import webSocketServer from './webSocket';



export default defineConfig({
	plugins: [sveltekit(), purgeCss({
		safelist: {
			// any selectors that begin with "hljs-" will not be purged
			greedy: [/^hljs-/],
		},
	}),
		// webSocketServer
	],
	server: {
		fs: {
			allow: ['..'],
		},
		host: true,
		// Thanks @sergiomoura for the window fix
		// add the next lines if you're using windows and hot reload doesn't work
		watch: {
			usePolling: true
		}
	},

});