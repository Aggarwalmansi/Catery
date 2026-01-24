"use client"

import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { API_URL } from '@/lib/api';
import { useAuth } from '@/app/context/AuthContext';

interface EnquiryFormProps {
    roomId: string;
    packageName: string;
    totalPrice: number;
    itemCount: number;
    onSuccess?: () => void;
}

export default function EnquiryForm({
    roomId,
    packageName,
    totalPrice,
    itemCount,
    initialNotes = '', // New prop
    onSuccess
}: EnquiryFormProps & { initialNotes?: string }) {
    const { token } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [additionalNotes, setAdditionalNotes] = useState(initialNotes);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            toast.error('Please log in to submit an enquiry');
            return;
        }

        setIsSubmitting(true);

        try {


            const response = await fetch(`${API_URL}/kutumbh/${roomId}/enquiry`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    additionalNotes
                })
            });



            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('[EnquiryForm] Error response:', errorData);
                throw new Error(errorData.error || errorData.message || 'Failed to submit enquiry');
            }

            const data = await response.json();


            setIsSuccess(true);
            toast.success('Enquiry sent! The caterer will respond shortly.');

            if (onSuccess) {
                onSuccess();
            }
        } catch (error: any) {
            console.error('[EnquiryForm] ❌ Error submitting enquiry:', error);
            toast.error(error.message || 'Failed to send enquiry. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-8 text-center animate-fade-in">
                <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" strokeWidth={2} />
                <h3 className="text-xl font-bold text-green-800 mb-2">
                    Enquiry Sent Successfully!
                </h3>
                <p className="text-green-800 font-medium mb-1">
                    We've shared your custom menu with the caterer.
                </p>
                <p className="text-green-700 mb-4 text-sm">
                    They'll review your choices and send a personalized quote shortly.
                </p>
                <p className="text-sm text-green-600 bg-white/50 py-2 px-4 rounded-full inline-block">
                    Check your email or dashboard for their response.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border-2 border-[#D4AF37] bg-gradient-to-br from-[#FCFBF4] to-[#FAF9F0] p-6">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Send Custom Menu Enquiry
                </h3>
                <p className="text-sm text-gray-600">
                    Your family's menu choices will be sent to the caterer for pricing.
                </p>
            </div>

            {/* Summary */}
            <div className="mb-6 space-y-2 rounded-lg bg-white p-4">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Context:</span>
                    <span className="font-semibold text-gray-800">Custom Menu Request</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Selected Items:</span>
                    <span className="font-semibold text-gray-800">{itemCount} items</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2">
                    <span className="font-medium text-gray-700">Estimated Price:</span>
                    <span className="text-lg font-bold text-[#B8941F]">To be confirmed</span>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Additional Notes (Optional)
                    </label>
                    <textarea
                        value={additionalNotes}
                        onChange={(e) => setAdditionalNotes(e.target.value)}
                        placeholder="Any special requests or dietary requirements..."
                        rows={4}
                        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20"
                        maxLength={500}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        {additionalNotes.length}/500 characters
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#D4AF37] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#B8941F] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting ? (
                        <>
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            <span>Sending...</span>
                        </>
                    ) : (
                        <>
                            <Send className="h-5 w-5" strokeWidth={2} />
                            <span>Send Enquiry to Caterer</span>
                        </>
                    )}
                </button>
            </form>

            <p className="mt-4 text-center text-xs text-gray-500">
                All votes, comments, and family discussion will be included in the enquiry.
            </p>
        </div>
    );
}
