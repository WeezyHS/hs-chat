import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
// import dns from 'dns';

dotenv.config();

// dns.setServers(['8.8.8.8', '8.8.4.4']);
if (!process.env.MONGODB_URI) {
    console.error("ERRO: MONGODB_URI não está definida no .env!")
}

const client = new MongoClient(process.env.MONGODB_URI || '');

export async function connectDB() {
    try {
        await client.connect();
        console.log("Conectado ao MongoDB com sucesso!");
        return client.db('HSChat');
    } catch (error) {
        console.log('Erro ao conectar no MongoDB:', error);
        console.error('Erro ao conectar no MongoDB: ', error);
        throw error;
    }
}