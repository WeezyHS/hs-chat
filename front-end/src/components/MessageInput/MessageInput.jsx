import { useState } from 'react';
import { socket } from '../../services/socket';

function MessageInput({ conversationId }) {
    const [text, setText] = useState('');
    const loggedUser = JSON.parse(localStorage.getItem('user'));

    function handleSubmit(e) {
        e.preventDefault();

        if (text.trim() === '') return;

        socket.emit('nova-mensagem', {
            conversationId,
            authorId: loggedUser.id,
            text: text,
        });
        setText('');
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t border-gray-700">
            <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Digite uma mensagem..." className="flex-1 rounded-md bg-white/5 px-3.5 py-2 text-white outline-1 outline-white/10"/>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 rounded-md transition-colors cursor-pointer">Enviar</button>
        </form>
    );
}

export default MessageInput;