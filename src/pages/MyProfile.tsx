
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getAllItems } from "../service/item";
import ItemCard, { type AdItem } from "../components/common/ItemCard";
import { User, Mail } from "lucide-react";

export default function MyProfile() {
  const { user, loading: authLoading } = useAuth();

  const [myItems, setMyItems] = useState<AdItem[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = user?.id || user?._id;

  useEffect(() => {
    const fetchMyItems = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await getAllItems(1, 100);

        console.log("My Profile User ID:", userId);

console.log(
  "All Retrieved Owner IDs:",
  response.data.map((item) => ({
    itemName: item.itemName,
    userId: item.userId,
  }))
);

const ownItems = response.data.filter(
  (item) => String(item.userId) === String(userId)
);

console.log("My Own Posts:", ownItems);

setMyItems(ownItems);
      } catch (error) {
        console.error("Error fetching my posts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchMyItems();
    }
  }, [userId, authLoading]);

  if (authLoading || loading) {
    return <p className="text-center py-10">Loading profile...</p>;
  }

  if (!user) {
    return <p className="text-center py-10">Please log in to view your profile.</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

      {/* Profile Information */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
            <User size={32} className="text-indigo-600" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {user.name || "User"}
            </h1>

            <p className="flex items-center gap-2 text-sm text-slate-500 mt-1">
              <Mail size={15} />
              {user.email}
            </p>
          </div>
        </div>
      </div>

      {/* My Posts */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-slate-900">
            My Posts
          </h2>

          <span className="text-sm font-semibold text-indigo-600">
            {myItems.length} Posts
          </span>
        </div>

        {myItems.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
            <p className="text-slate-500">
              You haven't posted any items yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myItems.map((item) => (
              <ItemCard key={item.id} ad={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
