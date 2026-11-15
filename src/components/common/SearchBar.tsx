import { Search } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch?: () => void;
  placeholder?: string;
}

export default function SearchBar({ searchQuery, setSearchQuery,onSearch, placeholder }: SearchBarProps) {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
        onSearch?.();
      }
    };
  return (
    <div className="relative group max-w-2xl mx-auto">
      <input
        type="text"
        placeholder={placeholder || "Search lost or found items..."}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full pl-12 pr-12 py-3 bg-slate-100 hover:bg-slate-50 focus:bg-white text-slate-900 text-sm rounded-full border border-slate-300 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition-all shadow-inner"
      />
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
      {searchQuery && (
        <button 
          onClick={() => setSearchQuery('')} 
          className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 bg-slate-200 hover:bg-slate-300 rounded-full w-5 h-5 flex items-center justify-center"
        >
          ✕
        </button>
      )}
    </div>
  );
}
