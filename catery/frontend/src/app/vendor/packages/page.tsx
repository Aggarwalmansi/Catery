'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { VendorAPI } from '@/app/utils/apiClient';
import Link from 'next/link';

export default function PackageList() {
    const { token } = useAuth();
    const [packages, setPackages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) fetchPackages();
    }, [token]);

    const fetchPackages = async () => {
        try {
            const data = await VendorAPI.getPackages(token!);
            setPackages(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this package?')) return;
        try {
            await VendorAPI.deletePackage(id, token!);
            setPackages(packages.filter(p => p.id !== id));
        } catch (error) {
            alert('Failed to delete package');
        }
    };

    if (loading) return <div>Loading packages...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">My Packages</h1>
                <Link href="/vendor/packages/create" className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
                    + Create Package
                </Link>
            </div>

            <div className="grid gap-6">
                {packages.map((pkg) => (
                    <div key={pkg.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-semibold">{pkg.name}</h3>
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold">
                                    ₹{pkg.price}/plate
                                </span>
                            </div>
                            <p className="text-gray-500 mt-1">{pkg.description}</p>
                            <p className="text-sm text-gray-400 mt-2">Min Plates: {pkg.minPlates}</p>

                            <div className="mt-4">
                                <p className="text-sm font-medium mb-2">Includes:</p>
                                <div className="flex flex-wrap gap-2">
                                    {pkg.items?.map((item: any) => (
                                        <span key={item.id} className="text-xs bg-gray-100 px-2 py-1 rounded border border-gray-200">
                                            {item.menuItem?.name || 'Unknown Item'}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => handleDelete(pkg.id)}
                            className="text-red-500 hover:text-red-700 text-sm"
                        >
                            Delete
                        </button>
                    </div>
                ))}

                {packages.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-100 border-dashed">
                        <p className="text-gray-500">No packages created yet.</p>
                        <p className="text-sm text-gray-400 mt-1">Create packages (e.g. Silver, Gold) for users to book.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
