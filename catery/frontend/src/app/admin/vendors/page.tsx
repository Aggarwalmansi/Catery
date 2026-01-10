'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { API_URL } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { CheckCircle, XCircle, Trash2, ShieldAlert, ExternalLink, Mail, Phone, MapPin, Clock, Users } from 'lucide-react';

export default function AdminVendorsPage() {
    const { token } = useAuth();
    const [vendors, setVendors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchVendors = async () => {
        try {
            const res = await fetch(`${API_URL}/vendor/admin/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setVendors(data);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error("Failed to load vendors");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchVendors();
    }, [token]);

    const handleVerification = async (id: string, isVerified: boolean) => {
        const action = isVerified ? 'verify' : 'revoke verification for';
        if (!confirm(`Are you sure you want to ${action} this vendor?`)) return;

        try {
            const res = await fetch(`${API_URL}/vendor/admin/${id}/verify`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isVerified })
            });

            if (res.ok) {
                toast.success(isVerified ? "Vendor Approved!" : "Verification Revoked");
                setVendors(vendors.map(v => v.id === id ? { ...v, isVerified } : v));
            } else {
                toast.error("Process failed");
            }
        } catch (error) {
            toast.error("Error communicating with server");
        }
    }

    const handleStatusUpdate = async (id: string, status: string) => {
        if (!confirm(`Change vendor status to ${status}?`)) return;

        try {
            const res = await fetch(`${API_URL}/vendor/admin/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                toast.success(`Status updated to ${status}`);
                setVendors(vendors.map(v => v.id === id ? { ...v, status } : v));
            } else {
                toast.error("Failed to update status");
            }
        } catch (error) {
            toast.error("Error updating status");
        }
    }

    const handleDeleteVendor = async (id: string) => {
        if (!confirm("CRITICAL: Delete this vendor profile permanently? This will revert the user to CUSTOMER role.")) return;

        try {
            const res = await fetch(`${API_URL}/vendor/admin/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                toast.success("Vendor profile deleted");
                setVendors(vendors.filter(v => v.id !== id));
            } else {
                const errorData = await res.json();
                toast.error(errorData.error || "Failed to delete vendor");
            }
        } catch (error: any) {
            toast.error(error.message || "Delete operation failed");
        }
    }

    const getStatusBadge = (vendor: any) => {
        if (vendor.status === 'DISABLED') {
            return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-red-100 text-red-700 flex items-center gap-1 w-fit">
                <ShieldAlert className="w-3 h-3" /> DISABLED
            </span>;
        }
        if (vendor.isVerified) {
            return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-green-100 text-green-700 flex items-center gap-1 w-fit">
                <CheckCircle className="w-3 h-3" /> APPROVED
            </span>;
        }
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-orange-100 text-orange-700 flex items-center gap-1 w-fit">
            <Clock className="w-3 h-3" /> PENDING
        </span>;
    }

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 font-medium">Loading vendor ecosystem...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Caterer Management</h1>
                    <p className="text-gray-500 mt-1">Verify, monitor, and manage all registered catering partners.</p>
                </div>
                <div className="text-sm font-medium text-gray-400 bg-white px-4 py-2 rounded-lg border border-gray-100">
                    Total: {vendors.length}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Vendor Details</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Contact</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Role/Status</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Management</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 bg-white">
                            {vendors.map((vendor) => (
                                <tr key={vendor.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            {vendor.image ? (
                                                <img src={vendor.image} alt="" className="w-12 h-12 rounded-xl object-cover ring-2 ring-gray-100" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xl">
                                                    {vendor.name[0]}
                                                </div>
                                            )}
                                            <div>
                                                <div className="text-base font-bold text-gray-900 flex items-center gap-2">
                                                    {vendor.name}
                                                    {vendor.isVerified && <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-50" />}
                                                </div>
                                                <div className="text-xs text-gray-400 font-medium mt-0.5 uppercase tracking-tighter">Joined {new Date(vendor.createdAt).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="space-y-1">
                                            <div className="text-sm text-gray-600 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {vendor.email}</div>
                                            <div className="text-sm text-gray-600 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {vendor.phone}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        {getStatusBadge(vendor)}
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {!vendor.isVerified ? (
                                                <button
                                                    onClick={() => handleVerification(vendor.id, true)}
                                                    className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all"
                                                >
                                                    Approve
                                                </button>
                                            ) : (
                                                <>
                                                    {vendor.status === 'DISABLED' ? (
                                                        <button
                                                            onClick={() => handleStatusUpdate(vendor.id, 'ACTIVE')}
                                                            className="px-3 py-1.5 text-xs font-bold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-all"
                                                        >
                                                            Enable
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleStatusUpdate(vendor.id, 'DISABLED')}
                                                            className="px-3 py-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-all"
                                                        >
                                                            Disable
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                            <button
                                                onClick={() => handleDeleteVendor(vendor.id)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                title="Delete permanently"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {vendors.length === 0 && (
                    <div className="py-20 text-center">
                        <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-400 font-medium">No vendors found in the platform.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
