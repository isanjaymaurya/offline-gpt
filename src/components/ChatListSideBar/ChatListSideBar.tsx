import { Link } from "react-router";

const ChatListSideBar = () => {
    return (
        <ul className="chat-sidebar">
            <li>
                <Link to="/chat/1">Chat 1</Link>
            </li>
        </ul>
    );
}

export default ChatListSideBar;