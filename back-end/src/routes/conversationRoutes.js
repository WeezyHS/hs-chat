import express from 'express';
import { findOrCreateConversation, getConversationsByUser, deleteConversationAndMessages } from '../models/Conversation.js';

const router = express.Router();

//Command in database for create/open conversation
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

//Command for delete conversation
router.delete('/:conversationId', async (req, res) => {
    const { conversationId } = req.params;

    try {
        await deleteConversationAndMessages(conversationId);
        res.json({ message: 'Conversa excluída!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao excluir conversa!' });
    }
})

//Command for search conversation
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