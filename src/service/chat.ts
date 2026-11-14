
import api from "./api";

// 1. Get all conversations of the logged-in user
export const getMyConversations = async () => {
    const res = await api.get("/chats");
    return res.data;
};

// 2. Get messages for a selected conversation
export const getConversationMessages = async (
    conversationId: string
) => {
    const res = await api.get(
        `/chats/${conversationId}/messages`
    );

    return res.data;
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

    return res.data;
};
