import { Tag, MapPin, ExternalLink } from 'lucide-react';

export interface AdItem {
  id: string | number;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  status: 'LOST' | 'FOUND' | string;
  type: string;
  reward: string;
  image: string;
  isPaid?: boolean;
}

interface ItemCardProps {
  ad: AdItem;
}

export default function ItemCard({ ad }: ItemCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group">
      <div className="relative h-48 bg-slate-100 overflow-hidden">
        <img 
          src={ad.image} 
          alt={ad.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`px-2.5 py-1 text-[11px] font-black rounded-md shadow-xs ${
            ad.status === 'LOST' ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
          }`}>
            {ad.status}
          </span>
          <span className="px-2.5 py-1 text-[11px] font-bold bg-amber-400 text-slate-900 rounded-md shadow-xs">
            {ad.type}
          </span>
        </div>
        <span className="absolute bottom-3 right-3 px-2.5 py-1 text-xs font-bold bg-slate-900/80 backdrop-blur-md text-white rounded-md">
          {ad.reward}
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold text-indigo-600 flex items-center gap-1">
              <Tag size={12} /> {ad.category}
            </span>
            <span>{ad.date}</span>
          </div>
          <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors line-clamp-1">
            {ad.title}
          </h3>
          <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
            {ad.description}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1 text-slate-600 font-medium">
            <MapPin size={14} className="text-indigo-500" />
            <span className="truncate max-w-[150px]">{ad.location}</span>
          </span>
          <button className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
            Details <ExternalLink size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
