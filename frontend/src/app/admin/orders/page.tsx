'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { API_URL } from '@/lib/api';
import { ShoppingBag, ChevronRight, Calendar, User, Store, Tag } from 'lucide-react';

export default function AdminOrdersPage() {
    const { token } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllOrders = async () => {
            try {
                const res = await fetch(`${API_URL}/bookings/all`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchAllOrders();
    }, [token]);

    const getStatusStyle = (status: string) => {
        const s = status.toUpperCase();
        if (s.includes('PENDING')) return 'bg-orange-50 text-orange-700 border-orange-100';
        if (s.includes('APPROVED') || s.includes('CONFIRMED')) return 'bg-blue-50 text-blue-700 border-blue-100';
        if (s.includes('COMPLETED')) return 'bg-green-50 text-green-700 border-green-100';
        return 'bg-gray-50 text-gray-700 border-gray-100';
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 font-medium">Fetching platform bookings...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Order Oversight</h1>
                <p className="text-gray-500 mt-1">Monitor all transactions and booking activity across the platform.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Order ID & Status */}
                                <div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Order ID</div>
                                    <div className="text-sm font-mono font-medium text-gray-600 truncate mb-2">{order.id}</div>
                                    <span className={`px-2 py-1 text-[10px] font-bold rounded-md border ${getStatusStyle(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>

                                {/* Customer */}
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Customer</div>
                                        <div className="text-sm font-bold text-gray-900">{order.user?.name || 'Unknown'}</div>
                                        <div className="text-xs text-gray-500">{order.user?.email}</div>
                                    </div>
                                </div>

                                {/* Vendor */}
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                        <Store className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Caterer</div>
                                        <div className="text-sm font-bold text-gray-900">{order.vendor?.name}</div>
                                        <div className="text-xs text-blue-600 font-medium">{order.occasion}</div>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-green-50 rounded-lg text-green-600">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Event Date</div>
                                        <div className="text-sm font-bold text-gray-900">{new Date(order.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</div>
                                        <div className="text-xs text-gray-500 font-medium uppercase tracking-tighter">{order.guestCount} Plates</div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:text-right border-t lg:border-t-0 pt-4 lg:pt-0 border-gray-50 flex lg:flex-col justify-between items-center gap-2">
                                <div className="text-2xl font-black text-gray-900">
                                    ₹{order.totalAmount.toLocaleString()}
                                </div>
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    Placed {new Date(order.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {orders.length === 0 && (
                    <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-20 flex flex-col items-center justify-center grayscale opacity-60">
                        <ShoppingBag className="w-16 h-16 text-gray-100 mb-4" />
                        <p className="text-gray-400 font-bold text-xl uppercase tracking-widest transition-all group-hover:tracking-[0.2em]">No platform orders yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}
