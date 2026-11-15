
import { useEffect, useState, useContext  } from "react";
import { useParams, Link , useNavigate} from "react-router-dom";
import { MapPin, Calendar, User, ArrowLeft,MessageCircle } from "lucide-react";
import api from "../service/api";
import { AuthContext } from "../context/AuthContext";
import { createConversation } from "../service/chat";

interface ItemDetailsType {
    _id: string;
    itemName: string;
    category: string;
    location: string;
    description: string;
    dateFound: string;
    additionalDetails?: string;
    imageUrl: string;
    userId?: {
        _id: string;
        name: string;
        email: string;
    };
}

export default function ItemDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const auth = useContext(AuthContext);
    const currentUser = auth?.user;

    const [startingChat, setStartingChat] = useState(false);
    const [chatError, setChatError] = useState("");

    const [item, setItem] = useState<ItemDetailsType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const currentUserId = currentUser?.id || currentUser?._id;

    const isOwner =
        !!currentUserId &&
        !!item?.userId?._id &&
        item.userId._id === currentUserId;
    
    const handleStartChat = async () => {
        if (!id || !currentUser) return;

        try {
            setStartingChat(true);
            setChatError("");

            const conversation = await createConversation(id);

            navigate(`/chats?conversationId=${conversation._id}`);

        } catch (error) {
            console.error("Start Chat Error:", error);
            setChatError("Unable to start chat. Please try again.");
        } finally {
            setStartingChat(false);
        }
    };

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await api.get(`/items/${id}`);
                setItem(response.data.data);
            } catch (error) {
                console.error("Item Details Error:", error);
                setError("Unable to load item details.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchItem();
        }
    }, [id]);

    if (loading) {
        return <p className="text-center mt-10">Loading item details...</p>;
    }

    if (error || !item) {
        return (
            <div className="text-center mt-10">
                <p>{error || "Item not found."}</p>
                <Link to="/items" className="text-blue-600">
                    Back to items
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <Link
                to="/items"
                className="inline-flex items-center gap-2 mb-6 text-gray-600 hover:text-blue-600"
            >
                <ArrowLeft size={18} />
                Back to items
            </Link>

            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <img
                        src={item.imageUrl}
                        alt={item.itemName}
                        className="w-full h-96 object-cover rounded-xl"
                    />
                </div>

                <div className="space-y-5">
                    <div>
                        <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                            {item.category}
                        </span>

                        <h1 className="text-3xl font-bold mt-4">
                            {item.itemName}
                        </h1>
                    </div>

                    <div>
                        <h2 className="font-semibold text-lg">
                            Description
                        </h2>
                        <p className="text-gray-600 mt-2">
                            {item.description}
                        </p>
                    </div>

                    {item.additionalDetails && (
                        <div>
                            <h2 className="font-semibold text-lg">
                                Additional Details
                            </h2>
                            <p className="text-gray-600 mt-2">
                                {item.additionalDetails}
                            </p>
                        </div>
                    )}

                    <div className="flex items-center gap-3 text-gray-600">
                        <MapPin size={18} />
                        {item.location}
                    </div>

                    <div className="flex items-center gap-3 text-gray-600">
                        <Calendar size={18} />
                        {new Date(item.dateFound).toLocaleDateString()}
                    </div>

                    {item.userId && (
                        <div className="border-t pt-5">

                            {/* Owner can edit their own item */}
                            {isOwner && (
                                <Link
                                    to={`/items/${id}/edit`}
                                    className="flex items-center justify-center w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 mb-4"
                                >
                                    Edit Item
                                </Link>
                            )}

                            {/* Other users can start a chat */}

                            {currentUser && !isOwner && (
                                <div className="border-t pt-5">
                                    <button
                                        onClick={handleStartChat}
                                        disabled={startingChat}
                                        className="flex items-center justify-center gap-2 w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        <MessageCircle size={18} />
                                        {startingChat ? "Opening Chat..." : "Start Chat"}
                                    </button>

                                    {chatError && (
                                        <p className="text-red-500 text-sm mt-2">
                                            {chatError}
                                        </p>
                                    )}
                                </div>
                            )}
                            <h2 className="font-semibold text-lg mb-3">
                                Posted By
                            </h2>

                            <div className="flex items-center gap-3">
                                <User size={20} />
                                <div>
                                    <p>{item.userId.name}</p>
                                    {/* <p className="text-sm text-gray-500">
                                        {item.userId.email}
                                    </p> */}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
