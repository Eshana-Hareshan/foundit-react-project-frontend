import { useState, type FormEvent, type ChangeEvent } from "react";
import {
  Plus,
  MapPin,
  Calendar,
  FileText,
  Star,
  UploadCloud,
  X,
  Search,
  PackageCheck,
  ShieldCheck,
  Camera,
  Loader2,
} from "lucide-react";

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

export default function AddItem() {
  const [status, setStatus] = useState<"LOST" | "FOUND">("FOUND");

  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [dateFound, setDateFound] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLost = status === "LOST";

  const handleRemoveImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImage(null);
    setImagePreview("");
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      alert("Image size must be less than 1MB.");
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!image) {
      alert("Please upload an item photo.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Create FormData to send text and image together
      const formData = new FormData();

      formData.append("itemName", itemName);
      formData.append("category", category);
      formData.append("location", location);
      formData.append("description", description);
      formData.append("dateFound", dateFound);
      formData.append("additionalDetails", additionalDetails);
      formData.append("status", status);
      formData.append("image", image);

      // Get access token
      const token = localStorage.getItem("ACCESS_TOKEN");

      if (!token) {
        throw new Error("Please login first.");
      }

      // Send data to backend
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/items`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add item.");
      }

      alert(
        status === "LOST"
          ? "Lost item reported successfully!"
          : "Found item added successfully!"
      );
      console.log("Saved item:", data.item);

      // Clear form
      setItemName("");
      setCategory("");
      setLocation("");
      setDescription("");
      setDateFound("");
      setAdditionalDetails("");

      handleRemoveImage();
    } catch (error) {
      console.error("Add Item Error:", error);

      alert(error instanceof Error ? error.message : "Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Page heading */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl text-white flex items-center justify-center shadow-lg transition-colors ${
              isLost
                ? "bg-gradient-to-br from-rose-500 to-rose-700 shadow-rose-200"
                : "bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-emerald-200"
            }`}
          >
            {isLost ? <Search size={26} /> : <PackageCheck size={26} />}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-emerald-950">
              {isLost ? "Report a lost item" : "Add a found item"}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {isLost
                ? "Tell others about the item you have lost."
                : "Help someone get their lost item back!"}
            </p>
          </div>
        </div>
      </div>

      {/* Post type toggle */}
      <div className="mb-6">
        <span className={labelBase}>I want to post a...</span>
        <div className="relative grid grid-cols-2 p-1.5 bg-emerald-50 border border-emerald-100 rounded-2xl max-w-md">
          <span
            aria-hidden
            className={`absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-0.375rem)] rounded-xl shadow-md transition-all duration-300 ${
              isLost ? "translate-x-0 bg-rose-600" : "translate-x-full bg-emerald-600"
            }`}
          />
          <button
            type="button"
            onClick={() => setStatus("LOST")}
            className={`relative z-10 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-colors ${
              isLost ? "text-white" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Search size={16} /> Lost
          </button>
          <button
            type="button"
            onClick={() => setStatus("FOUND")}
            className={`relative z-10 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-colors ${
              !isLost ? "text-white" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <PackageCheck size={16} /> Found
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ============ LEFT: PHOTO ============ */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-5 lg:sticky lg:top-24">
            <div className="flex items-center gap-2 mb-4">
              <Camera size={18} className="text-emerald-600" />
              <h2 className="font-bold text-emerald-950">
                Item photo <span className="text-rose-500">*</span>
              </h2>
            </div>

            {!imagePreview ? (
              <label className="group flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-emerald-300 rounded-2xl bg-emerald-50/50 hover:bg-emerald-50 hover:border-emerald-500 cursor-pointer transition-all">
                <div className="w-14 h-14 rounded-full bg-white shadow-sm text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <UploadCloud size={28} />
                </div>
                <span className="font-semibold text-slate-800">Upload a photo</span>
                <span className="text-sm text-slate-500 mt-0.5">Click to browse</span>
                <span className="text-xs text-slate-400 mt-3 px-2.5 py-1 rounded-full bg-white border border-emerald-100">
                  JPG, PNG up to 1MB
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Item preview"
                  className="w-full aspect-square object-cover rounded-2xl border border-emerald-100"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  aria-label="Remove photo"
                  className="absolute top-3 right-3 p-2 bg-white/95 backdrop-blur rounded-full shadow-md hover:bg-rose-50 transition-colors"
                >
                  <X size={18} className="text-rose-600" />
                </button>
              </div>
            )}

            <div className="mt-4 flex gap-2.5 p-3 rounded-xl bg-emerald-50 text-emerald-900 text-xs leading-relaxed">
              <ShieldCheck size={16} className="shrink-0 mt-0.5 text-emerald-600" />
              <p>
                A clear photo helps the right person recognise the item. Avoid showing personal
                details such as ID numbers.
              </p>
            </div>
          </div>
        </div>

        {/* ============ RIGHT: DETAILS ============ */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-emerald-100 shadow-sm p-5 sm:p-7 space-y-5">
          {/* Item Name and Category */}
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
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g. iPhone 15, Blue Wallet"
                  className={`${inputBase} pl-11 pr-4`}
                />
              </div>
            </div>

            <div>
              <label className={labelBase}>
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`${inputBase} px-4`}
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className={labelBase}>
              {isLost ? "Last seen location" : "Found location"}{" "}
              <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <MapPin
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Panadura Railway Station"
                className={`${inputBase} pl-11 pr-4`}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelBase}>
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={`Describe the ${
                isLost ? "lost" : "found"
              } item, its colour, condition and other visible features...`}
              className={`${inputBase} px-4 resize-none`}
            />
          </div>

          {/* Date and Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelBase}>
                {isLost ? "Date lost" : "Date found"} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="date"
                  required
                  value={dateFound}
                  onChange={(e) => setDateFound(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  className={`${inputBase} pl-11 pr-4`}
                />
              </div>
            </div>

            <div>
              <label className={labelBase}>
                Additional details <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <Star
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                  placeholder="Any other info... (contact no)"
                  className={`${inputBase} pl-11 pr-4`}
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 disabled:cursor-not-allowed ${
                isLost
                  ? "bg-rose-600 hover:bg-rose-700 shadow-rose-200"
                  : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
              }`}
            >
              {isSubmitting ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Plus size={20} />
              )}
              {isSubmitting ? "Uploading..." : isLost ? "Post lost item" : "Post found item"}
            </button>
            <p className="text-xs text-center text-slate-400 mt-3">
              Please provide accurate information to help the owner find their item.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}