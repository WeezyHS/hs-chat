import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import conversationRoutes from './src/routes/conversationRoutes.js';
import { saveMessage } from './src/models/Message.js';
import messageRoutes from './src/routes/messageRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/conversations', conversationRoutes);
app.use('/messages', messageRoutes);

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:5173',
    },
});

io.on('connection', (socket) => {
    console.log("Usuário conectado:", socket.id);

    socket.on("join-conversation", (conversationId) => {
        socket.join(`conversa-${conversationId}`);
        console.log(`Socket ${socket.id} entrou na sala conversa-${conversationId}`);
    });

    socket.on("nova-mensagem", async (mensagem) => {
        try {
            const saved = await saveMessage(mensagem);
            io.to(`conversa-${mensagem.conversationId}`).emit("mensagem-recebida", saved);
        } catch (error) {
            console.log("Erro ao salvar mensagem:", error);
        }
    });

    socket.on("disconnect", () => {
        console.log("Usuário desconectado:", socket.id);
    });
});

httpServer.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});