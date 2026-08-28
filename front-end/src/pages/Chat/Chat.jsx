import Sidebar from '../../components/Sidebar/Sidebar'
import ChatWindow from '../../components/ChatWindow/ChatWindow'
import UserList from '../../components/UserList/UserList'
import { users, conversations } from '../../mocks/data'

function Chat() {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <ChatWindow />
            <UserList users={users} />
        </div>
    );
}

export default Chat;