import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Calendar,
    Camera,
    FileText,
    Loader2,
    MapPin,
    PackageX,
    Pencil,
    RefreshCw,
    Save,
    Star,
    X,
} from "lucide-react";
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
    moderationStatus?: string;
    moderationReason?: string;
}

const CATEGORIES = [
    "Electronics",
    "Mobile Phones",
    "Wallets",
    "Documents",
    "Bags",
    "Jewellery",
    "Keys",
    "Clothing",
    "Pets",
    "Other",
];

const inputBase =
    "w-full py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

const labelBase = "block text-sm font-semibold text-slate-700 mb-1.5";

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
    const [imagePreview, setImagePreview] = useState("");

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

    // Clean up the preview URL when it changes or the page unmounts
    useEffect(() => {
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
        };
    }, [imagePreview]);

    const handleImageChange = (file: File | null) => {
        setImage(file);
        setImagePreview(file ? URL.createObjectURL(file) : "");
    };

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
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center gap-2 py-24 text-emerald-700 text-sm">
                <Loader2 size={18} className="animate-spin" /> Loading item...
            </div>
        );
    }

    if (error || !item) {
        return (
            <div className="max-w-md mx-auto text-center py-16 px-6 bg-white border border-dashed border-emerald-200 rounded-2xl">
                <div className="w-14 h-14 mx-auto rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-3">
                    <PackageX size={26} />
                </div>
                <p className="font-bold text-emerald-950">{error || "Item not found."}</p>
                <Link
                    to="/items"
                    className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
                >
                    <ArrowLeft size={16} /> Back to items
                </Link>
            </div>
        );
    }

    // Keep the saved category selectable even if it isn't in the standard list
    const categoryOptions = CATEGORIES.includes(category) || !category
        ? CATEGORIES
        : [category, ...CATEGORIES];

    return (
        <div className="max-w-5xl mx-auto">
            {/* Page heading */}
            <div className="mb-6 sm:mb-8 flex items-center gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
                    <Pencil size={24} />
                </div>
                <div className="min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-emerald-950">
                        Edit item
                    </h1>
                    <p className="text-sm text-slate-500 mt-0.5 truncate">
                        Update the details for <span className="font-semibold text-emerald-800">{item.itemName}</span>
                    </p>
                </div>
            </div>

            {item.moderationStatus === "EDIT_REQUESTED" && (
                <div className="mb-6 p-5 rounded-xl border border-amber-300 bg-amber-50">
                    <h2 className="font-bold text-amber-900">
                        Changes requested by Administrator
                    </h2>

                    <p className="text-sm text-amber-800 mt-2">
                        Please correct your post according to the following instructions:
                    </p>

                    <p className="text-sm font-semibold text-amber-900 mt-2">
                        {item.moderationReason || "Please review and correct your post."}
                    </p>

                    <p className="text-xs text-amber-700 mt-3">
                        Save your corrections to make your post active again.
                    </p>
                </div>
            )}

            <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* ============ LEFT: PHOTO ============ */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-5 lg:sticky lg:top-24">
                        <div className="flex items-center gap-2 mb-4">
                            <Camera size={18} className="text-emerald-600" />
                            <h2 className="font-bold text-emerald-950">Item photo</h2>
                        </div>

                        <div className="relative">
                            <img
                                src={imagePreview || item.imageUrl}
                                alt={item.itemName}
                                className="w-full aspect-square object-cover rounded-2xl border border-emerald-100"
                            />
                            <span
                                className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur ${
                                    imagePreview
                                        ? "bg-emerald-600 text-white"
                                        : "bg-white/90 text-slate-700"
                                }`}
                            >
                                {imagePreview ? "New photo" : "Current photo"}
                            </span>
                            {imagePreview && (
                                <button
                                    type="button"
                                    onClick={() => handleImageChange(null)}
                                    aria-label="Discard new photo"
                                    className="absolute top-3 right-3 p-2 bg-white/95 backdrop-blur rounded-full shadow-md hover:bg-rose-50 transition-colors"
                                >
                                    <X size={18} className="text-rose-600" />
                                </button>
                            )}
                        </div>

                        <label className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/50 hover:bg-emerald-50 hover:border-emerald-500 text-sm font-semibold text-emerald-800 cursor-pointer transition-all">
                            <RefreshCw size={16} />
                            {imagePreview ? "Choose a different photo" : "Replace photo (optional)"}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                                className="hidden"
                            />
                        </label>
                        <p className="text-xs text-slate-400 text-center mt-2">
                            Leave as is to keep the current photo.
                        </p>
                    </div>
                </div>

                {/* ============ RIGHT: DETAILS ============ */}
                <div className="lg:col-span-3 bg-white rounded-2xl border border-emerald-100 shadow-sm p-5 sm:p-7 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className={labelBase}>
                                Item name <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <FileText
                                    size={18}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    type="text"
                                    value={itemName}
                                    onChange={(e) => setItemName(e.target.value)}
                                    className={`${inputBase} pl-11 pr-4`}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className={labelBase}>
                                Category <span className="text-rose-500">*</span>
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className={`${inputBase} px-4`}
                                required
                            >
                                <option value="">Select category</option>
                                {categoryOptions.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className={labelBase}>
                            Location <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <MapPin
                                size={18}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className={`${inputBase} pl-11 pr-4`}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className={labelBase}>
                            Description <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={`${inputBase} px-4 resize-none`}
                            rows={4}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className={labelBase}>
                                Date <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <Calendar
                                    size={18}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    type="date"
                                    value={dateFound}
                                    onChange={(e) => setDateFound(e.target.value)}
                                    className={`${inputBase} pl-11 pr-4`}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className={labelBase}>
                                Additional details{" "}
                                <span className="text-slate-400 font-normal">(optional)</span>
                            </label>
                            <div className="relative">
                                <Star
                                    size={18}
                                    className="absolute left-3.5 top-3.5 text-slate-400"
                                />
                                <textarea
                                    value={additionalDetails}
                                    onChange={(e) => setAdditionalDetails(e.target.value)}
                                    className={`${inputBase} pl-11 pr-4 resize-none`}
                                    rows={1}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 flex flex-col-reverse sm:flex-row gap-3">
                        <Link
                            to={`/items/${id}`}
                            className="sm:w-1/3 flex items-center justify-center gap-2 py-3.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={updating}
                            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
                        >
                            {updating ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <Save size={20} />
                            )}
                            {updating ? "Updating..." : "Save changes"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}