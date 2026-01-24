import { Lock, Check } from 'lucide-react';
import VotingInterface from './VotingInterface';
import CommentSystem from './CommentSystem';

interface MenuItem {
    originalId: string;
    currentId: string;
    categoryId: string;
    name: string;
    basePrice: number;
    priceDelta: number;
    comments: any[];
    votes?: { up: string[]; down: string[] };
    isSelected: boolean;
}

interface Addon {
    id: string;
    name: string;
    price: number;
    qty: number;
}

interface SharedMenuStateProps {
    items: MenuItem[];
    addons: Addon[];
    totalPrice: number;
    basePrice: number;
    isLocked: boolean;
    currentUserName: string;
    onVote: (itemIndex: number, voteType: 'up' | 'down' | 'remove') => void;
    onAddComment: (itemIndex: number, text: string) => void;
    onToggleSelection: (itemIndex: number, isSelected: boolean) => void;
}

export default function SharedMenuState({
    items = [],
    addons = [],
    totalPrice,
    basePrice,
    isLocked,
    currentUserName,
    onVote,
    onAddComment,
    onToggleSelection,
}: SharedMenuStateProps) {
    // Group items by category
    const groupedItems = items.reduce((acc, item, index) => {
        const category = item.categoryId || 'Other';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push({ ...item, index });
        return acc;
    }, {} as Record<string, (MenuItem & { index: number })[]>);

    const selectedCount = items.filter(i => i.isSelected).length;

    return (
        <div className="space-y-6">
            {/* Lock indicator */}
            {isLocked && (
                <div className="flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
                    <Lock className="h-5 w-5 text-amber-600" strokeWidth={2} />
                    <p className="text-sm font-medium text-amber-800">
                        Room is locked by host. You can view but not make changes.
                    </p>
                </div>
            )}

            {/* Price summary */}
            <div className="rounded-xl border border-[#D4AF37]/20 bg-gradient-to-br from-[#FCFBF4] to-[#FAF9F0] p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Menu Planning</p>
                        <p className="text-xl font-serif font-bold text-gray-700">Custom Menu</p>
                        <p className="text-sm text-[#D4AF37] font-medium mt-1">
                            {selectedCount} Items Selected
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-serif font-bold text-[#D4AF37]">Request Quote</p>
                        <p className="text-xs text-gray-500">Price to be confirmed by caterer</p>
                    </div>
                </div>
            </div>

            {/* Menu items by category */}
            <div className="space-y-8">
                {Object.entries(groupedItems).map(([category, categoryItems]) => (
                    <div key={category} className="rounded-xl bg-white">
                        <h3 className="mb-4 text-xs font-bold text-[#B8941F] uppercase tracking-widest pl-1">
                            {category}
                        </h3>
                        <div className="space-y-3">
                            {categoryItems.map((item) => (
                                <div
                                    key={item.index}
                                    className={`
                                        group rounded-xl border p-4 transition-all hover:shadow-md 
                                        ${item.isSelected
                                            ? 'border-[#D4AF37] bg-[#FCFBF4] shadow-[#D4AF37]/5'
                                            : 'border-gray-100 bg-white hover:border-[#D4AF37]/30'
                                        }
                                    `}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        {/* Checkbox Section */}
                                        <div className="pt-1">
                                            <button
                                                disabled={isLocked}
                                                onClick={() => onToggleSelection(item.index, !item.isSelected)}
                                                className={`
                                                    flex h-5 w-5 items-center justify-center rounded border transition-colors
                                                    ${item.isSelected
                                                        ? 'bg-[#D4AF37] border-[#D4AF37] text-white'
                                                        : 'border-gray-300 bg-white text-transparent hover:border-[#D4AF37]'
                                                    }
                                                    ${isLocked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                                                `}
                                            >
                                                <Check className="h-3.5 w-3.5" strokeWidth={3} />
                                            </button>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className={`font-medium transition-colors ${item.isSelected ? 'text-[#333333]' : 'text-gray-600'}`}>
                                                    {item.name}
                                                </h4>
                                            </div>

                                            {/* Voting */}
                                            <VotingInterface
                                                itemIndex={item.index}
                                                votes={item.votes}
                                                currentUserName={currentUserName}
                                                onVote={onVote}
                                                disabled={isLocked}
                                            />
                                        </div>
                                    </div>

                                    {/* Comments */}
                                    <div className="pl-9">
                                        <CommentSystem
                                            itemIndex={item.index}
                                            itemName={item.name}
                                            comments={item.comments}
                                            currentUserName={currentUserName}
                                            onAddComment={onAddComment}
                                            disabled={isLocked}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add-ons */}
            {addons.length > 0 && (
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <h3 className="mb-4 text-lg font-bold text-gray-800 uppercase tracking-wide">
                        Add-Ons
                    </h3>
                    <div className="space-y-2">
                        {addons.map((addon, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between rounded-lg bg-green-50 border border-green-100 px-4 py-3"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="font-semibold text-gray-800">{addon.name}</span>
                                    <span className="text-sm text-gray-600">x{addon.qty}</span>
                                </div>
                                <span className="font-bold text-green-700">
                                    Price TBD
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
