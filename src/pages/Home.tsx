import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Compass, PackagePlus, Search, HandHeart, ArrowRight, SearchX } from "lucide-react"
import { getPaidAds } from "../service/item"
import { PageHeader } from "../components/common/PageHeader"
// import CategoryPills from "../components/common/CategoryPills"
import SearchBar from "../components/common/SearchBar"
import ItemCard, { type AdItem } from "../components/common/ItemCard"

const STEPS = [
  {
    icon: PackagePlus,
    title: "Post an item",
    text: "Lost something or found something? Add a listing with a photo and location in under a minute.",
  },
  {
    icon: Search,
    title: "Search & match",
    text: "Browse listings from your community and chat with people who might have what you're looking for.",
  },
  {
    icon: HandHeart,
    title: "Reunite safely",
    text: "Arrange a safe handover and mark the item as returned. Simple as that.",
  },
]

export const Home = () => {
  const navigate = useNavigate()

  const [items, setItems] = useState<AdItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedCategory] = useState<string>("All")
  // To re-enable category filtering, uncomment the pills below and use:
  // const [selectedCategory, setSelectedCategory] = useState<string>("All")

  const handleSearch = () => {
    navigate(`/all-items?search=${encodeURIComponent(searchQuery.trim())}`)
  }

  useEffect(() => {
    let isMounted = true
    getPaidAds(1, 6, selectedCategory)
      .then((res) => {
        if (isMounted) setItems(res.data)
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [selectedCategory])

  // const handleCategoryChange = (cat: string) => {
  //   setSelectedCategory(cat)
  //   setLoading(true)
  // }

  const q = searchQuery.toLowerCase()
  const filteredItems = items.filter(
    (item) =>
      item.itemName.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q)
  )

  return (
    <div className="space-y-6 sm:space-y-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 text-white px-5 py-6 sm:px-10 sm:py-8 text-center shadow-lg shadow-emerald-900/10">
        {/* Decorative */}
        <Compass
          aria-hidden
          className="absolute -right-8 -top-8 w-40 h-40 sm:w-56 sm:h-56 text-white/5 rotate-12"
          strokeWidth={1}
        />
        <div
          aria-hidden
          className="absolute -left-12 -bottom-12 w-40 h-40 rounded-full bg-emerald-400/20 blur-3xl"
        />

        <div className="relative">
          <h1 className="text-xl sm:text-3xl font-black tracking-tight mb-1">
            Find what you lost. <span className="text-emerald-300">Return what you found.</span>
          </h1>
          <p className="text-emerald-100/90 text-xs sm:text-sm max-w-xl mx-auto mb-4">
            Search lost &amp; found listings across your local community.
          </p>
          <div className="max-w-xl mx-auto">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearch={handleSearch}
            />
          </div>
        </div>
      </section>

      {/* Category Filter (disabled, same as before)
      <div className="space-y-3">
        <h2 className="text-lg sm:text-xl font-extrabold text-emerald-950">Browse Categories</h2>
        <CategoryPills
          selectedCategory={selectedCategory}
          setSelectedCategory={handleCategoryChange}
        />
      </div>
      */}

      {/* Featured ads */}
      <section className="space-y-6">
        <PageHeader
          title="Featured Paid Ads"
          description="Promoted lost & found items with priority listing"
          // actionLabel="View All Items"
          // actionLink="/all-items"
        />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-emerald-100/60 rounded-2xl h-80 w-full" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center text-center py-16 px-6 bg-white border border-dashed border-emerald-200 rounded-2xl">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <SearchX size={26} />
            </div>
            <p className="font-bold text-emerald-950">No featured paid ads found</p>
            <p className="text-slate-500 text-sm mt-1">
              Try a different search, or browse every listing.
            </p>
            <button
              onClick={() => navigate("/all-items")}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
            >
              Browse all items <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} ad={item} />
            ))}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-emerald-950">
            How foundit works
          </h2>
          <p className="text-slate-500 text-sm mt-1">Three simple steps to get things back where they belong.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <div
              key={title}
              className="relative bg-white rounded-2xl border border-emerald-100 p-6 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all"
            >
              <span className="absolute top-4 right-5 text-5xl font-black text-emerald-50 select-none">
                {i + 1}
              </span>
              <div className="relative w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <Icon size={22} />
              </div>
              <h3 className="relative font-bold text-emerald-950 mb-1">{title}</h3>
              <p className="relative text-sm text-slate-600 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-3xl bg-emerald-950 text-white px-6 py-10 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">Lost or found something?</h2>
          <p className="text-emerald-100/70 text-sm mt-1">Post it now and help it find its way home.</p>
        </div>
        <button
          onClick={() => navigate("/add-item")}
          className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-400 text-emerald-950 font-bold text-sm hover:bg-emerald-300 transition-colors"
        >
          <PackagePlus size={18} /> Post an item
        </button>
      </section>
    </div>
  )
}