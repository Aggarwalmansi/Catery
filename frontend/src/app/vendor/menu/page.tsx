'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { VendorAPI } from '@/app/utils/apiClient';

export default function MenuPage() {
    const { token } = useAuth();
    const [menuItems, setMenuItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Main Course',
        isVeg: true
    });
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        const fetchMenu = async () => {
            if (!token) return;
            try {
                const profile = await VendorAPI.getProfile(token);
                setMenuItems(profile.menuItems || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchMenu();
    }, [token]);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            if (!token) return;
            await VendorAPI.deleteMenuItem(id, token);
            setMenuItems(menuItems.filter(i => i.id !== id));
        } catch (error) {
            alert('Failed to delete');
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!token) return;
            const newItem = await VendorAPI.addMenuItem(formData, token);
            setMenuItems([...menuItems, newItem]);
            setIsAdding(false);
            setFormData({ name: '', description: '', price: '', category: 'Main Course', isVeg: true });
        } catch (error) {
            alert('Failed to add item');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Menu Management</h1>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                >
                    {isAdding ? 'Cancel' : '+ Add Item'}
                </button>
            </div>

            {isAdding && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                    <h3 className="font-bold mb-4">Add New Item</h3>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                placeholder="Item Name"
                                required
                                className="border p-2 rounded"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                            <input
                                placeholder="Price (₹)"
                                required
                                type="number"
                                className="border p-2 rounded"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                        <textarea
                            placeholder="Description"
                            className="w-full border p-2 rounded"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                        <div className="flex gap-4">
                            <select
                                className="border p-2 rounded"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option>Starters</option>
                                <option>Main Course</option>
                                <option>Dessert</option>
                                <option>Drinks</option>
                            </select>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.isVeg}
                                    onChange={e => setFormData({ ...formData, isVeg: e.target.checked })}
                                />
                                Vegetarian
                            </label>
                        </div>
                        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Save Item</button>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-sm">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Veg/Non-Veg</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {menuItems.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="p-4 font-medium">{item.name}</td>
                                <td className="p-4 text-sm text-gray-500">{item.category}</td>
                                <td className="p-4">₹{item.price}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs ${item.isVeg ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {item.isVeg ? 'VEG' : 'NON-VEG'}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                                </td>
                            </tr>
                        ))}
                        {menuItems.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">No items found. Add some!</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
