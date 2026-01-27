'use client';

import { getSupabaseClient } from './supabase';
import type { UserRole, UserRoleRecord } from '@/types/orders';

// Get current user's role
export async function getUserRole(): Promise<UserRole | null> {
    const supabase = getSupabaseClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return null;
    }



    const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

    if (error) {
        return 'customer';
    }

    if (!data) {
        return 'customer';
    }

    return data.role as UserRole;
}

// Check if current user is admin
export async function isAdmin(): Promise<boolean> {
    const role = await getUserRole();
    return role === 'admin' || role === 'super_admin';
}

// Check if current user is staff or above
export async function isStaffOrAbove(): Promise<boolean> {
    const role = await getUserRole();
    return role === 'staff' || role === 'admin' || role === 'super_admin';
}

// Get all roles (admin only)
export async function getAllUserRoles(): Promise<UserRoleRecord[]> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching user roles:', error);
        return [];
    }

    return data as UserRoleRecord[];
}

// Update user role (super_admin only)
export async function updateUserRole(
    userId: string,
    newRole: UserRole
): Promise<{ error: Error | null }> {
    const supabase = getSupabaseClient();

    const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('user_id', userId);

    if (error) {
        return { error: new Error(error.message) };
    }

    return { error: null };
}

// Role permission levels
export const ROLE_LEVELS: Record<UserRole, number> = {
    customer: 0,
    staff: 1,
    admin: 2,
    super_admin: 3,
};

// Check if a role has permission for an action
export function hasPermission(
    userRole: UserRole | null,
    requiredRole: UserRole
): boolean {
    if (!userRole) return false;
    return ROLE_LEVELS[userRole] >= ROLE_LEVELS[requiredRole];
}
