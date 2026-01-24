"use client"

import { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';

interface Comment {
    text: string;
    author: string;
    timestamp: string;
}

interface CommentSystemProps {
    itemIndex: number;
    itemName: string;
    comments: Comment[];
    currentUserName: string;
    onAddComment: (itemIndex: number, text: string) => void;
    disabled?: boolean;
}

export default function CommentSystem({
    itemIndex,
    itemName,
    comments = [],
    currentUserName,
    onAddComment,
    disabled = false
}: CommentSystemProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [commentText, setCommentText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (commentText.trim() && !disabled) {
            onAddComment(itemIndex, commentText.trim());
            setCommentText('');
        }
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="border-t border-gray-100 pt-3">
            {/* Toggle button */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#B8941F] transition-colors"
            >
                <MessageSquare className="h-4 w-4" strokeWidth={2} />
                <span>
                    {comments.length > 0
                        ? `${comments.length} ${comments.length === 1 ? 'Comment' : 'Comments'}`
                        : 'Add Comment'
                    }
                </span>
            </button>

            {/* Expanded view */}
            {isExpanded && (
                <div className="mt-3 space-y-3">
                    {/* Existing comments */}
                    {comments.length > 0 && (
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {comments.map((comment, idx) => (
                                <div key={idx} className="rounded-lg bg-white border border-gray-100 p-3 shadow-sm">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-bold text-[#B8941F]">
                                            {comment.author}
                                        </span>
                                        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                                            {formatTime(comment.timestamp)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-700 leading-relaxed font-medium">{comment.text}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add comment form */}
                    {!disabled && (
                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder={`Add note for ${itemName}...`}
                                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20"
                                maxLength={200}
                            />
                            <button
                                type="submit"
                                disabled={!commentText.trim()}
                                className="flex items-center gap-1 rounded-lg bg-[#D4AF37] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#B8941F] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Send className="h-4 w-4" strokeWidth={2} />
                            </button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}
