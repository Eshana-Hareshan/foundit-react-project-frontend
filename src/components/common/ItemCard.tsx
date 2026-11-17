import { Tag, MapPin, ArrowUpRight, Calendar, Star, Gift, CheckCircle2 } from 'lucide-react';
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
  isResolved?: boolean;
}

interface ItemCardProps {
  ad: AdItem;
}

export default function ItemCard({ ad }: ItemCardProps) {
  return (
    <div className="relative bg-white border border-amber-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-amber-200/50 hover:border-amber-300 hover:-translate-y-1 transition-all duration-300 flex flex-col group">

      {/* Image */}
      <div className="relative h-48 bg-amber-50 overflow-hidden">
        <img
          src={ad.imageUrl}
          alt={ad.itemName}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
            ad.isResolved ? 'grayscale-[50%]' : ''
          }`}
        />

        {/* Soft gradient so badges stay readable */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/30 to-transparent pointer-events-none"
        />

        {/* Status badge */}
        {ad.isResolved ? (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-black tracking-wide rounded-full shadow-md bg-white text-slate-800">
            <CheckCircle2 size={12} className="text-emerald-600" /> RESOLVED
          </span>
        ) : (
          ad.status && (
            <span
              className={`absolute top-3 left-3 px-2.5 py-1 text-[11px] font-black tracking-wide rounded-full shadow-md text-white ${
                ad.status === 'LOST' ? 'bg-rose-600' : 'bg-emerald-600'
              }`}
            >
              {ad.status}
            </span>
          )
        )}

        {/* Featured / reward badge */}
        {(ad.isPaid || ad.reward) && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-black rounded-full shadow-md bg-amber-400 text-amber-950">
            {ad.reward ? <Gift size={12} /> : <Star size={12} className="fill-amber-950" />}
            {ad.reward || 'Featured'}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold ring-1 ring-amber-200 truncate">
              <Tag size={11} /> <span className="truncate">{ad.category}</span>
            </span>

            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 shrink-0">
              <Calendar size={11} />
              {new Date(ad.dateFound).toLocaleDateString()}
            </span>
          </div>

          <h3 className="font-extrabold text-slate-900 text-base group-hover:text-amber-700 transition-colors line-clamp-1">
            {ad.itemName}
          </h3>

          <p className="text-sm text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
            {ad.description}
          </p>
        </div>

        <div className="pt-3 border-t border-amber-100 flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 min-w-0 text-xs font-medium text-slate-600">
            <span className="w-6 h-6 shrink-0 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
              <MapPin size={13} />
            </span>
            <span className="truncate">{ad.location}</span>
          </span>

          {/* The ::after stretches this link over the whole card, so the entire card is clickable */}
          <Link
            to={`/items/${ad.id}`}
            className="shrink-0 inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-amber-400 group-hover:bg-amber-500 text-amber-950 text-xs font-bold transition-colors after:absolute after:inset-0 after:content-['']"
          >
            Details <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}