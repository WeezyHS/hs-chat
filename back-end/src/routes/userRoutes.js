import express from 'express';
import { searchUsersByUsername } from '../models/User.js';

const router = express.Router();

router.get('/search', async (req, res) => {
    const { q } = req.query;

    if (!q || q.trim() === '') {
        return res.status(400).json({ error: 'Digite algo para buscar!' });
    }

    try {
        const users = await searchUsersByUsername(q);
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuários!' });
    }
});

export default router;