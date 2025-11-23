import { Link } from "react-router";
import type { ChatRecordType } from "../../global";

interface ChatListSideBarProps {
    chats: ChatRecordType[];
    onAdd: () => void;
    onDelete: (id: number) => void;
}

const ChatListSideBar = (
    { chats, onAdd, onDelete }: ChatListSideBarProps
) => {
    return (
        <aside className="chat-list-sidebar">
            <div>
                <button
                    aria-label='New Chat'
                    onClick={onAdd}
                >
                    +
                </button>
            </div>
            <ul className="chat-sidebar">
                {chats.map((chat) => (
                    <li key={chat.id}>
                        <div>
                            <Link to={`/chat/${chat.id}`}>
                                {chat.chatTitle}
                            </Link>
                            <button
                                aria-label={`Delete chat ${chat.id}`}
                                onClick={() => chat.id !== undefined && onDelete(chat.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </aside>
    );
}

export default ChatListSideBar;