function MessageList({ messages }) {
    const loggedUser = JSON.parse(localStorage.getItem('user'));

    return (
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
            {messages.map((msg) => {
                const isOwnMessage = msg.authorId === loggedUser.id;
                const clock = new Date(msg.createAt).toLocaleTimeString().slice(0, 5);

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