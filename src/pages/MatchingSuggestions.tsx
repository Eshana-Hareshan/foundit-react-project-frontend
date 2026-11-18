import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Sparkles,
    CheckCircle2,
    AlertCircle,
    MapPin,
    Calendar,
    Tag,
    ArrowUpRight,
    Loader2,
    Search
} from "lucide-react";
import { getItemMatches, type ItemMatch } from "../service/item";

interface MatchingSuggestionsProps {
    itemId: string;
    itemStatus?: "LOST" | "FOUND";
    itemName: string;
}

export default function MatchingSuggestions({
    itemId,
    itemStatus = "LOST",
    itemName
}: MatchingSuggestionsProps) {
    const [matches, setMatches] = useState<ItemMatch[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        const loadMatches = async () => {
            try {
                setLoading(true);
                setError("");
                const data = await getItemMatches(itemId);
                if (isMounted) {
                    setMatches(data);
                }
            } catch (err) {
                console.error("Error loading matches:", err);
                if (isMounted) {
                    setError("Unable to load matching suggestions.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        if (itemId) {
            loadMatches();
        }

        return () => {
            isMounted = false;
        };
    }, [itemId]);

    const targetType = itemStatus === "LOST" ? "found" : "lost";

    return (
        <section className="mt-8 pt-8 border-t border-emerald-100 space-y-5">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-500 text-amber-950 flex items-center justify-center shadow-sm">
                        <Sparkles size={18} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                                AI-Powered Matching Suggestions
                            </h2>
                            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                                Gemini AI
                            </span>
                        </div>
                        <p className="text-xs text-slate-500">
                            Potential {targetType} items that may match "{itemName}"
                        </p>
                    </div>
                </div>

                {!loading && matches.length > 0 && (
                    <span className="self-start sm:self-center text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                        {matches.length} {matches.length === 1 ? "suggestion" : "suggestions"}
                    </span>
                )}
            </div>

            {/* Disclaimer */}
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 leading-relaxed">
                <AlertCircle size={16} className="text-amber-700 shrink-0 mt-0.5" />
                <p>
                    <strong className="font-semibold">Notice:</strong> Suggestions are identified automatically using Google Gemini semantic evaluation. They represent potential similarities and do not verify or confirm ownership.
                </p>
            </div>

            {/* Content States */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 rounded-2xl bg-white border border-emerald-100">
                    <Loader2 size={28} className="animate-spin text-emerald-600 mb-3" />
                    <p className="text-sm font-semibold text-slate-700">Evaluating semantic matches with Gemini...</p>
                    <p className="text-xs text-slate-400 mt-1">Comparing categories, descriptions, brands, and locations</p>
                </div>
            ) : error ? (
                <div className="p-6 text-center rounded-2xl bg-white border border-rose-100 text-sm text-rose-600">
                    {error}
                </div>
            ) : matches.length === 0 ? (
                <div className="text-center py-10 px-4 rounded-2xl bg-white border border-dashed border-emerald-200">
                    <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                        <Search size={20} />
                    </div>
                    <p className="text-sm font-bold text-slate-800">No matching items found yet</p>
                    <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                        When a {targetType} item matching your report is added to Foundit, Gemini AI will evaluate it and notify you automatically.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
                    {matches.map((match) => {
                        const item = match.matchedItem;
                        const isHighMatch = match.matchScore >= 80;

                        return (
                            <div
                                key={match._id}
                                className="bg-white border border-emerald-100 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-200 flex flex-col justify-between gap-4"
                            >
                                <div className="space-y-3.5">
                                    {/* Top Row: Match Badge & Score */}
                                    <div className="flex items-center justify-between gap-2">
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black tracking-wider ${
                                                isHighMatch
                                                    ? "bg-emerald-600 text-white shadow-sm shadow-emerald-200"
                                                    : "bg-amber-500 text-white shadow-sm shadow-amber-200"
                                            }`}
                                        >
                                            <Sparkles size={12} />
                                            {isHighMatch ? "HIGH POSSIBLE MATCH" : "POSSIBLE MATCH"}
                                        </span>

                                        <span className="text-sm font-extrabold text-slate-800">
                                            {match.matchScore}% Match
                                        </span>
                                    </div>

                                    {/* Item Preview (Image + Info) */}
                                    <div className="flex gap-3.5">
                                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                                            <img
                                                src={item.imageUrl}
                                                alt={item.itemName}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="min-w-0 flex-1 space-y-1">
                                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full w-fit">
                                                <Tag size={11} />
                                                <span className="truncate">{item.category}</span>
                                            </div>

                                            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base truncate">
                                                {item.itemName}
                                            </h3>

                                            <div className="flex flex-col gap-0.5 text-xs text-slate-500">
                                                <span className="flex items-center gap-1 truncate">
                                                    <MapPin size={12} className="shrink-0 text-slate-400" />
                                                    <span className="truncate">{item.location}</span>
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={12} className="shrink-0 text-slate-400" />
                                                    <span>{new Date(item.dateFound).toLocaleDateString()}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Gemini Explanation */}
                                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                        <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                            "{match.explanation}"
                                        </p>
                                    </div>

                                    {/* Matching Characteristics */}
                                    {match.matchingDetails && match.matchingDetails.length > 0 && (
                                        <div className="space-y-1">
                                            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                                                Matching Characteristics
                                            </p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {match.matchingDetails.map((detail, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg"
                                                    >
                                                        <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                                                        {detail}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Conflicting Characteristics (if any) */}
                                    {match.conflictingDetails && match.conflictingDetails.length > 0 && (
                                        <div className="space-y-1">
                                            <p className="text-[11px] font-bold uppercase tracking-wider text-rose-800">
                                                Conflicting Characteristics
                                            </p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {match.conflictingDetails.map((detail, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-lg"
                                                    >
                                                        <AlertCircle size={12} className="text-rose-500 shrink-0" />
                                                        {detail}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* View Item CTA */}
                                <div className="pt-3 border-t border-slate-100">
                                    <Link
                                        to={`/items/${item._id}`}
                                        className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-200 transition-colors"
                                    >
                                        <span>View Item</span>
                                        <ArrowUpRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
