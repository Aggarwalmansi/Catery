'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { API_URL } from '@/lib/api';
import { Users, UserCheck, Clock, TrendingUp, Package } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
    const { token } = useAuth();
    const [stats, setStats] = useState({
        totalCaterers: 0,
        pendingApprovals: 0,
        liveCaterers: 0,
        totalUsers: 0,
        revenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${API_URL}/vendor/admin/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchStats();
    }, [token]);

    const statCards = [
        { label: 'Total Caterers', value: stats.totalCaterers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Pending Approvals', value: stats.pendingApprovals, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'Live Caterers', value: stats.liveCaterers, icon: UserCheck, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Total Customers', value: stats.totalUsers, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Platform Analytics</h1>
                <p className="text-gray-500 mt-1">Real-time overview of your catering ecosystem.</p>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl ${stat.bg}`}>
                                    <Icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
                                <p className="text-3xl font-bold text-gray-900 mt-1">
                                    {loading ? (
                                        <span className="h-8 w-12 bg-gray-100 animate-pulse inline-block rounded"></span>
                                    ) : (
                                        stat.value
                                    )}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Revenue & Secondary Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl text-white shadow-lg overflow-hidden relative">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2 opacity-80 font-medium">
                            <TrendingUp className="w-5 h-5" />
                            <span>Total Platform Revenue</span>
                        </div>
                        <h2 className="text-5xl font-black mb-6">
                            {loading ? '₹...' : `₹${stats.revenue.toLocaleString()}`}
                        </h2>
                        <div className="flex gap-4">
                            <Link href="/admin/orders" className="bg-white/20 hover:bg-white/30 px-5 py-2.5 rounded-xl font-semibold transition-colors flex items-center gap-2">
                                <Package className="w-4 h-4" />
                                View All Orders
                            </Link>
                        </div>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center">
                    <h2 className="font-bold text-xl text-gray-800 mb-2">New Applications</h2>
                    <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                        {stats.pendingApprovals > 0
                            ? `You have ${stats.pendingApprovals} caterers waiting for your approval.`
                            : 'All applications have been processed.'}
                    </p>
                    <Link
                        href="/admin/vendors"
                        className={`block text-center px-6 py-3 rounded-xl font-bold transition-all ${stats.pendingApprovals > 0
                            ? 'bg-orange-600 text-white shadow-lg shadow-orange-200 hover:bg-orange-700 hover:-translate-y-0.5'
                            : 'bg-gray-100 text-gray-400 cursor-default'
                            }`}
                    >
                        Manage Vendors
                    </Link>
                </div>
            </div>
        </div>
    );
}
