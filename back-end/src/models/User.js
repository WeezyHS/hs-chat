import { connectDB } from '../config/database.js';
import bcrypt from 'bcrypt';

export async function createUser({ email, username, password }) {
    const db = await connectDB();

    const existingUser = await db.collection('users').findOne({ username });

    if (existingUser) {
        throw new Error('Username já está em uso');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.collection('users').insertOne({
        email,
        username,
        password: hashedPassword,
        createdAt: new Date(),
    });

    return result;
}

export async function findUserByUsernameOrEmail(login) {
    const db = await connectDB();
    return db.collection('users').findOne({
        $or: [{ username: login }, { email: login }],
    });
}

export async function findUserByUsername(username) {
    const db = await connectDB();
    return db.collection('users').findOne({ username });
}

export async function validatePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
}

export async function searchUsersByUsername(searchTerm) {
    const db = await connectDB();
    return db
        .collection('users')
        .find({ username: { $regex: searchTerm, $options: 'i' } })
        .project({ password: 0 })
        .toArray();
}