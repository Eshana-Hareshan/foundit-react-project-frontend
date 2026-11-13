import { Wallet, Key, Laptop, Dog, Smartphone } from 'lucide-react';

const categories = [
  { id: 'Wallet', label: 'Wallet', icon: Wallet },
  { id: 'Keys', label: 'Keys', icon: Key },
  { id: 'Laptops', label: 'Laptops', icon: Laptop },
  { id: 'Animal', label: 'Animal', icon: Dog },
  { id: 'Mobile Phones', label: 'Mobile Phones', icon: Smartphone },
];

interface CategoryPillsProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export default function CategoryPills({ selectedCategory, setSelectedCategory }: CategoryPillsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
      {categories.map((cat) => {
        const IconComp = cat.icon;
        const isSelected = selectedCategory === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(isSelected ? 'All' : cat.id)}
            className={`flex items-center justify-center gap-2.5 p-3 rounded-xl border text-sm font-semibold transition-all duration-150 ${
              isSelected 
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <IconComp size={18} className={isSelected ? 'text-white' : 'text-slate-500'} />
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
