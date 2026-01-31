import 'server-only';

import { createServerSupabaseClient } from '@/lib/supabase-server';
import { ROLE_LEVELS, hasPermission } from '@/lib/rbac';
import type { UserRole } from '@/types/orders';

export type AuthCheckResult =
    | { success: true; user: { id: string; email?: string }; role: UserRole }
    | { success: false; error: string; status: number };

/**
 * Server-side check for authenticated user with optional role requirement.
 * Use this in API routes to verify authentication and authorization.
 */
export async function requireAuthServer(
    minRole: UserRole = 'customer'
): Promise<AuthCheckResult> {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'Authentication required', status: 401 };
    }

    const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

    const userRole = (roleData?.role as UserRole) || 'customer';

    if (!hasPermission(userRole, minRole)) {
        return { success: false, error: 'Insufficient permissions', status: 403 };
    }

    return {
        success: true,
        user: { id: user.id, email: user.email },
        role: userRole
    };
}

/**
 * Server-side check for admin (staff or above).
 * Use this in admin API routes to verify the user has admin privileges.
 */
export async function requireAdminServer(): Promise<AuthCheckResult> {
    return requireAuthServer('staff');
}

/**
 * Server-side check for super admin only.
 * Use this for sensitive operations that require super admin access.
 */
export async function requireSuperAdminServer(): Promise<AuthCheckResult> {
    return requireAuthServer('super_admin');
}

// Re-export ROLE_LEVELS for convenience
export { ROLE_LEVELS, hasPermission };
export type { UserRole };
