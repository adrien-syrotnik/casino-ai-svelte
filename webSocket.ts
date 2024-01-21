import type { PluginOption, ViteDevServer } from 'vite';
import injectSocketIO from './injectSocketIO';

export const webSocketServer = {
    name: 'webSocketServer',
    configureServer(server: ViteDevServer) {
        injectSocketIO(server);
    }
} as PluginOption;

export default webSocketServer;