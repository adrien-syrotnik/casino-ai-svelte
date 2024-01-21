import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type ViteDevServer } from 'vite';

import { Server } from 'socket.io'

const webSocketServer = {
	name: 'webSocketServer',
	configureServer(server: ViteDevServer) {
		if (!server.httpServer) return

		const io = new Server(server.httpServer)

		io.on('connection', (socket) => {
			// socket.emit('eventFromServer', 'Hello, World 👋')

			// handle messages
			socket.on('message', (data) => {
				// io.emit('message', data)
				socket.broadcast.emit('message', data)
			});
		})


	}
}

export default defineConfig({
	plugins: [sveltekit(), purgeCss({
		safelist: {
			// any selectors that begin with "hljs-" will not be purged
			greedy: [/^hljs-/],
		},
	}),
		webSocketServer
	],
	server: {
		fs: {
			allow: ['..'],
		},
		// host: true,
		// // Thanks @sergiomoura for the window fix
		// // add the next lines if you're using windows and hot reload doesn't work
		// watch: {
		// 	usePolling: true
		// }
	},

});