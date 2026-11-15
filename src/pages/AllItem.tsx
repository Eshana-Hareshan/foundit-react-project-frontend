import { useState, useEffect } from 'react';
import { 
  Layers, 
  Wallet, 
  Key, 
  Laptop, 
  Dog, 
  Smartphone, 
  Sparkles, 
  MapPin, 
  Tag, 
  Shirt,
  ArrowRight,
  FileText,
  Gem,
  Briefcase,
  Inbox
} from 'lucide-react';
import SearchBar from '../components/common/SearchBar';
import ItemCard, { type AdItem } from '../components/common/ItemCard';
import { getAllItems, getPaidAds } from '../service/item';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface AllItemProps {
  paidAds?: AdItem[];
}

const CATEGORY_LIST = [
  { id: 'All', label: 'All Categories', icon: Layers },
  { id: 'Electronics', label: 'Electronics', icon: Laptop },
  { id: 'Mobile Phones', label: 'Mobile Phones', icon: Smartphone },
  { id: 'Wallets', label: 'Wallets', icon: Wallet },
  { id: 'Documents', label: 'Documents', icon: FileText },
  { id: 'Bags', label: 'Bags', icon: Briefcase },
  { id: 'Jewellery', label: 'Jewellery', icon: Gem },
  { id: 'Keys', label: 'Keys', icon: Key },
  { id: 'Clothing', label: 'Clothing', icon: Shirt },
  { id: 'Pets', label: 'Pets', icon: Dog },
  { id: 'Other', label: 'Other', icon: Layers },
];

export default function AllItem({ paidAds: initialPaidAds }: AllItemProps = {}) {
  const { user, loading: authLoading } = useAuth();

  const currentUserId = user?.id || user?._id;

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'LOST' | 'FOUND'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<AdItem[]>([]);
  const [paidAds, setPaidAds] = useState<AdItem[]>(initialPaidAds || []);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingAds, setLoadingAds] = useState<boolean>(!initialPaidAds);

  // Fetch all items when category changes
  useEffect(() => {
    if (authLoading) return;

    let isMounted = true;

    getAllItems(1, 50, selectedCategory)
      .then((res) => {
        if (isMounted) {


          console.log("Current User ID:", currentUserId);

          console.log(
            "Post Owner ID:",
            res.data.map((item) => ({
              itemName: item.itemName,
              userId: item.userId,
            }))
          );

          console.log("Fetched Items:", res.data);



          setItems(res.data);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCategory, currentUserId, authLoading]);

  // Fetch paid ads for the right sidebar if not passed
  useEffect(() => {
    if (initialPaidAds) {
      return;
    }

    let isMounted = true;
    getPaidAds(1, 4)
      .then((res) => {
        if (isMounted) {
          setPaidAds(res.data);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        if (isMounted) {
          setLoadingAds(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [initialPaidAds]);

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    setLoading(true);
  };

  const filteredItems = items.filter((item) => {
    const isNotMyPost = !currentUserId || item.userId !== currentUserId;

    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;

    const matchesStatus =
      statusFilter === 'ALL' ||
      item.status?.toUpperCase() === statusFilter;

    const matchesSearch =
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());

    return isNotMyPost && matchesCategory && matchesStatus && matchesSearch;
  });

  
  console.log("Filtered Items:", filteredItems);


  return (
    <div className="space-y-6">

      {/* 3-Column Layout: Left (Categories) | Middle (Items) | Right (Adds) */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* ================= LEFT SIDE: CATEGORIES ================= */}
        <aside className="w-full lg:w-60 xl:w-64 shrink-0 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs sticky top-20 space-y-5">
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-extrabold text-xs uppercase tracking-wider">
                <Layers size={16} className="text-indigo-600" />
                <span>Categories</span>
              </div>
              <div className="flex flex-col gap-1.5 mt-3">
                {CATEGORY_LIST.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <Icon size={16} className={isSelected ? 'text-white' : 'text-slate-500'} />
                      <span className="truncate">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Status Filter */}
            <div className="pt-3 border-t border-slate-100">
              <span className="block text-slate-400 font-bold text-[10px] uppercase tracking-wider mb-2.5">
                Filter by Status
              </span>
              <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl">
                {(['ALL', 'LOST', 'FOUND'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                      statusFilter === status
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {status === 'ALL' ? 'All' : status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ================= MIDDLE: ITEMS LIST ================= */}
        <main className="flex-1 min-w-0 w-full space-y-4">
          {/* Search Bar at Top of Middle Section */}
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="Search lost or found items by name, details, location..."
          />

          {/* Active Filter Indicators & Item Count */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1 pt-1">
            <span className="font-semibold">
              Showing{' '}
              <span className="text-slate-900 font-bold">{filteredItems.length}</span>{' '}
              {filteredItems.length === 1 ? 'item' : 'items'}
              {selectedCategory !== 'All' && (
                <> in <span className="text-indigo-600 font-bold">{selectedCategory}</span></>
              )}
            </span>
            {(selectedCategory !== 'All' || statusFilter !== 'ALL' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setStatusFilter('ALL');
                  setSearchQuery('');
                }}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-bold"
              >
                Reset filters
              </button>
            )}
          </div>

          {/* Items Feed State */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-slate-200 rounded-2xl h-80 w-full"></div>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white border border-slate-200 rounded-2xl space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Inbox size={24} />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No items found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No lost or found items match your current category or search criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredItems.map((item) => (
                <ItemCard key={item.id} ad={item} />
              ))}
            </div>
          )}
        </main>

        {/* ================= RIGHT SIDE: ADDS / PROMOTED ================= */}
        <aside className="w-full lg:w-72 xl:w-80 shrink-0 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs sticky top-20 space-y-4">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500 fill-amber-500" />
                <span className="font-extrabold text-xs uppercase tracking-wider text-slate-900">
                  Featured Ads
                </span>
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 tracking-wider">
                Promoted
              </span>
            </div>

            {/* Paid Ads List */}
            {loadingAds ? (
              <div className="space-y-3 animate-pulse">
                {[1, 2].map((n) => (
                  <div key={n} className="bg-slate-200 rounded-xl h-24 w-full"></div>
                ))}
              </div>
            ) : paidAds.length === 0 ? (
              <div className="text-center py-6 px-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                <p className="text-xs font-semibold text-slate-700">No promoted ads currently</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Be the first to promote your lost item here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {paidAds.map((ad) => (
                  <div 
                    key={ad.id}
                    className="border border-slate-200 hover:border-indigo-300 rounded-xl p-3 bg-slate-50/50 hover:bg-white transition-all space-y-2 group"
                  >
                    <div className="flex gap-3">
                      <img 
                        src={ad.imageUrl} 
                        alt={ad.itemName} 
                        className="w-16 h-16 rounded-lg object-cover shrink-0 group-hover:scale-105 transition-transform"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                            ad.status === 'LOST' ? 'bg-rose-500 text-white' : 'bg-emerald-600 text-white'
                          }`}>
                            {ad.status}
                          </span>
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1 rounded">
                            {ad.reward || 'Ad'}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600">
                          {ad.itemName}
                        </h4>
                        <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-1 truncate">
                          <MapPin size={10} className="text-indigo-500 shrink-0" />
                          <span className="truncate">{ad.location}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Promotional Banner Box */}
            <div className="rounded-xl p-4 bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 text-white space-y-2.5 shadow-sm">
              <div className="flex items-center gap-1.5 text-indigo-200 text-xs font-bold uppercase tracking-wider">
                <Tag size={13} />
                <span>Priority Boost</span>
              </div>
              <h4 className="font-extrabold text-sm leading-snug">
                Promote Your Lost Item
              </h4>
              <p className="text-[11px] text-indigo-100 leading-relaxed">
                Reach thousands faster with a featured paid listing on our homepage &amp; sidebar.
              </p>
              <Link 
                to="/login"
                className="inline-flex items-center justify-center gap-1.5 w-full mt-1 py-2 px-3 bg-white hover:bg-slate-100 text-indigo-600 font-bold text-xs rounded-lg transition-all shadow-xs"
              >
                <span>Boost an Item</span>
                <ArrowRight size={13} />
              </Link>
            </div>

          </div>
        </aside>

      </div>
    </div>
  );
}
