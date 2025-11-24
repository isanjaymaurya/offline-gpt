import { Link } from "react-router";
import type { ChatRecordType } from "../../global";
import IconButton from "../UI/IconButton/IconButton";
import DocumentAddIcon from "../Icons/DocumentAddIcon";
import Button from "../UI/Button/Button";

interface ChatListSideBarProps {
    chats: ChatRecordType[];
    onDelete: (id: string) => void;
    onNewChat: () => void;
}

const ChatListSideBar = (
    { chats, onDelete, onNewChat }: ChatListSideBarProps
) => {
    return (
        <aside className="chat-list-sidebar">
            <div style={{ display: 'flex', justifyContent: 'end'}}>
                <Link to="/chat">
                    <Button
                        aria-label='New Chat'
                        startIcon={<DocumentAddIcon />}
                        onClick={onNewChat}
                    >
                        New Chat
                    </Button>
                </Link>
            </div>
            <ul className="chat-sidebar">
                {chats.sort((a, b) =>  b.updatedAt - a.updatedAt).map((chat: ChatRecordType) => (
                    <li key={chat.id}>
                        <div>
                            <Link to={`/chat/${chat.id}`}>
                                {chat.chatTitle}
                            </Link>
                            <IconButton
                                aria-label={`Delete chat ${chat.id}`}
                                onClick={() => chat.id !== undefined && onDelete(chat.id)}
                            >
                                Delete
                            </IconButton>
                        </div>
                    </li>
                ))}
            </ul>
        </aside>
    );
}

export default ChatListSideBar;