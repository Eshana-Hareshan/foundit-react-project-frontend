import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { getPaidAds } from "../service/item"
import { PageHeader } from "../components/common/PageHeader"
import CategoryPills from "../components/common/CategoryPills"
import SearchBar from "../components/common/SearchBar"
import ItemCard, { type AdItem } from "../components/common/ItemCard"

export const Home = () => {
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/all-items?search=${encodeURIComponent(searchQuery.trim())}`);
  };
  const [items, setItems] = useState<AdItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  useEffect(() => {
    let isMounted = true
    getPaidAds(1, 6, selectedCategory)
      .then((res) => {
        if (isMounted) {
          setItems(res.data)
        }
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [selectedCategory])

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat)
    setLoading(true)
  }

  const filteredItems = items.filter((item) =>
    item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-800 text-white rounded-2xl sm:rounded-3xl p-6 sm:p-12 shadow-sm text-center">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2">
          Find What You Lost
        </h1>
        <p className="text-indigo-100 text-xs sm:text-base max-w-xl mx-auto mb-6">
          Search through lost & found listings across your local community.
        </p>
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearch={handleSearch}/>
      </div>

      {/* Category Filter */}
      {/* <div className="space-y-3">
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
          Browse Categories
        </h2>
        <CategoryPills
          selectedCategory={selectedCategory}
          setSelectedCategory={handleCategoryChange}
        />
      </div> */}

      {/* Page Header */}
      <PageHeader
        title="Featured Paid Ads"
        description="Promoted lost & found items with priority listing"
        actionLabel="View All Items"
        actionLink="/all-items"
      />

      {/* Content State - Paid Ads Only */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-slate-200 rounded-2xl h-80 w-full"></div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl">
          <p className="text-slate-500 text-sm">No featured paid ads found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} ad={item} />
          ))}
        </div>
      )}
    </div>
  )
}
