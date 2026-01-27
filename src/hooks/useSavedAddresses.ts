'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabase';
import { useAuthStore } from '@/lib/authStore';

export interface SavedAddress {
    id: number;
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address_line1: string;
    address_line2?: string | null;
    city: string;
    state: string;
    pincode: string;
    country: string;
    label?: string | null;
    is_default: boolean;
    created_at: string;
    updated_at: string;
}

export interface AddressInput {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    pincode: string;
    country?: string;
    label?: string;
    is_default?: boolean;
}

interface UseSavedAddressesReturn {
    addresses: SavedAddress[];
    defaultAddress: SavedAddress | null;
    loading: boolean;
    error: string | null;
    saveAddress: (address: AddressInput) => Promise<SavedAddress | null>;
    updateAddress: (id: number, address: Partial<AddressInput>) => Promise<boolean>;
    deleteAddress: (id: number) => Promise<boolean>;
    setDefaultAddress: (id: number) => Promise<boolean>;
    refreshAddresses: () => Promise<void>;
}

export function useSavedAddresses(): UseSavedAddressesReturn {
    const [addresses, setAddresses] = useState<SavedAddress[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { user } = useAuthStore();
    const supabase = getSupabaseClient();

    const fetchAddresses = useCallback(async () => {
        if (!user?.id) {
            setAddresses([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { data, error: fetchError } = await supabase
                .from('user_addresses')
                .select('*')
                .eq('user_id', user.id)
                .order('is_default', { ascending: false })
                .order('created_at', { ascending: false });

            if (fetchError) {
                throw fetchError;
            }

            setAddresses((data as SavedAddress[]) || []);
        } catch (err) {
            console.error('Error fetching addresses:', err);
            setError('Failed to load saved addresses');
        } finally {
            setLoading(false);
        }
    }, [user?.id, supabase]);

    useEffect(() => {
        fetchAddresses();
    }, [fetchAddresses]);

    const saveAddress = async (address: AddressInput): Promise<SavedAddress | null> => {
        if (!user?.id) {
            setError('You must be logged in to save addresses');
            return null;
        }

        try {
            const { data, error: insertError } = await supabase
                .from('user_addresses')
                .insert({
                    ...address,
                    user_id: user.id,
                    country: address.country || 'India',
                })
                .select()
                .single();

            if (insertError) {
                throw insertError;
            }

            // Refresh the list
            await fetchAddresses();

            return data as SavedAddress;
        } catch (err) {
            console.error('Error saving address:', err);
            setError('Failed to save address');
            return null;
        }
    };

    const updateAddress = async (id: number, address: Partial<AddressInput>): Promise<boolean> => {
        if (!user?.id) {
            setError('You must be logged in to update addresses');
            return false;
        }

        try {
            const { error: updateError } = await supabase
                .from('user_addresses')
                .update(address)
                .eq('id', id)
                .eq('user_id', user.id);

            if (updateError) {
                throw updateError;
            }

            await fetchAddresses();
            return true;
        } catch (err) {
            console.error('Error updating address:', err);
            setError('Failed to update address');
            return false;
        }
    };

    const deleteAddress = async (id: number): Promise<boolean> => {
        if (!user?.id) {
            setError('You must be logged in to delete addresses');
            return false;
        }

        try {
            const { error: deleteError } = await supabase
                .from('user_addresses')
                .delete()
                .eq('id', id)
                .eq('user_id', user.id);

            if (deleteError) {
                throw deleteError;
            }

            await fetchAddresses();
            return true;
        } catch (err) {
            console.error('Error deleting address:', err);
            setError('Failed to delete address');
            return false;
        }
    };

    const setDefaultAddress = async (id: number): Promise<boolean> => {
        return updateAddress(id, { is_default: true });
    };

    const defaultAddress = addresses.find(addr => addr.is_default) || null;

    return {
        addresses,
        defaultAddress,
        loading,
        error,
        saveAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        refreshAddresses: fetchAddresses,
    };
}

/**
 * Convert a SavedAddress to the ShippingFormData format used by checkout
 */
export function savedAddressToFormData(address: SavedAddress) {
    return {
        firstName: address.first_name,
        lastName: address.last_name,
        email: address.email,
        phone: address.phone,
        address: address.address_line1,
        apartment: address.address_line2 || '',
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        country: address.country,
    };
}

/**
 * Convert ShippingFormData to AddressInput for saving
 */
export function formDataToAddressInput(formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    apartment?: string;
    city: string;
    state: string;
    pincode: string;
    country?: string;
}): AddressInput {
    return {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address_line1: formData.address,
        address_line2: formData.apartment || undefined,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        country: formData.country || 'India',
    };
}
