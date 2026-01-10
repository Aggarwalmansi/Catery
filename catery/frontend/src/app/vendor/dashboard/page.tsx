'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { VendorAPI } from '@/app/utils/apiClient';
import { toast } from 'react-hot-toast';
import { Power, PowerOff, AlertCircle, MapPin } from 'lucide-react';

export default function VendorDashboard() {
    const { token, user } = useAuth();
    const [vendor, setVendor] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [stats, setStats] = useState<any>({ totalOrders: 0, pendingOrders: 0, revenue: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (token) {
                console.log('Dashboard using token:', token.substring(0, 10));
                try {
                    const [profileRes, ordersRes, statsRes] = await Promise.all([
                        VendorAPI.getProfile(token),
                        VendorAPI.getOrders(token),
                        VendorAPI.getStats(token)
                    ]);
                    setVendor(profileRes);
                    setOrders(ordersRes);
                    setStats(statsRes);
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchData();
    }, [token]);

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        try {
            if (!token) return;
            await VendorAPI.updateOrderStatus(orderId, newStatus, token);
            // Update orders and refetch stats for accuracy
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            const freshStats = await VendorAPI.getStats(token);
            setStats(freshStats);
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const handleToggleStatus = async () => {
        try {
            if (!token || !vendor) return;
            const newStatus = vendor.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
            const updatedVendor = await VendorAPI.toggleStatus(newStatus, token);
            setVendor(updatedVendor);
            toast.success(`Shop is now ${newStatus}`);
        } catch (error: any) {
            toast.error(error.message || 'Failed to update status');
        }
    };

    if (loading) return <div>Loading dashboard...</div>;
    if (!vendor) return <div>Please complete onboarding first.</div>;

    return (
        <div className="space-y-8">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
                    <p className="text-3xl font-bold mt-2">{stats.totalOrders}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Pending Approvals</h3>
                    <p className="text-3xl font-bold mt-2 text-yellow-600">
                        {stats.pendingOrders}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Revenue</h3>
                    <p className="text-3xl font-bold mt-2 text-green-600">
                        ₹{stats.revenue.toLocaleString()}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content - Active Orders */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Paused Banner */}
                    {vendor.status === 'PAUSED' && (
                        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center gap-3 text-amber-800">
                            <AlertCircle className="w-5 h-5" />
                            <p className="font-medium">Your shop is currently PAUSED. You are not accepting new bookings.</p>
                        </div>
                    )}

                    <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>

                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-lg">{order.user?.name || 'Guest'}</span>
                                            <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                order.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                                                    order.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                                        order.status === 'REJECTED_BY_VENDOR' ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-800'
                                                }`}>
                                                {order.status.replace(/_/g, ' ')}
                                            </span>
                                        </div>
                                        <p className="text-gray-500 text-sm mt-1">{order.occasion} • {order.guestCount} Guests</p>
                                        <p className="text-gray-500 text-sm">{new Date(order.date).toLocaleDateString()}</p>
                                        {order.address && (
                                            <p className="text-gray-600 text-sm mt-2 flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                {order.address}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg">₹{order.totalAmount}</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                {order.status === 'PENDING' && (
                                    <div className="flex gap-3 justify-end pt-4 border-t border-gray-50">
                                        <button
                                            onClick={() => handleStatusUpdate(order.id, 'REJECTED')}
                                            className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            Reject
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(order.id, 'APPROVED')}
                                            className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                                        >
                                            Accept Order
                                        </button>
                                    </div>
                                )}
                                {order.status === 'CONFIRMED' && (
                                    <div className="flex gap-3 justify-end pt-4 border-t border-gray-50">
                                        <button
                                            onClick={() => handleStatusUpdate(order.id, 'COMPLETED')}
                                            className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            Mark Completed
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}

                        {orders.length === 0 && (
                            <div className="text-center py-12 bg-white rounded-xl border border-gray-100 border-dashed">
                                <p className="text-gray-500">No orders yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar - Menu & Quick Actions */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="font-bold text-gray-900 mb-4">Your Profile</h2>
                        <div className="flex items-center gap-4 mb-4">
                            {vendor.image && <img src={vendor.image} alt="Profile" className="w-16 h-16 rounded-full object-cover" />}
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold">{vendor.name}</p>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${vendor.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {vendor.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">{vendor.email}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <a href="/vendor/profile" className="py-2 border border-gray-200 rounded-lg text-sm text-center hover:bg-gray-50 transition-colors">
                                Edit Profile
                            </a>
                            <button
                                onClick={handleToggleStatus}
                                className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${vendor.status === 'ACTIVE'
                                    ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100'
                                    : 'bg-green-50 text-green-600 border border-green-100 hover:bg-green-100'
                                    }`}
                            >
                                {vendor.status === 'ACTIVE' ? (
                                    <>
                                        <PowerOff className="w-4 h-4" />
                                        Pause Shop
                                    </>
                                ) : (
                                    <>
                                        <Power className="w-4 h-4" />
                                        Resume Shop
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-bold text-gray-900">Menu Items</h2>
                            <a href="/vendor/menu" className="text-sm text-blue-600 hover:underline">Manage Menu</a>
                        </div>
                        <div className="space-y-3">
                            {vendor.menuItems?.slice(0, 5).map((item: any) => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span>{item.name}</span>
                                    <span className="font-medium">₹{item.price}</span>
                                </div>
                            ))}
                            {!vendor.menuItems?.length && <p className="text-sm text-gray-500">No menu items added.</p>}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-bold text-gray-900">Packages</h2>
                            <a href="/vendor/packages" className="text-sm text-blue-600 hover:underline">Manage Packages</a>
                        </div>
                        <p className="text-gray-500 text-sm">Create fixed-price packages (e.g. Gold, Silver) for customers.</p>
                        <a href="/vendor/packages/create" className="block mt-4 text-center py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                            + Create New Package
                        </a>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-bold text-gray-900">Orders</h2>
                            <a href="/vendor/orders" className="text-sm text-blue-600 hover:underline">View All</a>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-2xl font-bold text-orange-600">{orders.filter(o => o.status === 'PENDING').length}</p>
                                <p className="text-sm text-gray-500">Pending Orders</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                        </div>
                        <a href="/vendor/orders" className="block text-center py-2 bg-orange-50 border border-orange-200 rounded-lg text-sm font-medium text-orange-700 hover:bg-orange-100 transition-colors">
                            Manage Orders
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
