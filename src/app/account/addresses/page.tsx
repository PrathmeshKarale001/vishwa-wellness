'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, MapPin, Plus, Edit2, Trash2, Check } from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { getSupabaseClient } from '@/lib/supabase';
import { Address, AddressFormData } from '@/types/auth';

const STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Puducherry'
];

function AddressesContent() {
    const { user } = useAuthStore();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [formData, setFormData] = useState<AddressFormData>({
        label: 'Home',
        full_name: '',
        phone: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        pincode: '',
        is_default: false,
    });
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            fetchAddresses();
        }
    }, [user]);

    const fetchAddresses = async () => {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('addresses')
            .select('*')
            .eq('user_id', user?.id)
            .order('is_default', { ascending: false });

        if (!error && data) {
            setAddresses(data as Address[]);
        }
        setIsLoading(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSaving(true);

        const supabase = getSupabaseClient();

        // If setting as default, unset other defaults first
        if (formData.is_default) {
            await supabase
                .from('addresses')
                .update({ is_default: false })
                .eq('user_id', user?.id);
        }

        if (editingAddress) {
            // Update existing
            const { error } = await supabase
                .from('addresses')
                .update(formData)
                .eq('id', editingAddress.id);

            if (error) {
                setError('Failed to update address');
                setIsSaving(false);
                return;
            }
        } else {
            // Create new
            const { error } = await supabase
                .from('addresses')
                .insert({ ...formData, user_id: user?.id });

            if (error) {
                setError('Failed to save address');
                setIsSaving(false);
                return;
            }
        }

        setIsSaving(false);
        setShowForm(false);
        setEditingAddress(null);
        resetForm();
        fetchAddresses();
    };

    const handleEdit = (address: Address) => {
        setEditingAddress(address);
        setFormData({
            label: address.label,
            full_name: address.full_name,
            phone: address.phone,
            address_line1: address.address_line1,
            address_line2: address.address_line2 || '',
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            is_default: address.is_default,
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this address?')) return;

        const supabase = getSupabaseClient();
        await supabase.from('addresses').delete().eq('id', id);
        fetchAddresses();
    };

    const handleSetDefault = async (id: string) => {
        const supabase = getSupabaseClient();

        // Unset all defaults
        await supabase
            .from('addresses')
            .update({ is_default: false })
            .eq('user_id', user?.id);

        // Set new default
        await supabase
            .from('addresses')
            .update({ is_default: true })
            .eq('id', id);

        fetchAddresses();
    };

    const resetForm = () => {
        setFormData({
            label: 'Home',
            full_name: '',
            phone: '',
            address_line1: '',
            address_line2: '',
            city: '',
            state: '',
            pincode: '',
            is_default: false,
        });
    };

    return (
        <>
            {/* Breadcrumb */}
            <div className="bg-[#f9f9f9] py-4 border-b border-[#eee]">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm text-[#777]">
                        <Link href="/" className="hover:text-[var(--color-primary)]">Home</Link>
                        <ChevronRight size={14} />
                        <Link href="/account" className="hover:text-[var(--color-primary)]">My Account</Link>
                        <ChevronRight size={14} />
                        <span className="text-[#222]">Addresses</span>
                    </div>
                </div>
            </div>

            {/* Page Header */}
            <div className="bg-[#f5f2f2] py-8">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-3xl font-bold text-[#222]" style={{ fontFamily: 'var(--font-heading)' }}>
                        My Addresses
                    </h1>
                    <p className="text-[#777] mt-2">Manage your shipping addresses</p>
                </div>
            </div>

            <section className="section-padding">
                <div className="max-w-4xl mx-auto px-4">
                    {/* Add Address Button */}
                    {!showForm && (
                        <button
                            onClick={() => { setShowForm(true); setEditingAddress(null); resetForm(); }}
                            className="mb-6 flex items-center gap-2 btn-outline"
                        >
                            <Plus size={18} />
                            Add New Address
                        </button>
                    )}

                    {/* Address Form */}
                    {showForm && (
                        <div className="bg-white border border-[#eee] p-6 mb-6">
                            <h2 className="text-lg font-semibold text-[#222] mb-4">
                                {editingAddress ? 'Edit Address' : 'Add New Address'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {error && (
                                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm">
                                        {error}
                                    </div>
                                )}

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#222] mb-1">Label</label>
                                        <select
                                            name="label"
                                            value={formData.label}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-[#ddd] focus:outline-none focus:border-[var(--color-primary)]"
                                        >
                                            <option value="Home">Home</option>
                                            <option value="Work">Work</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#222] mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            name="full_name"
                                            value={formData.full_name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-[#ddd] focus:outline-none focus:border-[var(--color-primary)]"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#222] mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-[#ddd] focus:outline-none focus:border-[var(--color-primary)]"
                                        placeholder="+91 XXXXX XXXXX"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#222] mb-1">Address Line 1</label>
                                    <input
                                        type="text"
                                        name="address_line1"
                                        value={formData.address_line1}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-[#ddd] focus:outline-none focus:border-[var(--color-primary)]"
                                        placeholder="House/Flat No., Building, Street"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#222] mb-1">Address Line 2 (Optional)</label>
                                    <input
                                        type="text"
                                        name="address_line2"
                                        value={formData.address_line2}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-[#ddd] focus:outline-none focus:border-[var(--color-primary)]"
                                        placeholder="Landmark, Area"
                                    />
                                </div>

                                <div className="grid sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#222] mb-1">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-[#ddd] focus:outline-none focus:border-[var(--color-primary)]"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#222] mb-1">State</label>
                                        <select
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-[#ddd] focus:outline-none focus:border-[var(--color-primary)]"
                                            required
                                        >
                                            <option value="">Select State</option>
                                            {STATES.map(state => (
                                                <option key={state} value={state}>{state}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#222] mb-1">Pincode</label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-[#ddd] focus:outline-none focus:border-[var(--color-primary)]"
                                            pattern="[0-9]{6}"
                                            maxLength={6}
                                            required
                                        />
                                    </div>
                                </div>

                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="is_default"
                                        checked={formData.is_default}
                                        onChange={handleChange}
                                    />
                                    <span className="text-sm text-[#777]">Set as default address</span>
                                </label>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="btn-solid disabled:opacity-50"
                                    >
                                        {isSaving ? 'Saving...' : (editingAddress ? 'Update Address' : 'Save Address')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setShowForm(false); setEditingAddress(null); }}
                                        className="btn-outline"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Address List */}
                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-[#777]">Loading addresses...</p>
                        </div>
                    ) : addresses.length === 0 && !showForm ? (
                        <div className="bg-white border border-[#eee] p-12 text-center">
                            <MapPin className="w-16 h-16 text-[#ddd] mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-[#222] mb-2">No addresses saved</h2>
                            <p className="text-[#777] mb-6">
                                Add your shipping address for faster checkout
                            </p>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 gap-4">
                            {addresses.map(address => (
                                <div key={address.id} className={`bg-white border p-4 relative ${address.is_default ? 'border-[var(--color-primary)]' : 'border-[#eee]'}`}>
                                    {address.is_default && (
                                        <span className="absolute top-2 right-2 text-xs bg-[var(--color-primary)] text-white px-2 py-1">
                                            Default
                                        </span>
                                    )}
                                    <p className="text-xs text-[var(--color-primary)] font-medium mb-1">{address.label}</p>
                                    <p className="font-semibold text-[#222]">{address.full_name}</p>
                                    <p className="text-sm text-[#777] mt-1">
                                        {address.address_line1}
                                        {address.address_line2 && <>, {address.address_line2}</>}
                                    </p>
                                    <p className="text-sm text-[#777]">
                                        {address.city}, {address.state} {address.pincode}
                                    </p>
                                    <p className="text-sm text-[#777] mt-1">{address.phone}</p>

                                    <div className="flex gap-3 mt-4 pt-4 border-t border-[#eee]">
                                        <button
                                            onClick={() => handleEdit(address)}
                                            className="flex items-center gap-1 text-sm text-[var(--color-primary)] hover:underline"
                                        >
                                            <Edit2 size={14} /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(address.id)}
                                            className="flex items-center gap-1 text-sm text-red-500 hover:underline"
                                        >
                                            <Trash2 size={14} /> Delete
                                        </button>
                                        {!address.is_default && (
                                            <button
                                                onClick={() => handleSetDefault(address.id)}
                                                className="flex items-center gap-1 text-sm text-[#777] hover:text-[#222]"
                                            >
                                                <Check size={14} /> Set Default
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}

export default function AddressesPage() {
    return (
        <AuthGuard>
            <AddressesContent />
        </AuthGuard>
    );
}
