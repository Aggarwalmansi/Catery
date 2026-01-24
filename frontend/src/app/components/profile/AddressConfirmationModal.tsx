"use client";

import { useState } from 'react';
import { X, MapPin, Calendar, Users, IndianRupee, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface AddressConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    enquiry: {
        id: string;
        quotePrice: number;
        guestCount?: number;
        itemCount: number;
        caterer: {
            name: string;
        };
    };
    onConfirm: (address: string, eventDate: string) => Promise<void>;
}

export default function AddressConfirmationModal({
    isOpen,
    onClose,
    enquiry,
    onConfirm
}: AddressConfirmationModalProps) {
    const [address, setAddress] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const guestCount = enquiry.guestCount || 50;
    const totalAmount = enquiry.quotePrice * guestCount;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!address.trim()) {
            toast.error('Please enter delivery address');
            return;
        }

        if (!eventDate) {
            toast.error('Please select event date');
            return;
        }

        const selectedDate = new Date(eventDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            toast.error('Event date must be in the future');
            return;
        }

        setIsSubmitting(true);
        try {
            await onConfirm(address, eventDate);
            // Modal will be closed by parent component on success
        } catch (error) {
            setIsSubmitting(false);
        }
    };

    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 1);
    const minDateString = minDate.toISOString().split('T')[0];

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">Confirm Order Details</h3>
                        <p className="text-sm text-gray-500 mt-1">Review and provide delivery information</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                        disabled={isSubmitting}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Order Summary */}
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-100">
                        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-orange-600" />
                            Order Summary
                        </h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Caterer</span>
                                <span className="font-semibold text-gray-900">{enquiry.caterer.name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Menu Items</span>
                                <span className="font-semibold text-gray-900">{enquiry.itemCount} items</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Guest Count</span>
                                <span className="font-semibold text-gray-900">{guestCount} guests</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Price per Plate</span>
                                <span className="font-semibold text-gray-900">₹{enquiry.quotePrice}</span>
                            </div>
                            <div className="border-t border-orange-200 pt-3 flex justify-between items-center">
                                <span className="font-bold text-gray-900">Total Amount</span>
                                <span className="text-2xl font-bold text-orange-600">₹{totalAmount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Event Date */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <Calendar className="w-4 h-4 inline mr-2" />
                            Event Date *
                        </label>
                        <input
                            type="date"
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                            min={minDateString}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                        />
                        <p className="text-xs text-gray-500 mt-1">Select the date of your event</p>
                    </div>

                    {/* Delivery Address */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <MapPin className="w-4 h-4 inline mr-2" />
                            Delivery Address *
                        </label>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Enter complete delivery address including landmarks..."
                            rows={4}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition resize-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Provide detailed address for accurate delivery
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Creating Order...
                                </>
                            ) : (
                                <>
                                    <IndianRupee className="w-5 h-5" />
                                    Confirm & Create Order
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
