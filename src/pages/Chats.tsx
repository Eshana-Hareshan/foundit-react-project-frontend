
import { useContext, useEffect, useState, type FormEvent } from "react";
import { Send } from "lucide-react";

import { AuthContext } from "../context/AuthContext";
import {
    getMyConversations,
    getConversationMessages,
    sendMessage
} from "../service/chat";

// Types for populated MongoDB documents
interface ChatUser {
    _id: string;
    name: string;
    email?: string;
}

interface ChatItem {
    _id: string;
    itemName: string;
    category?: string;
    imageUrl?: string;
    location?: string;
}

interface Conversation {
    _id: string;
    itemId: ChatItem;
    ownerId: ChatUser;
    requesterId: ChatUser;
    lastMessage?: string;
    lastMessageAt?: string;
}

interface ChatMessage {
    _id: string;
    conversationId: string;
    senderId: ChatUser | string;
    text: string;
    createdAt?: string;
}

export default function Chats() {
    const auth = useContext(AuthContext);
    const user = auth?.user;

    const currentUserId = user?.id || user?._id;

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeChat, setActiveChat] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [messageInput, setMessageInput] = useState("");

    const [loadingChats, setLoadingChats] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");

    // Get the other participant in the conversation
    const getOtherUser = (conversation: Conversation) => {
        return conversation.ownerId._id === currentUserId
            ? conversation.requesterId
            : conversation.ownerId;
    };

    // Load conversations from MongoDB
    useEffect(() => {
        if (!currentUserId) {
            setLoadingChats(false);
            return;
        }

        const fetchConversations = async () => {
            try {
                setLoadingChats(true);
                setError("");

                const data = await getMyConversations();

                setConversations(data);

                if (data.length > 0) {
                    setActiveChat(data[0]._id);
                }
            } catch (err) {
                console.error("Failed to load conversations:", err);
                setError("Failed to load conversations.");
            } finally {
                setLoadingChats(false);
            }
        };

        fetchConversations();
    }, [currentUserId]);

    // Load messages when a conversation is selected
    useEffect(() => {
        if (!activeChat) {
            setMessages([]);
            return;
        }

        let cancelled = false;

        const fetchMessages = async () => {
            try {
                setLoadingMessages(true);
                setMessages([]);

                const data = await getConversationMessages(activeChat);

                if (!cancelled) {
                    setMessages(data);
                }
            } catch (err) {
                console.error("Failed to load messages:", err);

                if (!cancelled) {
                    setError("Failed to load messages.");
                }
            } finally {
                if (!cancelled) {
                    setLoadingMessages(false);
                }
            }
        };

        fetchMessages();

        return () => {
            cancelled = true;
        };
    }, [activeChat]);

    // Send a message and save it in MongoDB
    const handleSendMessage = async (e: FormEvent) => {
        e.preventDefault();

        const text = messageInput.trim();

        if (!text || !activeChat || sending) {
            return;
        }

        try {
            setSending(true);
            setError("");

            const newMessage = await sendMessage(activeChat, text);

            setMessages((previousMessages) => [
                ...previousMessages,
                newMessage
            ]);

            setMessageInput("");

            // Update the latest message in the conversation list
            setConversations((previousConversations) =>
                previousConversations.map((conversation) =>
                    conversation._id === activeChat
                        ? {
                            ...conversation,
                            lastMessage: newMessage.text,
                            lastMessageAt: newMessage.createdAt
                        }
                        : conversation
                )
            );
        } catch (err) {
            console.error("Failed to send message:", err);
            setError("Failed to send message. Please try again.");
        } finally {
            setSending(false);
        }
    };

    // Find the selected conversation
    const selectedConversation = conversations.find(
        (conversation) => conversation._id === activeChat
    );

    if (auth?.loading) {
        return <p className="p-6 text-slate-500">Loading user...</p>;
    }

    if (!user) {
        return <p className="p-6 text-slate-500">Please login to view your chats.</p>;
    }

    return (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[500px]">

            {/* Conversation List */}
            <div className="border-r border-slate-200 p-4 space-y-3 bg-slate-50">
                <h2 className="font-extrabold text-slate-900 text-lg">
                    Active Conversations
                </h2>

                {loadingChats ? (
                    <p className="text-sm text-slate-500">
                        Loading conversations...
                    </p>
                ) : conversations.length === 0 ? (
                    <p className="text-sm text-slate-500">
                        No conversations yet.
                    </p>
                ) : (
                    <div className="space-y-2">
                        {conversations.map((conversation) => {
                            const otherUser = getOtherUser(conversation);

                            return (
                                <div
                                    key={conversation._id}
                                    onClick={() => setActiveChat(conversation._id)}
                                    className={`p-3 rounded-xl cursor-pointer transition-all border ${
                                        activeChat === conversation._id
                                            ? "bg-indigo-600 text-white border-indigo-600"
                                            : "bg-white hover:bg-slate-100 border-slate-200"
                                    }`}
                                >
                                    <p className="font-bold text-sm">
                                        {otherUser?.name || "Unknown user"}
                                    </p>

                                    <p className={`text-xs ${
                                        activeChat === conversation._id
                                            ? "text-indigo-100"
                                            : "text-slate-500"
                                    }`}>
                                        {conversation.itemId?.itemName || "Item"}
                                    </p>

                                    <p className={`text-xs mt-1 truncate ${
                                        activeChat === conversation._id
                                            ? "text-indigo-100"
                                            : "text-slate-400"
                                    }`}>
                                        {conversation.lastMessage || "No messages yet"}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Message Area */}
            <div className="col-span-2 flex flex-col justify-between p-4 min-h-[500px]">

                {selectedConversation ? (
                    <>
                        <div className="border-b border-slate-200 pb-3 mb-3">
                            <h3 className="font-bold text-slate-900">
                                {getOtherUser(selectedConversation)?.name}
                            </h3>

                            <p className="text-xs text-slate-500">
                                {selectedConversation.itemId?.itemName}
                            </p>
                        </div>

                        <div className="space-y-3 overflow-y-auto flex-1 max-h-[380px] p-2">

                            {loadingMessages ? (
                                <p className="text-sm text-slate-500">
                                    Loading messages...
                                </p>
                            ) : messages.length === 0 ? (
                                <p className="text-sm text-slate-500 text-center mt-10">
                                    No messages yet. Start the conversation!
                                </p>
                            ) : (
                                messages.map((msg) => {
                                    const senderId =
                                        typeof msg.senderId === "string"
                                            ? msg.senderId
                                            : msg.senderId?._id;

                                    const isMine =
                                        senderId === currentUserId;

                                    return (
                                        <div
                                            key={msg._id}
                                            className={`flex ${
                                                isMine
                                                    ? "justify-end"
                                                    : "justify-start"
                                            }`}
                                        >
                                            <div className={`p-3 rounded-2xl text-xs max-w-xs break-words ${
                                                isMine
                                                    ? "bg-indigo-600 text-white"
                                                    : "bg-slate-100 text-slate-800"
                                            }`}>
                                                <p>{msg.text}</p>

                                                <span className="text-[9px] opacity-70 block text-right mt-1">
                                                    {msg.createdAt
                                                        ? new Date(msg.createdAt).toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit"
                                                        })
                                                        : ""}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {error && (
                            <p className="text-sm text-red-500 mt-2">
                                {error}
                            </p>
                        )}

                        <form
                            onSubmit={handleSendMessage}
                            className="flex gap-2 pt-3 border-t border-slate-200"
                        >
                            <input
                                type="text"
                                placeholder="Type your message..."
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                className="flex-1 px-4 py-2 text-sm border border-slate-300 rounded-xl outline-none focus:border-indigo-600"
                            />

                            <button
                                type="submit"
                                disabled={sending || !messageInput.trim()}
                                className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50"
                            >
                                <Send size={16} />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex flex-1 items-center justify-center text-sm text-slate-500">
                        Select a conversation to view messages.
                    </div>
                )}
            </div>
        </div>
    );
}
