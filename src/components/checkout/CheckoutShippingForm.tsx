'use client';

import { useState, useEffect } from 'react';
import { MapPin, Check, BookmarkPlus, Home, Building2, Loader2, RefreshCw } from 'lucide-react';
import { validateAddress, INDIAN_STATES } from '@/lib/validations/address';

export interface ShippingFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    apartment?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
}

interface SavedAddress extends ShippingFormData {
    id: number;
    label?: string;
    is_default?: boolean;
}

interface CheckoutShippingFormProps {
    data: ShippingFormData;
    onChange: (data: ShippingFormData) => void;
    onContinue?: () => void;
    errors?: Record<string, string>;
    isLoggedIn?: boolean;
    savedAddresses?: SavedAddress[];
    onSelectSavedAddress?: (address: ShippingFormData) => void;
    onSaveAddress?: (address: ShippingFormData, label?: string) => Promise<void>;
    showSaveOption?: boolean;
}

export default function CheckoutShippingForm({
    data,
    onChange,
    onContinue,
    errors: externalErrors = {},
    isLoggedIn = false,
    savedAddresses = [],
    onSelectSavedAddress,
    onSaveAddress,
    showSaveOption = true,
}: CheckoutShippingFormProps) {
    const [showSavedAddresses, setShowSavedAddresses] = useState(savedAddresses.length > 0);
    const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
    const [saveAddress, setSaveAddress] = useState(false);
    const [addressLabel, setAddressLabel] = useState<'home' | 'office' | 'other'>('home');
    const [saving, setSaving] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

    // PIN code auto-fill states
    const [pincodeLoading, setPincodeLoading] = useState(false);
    const [pincodeError, setPincodeError] = useState<string>('');
    const [fieldsLocked, setFieldsLocked] = useState(false);

    // Combine external and local errors
    const errors = { ...localErrors, ...externalErrors };

    // Validate on blur
    const handleBlur = (fieldName: string) => {
        const fieldErrors = validateAddress({ [fieldName]: data[fieldName as keyof ShippingFormData] });
        setLocalErrors(prev => ({
            ...prev,
            [fieldName]: fieldErrors[fieldName] || '',
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Clear error when user starts typing
        if (localErrors[name]) {
            setLocalErrors(prev => ({ ...prev, [name]: '' }));
        }

        // Reset selected address when manually editing
        setSelectedAddressId(null);

        onChange({
            ...data,
            [name]: value,
        });
    };

    // Fetch PIN code data from API
    const fetchPincodeData = async (pincode: string) => {
        if (!/^\d{6}$/.test(pincode)) {
            return; // Not a valid 6-digit PIN
        }

        setPincodeLoading(true);
        setPincodeError('');

        try {
            const response = await fetch(`/api/pincode-lookup?pincode=${pincode}`);
            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Failed to fetch PIN code details');
            }

            // Auto-fill city and state
            onChange({
                ...data,
                city: result.data.city,
                state: result.data.state,
            });

            // Lock the fields
            setFieldsLocked(true);
            setPincodeError('');
        } catch (error) {
            console.error('[pincode] Fetch error:', error);
            setPincodeError(error instanceof Error ? error.message : 'Failed to fetch PIN code details');
            // Unlock fields for manual entry
            setFieldsLocked(false);
        } finally {
            setPincodeLoading(false);
        }
    };

    // Handle PIN code blur - auto-fetch
    const handlePincodeBlur = () => {
        handleBlur('pincode');
        if (data.pincode && /^\d{6}$/.test(data.pincode)) {
            fetchPincodeData(data.pincode);
        }
    };

    const handleSelectAddress = (address: SavedAddress) => {
        setSelectedAddressId(address.id);
        onSelectSavedAddress?.(address);
    };

    const validateForm = (): boolean => {
        const validationErrors = validateAddress(data);
        setLocalErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleContinue = async () => {
        if (!validateForm()) {
            return;
        }

        // Save address if requested
        if (isLoggedIn && saveAddress && onSaveAddress) {
            setSaving(true);
            try {
                await onSaveAddress(data, addressLabel);
            } catch (error) {
                console.error('Failed to save address:', error);
            } finally {
                setSaving(false);
            }
        }

        onContinue?.();
    };

    const isFormValid = () => {
        return (
            data.firstName?.trim() &&
            data.lastName?.trim() &&
            data.email?.trim() &&
            data.phone?.trim() &&
            data.address?.trim() &&
            data.city?.trim() &&
            data.state?.trim() &&
            data.pincode?.trim() &&
            Object.values(errors).every(e => !e)
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-[#eee] overflow-hidden">
            {/* Section Header */}
            <div className="p-6 border-b border-[#eee] bg-[#f9f9f9]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center">
                        <MapPin size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-[#222]">
                            Shipping Information
                        </h2>
                        <p className="text-sm text-[#777]">
                            Where should we deliver your order?
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Saved Addresses */}
                {isLoggedIn && savedAddresses.length > 0 && (
                    <div className="space-y-3">
                        <button
                            type="button"
                            onClick={() => setShowSavedAddresses(!showSavedAddresses)}
                            className="flex items-center gap-2 text-sm text-[var(--color-primary)] hover:underline"
                        >
                            <BookmarkPlus size={16} />
                            {showSavedAddresses ? 'Hide' : 'Use'} saved addresses ({savedAddresses.length})
                        </button>

                        {showSavedAddresses && (
                            <div className="grid gap-3">
                                {savedAddresses.map((addr) => (
                                    <button
                                        key={addr.id}
                                        type="button"
                                        onClick={() => handleSelectAddress(addr)}
                                        className={`relative p-4 border-2 rounded-lg text-left transition-all ${selectedAddressId === addr.id
                                            ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                                            : 'border-[#eee] hover:border-[var(--color-primary)]/50'
                                            }`}
                                    >
                                        {/* Default badge */}
                                        {addr.is_default && (
                                            <span className="absolute top-2 right-2 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                                                Default
                                            </span>
                                        )}

                                        {/* Label icon */}
                                        <div className="flex items-center gap-2 mb-1">
                                            {addr.label === 'office' ? (
                                                <Building2 size={14} className="text-[#777]" />
                                            ) : (
                                                <Home size={14} className="text-[#777]" />
                                            )}
                                            <span className="text-xs text-[#777] capitalize">
                                                {addr.label || 'Address'}
                                            </span>
                                        </div>

                                        <p className="font-medium text-[#222]">
                                            {addr.firstName} {addr.lastName}
                                        </p>
                                        <p className="text-sm text-[#777] mt-1">
                                            {addr.address}
                                            {addr.apartment && `, ${addr.apartment}`}
                                        </p>
                                        <p className="text-sm text-[#777]">
                                            {addr.city}, {addr.state} - {addr.pincode}
                                        </p>

                                        {/* Selected checkmark */}
                                        {selectedAddressId === addr.id && (
                                            <div className="absolute bottom-4 right-4 w-6 h-6 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center">
                                                <Check size={14} />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}

                        {showSavedAddresses && (
                            <div className="border-t border-[#eee] pt-4 mt-4">
                                <p className="text-sm text-[#777] mb-4">Or enter a new address:</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-[#222] mb-2">
                            First Name *
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={data.firstName}
                            onChange={handleChange}
                            onBlur={() => handleBlur('firstName')}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[var(--color-primary)] transition-colors ${errors.firstName ? 'border-red-500 bg-red-50/50' : 'border-[#ddd]'
                                }`}
                            placeholder="Enter first name"
                        />
                        {errors.firstName && (
                            <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-[#222] mb-2">
                            Last Name *
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={data.lastName}
                            onChange={handleChange}
                            onBlur={() => handleBlur('lastName')}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[var(--color-primary)] transition-colors ${errors.lastName ? 'border-red-500 bg-red-50/50' : 'border-[#ddd]'
                                }`}
                            placeholder="Enter last name"
                        />
                        {errors.lastName && (
                            <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                        )}
                    </div>
                </div>

                {/* Contact Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[#222] mb-2">
                            Email *
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={data.email}
                            onChange={handleChange}
                            onBlur={() => handleBlur('email')}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[var(--color-primary)] transition-colors ${errors.email ? 'border-red-500 bg-red-50/50' : 'border-[#ddd]'
                                }`}
                            placeholder="you@example.com"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-[#222] mb-2">
                            Phone Number *
                        </label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 border border-r-0 border-[#ddd] rounded-l-lg bg-[#f9f9f9] text-[#777]">
                                +91
                            </span>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={data.phone}
                                onChange={handleChange}
                                onBlur={() => handleBlur('phone')}
                                maxLength={10}
                                className={`flex-1 px-4 py-3 border rounded-r-lg focus:outline-none focus:border-[var(--color-primary)] transition-colors ${errors.phone ? 'border-red-500 bg-red-50/50' : 'border-[#ddd]'
                                    }`}
                                placeholder="10-digit mobile number"
                            />
                        </div>
                        {errors.phone && (
                            <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                        )}
                    </div>
                </div>

                {/* Address Fields */}
                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-[#222] mb-2">
                        Street Address *
                    </label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={data.address}
                        onChange={handleChange}
                        onBlur={() => handleBlur('address')}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[var(--color-primary)] transition-colors ${errors.address ? 'border-red-500 bg-red-50/50' : 'border-[#ddd]'
                            }`}
                        placeholder="House/Flat No., Street, Locality"
                    />
                    {errors.address && (
                        <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="apartment" className="block text-sm font-medium text-[#222] mb-2">
                        Apartment, Suite, etc. (optional)
                    </label>
                    <input
                        type="text"
                        id="apartment"
                        name="apartment"
                        value={data.apartment || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-[#ddd] rounded-lg focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                        placeholder="Apartment, suite, unit, building, floor, etc."
                    />
                </div>

                {/* PIN Code, City, State - reordered */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* PIN Code - First */}
                    <div className="relative">
                        <label htmlFor="pincode" className="block text-sm font-medium text-[#222] mb-2">
                            PIN Code *
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="pincode"
                                name="pincode"
                                value={data.pincode}
                                onChange={(e) => {
                                    handleChange(e);
                                    // Reset locked state when PIN changes
                                    if (fieldsLocked) {
                                        setFieldsLocked(false);
                                    }
                                    setPincodeError('');
                                }}
                                onBlur={handlePincodeBlur}
                                maxLength={6}
                                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:border-[var(--color-primary)] transition-colors ${errors.pincode || pincodeError ? 'border-red-500 bg-red-50/50' : 'border-[#ddd]'
                                    }`}
                                placeholder="6-digit PIN"
                            />
                            {/* Loading spinner */}
                            {pincodeLoading && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <Loader2 className="w-5 h-5 text-[var(--color-primary)] animate-spin" />
                                </div>
                            )}
                        </div>

                        {/* Manual fetch button */}
                        {!pincodeLoading && data.pincode.length === 6 && !fieldsLocked && (
                            <button
                                type="button"
                                onClick={() => fetchPincodeData(data.pincode)}
                                className="mt-2 flex items-center gap-1.5 text-sm text-[var(--color-primary)] hover:underline"
                            >
                                <RefreshCw size={14} />
                                Fetch City & State
                            </button>
                        )}

                        {errors.pincode && (
                            <p className="mt-1 text-sm text-red-500">{errors.pincode}</p>
                        )}
                        {pincodeError && (
                            <p className="mt-1 text-sm text-red-500">{pincodeError}</p>
                        )}
                    </div>

                    {/* City - Second, disabled until PIN is valid */}
                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-[#222] mb-2">
                            City *
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={data.city}
                                onChange={handleChange}
                                onBlur={() => handleBlur('city')}
                                disabled={!data.pincode || data.pincode.length !== 6 || pincodeLoading}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[var(--color-primary)] transition-colors ${!data.pincode || data.pincode.length !== 6 || pincodeLoading ? 'bg-gray-100 cursor-not-allowed text-gray-500' : ''} ${errors.city ? 'border-red-500 bg-red-50/50' : 'border-[#ddd]'}`}
                                placeholder={pincodeLoading ? 'Fetching...' : (!data.pincode || data.pincode.length !== 6) ? 'Enter PIN first' : 'Enter city'}
                            />
                            {fieldsLocked && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <Check className="w-4 h-4 text-green-600" />
                                </div>
                            )}
                        </div>
                        {errors.city && (
                            <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                        )}
                    </div>

                    {/* State - Third, disabled until PIN is valid */}
                    <div>
                        <label htmlFor="state" className="block text-sm font-medium text-[#222] mb-2">
                            State *
                        </label>
                        <div className="relative">
                            <select
                                id="state"
                                name="state"
                                value={data.state}
                                onChange={handleChange}
                                onBlur={() => handleBlur('state')}
                                disabled={!data.pincode || data.pincode.length !== 6 || pincodeLoading}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[var(--color-primary)] transition-colors ${!data.pincode || data.pincode.length !== 6 || pincodeLoading ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'bg-white'} ${errors.state ? 'border-red-500 bg-red-50/50' : 'border-[#ddd]'}`}
                            >
                                <option value="">{pincodeLoading ? 'Fetching...' : (!data.pincode || data.pincode.length !== 6) ? 'Enter PIN first' : 'Select state'}</option>
                                {INDIAN_STATES.map((state) => (
                                    <option key={state} value={state}>
                                        {state}
                                    </option>
                                ))}
                            </select>
                            {fieldsLocked && (
                                <div className="absolute right-10 top-1/2 -translate-y-1/2">
                                    <Check className="w-4 h-4 text-green-600" />
                                </div>
                            )}
                        </div>
                        {errors.state && (
                            <p className="mt-1 text-sm text-red-500">{errors.state}</p>
                        )}
                    </div>
                </div>

                {/* Save Address Option */}
                {isLoggedIn && showSaveOption && !selectedAddressId && (
                    <div className="border-t border-[#eee] pt-4 space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={saveAddress}
                                onChange={(e) => setSaveAddress(e.target.checked)}
                                className="w-5 h-5 rounded border-[#ddd] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                            />
                            <span className="text-sm text-[#555]">
                                Save this address for future orders
                            </span>
                        </label>

                        {saveAddress && (
                            <div className="flex gap-3 ml-8">
                                <button
                                    type="button"
                                    onClick={() => setAddressLabel('home')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${addressLabel === 'home'
                                        ? 'bg-[var(--color-primary)] text-white'
                                        : 'bg-[#f5f5f5] text-[#555] hover:bg-[#eee]'
                                        }`}
                                >
                                    <Home size={14} />
                                    Home
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setAddressLabel('office')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${addressLabel === 'office'
                                        ? 'bg-[var(--color-primary)] text-white'
                                        : 'bg-[#f5f5f5] text-[#555] hover:bg-[#eee]'
                                        }`}
                                >
                                    <Building2 size={14} />
                                    Office
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setAddressLabel('other')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${addressLabel === 'other'
                                        ? 'bg-[var(--color-primary)] text-white'
                                        : 'bg-[#f5f5f5] text-[#555] hover:bg-[#eee]'
                                        }`}
                                >
                                    <MapPin size={14} />
                                    Other
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Continue Button */}
                {onContinue && (
                    <button
                        type="button"
                        onClick={handleContinue}
                        disabled={!isFormValid() || saving}
                        className="w-full btn-solid py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {saving ? (
                            <>
                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Continue to Payment'
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
