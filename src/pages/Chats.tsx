import { useContext, useEffect, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { Send, ArrowLeft, MessageSquare, MessagesSquare, Loader2, Package } from "lucide-react";

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

const initialOf = (name?: string) => (name?.trim()?.[0] || "?").toUpperCase();

const Avatar = ({ name, size = "md" }: { name?: string; size?: "md" | "lg" }) => (
    <div
        className={`shrink-0 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 text-white font-bold flex items-center justify-center ${
            size === "lg" ? "w-11 h-11 text-base" : "w-10 h-10 text-sm"
        }`}
    >
        {initialOf(name)}
    </div>
);

export default function Chats() {
    const auth = useContext(AuthContext);
    const user = auth?.user;

    const currentUserId = user?.id || user?._id;

    const [searchParams] = useSearchParams();

    const requestedConversationId = searchParams.get("conversationId");

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeChat, setActiveChat] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [messageInput, setMessageInput] = useState("");

    const [loadingChats, setLoadingChats] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");

    // Mobile only: show the conversation list or the open chat
    const [mobileShowChat, setMobileShowChat] = useState<boolean>(!!requestedConversationId);

    const bottomRef = useRef<HTMLDivElement>(null);

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
                    const selectedConversation = data.find(
                        (conversation: Conversation) =>
                            conversation._id === requestedConversationId
                    );

                    setActiveChat(
                        selectedConversation
                            ? selectedConversation._id
                            : data[0]._id
                    );
                }
            } catch (err) {
                console.error("Failed to load conversations:", err);
                setError("Failed to load conversations.");
            } finally {
                setLoadingChats(false);
            }
        };

        fetchConversations();
    }, [currentUserId, requestedConversationId]);

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

    // Keep the newest message in view
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [messages, loadingMessages]);

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
        return (
            <div className="flex items-center justify-center gap-2 py-20 text-emerald-700 text-sm">
                <Loader2 size={18} className="animate-spin" /> Loading user...
            </div>
        );
    }

    if (!user) {
        return (
            <div className="max-w-md mx-auto text-center py-16 px-6 bg-white border border-dashed border-emerald-200 rounded-2xl">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                    <MessageSquare size={26} />
                </div>
                <p className="font-bold text-emerald-950">Please log in</p>
                <p className="text-sm text-slate-500 mt-1">You need to be logged in to view your chats.</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-emerald-100 rounded-2xl shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[calc(100vh-13rem)] min-h-[520px]">

            {/* ============ Conversation List ============ */}
            <div
                className={`${
                    mobileShowChat ? "hidden md:flex" : "flex"
                } flex-col min-h-0 border-r border-emerald-100 bg-emerald-50/40`}
            >
                <div className="p-4 border-b border-emerald-100 bg-white flex items-center gap-2">
                    <MessagesSquare size={18} className="text-emerald-600" />
                    <h2 className="font-extrabold text-emerald-950 text-base">Conversations</h2>
                    {conversations.length > 0 && (
                        <span className="ml-auto text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            {conversations.length}
                        </span>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {loadingChats ? (
                        <div className="space-y-2 animate-pulse">
                            {[1, 2, 3].map((n) => (
                                <div key={n} className="h-16 rounded-xl bg-emerald-100/60" />
                            ))}
                        </div>
                    ) : conversations.length === 0 ? (
                        <div className="text-center py-10 px-4">
                            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                                <MessageSquare size={22} />
                            </div>
                            <p className="text-sm font-semibold text-emerald-950">No conversations yet</p>
                            <p className="text-xs text-slate-500 mt-1">
                                Contact an item owner to start chatting.
                            </p>
                        </div>
                    ) : (
                        conversations.map((conversation) => {
                            const otherUser = getOtherUser(conversation);
                            const isActive = activeChat === conversation._id;

                            return (
                                <button
                                    type="button"
                                    key={conversation._id}
                                    onClick={() => {
                                        setActiveChat(conversation._id);
                                        setMobileShowChat(true);
                                    }}
                                    className={`w-full text-left flex items-center gap-3 p-3 rounded-xl transition-all border ${
                                        isActive
                                            ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-200"
                                            : "bg-white hover:bg-emerald-50 border-emerald-100 hover:border-emerald-200"
                                    }`}
                                >
                                    <Avatar name={otherUser?.name} />
                                    <div className="min-w-0 flex-1">
                                        <p className="font-bold text-sm truncate">
                                            {otherUser?.name || "Unknown user"}
                                        </p>
                                        <p
                                            className={`text-[11px] font-medium truncate ${
                                                isActive ? "text-emerald-100" : "text-emerald-700"
                                            }`}
                                        >
                                            {conversation.itemId?.itemName || "Item"}
                                        </p>
                                        <p
                                            className={`text-xs truncate mt-0.5 ${
                                                isActive ? "text-emerald-100/80" : "text-slate-400"
                                            }`}
                                        >
                                            {conversation.lastMessage || "No messages yet"}
                                        </p>
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            {/* ============ Message Area ============ */}
            <div
                className={`${
                    mobileShowChat ? "flex" : "hidden md:flex"
                } md:col-span-2 flex-col min-h-0 bg-white`}
            >
                {selectedConversation ? (
                    <>
                        {/* Chat header */}
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-emerald-100 bg-white">
                            <button
                                type="button"
                                onClick={() => setMobileShowChat(false)}
                                aria-label="Back to conversations"
                                className="md:hidden p-2 -ml-1 rounded-full text-emerald-700 hover:bg-emerald-50"
                            >
                                <ArrowLeft size={20} />
                            </button>

                            <Avatar name={getOtherUser(selectedConversation)?.name} size="lg" />

                            <div className="min-w-0 flex-1">
                                <h3 className="font-bold text-emerald-950 truncate">
                                    {getOtherUser(selectedConversation)?.name}
                                </h3>
                                <p className="text-xs text-slate-500 truncate">
                                    Re: {selectedConversation.itemId?.itemName}
                                </p>
                            </div>

                            {/* Item chip */}
                            <div className="hidden sm:flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
                                {selectedConversation.itemId?.imageUrl ? (
                                    <img
                                        src={selectedConversation.itemId.imageUrl}
                                        alt={selectedConversation.itemId.itemName}
                                        className="w-7 h-7 rounded-full object-cover"
                                    />
                                ) : (
                                    <Package size={16} className="text-emerald-600 ml-1" />
                                )}
                                <span className="text-xs font-semibold text-emerald-800 max-w-[120px] truncate">
                                    {selectedConversation.itemId?.itemName}
                                </span>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-5 space-y-3 bg-gradient-to-b from-emerald-50/40 to-white">
                            {loadingMessages ? (
                                <div className="flex items-center justify-center gap-2 text-sm text-emerald-700 mt-10">
                                    <Loader2 size={16} className="animate-spin" /> Loading messages...
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="text-center mt-16">
                                    <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                                        <MessageSquare size={22} />
                                    </div>
                                    <p className="text-sm font-semibold text-emerald-950">No messages yet</p>
                                    <p className="text-xs text-slate-500 mt-1">Start the conversation!</p>
                                </div>
                            ) : (
                                messages.map((msg) => {
                                    const senderId =
                                        typeof msg.senderId === "string"
                                            ? msg.senderId
                                            : msg.senderId?._id;

                                    const isMine = senderId === currentUserId;

                                    return (
                                        <div
                                            key={msg._id}
                                            className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                                        >
                                            <div
                                                className={`px-3.5 py-2.5 text-sm max-w-[80%] sm:max-w-sm break-words shadow-sm ${
                                                    isMine
                                                        ? "bg-emerald-600 text-white rounded-2xl rounded-br-md"
                                                        : "bg-white text-slate-800 border border-emerald-100 rounded-2xl rounded-bl-md"
                                                }`}
                                            >
                                                <p>{msg.text}</p>

                                                <span
                                                    className={`text-[10px] block text-right mt-1 ${
                                                        isMine ? "text-emerald-100/80" : "text-slate-400"
                                                    }`}
                                                >
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
                            <div ref={bottomRef} />
                        </div>

                        {error && (
                            <p className="mx-4 mb-2 text-xs font-medium text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
                                {error}
                            </p>
                        )}

                        {/* Composer */}
                        <form
                            onSubmit={handleSendMessage}
                            className="flex items-center gap-2 p-3 border-t border-emerald-100 bg-white"
                        >
                            <input
                                type="text"
                                placeholder="Type your message..."
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                className="flex-1 px-4 py-2.5 text-sm bg-emerald-50/60 border border-emerald-100 rounded-full outline-none transition-all focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                            />

                            <button
                                type="submit"
                                disabled={sending || !messageInput.trim()}
                                aria-label="Send message"
                                className="w-10 h-10 shrink-0 flex items-center justify-center bg-emerald-600 text-white rounded-full shadow-md shadow-emerald-200 hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:shadow-none"
                            >
                                {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex flex-1 flex-col items-center justify-center text-center px-6">
                        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4">
                            <MessagesSquare size={30} />
                        </div>
                        <p className="font-bold text-emerald-950">Select a conversation</p>
                        <p className="text-sm text-slate-500 mt-1">Choose a chat on the left to view messages.</p>
                    </div>
                )}
            </div>
        </div>
    );
}