"use client"

import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle } from 'lucide-react';

interface ChatMessage {
    text: string;
    author: string;
    timestamp: string;
}

interface FamilyChatProps {
    messages: ChatMessage[];
    currentUserName: string;
    typingUsers: string[];
    onSendMessage: (text: string) => void;
    onTyping: (isTyping: boolean) => void;
    disabled?: boolean;
}

export default function FamilyChat({
    messages = [],
    currentUserName,
    typingUsers = [],
    onSendMessage,
    onTyping,
    disabled = false
}: FamilyChatProps) {
    const [messageText, setMessageText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (messageText.trim() && !disabled) {
            onSendMessage(messageText.trim());
            setMessageText('');
            onTyping(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessageText(e.target.value);

        // Notify typing
        if (e.target.value.length > 0) {
            onTyping(true);
        } else {
            onTyping(false);
        }
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white">
            {/* Header */}
            <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3">
                <MessageCircle className="h-5 w-5 text-[#B8941F]" strokeWidth={2} />
                <h3 className="font-semibold text-gray-800">Family Discussion</h3>
                <span className="ml-auto text-xs text-gray-500">Private to family</span>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4" style={{ maxHeight: '400px' }}>
                {messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center">
                        <p className="text-sm text-gray-400">Start the conversation...</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => {
                        const isCurrentUser = msg.author === currentUserName;

                        return (
                            <div
                                key={idx}
                                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[75%] rounded-2xl px-4 py-2 ${isCurrentUser
                                            ? 'bg-[#D4AF37] text-white'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}
                                >
                                    {!isCurrentUser && (
                                        <p className="mb-1 text-xs font-semibold opacity-75">
                                            {msg.author}
                                        </p>
                                    )}
                                    <p className="text-sm leading-relaxed">{msg.text}</p>
                                    <p
                                        className={`mt-1 text-xs ${isCurrentUser ? 'text-white/70' : 'text-gray-500'
                                            }`}
                                    >
                                        {formatTime(msg.timestamp)}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Typing indicator */}
            {typingUsers.length > 0 && (
                <div className="border-t border-gray-100 px-4 py-2">
                    <p className="text-xs text-gray-500">
                        {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                    </p>
                </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
                <div className="flex gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={messageText}
                        onChange={handleInputChange}
                        onBlur={() => onTyping(false)}
                        placeholder="Share your thoughts..."
                        disabled={disabled}
                        className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 disabled:cursor-not-allowed disabled:bg-gray-50"
                        maxLength={500}
                    />
                    <button
                        type="submit"
                        disabled={!messageText.trim() || disabled}
                        className="flex items-center gap-2 rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#B8941F] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Send className="h-4 w-4" strokeWidth={2} />
                    </button>
                </div>
            </form>
        </div>
    );
}
