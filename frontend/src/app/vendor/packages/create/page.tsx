'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { VendorAPI } from '@/app/utils/apiClient';
import { useRouter } from 'next/navigation';

export default function CreatePackage() {
    const { token } = useAuth();
    const router = useRouter();

    // Form State
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [minPlates, setMinPlates] = useState('50');
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    // Data State
    const [menuItems, setMenuItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const profile = await VendorAPI.getProfile(token!);
                setMenuItems(profile.menuItems || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchMenuItems();
    }, [token]);

    const toggleItem = (itemId: string) => {
        setSelectedItems(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await VendorAPI.createPackage({
                name,
                description,
                price,
                minPlates,
                items: selectedItems
            }, token!);
            router.push('/vendor/packages');
        } catch (error) {
            alert('Failed to create package');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Create New Package</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-1">Package Name</label>
                    <input
                        type="text"
                        required
                        className="w-full p-2 border rounded-lg"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Silver Wedding Package"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                        className="w-full p-2 border rounded-lg"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows={3}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Price per Plate (₹)</label>
                        <input
                            type="number"
                            required
                            className="w-full p-2 border rounded-lg"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Min Plates</label>
                        <input
                            type="number"
                            required
                            className="w-full p-2 border rounded-lg"
                            value={minPlates}
                            onChange={e => setMinPlates(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Include Menu Items</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto border p-3 rounded-lg">
                        {menuItems.map(item => (
                            <div
                                key={item.id}
                                onClick={() => toggleItem(item.id)}
                                className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedItems.includes(item.id)
                                    ? 'bg-black text-white border-black'
                                    : 'bg-white hover:bg-gray-50 border-gray-200'
                                    }`}
                            >
                                <div className="flex justify-between">
                                    <span className="font-medium">{item.name}</span>
                                    {!selectedItems.includes(item.id) && <span className="text-xs text-gray-500">₹{item.price}</span>}
                                </div>
                                <p className={`text-xs mt-1 ${selectedItems.includes(item.id) ? 'text-gray-300' : 'text-gray-500'}`}>
                                    {item.category}
                                </p>
                            </div>
                        ))}
                        {menuItems.length === 0 && <p className="text-gray-500 text-sm">No menu items found. Please add menu items first.</p>}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{selectedItems.length} items selected</p>
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex-1 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={selectedItems.length === 0}
                        className="flex-1 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 font-medium"
                    >
                        Create Package
                    </button>
                </div>
            </form>
        </div>
    );
}
