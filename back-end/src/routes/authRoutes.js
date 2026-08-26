import express from 'express';
import { createUser, findUserByUsernameOrEmail, validatePassword } from '../models/User.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return res.status(400).json({ error: 'Preencha todos os campos' });
    }

    try {
        await createUser({ email, username, password });
        res.status(201).json({ message: 'Usuário criado com sucesso!' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {

    const { login, password } = req.body;
    const user = await findUserByUsernameOrEmail(login);

    if (!user) {
        return res.status(401).json({ error: 'Usuário ou senha incorretos!' });
    }

    const senhaValida = await validatePassword(password, user.password);

    if (!senhaValida) {
        return res.status(401).json({ error: 'Usuário ou senha incorretos!' });
    }

    res.json({
        message: 'Login realizado com sucesso!',
        user: { id: user._id, email: user.email, username: user.username },
    });
});

export default router;