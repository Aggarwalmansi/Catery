"use client";
import { useState, useEffect } from 'react';
import { Loader2, MessageSquare, IndianRupee, Clock, CheckCircle, Store } from 'lucide-react';
import { API_URL } from '@/lib/api';
import { toast } from 'react-hot-toast';
import ContactCatererModal from './ContactCatererModal';
import AddressConfirmationModal from './AddressConfirmationModal';

export default function UserEnquiries() {
    const [enquiries, setEnquiries] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAccepting, setIsAccepting] = useState<string | null>(null);
    const [contactModal, setContactModal] = useState<{ isOpen: boolean; caterer: any; enquiry: any }>({
        isOpen: false,
        caterer: null,
        enquiry: null
    });
    const [addressModal, setAddressModal] = useState<{ isOpen: boolean; enquiry: any }>({
        isOpen: false,
        enquiry: null
    });

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/kutumbh/user/list`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setEnquiries(data.enquiries);
            }
        } catch (error) {
            console.error('Error fetching enquiries:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAcceptQuote = (enquiry: any) => {
        // Open address modal instead of directly accepting
        setAddressModal({ isOpen: true, enquiry });
    };

    const handleConfirmOrder = async (address: string, eventDate: string) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/kutumbh/accept/${addressModal.enquiry.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ address, eventDate })
            });

            const data = await res.json();

            if (data.success) {
                toast.success('Order created successfully!');
                // Update local state
                setEnquiries(prev => prev.map(e =>
                    e.id === addressModal.enquiry.id ? { ...e, status: 'ACCEPTED' } : e
                ));
                // Close modal
                setAddressModal({ isOpen: false, enquiry: null });
            } else {
                toast.error(data.message || 'Failed to create order');
            }
        } catch (error: any) {
            console.error('Error creating order:', error);
            toast.error(error.message || 'Failed to create order. Please try again.');
        }
    };

    const handleContactCaterer = (enquiry: any) => {
        setContactModal({
            isOpen: true,
            caterer: enquiry.caterer,
            enquiry: { id: enquiry.id, itemCount: enquiry.itemCount }
        });
    };

    if (isLoading) {
        return <div className="flex p-8 justify-center"><Loader2 className="animate-spin text-[#D4AF37]" /></div>;
    }

    if (enquiries.length === 0) {
        return (
            <div className="text-center p-8 bg-gray-50 rounded-xl">
                <p className="text-gray-500">No menu enquiries sent yet.</p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                <h2 className="text-2xl font-serif font-bold text-gray-800">My Custom Menu Enquiries</h2>
                <div className="grid gap-6">
                    {enquiries.map((enquiry) => (
                        <div key={enquiry.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    {enquiry.caterer?.image ? (
                                        <img src={enquiry.caterer.image} alt={enquiry.caterer.name} className="w-10 h-10 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-[#fcfbf4] border border-[#d4af37]/20 flex items-center justify-center">
                                            <Store className="w-5 h-5 text-[#d4af37]" />
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-bold text-gray-800">{enquiry.caterer?.name || 'Caterer'}</h3>
                                        <p className="text-xs text-gray-500">Sent on {new Date(enquiry.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${enquiry.status === 'RESPONDED' ? 'bg-green-50 text-green-700 border border-green-200' :
                                    enquiry.status === 'ACCEPTED' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                        enquiry.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                            'bg-gray-100 text-gray-600'
                                    }`}>
                                    {enquiry.status}
                                </span>
                            </div>

                            <div className="bg-[#fcfbf4] rounded-lg p-4 mb-4">
                                <h4 className="text-xs font-bold text-[#b8941f] uppercase tracking-wide mb-2">Custom Menu Details</h4>
                                <p className="text-sm font-medium text-gray-800">{enquiry.itemCount} Items Selected</p>
                                {enquiry.notes && (
                                    <p className="text-sm text-gray-600 mt-2 italic">"{enquiry.notes}"</p>
                                )}
                            </div>

                            {enquiry.status === 'RESPONDED' && (
                                <div className="border border-green-100 bg-green-50/50 rounded-xl p-5">
                                    <div className="flex items-start gap-4">
                                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                        <div>
                                            <h4 className="font-bold text-green-800 mb-1">Caterer's Quote</h4>
                                            <div className="text-2xl font-bold text-green-700 mb-2">₹{enquiry.quotePrice}<span className="text-sm font-normal text-green-600"> / plate</span></div>
                                            {enquiry.catererMessage && (
                                                <p className="text-sm text-green-800 bg-white/50 p-3 rounded-lg border border-green-100">
                                                    {enquiry.catererMessage}
                                                </p>
                                            )}
                                            <div className="mt-4 flex gap-3">
                                                <button
                                                    onClick={() => handleAcceptQuote(enquiry)}
                                                    disabled={isAccepting === enquiry.id}
                                                    className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                                                >
                                                    {isAccepting === enquiry.id ? 'Accepting...' : 'Accept Quote'}
                                                </button>
                                                <button
                                                    onClick={() => handleContactCaterer(enquiry)}
                                                    className="px-4 py-2 bg-white border border-green-200 text-green-700 text-sm font-semibold rounded-lg hover:bg-green-50 transition"
                                                >
                                                    Contact Caterer
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {enquiry.status === 'ACCEPTED' && (
                                <div className="border border-blue-100 bg-blue-50/50 rounded-xl p-5">
                                    <div className="flex items-start gap-4">
                                        <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                                        <div>
                                            <h4 className="font-bold text-blue-800 mb-1">Quote Accepted</h4>
                                            <p className="text-sm text-blue-700">Order created successfully! Check "My Orders" for details.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {enquiry.status === 'PENDING' && (
                                <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-4 py-2 rounded-lg w-fit">
                                    <Clock className="w-4 h-4" />
                                    <span>Awaiting quote from caterer...</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact Modal */}
            <ContactCatererModal
                isOpen={contactModal.isOpen}
                onClose={() => setContactModal({ isOpen: false, caterer: null, enquiry: null })}
                caterer={contactModal.caterer || { name: '', email: '', phone: '' }}
                enquiry={contactModal.enquiry || { id: '', itemCount: 0 }}
            />

            {/* Address Confirmation Modal */}
            {addressModal.enquiry && (
                <AddressConfirmationModal
                    isOpen={addressModal.isOpen}
                    onClose={() => setAddressModal({ isOpen: false, enquiry: null })}
                    enquiry={addressModal.enquiry}
                    onConfirm={handleConfirmOrder}
                />
            )}
        </>
    );
}
