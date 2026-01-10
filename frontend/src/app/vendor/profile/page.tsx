'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { VendorAPI } from '@/app/utils/apiClient';
import { useRouter } from 'next/navigation';
import { Store, Mail, Phone, MapPin, Calendar } from 'lucide-react';

export default function VendorProfile() {
    const { token } = useAuth();
    const router = useRouter();
    const [vendor, setVendor] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form state
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [occasions, setOccasions] = useState<string[]>([]);
    const [image, setImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await VendorAPI.getProfile(token!);
                setVendor(data);
                setName(data.name || '');
                setDescription(data.description || '');
                setEmail(data.email || '');
                setPhone(data.phone || '');
                setAddress(data.address || '');
                setOccasions(data.occasions || []);
                setImage(data.image || null);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchProfile();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            await VendorAPI.updateProfile({
                name,
                description,
                email,
                phone,
                address,
                occasions,
                image
            }, token!);

            alert('Profile updated successfully!');
            router.push('/vendor/dashboard');
        } catch (error) {
            alert('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const toggleOccasion = (occasion: string) => {
        if (occasions.includes(occasion)) {
            setOccasions(occasions.filter(o => o !== occasion));
        } else {
            setOccasions([...occasions, occasion]);
        }
    };

    const availableOccasions = ['Wedding', 'Birthday', 'Corporate', 'Anniversary', 'Festival', 'Party'];

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Store className="w-8 h-8 text-orange-600" />
                    <h1 className="text-3xl font-bold text-gray-900">Business Profile</h1>
                </div>
                <p className="text-gray-600">Manage your catering business information</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Business Photo */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Business Photo</h2>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-full md:w-48 h-48 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden relative group">
                            {image ? (
                                <>
                                    <img src={image} alt="Business" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={() => setImage(null)}
                                            className="bg-white text-red-600 p-2 rounded-full shadow-lg"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center p-4">
                                    <Store className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                                    <p className="text-xs text-gray-400">No photo uploaded</p>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 space-y-4">
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Upload a photo of your business or featured dishes. This will be visible on your public profile to attract customers.
                            </p>
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="business_photo"
                                />
                                <label
                                    htmlFor="business_photo"
                                    className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-bold cursor-pointer hover:bg-orange-700 transition-all shadow-lg shadow-orange-100"
                                >
                                    {image ? 'Change Photo' : 'Upload Business Photo'}
                                </label>
                            </div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Max size: 5MB • Formats: JPG, PNG, WEBP</p>
                        </div>
                    </div>
                </div>

                {/* Basic Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Store className="w-4 h-4 inline mr-2" />
                                Business Name *
                            </label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                placeholder="e.g., Royal Catering"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                placeholder="Tell customers about your catering services..."
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Mail className="w-4 h-4 inline mr-2" />
                                Email *
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                placeholder="contact@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Phone className="w-4 h-4 inline mr-2" />
                                Phone *
                            </label>
                            <input
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                placeholder="9876543210"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <MapPin className="w-4 h-4 inline mr-2" />
                                Address *
                            </label>
                            <textarea
                                required
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                placeholder="Your business address..."
                            />
                        </div>
                    </div>
                </div>

                {/* Occasions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                        <Calendar className="w-5 h-5 inline mr-2" />
                        Occasions You Cater
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {availableOccasions.map(occasion => (
                            <div
                                key={occasion}
                                onClick={() => toggleOccasion(occasion)}
                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${occasions.includes(occasion)
                                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                                    : 'border-gray-200 hover:border-orange-200 hover:bg-orange-50/50'
                                    }`}
                            >
                                <div className="text-center font-medium">{occasion}</div>
                            </div>
                        ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-4">{occasions.length} occasions selected</p>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => router.push('/vendor/dashboard')}
                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
