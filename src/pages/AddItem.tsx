
import { useState, type FormEvent, type ChangeEvent } from "react";
import {
  Plus,
  Camera,
  MapPin,
  Calendar,
  FileText,
  Star,
  UploadCloud,
  X
} from "lucide-react";

export default function AddItem() {
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [dateFound, setDateFound] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        formData.append("image", image);

        // Get access token
        const token = localStorage.getItem("ACCESS_TOKEN");

        if (!token) {
            throw new Error("Please login first.");
        }

        // Send data to backend
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/items`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to add item.");
        }

        alert("Found item added successfully!");

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

        alert(
            error instanceof Error
                ? error.message
                : "Something went wrong!"
        );

    } finally {
        setIsSubmitting(false);
    }
    };

  const handleRemoveImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImage(null);
    setImagePreview("");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10">

        {/* Page Heading */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
            <Plus size={30} />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Add Found Item
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Help someone get their lost item back!
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Item Photo <span className="text-rose-500">*</span>
            </label>

            {!imagePreview ? (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-indigo-300 rounded-xl bg-indigo-50/40 hover:bg-indigo-50 cursor-pointer transition">
                <UploadCloud size={38} className="text-indigo-600 mb-3" />

                <span className="font-semibold text-slate-700">
                  Upload a Photo
                </span>

                <span className="text-sm text-slate-500 mt-1">
                  Click to browse
                </span>

                <span className="text-xs text-slate-400 mt-2">
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
              <div className="relative w-full max-w-sm">
                <img
                  src={imagePreview}
                  alt="Item preview"
                  className="w-full h-56 object-cover rounded-xl border border-slate-200"
                />

                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-rose-50"
                >
                  <X size={18} className="text-rose-600" />
                </button>
              </div>
            )}
          </div>

          {/* Item Name and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Item Name *
              </label>

              <div className="relative">
                <FileText size={18} className="absolute left-3 top-3.5 text-slate-400" />

                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g. iPhone 15, Blue Wallet"
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Category *
              </label>

              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:border-indigo-600 bg-white"
              >
                <option value="">Select category</option>
                <option value="Electronics">Electronics</option>
                <option value="Mobile Phones">Mobile Phones</option>
                <option value="Wallets">Wallets</option>
                <option value="Documents">Documents</option>
                <option value="Bags">Bags</option>
                <option value="Jewellery">Jewellery</option>
                <option value="Keys">Keys</option>
                <option value="Clothing">Clothing</option>
                <option value="Pets">Pets</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Found Location */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Found Location *
            </label>

            <div className="relative">
              <MapPin size={18} className="absolute left-3 top-3.5 text-slate-400" />

              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Panadura Railway Station"
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Description *
            </label>

            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the found item, its colour, condition and other visible features..."
              className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:border-indigo-600 resize-none"
            />
          </div>

          {/* Date and Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Date Found *
              </label>

              <div className="relative">
                <Calendar size={18} className="absolute left-3 top-3.5 text-slate-400" />

                <input
                  type="date"
                  required
                  value={dateFound}
                  onChange={(e) => setDateFound(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Additional Details (Optional)
              </label>

              <div className="relative">
                <Star size={18} className="absolute left-3 top-3.5 text-slate-400" />

                <input
                  type="text"
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                  placeholder="Any other helpful information..."
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl outline-none focus:border-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2
            bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50
            text-white font-semibold py-3.5 rounded-xl transition-all"
        >
            <Plus size={20} />

            {isSubmitting ? "Uploading..." : "Post Found Item"}
        </button>
          <p className="text-xs text-center text-slate-400">
            Please provide accurate information to help the owner find their item.
          </p>

        </form>
      </div>
    </div>
  );
}
