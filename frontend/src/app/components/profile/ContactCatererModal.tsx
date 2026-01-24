"use client";

import { X, Phone, MessageCircle, Mail } from 'lucide-react';

interface ContactCatererModalProps {
    isOpen: boolean;
    onClose: () => void;
    caterer: {
        name: string;
        email?: string;
        phone?: string;
    };
    enquiry: {
        id: string;
        itemCount: number;
    };
}

export default function ContactCatererModal({
    isOpen,
    onClose,
    caterer,
    enquiry
}: ContactCatererModalProps) {
    if (!isOpen) return null;

    // Format phone number for display (add +91 if not present)
    const formatPhoneDisplay = (phone: string) => {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.startsWith('91') && cleaned.length === 12) {
            return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
        } else if (cleaned.length === 10) {
            return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
        }
        return phone;
    };

    // Format phone for WhatsApp (numbers only, with 91 prefix)
    const formatPhoneForWhatsApp = (phone: string) => {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.startsWith('91')) {
            return cleaned;
        }
        return `91${cleaned}`;
    };

    const whatsappMessage = encodeURIComponent(
        `Hi ${caterer.name}! I'd like to discuss my custom menu enquiry (${enquiry.itemCount} items). When would be a good time to connect?`
    );

    const emailSubject = encodeURIComponent('Custom Menu Enquiry Discussion');
    const emailBody = encodeURIComponent(
        `Dear ${caterer.name},\n\nI hope this message finds you well. I'd like to discuss my custom menu enquiry with ${enquiry.itemCount} items in more detail.\n\nLooking forward to hearing from you.\n\nBest regards`
    );

    const hasContactInfo = caterer.phone || caterer.email;

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 px-6 py-5 border-b border-orange-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                                Get in Touch
                            </h3>
                            <p className="text-sm text-gray-600">
                                Connect with <span className="font-semibold text-orange-700">{caterer.name}</span>
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-white/50 rounded-lg"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Contact Options */}
                <div className="p-6 space-y-3">
                    {!hasContactInfo ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 mb-2">Contact information not available</p>
                            <p className="text-sm text-gray-400">Please check back later or contact support</p>
                        </div>
                    ) : (
                        <>
                            {caterer.phone && (
                                <>
                                    {/* WhatsApp - Primary */}
                                    <a
                                        href={`https://wa.me/${formatPhoneForWhatsApp(caterer.phone)}?text=${whatsappMessage}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-2xl border-2 border-green-200 hover:border-green-300 transition-all group shadow-sm hover:shadow-md"
                                    >
                                        <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                                            <MessageCircle className="w-7 h-7 text-white" strokeWidth={2.5} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-900 mb-0.5">WhatsApp Chat</p>
                                            <p className="text-sm text-gray-600">{formatPhoneDisplay(caterer.phone)}</p>
                                            <p className="text-xs text-green-700 mt-1">Recommended • Quick response</p>
                                        </div>
                                    </a>

                                    {/* Call */}
                                    <a
                                        href={`tel:${caterer.phone}`}
                                        className="flex items-center gap-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-2xl border border-blue-200 hover:border-blue-300 transition-all group"
                                    >
                                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                                            <Phone className="w-7 h-7 text-white" strokeWidth={2.5} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-900 mb-0.5">Call Directly</p>
                                            <p className="text-sm text-gray-600">{formatPhoneDisplay(caterer.phone)}</p>
                                        </div>
                                    </a>
                                </>
                            )}

                            {/* Email */}
                            {caterer.email && (
                                <a
                                    href={`mailto:${caterer.email}?subject=${emailSubject}&body=${emailBody}`}
                                    className="flex items-center gap-4 p-4 bg-gradient-to-br from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 rounded-2xl border border-orange-200 hover:border-orange-300 transition-all group"
                                >
                                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                                        <Mail className="w-7 h-7 text-white" strokeWidth={2.5} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900 mb-0.5">Send Email</p>
                                        <p className="text-sm text-gray-600 truncate">{caterer.email}</p>
                                    </div>
                                </a>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 space-y-3">
                    {hasContactInfo && (
                        <p className="text-xs text-center text-gray-500 bg-gray-50 py-2 px-3 rounded-lg flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                            Your contact details are kept private and secure
                        </p>
                    )}

                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
