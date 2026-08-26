import express from 'express';
import { getMessagesByConversation } from '../models/Message.js';

const router = express.Router();

router.get('/:conversationId', async (req, res) => {
    const { conversationId } = req.params;

    try {
        const messages = await getMessagesByConversation(conversationId);
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar mensagens!' });
    }
});

export default router;