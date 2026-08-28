import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { socket } from '../../services/socket';
import MessageList from '../MessageList/MessageList';
import MessageInput from '../MessageInput/MessageInput';

function ChatWindow() {
    const navigate = useNavigate();
    const loggedUser = JSON.parse(localStorage.getItem('user'));
    const { conversationId } = useParams();
    const [messages, setMessages] = useState([]);
    const [otherUser, setOtherUser] = useState(null);

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

    useEffect(() => {
        async function loadOtherUser() {
            if (!conversationId) {
                setOtherUser(null);
                return;
            }
            const response = await fetch(
                `http://localhost:3000/conversations/user/${loggedUser.id}`
            );
            const convs = await response.json();
            const found = convs.find((c) => c._id === conversationId);
            setOtherUser(found?.otherUser || null);
        }
        loadOtherUser();
    }, [conversationId]);

    function handleCloseChat() {
        navigate('/chat');
    }

    if (!conversationId) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-950 text-gray-400">Selecione uma conversa para começar!</div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-gray-950 relative group/chat">
            <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-gray-900/80 backdrop-blur border-b border-gray-800">
                <span className="font-semibold text-white">{otherUser?.username || 'Conversa'}</span>
                <button onClick={handleCloseChat} title="Fechar conversa" className="flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </header>
            <MessageList messages={messages} />
            <MessageInput conversationId={conversationId} />
        </div>
    );
}

export default ChatWindow;