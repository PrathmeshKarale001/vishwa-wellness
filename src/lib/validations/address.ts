import { z } from 'zod';

/**
 * Indian states and union territories
 */
export const INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
    'Andaman and Nicobar Islands', 'Dadra and Nagar Haveli and Daman and Diu',
    'Lakshadweep',
] as const;

export type IndianState = typeof INDIAN_STATES[number];

/**
 * Indian PIN code validation regex
 * Valid format: 6 digits, first digit cannot be 0
 */
const PINCODE_REGEX = /^[1-9][0-9]{5}$/;

/**
 * Indian phone number validation regex
 * Valid format: 10 digits starting with 6, 7, 8, or 9
 */
const INDIAN_PHONE_REGEX = /^[6-9]\d{9}$/;

/**
 * Email validation schema
 */
const emailSchema = z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address');

/**
 * Phone number validation schema
 */
const phoneSchema = z
    .string()
    .min(1, 'Phone number is required')
    .regex(INDIAN_PHONE_REGEX, 'Please enter a valid 10-digit Indian mobile number');

/**
 * PIN code validation schema
 */
const pincodeSchema = z
    .string()
    .min(1, 'PIN code is required')
    .regex(PINCODE_REGEX, 'Please enter a valid 6-digit PIN code');

/**
 * Address validation schema
 */
export const addressSchema = z.object({
    firstName: z
        .string()
        .min(1, 'First name is required')
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name must be less than 50 characters')
        .regex(/^[a-zA-Z\s'-]+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes'),

    lastName: z
        .string()
        .min(1, 'Last name is required')
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name must be less than 50 characters')
        .regex(/^[a-zA-Z\s'-]+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes'),

    email: emailSchema,

    phone: phoneSchema,

    address: z
        .string()
        .min(1, 'Street address is required')
        .min(10, 'Please enter a complete street address')
        .max(200, 'Address must be less than 200 characters'),

    apartment: z
        .string()
        .max(100, 'Apartment/suite must be less than 100 characters')
        .optional(),

    city: z
        .string()
        .min(1, 'City is required')
        .min(2, 'City name must be at least 2 characters')
        .max(50, 'City name must be less than 50 characters'),

    state: z
        .string()
        .min(1, 'Please select a valid state')
        .refine((val) => INDIAN_STATES.includes(val as IndianState), {
            message: 'Please select a valid state',
        }),

    pincode: pincodeSchema,

    country: z
        .string()
        .default('India'),
});

export type AddressFormData = z.infer<typeof addressSchema>;

/**
 * Validates an address and returns errors
 */
export function validateAddress(data: Partial<AddressFormData>): Record<string, string> {
    const result = addressSchema.safeParse(data);

    if (result.success) {
        return {};
    }

    const errors: Record<string, string> = {};
    for (const issue of result.error.issues) {
        const field = issue.path[0] as string;
        if (!errors[field]) {
            errors[field] = issue.message;
        }
    }

    return errors;
}

/**
 * PIN code to city/state lookup (common Indian PIN codes)
 * In production, this would call an API like India Post
 */
export async function lookupPincode(pincode: string): Promise<{
    city?: string;
    state?: string;
    error?: string;
}> {
    // Validate PIN code format first
    if (!PINCODE_REGEX.test(pincode)) {
        return { error: 'Invalid PIN code format' };
    }

    // In production, call India Post API or similar
    // For now, return a simple mapping for common areas
    const firstDigit = pincode[0];
    const stateMap: Record<string, string> = {
        '1': 'Delhi',
        '2': 'Uttar Pradesh',
        '3': 'Rajasthan',
        '4': 'Maharashtra',
        '5': 'Andhra Pradesh',
        '6': 'Tamil Nadu',
        '7': 'West Bengal',
        '8': 'Bihar',
        '9': 'Kerala',
    };

    // Return approximate state based on first digit
    // This is a simplified version - real implementation would use an API
    return {
        state: stateMap[firstDigit] || undefined,
    };
}

/**
 * Format address for display
 */
export function formatAddress(address: AddressFormData): string {
    const parts = [
        address.address,
        address.apartment,
        address.city,
        `${address.state} - ${address.pincode}`,
        address.country,
    ].filter(Boolean);

    return parts.join(', ');
}

/**
 * Format address as multiline
 */
export function formatAddressMultiline(address: AddressFormData): string[] {
    return [
        `${address.firstName} ${address.lastName}`,
        address.address,
        address.apartment,
        `${address.city}, ${address.state} - ${address.pincode}`,
        address.country,
        `Phone: +91 ${address.phone}`,
    ].filter((line): line is string => Boolean(line));
}
