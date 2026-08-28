function MessageList({ messages }) {
    const loggedUser = JSON.parse(localStorage.getItem('user'));
    const safeMessages = Array.isArray(messages) ? messages : [];

    return (
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
            {safeMessages.map((msg) => {
                const isOwnMessage = msg.authorId === loggedUser.id;
                const date = new Date(msg.createdAt);
                const clock = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });

                return (
                    <div key={msg._id} className={`rounded-md p-2 max-w-xs ${
                        isOwnMessage ? 'bg-indigo-600 text-white self-end' : 'bg-gray-800 text-white self-start'
                    }`}>
                        <p>{msg.text}</p>
                        <p className="text-xs text-gray-300 text-right">{clock}</p>
                    </div>
                );
            })}
        </div>
    );
}

export default MessageList;