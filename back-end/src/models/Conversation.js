import { connectDB } from '../config/database.js';
import { ObjectId } from 'mongodb';

export async function findOrCreateConversation(userId1, userId2) {
    const db = await connectDB();

    const existing = await db.collection('conversations').findOne({
        participants: { $all: [new ObjectId(userId1), new ObjectId(userId2)] },
    });

    if (existing) return existing;

    const result = await db.collection('conversations').insertOne({
        participants: [new ObjectId(userId1), new ObjectId(userId2)],
        createdAt: new Date(),
    });

    return { _id: result.insertedId, participants: [userId1, userId2] };
}

export async function getConversationsByUser(userId) {
    const db = await connectDB();
    const conversations = await db
        .collection('conversations')
        .find({ participants: new ObjectId(userId) })
        .toArray();
    
    const populated = await Promise.all(
        conversations.map(async (conv) => {
            const otherUserId = conv.participants.find(
                (id) => id.toString() !== userId
            );

            const otherUser = await db
                .collection('users')
                .findOne(
                    { _id: otherUserId },
                    { projection: { password: 0 } }
                );

            return {
                _id: conv._id,
                otherUser,
            };
        })
    );

    return populated;
}