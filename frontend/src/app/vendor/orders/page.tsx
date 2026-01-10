'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { VendorAPI } from '@/app/utils/apiClient';
import { ClipboardList, User, Phone, MapPin, Package, Users, Calendar, DollarSign } from 'lucide-react';

export default function VendorOrders() {
    const { token } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await VendorAPI.getOrders(token!);
                setOrders(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchOrders();
    }, [token]);

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        try {
            await VendorAPI.updateOrderStatus(orderId, newStatus, token!);
            // Optimistic update
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'APPROVED': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'CONFIRMED': return 'bg-green-100 text-green-800 border-green-200';
            case 'COMPLETED': return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'REJECTED_BY_VENDOR': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const filteredOrders = filter === 'ALL'
        ? orders
        : orders.filter(o => o.status === filter);

    if (loading) return <div className="flex items-center justify-center min-h-screen">Loading orders...</div>;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <ClipboardList className="w-8 h-8 text-orange-600" />
                    <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
                </div>
                <p className="text-gray-600">Manage incoming orders and update their status</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-wrap gap-2">
                    {['ALL', 'PENDING', 'APPROVED', 'CONFIRMED', 'COMPLETED'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${filter === status
                                ? 'bg-orange-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {status}
                            {status !== 'ALL' && (
                                <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                                    {orders.filter(o => o.status === status).length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 border-dashed p-12 text-center">
                        <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No {filter.toLowerCase()} orders</p>
                    </div>
                ) : (
                    filteredOrders.map((order) => (
                        <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                        <User className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">{order.user?.name || 'Guest'}</h3>
                                        <p className="text-sm text-gray-500">{order.user?.email}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                                    {order.status.replace(/_/g, ' ')}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500">Event Date</p>
                                        <p className="font-medium text-gray-900">{new Date(order.date).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500">Guest Count</p>
                                        <p className="font-medium text-gray-900">{order.guestCount} plates</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500">Total Amount</p>
                                        <p className="font-medium text-gray-900">₹{order.totalAmount?.toLocaleString()}</p>
                                    </div>
                                </div>

                                {order.package && (
                                    <div className="flex items-start gap-3">
                                        <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500">Package</p>
                                            <p className="font-medium text-gray-900">{order.package.name}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500">Occasion</p>
                                        <p className="font-medium text-gray-900">{order.occasion}</p>
                                    </div>
                                </div>
                            </div>

                            {order.notes && (
                                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                    <p className="text-xs text-gray-500 mb-1">Notes</p>
                                    <p className="text-sm text-gray-700">{order.notes}</p>
                                </div>
                            )}

                            {/* Actions */}
                            {order.status === 'PENDING' && (
                                <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => handleStatusUpdate(order.id, 'REJECTED_BY_VENDOR')}
                                        className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                                    >
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(order.id, 'APPROVED')}
                                        className="px-4 py-2 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                                    >
                                        Accept Order
                                    </button>
                                </div>
                            )}

                            {order.status === 'CONFIRMED' && (
                                <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => handleStatusUpdate(order.id, 'COMPLETED')}
                                        className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                                    >
                                        Mark Completed
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Summary Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <p className="text-yellow-800 text-sm font-medium">Pending</p>
                    <p className="text-3xl font-bold text-yellow-900 mt-1">
                        {orders.filter(o => o.status === 'PENDING').length}
                    </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-blue-800 text-sm font-medium">Approved</p>
                    <p className="text-3xl font-bold text-blue-900 mt-1">
                        {orders.filter(o => o.status === 'APPROVED').length}
                    </p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <p className="text-green-800 text-sm font-medium">Confirmed</p>
                    <p className="text-3xl font-bold text-green-900 mt-1">
                        {orders.filter(o => o.status === 'CONFIRMED').length}
                    </p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <p className="text-gray-800 text-sm font-medium">Completed</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                        {orders.filter(o => o.status === 'COMPLETED').length}
                    </p>
                </div>
            </div>
        </div>
    );
}
