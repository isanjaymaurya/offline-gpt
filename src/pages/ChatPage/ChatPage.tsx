import { useState, useEffect } from 'react'
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';

import { useIndexDb } from '../../hooks/useIndexDB';
import { SITE_NAME } from '../../constants';
import './ChatPage.module.scss';
import BaseLayout from "../../components/Layout/BaseLayout/BaseLayout";
import ChatListSideBar from "../../components/ChatListSideBar/ChatListSideBar";
import ChatForm from '../../components/Forms/ChatForm/ChatForm';
import type { ChatConvoType, ChatRecordType } from '../../global';
import ChatSuggestions from '../../components/ChatSuggestions/ChatSuggestions';

function ChatPage() {
    const { chatId } = useParams();
    const navigate = useNavigate();
    const {
        addRecord,
        updateRecord,
        getChatRecord,
        getAllRecord,
        deleteRecord,
        isDBReady
    } = useIndexDb("ChatDB", "Chats");
    const [chatList, setChatList] = useState<ChatRecordType[]>([]);
    const [pageTitle, setPageTitle] = useState(`Chat Page | ${SITE_NAME}`);
    const [userQuery, setUserQuery] = useState<string>("");
    const [chatTitle, setChatTitle] = useState<string>("");
    const [chatConvo, setChatConvo] = useState<ChatConvoType[]>([]);

    useEffect(() => {
        if (!isDBReady) return;
        let mounted = true;
        getAllRecord()
            .then(data => { if (mounted) setChatList(data); })
            .catch(console.error);
        return () => { mounted = false; };
    }, [isDBReady, getAllRecord]);

    useEffect(() => {
        if (!chatId || !isDBReady) return;

        getChatRecord(chatId)
            .then((record) => {
                if (record) {
                    setPageTitle(`${record.chatTitle} | ${SITE_NAME}`);
                    setChatTitle(record.chatTitle || "");
                    setChatConvo(record.convo || []);
                } else {
                    toast.error(`No chat record found for ID: ${chatId}`, {
                        position: "bottom-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: false,
                        progress: undefined,
                        theme: "dark",
                    });
                    navigate('/chat', { replace: true });
                };
            })
            .catch(e => console.error("Error fetching chat record:", e));
    }, [isDBReady, chatId]);

    const handleOnAddChat = async (newUserQuery: string) => {
        const newChatData = { 
            chatTitle: newUserQuery,
            convo: [
                {
                    query: newUserQuery,
                    reply: []
                }
            ],
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        const newRecordId = await addRecord(newChatData);
        navigate(`/chat/${newRecordId}`, { replace: true });
        const updated = await getAllRecord();
        setChatList(updated);
    };

    const handleOnUpdateChat = async (newUserQuery: string) => {
        if (!chatId) return;
        const updatedConvo = [{
            query: newUserQuery,
            reply: [] 
        }];
        await updateRecord(chatId, updatedConvo);
        const updatedRecords = await getAllRecord();
        setChatList(updatedRecords);
        setChatConvo(prevConvo => [...prevConvo, ...updatedConvo]);
    }

    const handleOnDeleteChat = async (id: string) => {
        await deleteRecord(id);
        const updated = await getAllRecord();
        setChatList(updated);
        // if the deleted chat is currently open, navigate away
        if(chatId == id){
            navigate('/chat', { replace: true });
            handleOnChatReset();
        }
    };

    const onSelect = (suggestion: string) => {
        setUserQuery(suggestion);
    }

    const handleOnChatReset = () => {
        setChatTitle("");
        setChatConvo([]);
        setPageTitle(`Chat Page | ${SITE_NAME}`);
    }

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
                        onDelete={handleOnDeleteChat}
                        onNewChat={handleOnChatReset}
                    />
                }
            >
                <div>
                    {chatTitle ? (
                        <div>
                            {chatTitle && <h2>{chatTitle}</h2>}
                            {chatConvo.length > 0 ? (
                                <div>
                                    {chatConvo.map((convo: ChatConvoType, index: number) => (
                                        <div key={index}>
                                            <h1>{convo.query}:</h1>
                                            <p>{convo.reply}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                    ) : (
                        <ChatSuggestions onSelect={onSelect} />
                    )}
                    <ChatForm
                        userQuery={userQuery}
                        setUserQuery={setUserQuery}
                        onSubmit={chatId ? handleOnUpdateChat : handleOnAddChat}
                    />
                </div>
            </BaseLayout>
        </>
    )
}

export default ChatPage
