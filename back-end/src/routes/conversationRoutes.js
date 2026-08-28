import express from 'express';
import { findOrCreateConversation, getConversationsByUser } from '../models/Conversation.js';

const router = express.Router();

router.post("/", async (req, res) => {
    const { userId1, userId2 } = req.body;

    if (!userId1 || !userId2) {
        return res.status(400).json({ error: 'Faltam os IDs dos usuários!' });
    }

    try {
        const conversation = await findOrCreateConversation(userId1, userId2);
        res.json(conversation);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar/abrir conversa!' });
    }
});

router.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const conversations = await getConversationsByUser(userId);
        res.json(conversations);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar conversas' });
    }
});

export default router;