import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Sidebar() {
    const navigate = useNavigate();
    const { conversationId } = useParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [conversations, setConversations] = useState([]);

    const loggedUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        async function loadConversations() {
            const response = await fetch(
                `http://localhost:3000/conversations/user/${loggedUser.id}`
            );
            const data = await response.json();
            setConversations(data);
        }

        loadConversations();
    }, [conversationId]);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);

        const timeoutId = setTimeout(async () => {
            try {
                const response = await fetch(
                    `http://localhost:3000/users/search?q=${searchTerm}`
                );
                const data = await response.json();
                setSearchResults(data);
            } catch (err) {
                console.log("Erro ao buscar usuários:", err);
            } finally {
                setIsSearching(false);
            }
        }, 400);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    async function handleSelectUser(user) {
        const loggedUser = JSON.parse(localStorage.getItem('user'));
        
        const response = await fetch('http://localhost:3000/conversations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId1: loggedUser.id,
                userId2: user._id,
            }),
        });

        const conversation = await response.json();
        setSearchTerm('');
        navigate(`/chat/${conversation._id}`);
    }

    const mostrandoBusca = searchTerm.trim() !== '';

    function handleExit() {
        localStorage.removeItem('user');
        navigate("/");
    }

    return (
        <aside className="w-64 bg-gray-900 text-white p-4 flex flex-col">
            <h2 className="text-3xl font-bold mb-4">HS Chat</h2><br/>

            <input type="text" placeholder="Buscar usuário..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full rounded-md bg-white/5 px-3.5 py-2 text-sm text-white outline-1 outline-white/10 mb-4"/>
            <div className="flex-1 overflow-y-auto">
                {mostrandoBusca ? (
                    <>
                        {isSearching && <p className="text-gray-400 text-sm">Buscando...</p>}

                        {!isSearching && searchResults.length === 0 && (
                            <p className="text-gray-400 text-sm">Nenhum usuário encontrado</p>
                        )}

                        <ul>
                            {searchResults.map((user) => (
                                <li key={user._id} onClick={() => handleSelectUser(user)} className="py-2 border-b border-gray-700 cursor-pointer hover:bg-gray-800">
                                    <strong>{user.username}</strong>
                                </li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <>
                        <p className="text-2xl font-semibold mb-2">Conversas</p>
                        <ul>
                            {conversations.map((conv) => (
                                <li key={conv._id} onClick={() => navigate(`/chat/${conv._id}`)} className={`py-2 border-b border-gray-700 cursor-pointer hover:bg-gray-800 ${conv._id === conversationId ? 'bg-gray-800' : ''}`}>
                                    <strong>{conv.otherUser?.username}</strong>
                                </li>
                            ))}
                        </ul>
                        {conversations.length === 0 && (
                            <p className="text-gray-400 text-sm">Nenhuma conversa ainda. Busque alguém!</p>
                        )}
                    </>
                )}
            </div>

            <button className="bg-red-600 hover:bg-red-700 text-white py-2 rounded cursor-pointer" onClick={handleExit}>Sair</button>

        </aside>
    );
}

export default Sidebar;