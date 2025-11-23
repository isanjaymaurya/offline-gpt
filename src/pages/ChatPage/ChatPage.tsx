import { useState, useEffect } from 'react'
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from 'react-router';

import { useIndexDb } from '../../hooks/useIndexDB';
import { SITE_NAME } from '../../constants';
import './ChatPage.module.scss';
import BaseLayout from "../../components/Layout/BaseLayout/BaseLayout";
import ChatListSideBar from "../../components/ChatListSideBar/ChatListSideBar";
import ChatForm from '../../components/Forms/ChatForm/ChatForm';
import type { ChatRecordType } from '../../global';

function ChatPage() {
    const { chatId } = useParams();
    const navigate = useNavigate();
    const {
        addRecord,
        getChatRecord,
        getAllRecord,
        deleteRecord,
        isDBReady
    } = useIndexDb("ChatDB", "Chats");
    const [chatList, setChatList] = useState<ChatRecordType[]>([]);
    const [pageTitle, setPageTitle] = useState(`Chat Page | ${SITE_NAME}`);

    useEffect(() => {
        if (!isDBReady) return;
        let mounted = true;
        getAllRecord()
            .then(data => { if (mounted) setChatList(data); })
            .catch(console.error);
        return () => { mounted = false; };
    }, [isDBReady, getAllRecord]);

    useEffect(() => {
        if (!chatId) return;

        getChatRecord(chatId)
            .then((record) => {
                if (record) {
                    console.log("Loaded chat record:", record);
                    setPageTitle(`${record.chatTitle} | ${SITE_NAME}`);
                } else {
                    navigate('/chat', { replace: true });
                    console.log("No chat record found for ID:", chatId);
                };
            })
            .catch(e => console.error("Error fetching chat record:", e));
    }, [chatId]);

    const handleOnAddChat = async () => {
        const newRecordId = await addRecord({ name: "Sanjay", role: "Developer" });
        navigate(`/chat/${newRecordId}`, { replace: true });
        const updated = await getAllRecord();
        setChatList(updated);
    };

    const handleOnDeleteChat = async (id: number) => {
        await deleteRecord(id);
        const updated = await getAllRecord();
        setChatList(updated);
        // if the deleted chat is currently open, navigate away
        if( chatId == String(id) ){
            navigate('/chat', { replace: true });
        }
    };

    return (
        <>
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content="Chat with our AI model." />
            </Helmet>

            <BaseLayout
                sidebar={
                    <ChatListSideBar
                        chats={chatList}
                        onAdd={handleOnAddChat}
                        onDelete={handleOnDeleteChat}
                    />
                }
            >
                <div>
                    <ChatForm />
                </div>
            </BaseLayout>
        </>
    )
}

export default ChatPage
