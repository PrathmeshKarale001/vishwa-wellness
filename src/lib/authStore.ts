'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Session } from '@supabase/supabase-js';
import { Profile } from '@/types/auth';
import { getSupabaseClient } from './supabase';
import { useWishlistStore } from './wishlistStore';

interface AuthState {
    user: User | null;
    session: Session | null;
    profile: Profile | null;
    isLoading: boolean;
    isInitialized: boolean;

    // Actions
    setUser: (user: User | null) => void;
    setSession: (session: Session | null) => void;
    setProfile: (profile: Profile | null) => void;
    setLoading: (loading: boolean) => void;
    initialize: () => Promise<void>;
    signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
    signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
    signInWithGoogle: (redirectTo?: string) => Promise<{ error: Error | null }>;
    signOut: () => Promise<void>;
    fetchProfile: () => Promise<void>;
    updateProfile: (data: Partial<Profile>) => Promise<{ error: Error | null }>;
    resetPassword: (email: string) => Promise<{ error: Error | null }>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            session: null,
            profile: null,
            isLoading: true,
            isInitialized: false,

            setUser: (user) => set({ user }),
            setSession: (session) => set({ session }),
            setProfile: (profile) => set({ profile }),
            setLoading: (isLoading) => set({ isLoading }),

            initialize: async () => {
                const supabase = getSupabaseClient();

                try {
                    // Get initial session
                    const { data: { session } } = await supabase.auth.getSession();

                    if (session?.user) {
                        set({
                            user: session.user,
                            session,
                            isLoading: false,
                            isInitialized: true
                        });
                        await get().fetchProfile();
                    } else {
                        set({
                            user: null,
                            session: null,
                            profile: null,
                            isLoading: false,
                            isInitialized: true
                        });
                    }

                    // Listen for auth changes
                    supabase.auth.onAuthStateChange(async (_event: string, session: Session | null) => {
                        set({
                            user: session?.user ?? null,
                            session
                        });

                        if (session?.user) {
                            await get().fetchProfile();
                        } else {
                            set({ profile: null });
                        }
                    });
                } catch (error) {
                    console.error('Auth initialization error:', error);
                    set({ isLoading: false, isInitialized: true });
                }
            },

            signIn: async (email, password) => {
                const supabase = getSupabaseClient();
                set({ isLoading: true });

                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) {
                    set({ isLoading: false });
                    return { error };
                }

                set({
                    user: data.user,
                    session: data.session,
                    isLoading: false
                });

                await get().fetchProfile();

                // Sync wishlist with database
                if (data.user) {
                    useWishlistStore.getState().syncWithDatabase(data.user.id);
                }

                return { error: null };
            },

            signUp: async (email, password, fullName) => {
                const supabase = getSupabaseClient();
                set({ isLoading: true });

                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        },
                    },
                });

                if (error) {
                    set({ isLoading: false });
                    return { error };
                }

                // Create profile if user was created
                if (data.user) {
                    await supabase.from('profiles').insert({
                        id: data.user.id,
                        full_name: fullName,
                    });
                }

                set({ isLoading: false });
                return { error: null };
            },

            signInWithGoogle: async (redirectTo?: string) => {
                const supabase = getSupabaseClient();

                // Build callback URL with next parameter if provided
                const callbackUrl = new URL('/auth/callback', window.location.origin);
                if (redirectTo) {
                    callbackUrl.searchParams.set('next', redirectTo);
                }

                const { error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        redirectTo: callbackUrl.toString(),
                    },
                });

                return { error };
            },

            signOut: async () => {
                const supabase = getSupabaseClient();
                await supabase.auth.signOut();
                set({ user: null, session: null, profile: null });

                // Clear wishlist on logout (keeps local persistence)
                // Note: We don't clear local storage, just the in-memory state
            },

            fetchProfile: async () => {
                const supabase = getSupabaseClient();
                const user = get().user;

                if (!user) return;

                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (error) {
                    console.error('Error fetching profile:', error);
                    // If profile doesn't exist, create one
                    if (error.code === 'PGRST116') {
                        await supabase.from('profiles').insert({
                            id: user.id,
                            full_name: user.user_metadata?.full_name || null,
                        });
                    }
                    return;
                }

                set({ profile: data as Profile });
            },

            updateProfile: async (data) => {
                const supabase = getSupabaseClient();
                const user = get().user;

                if (!user) return { error: new Error('Not authenticated') };

                const { error } = await supabase
                    .from('profiles')
                    .update({ ...data, updated_at: new Date().toISOString() })
                    .eq('id', user.id);

                if (!error) {
                    set({ profile: { ...get().profile!, ...data } });
                }

                return { error };
            },

            resetPassword: async (email) => {
                const supabase = getSupabaseClient();

                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/account/reset-password`,
                });

                return { error };
            },
        }),
        {
            name: 'vishwa-auth',
            partialize: (state) => ({
                // Only persist minimal auth state - actual session managed by Supabase
            }),
        }
    )
);
