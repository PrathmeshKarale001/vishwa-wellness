import { User, Session } from '@supabase/supabase-js';

// User profile stored in Supabase
export interface Profile {
    id: string;
    full_name: string | null;
    phone: string | null;
    avatar_url: string | null;
    dosha_type: 'vata' | 'pitta' | 'kapha' | null;
    created_at: string;
    updated_at: string;
}

// Address for shipping
export interface Address {
    id: string;
    user_id: string;
    label: string;
    full_name: string;
    phone: string;
    address_line1: string;
    address_line2: string | null;
    city: string;
    state: string;
    pincode: string;
    is_default: boolean;
    created_at: string;
}

// Order record
export interface Order {
    id: string;
    user_id: string;
    order_number: string;
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    subtotal: number;
    shipping: number;
    total: number;
    items: OrderItem[];
    shipping_address: Address;
    payment_method: string | null;
    created_at: string;
    updated_at: string;
}

export interface OrderItem {
    product_id: string;
    product_title: string;
    product_image: string;
    quantity: number;
    price: number;
    variant?: {
        id: string;
        size?: string;
        color?: string;
    };
}

// Wishlist item in DB
export interface WishlistItem {
    id: string;
    user_id: string;
    product_id: string;
    created_at: string;
}

// Auth state
export interface AuthState {
    user: User | null;
    session: Session | null;
    profile: Profile | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

// Form types
export interface LoginFormData {
    email: string;
    password: string;
}

export interface RegisterFormData {
    email: string;
    password: string;
    full_name: string;
}

export interface ResetPasswordFormData {
    email: string;
}

export interface UpdatePasswordFormData {
    password: string;
    confirmPassword: string;
}

export interface ProfileFormData {
    full_name: string;
    phone: string;
}

export interface AddressFormData {
    label: string;
    full_name: string;
    phone: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    pincode: string;
    is_default: boolean;
}
