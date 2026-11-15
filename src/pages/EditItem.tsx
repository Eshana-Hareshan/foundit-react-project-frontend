
import { useEffect, useState } from "react";
import { useParams, Link,useNavigate } from "react-router-dom";
import api from "../service/api";

interface ItemType {
    _id: string;
    itemName: string;
    category: string;
    location: string;
    description: string;
    dateFound: string;
    additionalDetails?: string;
    imageUrl: string;
}

export default function EditItem() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [item, setItem] = useState<ItemType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updating, setUpdating] = useState(false);

     // Form states
    const [itemName, setItemName] = useState("");
    const [category, setCategory] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [dateFound, setDateFound] = useState("");
    const [additionalDetails, setAdditionalDetails] = useState("");
    const [image, setImage] = useState<File | null>(null);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await api.get(`/items/${id}`);

                const data = response.data.data;

                setItem(data);
                setItemName(data.itemName);
                setCategory(data.category);
                setLocation(data.location);
                setDescription(data.description);
                setDateFound(data.dateFound.split("T")[0]);
                setAdditionalDetails(data.additionalDetails || "");

            } catch (error) {
                console.error("Fetch Item Error:", error);
                setError("Unable to load item details.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchItem();
        }
    }, [id]);

    const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

    try {
        setUpdating(true);
        const formData = new FormData();

        formData.append("itemName", itemName);
        formData.append("category", category);
        formData.append("location", location);
        formData.append("description", description);
        formData.append("dateFound", dateFound);
        formData.append("additionalDetails", additionalDetails);

        if (image) {
            formData.append("image", image);
        }

        const response = await api.put(`/items/${id}`, formData);

        alert(response.data.message);
        navigate(`/items/${id}`);

    } catch (error) {
        console.error("Update Item Error:", error);
        alert("Failed to update item.");
    }finally {
        setUpdating(false);
    }
};

    if (loading) {
        return <p className="text-center mt-10">Loading item...</p>;
    }

    if (error || !item) {
        return (
            <div className="text-center mt-10">
                <p>{error || "Item not found."}</p>
                <Link to="/items">Back to items</Link>
            </div>
        );
    }

    
    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-6">Edit Item</h1>

            <form
                onSubmit={handleUpdate}
                className="bg-white p-6 rounded-xl shadow space-y-5"
            >
                <div>
                    <label className="block font-semibold mb-2">Item Name</label>
                    <input
                        type="text"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        className="w-full border rounded-lg p-3"
                        required
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-2">Category</label>
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full border rounded-lg p-3"
                        required
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-2">Location</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full border rounded-lg p-3"
                        required
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-2">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border rounded-lg p-3"
                        rows={4}
                        required
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-2">Date Found</label>
                    <input
                        type="date"
                        value={dateFound}
                        onChange={(e) => setDateFound(e.target.value)}
                        className="w-full border rounded-lg p-3"
                        required
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-2">
                        Additional Details
                    </label>
                    <textarea
                        value={additionalDetails}
                        onChange={(e) => setAdditionalDetails(e.target.value)}
                        className="w-full border rounded-lg p-3"
                        rows={3}
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-2">
                        Current Image
                    </label>
                    <img
                        src={item.imageUrl}
                        alt={item.itemName}
                        className="w-full h-48 object-cover rounded-lg mb-3"
                    />

                    <label className="block font-semibold mb-2">
                        Upload New Image (Optional)
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setImage(e.target.files?.[0] || null)
                        }
                        className="w-full border rounded-lg p-3"
                    />
                </div>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={updating}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {updating ? "Updating..." : "Save Changes"}
                    </button>

                    <Link
                        to={`/items/${id}`}
                        className="bg-gray-200 px-6 py-3 rounded-lg"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );

}
