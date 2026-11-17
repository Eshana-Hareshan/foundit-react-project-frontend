import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getAllItems } from "../service/item";
import ItemCard, { type AdItem } from "../components/common/ItemCard";
import {
  CheckCircle2,
  FileStack,
  Loader2,
  LogIn,
  Mail,
  PackageCheck,
  PackagePlus,
  Search,
} from "lucide-react";

type Filter = "ALL" | "LOST" | "FOUND";

export default function MyProfile() {
  const { user, loading: authLoading } = useAuth();

  const [myItems, setMyItems] = useState<AdItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("ALL");

  const userId = user?.id || user?._id;

  useEffect(() => {
    const fetchMyItems = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await getAllItems(1, 100);

        const ownItems = response.data.filter(
          (item) => String(item.userId) === String(userId)
        );

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
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-emerald-700 text-sm">
        <Loader2 size={18} className="animate-spin" /> Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-6 bg-white border border-dashed border-emerald-200 rounded-2xl">
        <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
          <LogIn size={26} />
        </div>
        <p className="font-bold text-emerald-950">Please log in</p>
        <p className="text-sm text-slate-500 mt-1">Log in to view your profile and posts.</p>
        <Link
          to="/login"
          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
        >
          Log In
        </Link>
      </div>
    );
  }

  const countBy = (s: "LOST" | "FOUND") =>
    myItems.filter((i) => i.status?.toUpperCase() === s).length;
  const lostCount = countBy("LOST");
  const foundCount = countBy("FOUND");
  const resolvedCount = myItems.filter((i) => i.isResolved === true).length;

  const visibleItems =
    filter === "ALL"
      ? myItems
      : myItems.filter((i) => i.status?.toUpperCase() === filter);

  const summary = [
    { label: "Total posts", value: myItems.length, icon: FileStack },
    { label: "Lost", value: lostCount, icon: Search },
    { label: "Found", value: foundCount, icon: PackageCheck },
    { label: "Resolved", value: resolvedCount, icon: CheckCircle2 },
  ];

  const tabs: { id: Filter; label: string; count: number }[] = [
    { id: "ALL", label: "All", count: myItems.length },
    { id: "LOST", label: "Lost", count: lostCount },
    { id: "FOUND", label: "Found", count: foundCount },
  ];

  return (
    <div className="max-w-6xl mx-auto grid lg:grid-cols-[320px_1fr] gap-6 lg:gap-8 items-start">
      {/* ============ LEFT: PROFILE CARD ============ */}
      <aside className="bg-white border border-emerald-100 rounded-3xl shadow-sm overflow-hidden lg:sticky lg:top-24">
        {/* Soft cover strip */}
        <div className="h-20 bg-gradient-to-r from-emerald-200 via-emerald-100 to-lime-100" />

        <div className="px-6 pb-6 -mt-10">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white text-3xl font-black flex items-center justify-center ring-4 ring-white shadow-lg shadow-emerald-200">
            {(user.name?.trim()?.[0] || "U").toUpperCase()}
          </div>

          <h1 className="text-xl font-black tracking-tight text-emerald-950 mt-4 break-words">
            {user.name || "User"}
          </h1>
          <p className="flex items-center gap-2 text-sm text-slate-500 mt-1 min-w-0">
            <Mail size={15} className="shrink-0 text-emerald-600" />
            <span className="truncate">{user.email}</span>
          </p>

          {/* Summary list */}
          <ul className="mt-5 divide-y divide-emerald-100 border-y border-emerald-100">
            {summary.map(({ label, value, icon: Icon }) => (
              <li key={label} className="flex items-center justify-between py-2.5 text-sm">
                <span className="flex items-center gap-2.5 text-slate-600">
                  <Icon size={16} className="text-emerald-600" />
                  {label}
                </span>
                <span className="font-bold text-emerald-950">{value}</span>
              </li>
            ))}
          </ul>

          <Link
            to="/add-item"
            className="mt-5 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 shadow-md shadow-emerald-200 transition-all"
          >
            <PackagePlus size={18} /> New post
          </Link>
        </div>
      </aside>

      {/* ============ RIGHT: POSTS ============ */}
      <section className="min-w-0">
        <div className="flex items-end justify-between gap-4 mb-1">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-emerald-950">My Posts</h2>
            <p className="text-sm text-slate-500 mt-0.5">Everything you've reported or found.</p>
          </div>
        </div>

        {/* Underline tabs */}
        <div className="flex gap-6 border-b border-emerald-100 mt-4 mb-6 overflow-x-auto">
          {tabs.map((t) => {
            const active = filter === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setFilter(t.id)}
                className={`relative pb-3 text-sm font-bold whitespace-nowrap transition-colors ${
                  active ? "text-emerald-700" : "text-slate-500 hover:text-emerald-700"
                }`}
              >
                {t.label}
                <span
                  className={`ml-2 text-[11px] px-1.5 py-0.5 rounded-full ${
                    active ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {t.count}
                </span>
                {active && (
                  <span className="absolute left-0 right-0 -bottom-px h-0.5 rounded-full bg-emerald-600" />
                )}
              </button>
            );
          })}
        </div>

        {myItems.length === 0 ? (
          <div className="flex flex-col items-center text-center py-16 px-6 bg-white border border-dashed border-emerald-200 rounded-2xl">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <PackagePlus size={26} />
            </div>
            <p className="font-bold text-emerald-950">You haven't posted any items yet</p>
            <p className="text-sm text-slate-500 mt-1">
              Lost or found something? Post it and help it find its way home.
            </p>
            <Link
              to="/add-item"
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
            >
              <PackagePlus size={16} /> Post an item
            </Link>
          </div>
        ) : visibleItems.length === 0 ? (
          <div className="text-center py-12 bg-white border border-dashed border-emerald-200 rounded-2xl">
            <p className="text-sm text-slate-500">No {filter.toLowerCase()} posts to show.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {visibleItems.map((item) => (
              <ItemCard key={item.id} ad={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}