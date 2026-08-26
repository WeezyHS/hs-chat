import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { socket } from '../../services/socket';
import MessageList from '../MessageList/MessageList';
import MessageInput from '../MessageInput/MessageInput';

function ChatWindow() {
    const { conversationId } = useParams();
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (!conversationId) {
            setMessages([]);
            return;
        }

        async function loadMessages() {
            const response = await fetch(`http://localhost:3000/messages/${conversationId}`);
            const data = await response.json();
            setMessages(data);
        }

        loadMessages();
        socket.emit('join-conversation', conversationId);
    }, [conversationId]);

    //New messages in real time
    useEffect(() => {
        function handleNewMessage(msg) {
            if (msg.conversationId === conversationId) {
                setMessages((prev) => [...prev, msg]);
            }
        }

        socket.on('mensagem-recebida', handleNewMessage);
        return () => socket.off('mensagem-recebida', handleNewMessage);
    }, [conversationId]);

    if (!conversationId) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-950 text-gray-400">Selecione uma conversa para começar!</div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-gray-950">
            <MessageList messages={messages} />
            <MessageInput conversationId={conversationId} />
        </div>
    );
}

export default ChatWindow;