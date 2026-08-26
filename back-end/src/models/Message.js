import { connectDB } from '../config/database.js';
import { ObjectId } from 'mongodb';

export async function saveMessage({ conversationId, authorId, text }) {
    const db = await connectDB();

    const message = {
        conversationId: new ObjectId(conversationId),
        authorId: new ObjectId(authorId),
        text,
        createdAt: new Date(),
    };

    const result = await db.collection('message').insertOne(message);
    return { _id: result.insertedId, ...message };
}

export async function getMessagesByConversations(conversationId) {
    const db = await connectDB();
    return db
        .collection('messages')
        .find({ conversationId: new ObjectId(conversationId) })
        .sort({ createdAt: 1 })
        .toArray();
}