import { Server } from 'socket.io';

export default function injectSocketIO(server) {
    if (!server.httpServer) return

    const io = new Server(server.httpServer,
        {
            cors: {
                origin: '*',
                methods: ['GET', 'POST']
            }
        }
    );

    io.on('connection', (socket) => {
        // socket.emit('eventFromServer', 'Hello, World 👋')

        // handle messages
        socket.on('message', (data) => {
            // io.emit('message', data)
            socket.broadcast.emit('message', data)
        });
    })
}