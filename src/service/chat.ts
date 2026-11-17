
import api from "./api";

// 1. Get all conversations of the logged-in user
export const getMyConversations = async () => {
    const res = await api.get("/chats");
    return res.data.conversations;
};

// Create or retrieve a conversation
export const createConversation = async (itemId: string) => {
    const res = await api.post("/chats", { itemId });
    return res.data.conversation;
};


// 2. Get messages for a selected conversation
export const getConversationMessages = async (
    conversationId: string
) => {
    const res = await api.get(
        `/chats/${conversationId}/messages`
    );

    return res.data.messages;
};

// 3. Send a message
export const sendMessage = async (
    conversationId: string,
    text: string
) => {
    const res = await api.post(
        `/chats/${conversationId}/messages`,
        { text }
    );

    return res.data.newMessage;
};

// 4. Get unread message count
export const getUnreadMessageCount = async () => {
    const res = await api.get("/chats/unread-count");
    return res.data.unreadCount;
};