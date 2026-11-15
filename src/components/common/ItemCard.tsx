
import { Tag, MapPin, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface AdItem {
  id: string;
  itemName: string;
  description: string;
  category: string;
  location: string;
  dateFound: string;
  additionalDetails?: string;
  imageUrl: string;
  userId: string;

  // Optional fields for future paid advertisements
  status?: 'LOST' | 'FOUND';
  type?: string;
  reward?: string;
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
          src={ad.imageUrl}
          alt={ad.itemName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {ad.status && (
          <span className={`absolute top-3 left-3 px-2.5 py-1 text-[11px] font-black rounded-md shadow-xs ${
            ad.status === 'LOST'
              ? 'bg-rose-600 text-white'
              : 'bg-emerald-600 text-white'
          }`}>
            {ad.status}
          </span>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold text-indigo-600 flex items-center gap-1">
              <Tag size={12} /> {ad.category}
            </span>

            <span>
              {new Date(ad.dateFound).toLocaleDateString()}
            </span>
          </div>

          <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors line-clamp-1">
            {ad.itemName}
          </h3>

          <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
            {ad.description}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1 text-slate-600 font-medium">
            <MapPin size={14} className="text-indigo-500" />
            <span className="truncate max-w-[150px]">
              {ad.location}
            </span>
          </span>

          <Link
              to={`/items/${ad.id}`}
              className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
              Details <ExternalLink size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
