'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, User, Lock, Trash2, CheckCircle, Camera, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { getSupabaseClient } from '@/lib/supabase';

function SettingsContent() {
    const { user, profile, updateProfile, signOut } = useAuthStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Avatar upload
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [avatarError, setAvatarError] = useState('');

    // Profile form
    const [profileData, setProfileData] = useState({
        full_name: profile?.full_name || '',
        phone: profile?.phone || '',
    });
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [profileSuccess, setProfileSuccess] = useState(false);
    const [profileError, setProfileError] = useState('');

    // Password form
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    // Delete account
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        // Validate file
        if (!file.type.startsWith('image/')) {
            setAvatarError('Please select an image file');
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            setAvatarError('Image must be less than 2MB');
            return;
        }

        setIsUploadingAvatar(true);
        setAvatarError('');

        const supabase = getSupabaseClient();
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;

        // Upload to Storage
        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, file, { upsert: true });

        if (uploadError) {
            setAvatarError('Failed to upload image. Please try again.');
            setIsUploadingAvatar(false);
            return;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);

        // Update profile with avatar URL
        const { error: updateError } = await updateProfile({ avatar_url: publicUrl });

        if (updateError) {
            setAvatarError('Failed to update profile');
        }

        setIsUploadingAvatar(false);
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileError('');
        setProfileSuccess(false);
        setIsSavingProfile(true);

        const { error } = await updateProfile(profileData);

        if (error) {
            setProfileError('Failed to update profile');
        } else {
            setProfileSuccess(true);
            setTimeout(() => setProfileSuccess(false), 3000);
        }
        setIsSavingProfile(false);
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess(false);

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 8) {
            setPasswordError('Password must be at least 8 characters');
            return;
        }

        setIsSavingPassword(true);

        const supabase = getSupabaseClient();
        const { error } = await supabase.auth.updateUser({
            password: passwordData.newPassword
        });

        if (error) {
            setPasswordError(error.message || 'Failed to update password');
        } else {
            setPasswordSuccess(true);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => setPasswordSuccess(false), 3000);
        }
        setIsSavingPassword(false);
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== 'DELETE') return;

        setIsDeleting(true);

        // Note: Full account deletion requires admin key or server-side logic
        // For now, we'll sign out and show a message
        await signOut();

        // In production, you'd call a server action or API route that uses
        // the service role key to delete the user
    };

    const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
    const userInitial = displayName.charAt(0).toUpperCase();

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
                        <span className="text-[#222]">Settings</span>
                    </div>
                </div>
            </div>

            {/* Page Header */}
            <div className="bg-[#f5f2f2] py-8">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-3xl font-bold text-[#222]" style={{ fontFamily: 'var(--font-heading)' }}>
                        Account Settings
                    </h1>
                    <p className="text-[#777] mt-2">Manage your profile and preferences</p>
                </div>
            </div>

            <section className="section-padding">
                <div className="max-w-2xl mx-auto px-4 space-y-8">
                    {/* Profile Photo */}
                    <div className="bg-white border border-[#eee] p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Camera className="w-6 h-6 text-[var(--color-primary)]" />
                            <h2 className="text-lg font-semibold text-[#222]">Profile Photo</h2>
                        </div>

                        <div className="flex items-center gap-6">
                            {/* Avatar Display */}
                            <div className="relative">
                                {profile?.avatar_url ? (
                                    <Image
                                        src={profile.avatar_url}
                                        alt="Profile"
                                        width={96}
                                        height={96}
                                        className="w-24 h-24 rounded-full object-cover border-2 border-[#eee]"
                                    />
                                ) : (
                                    <div className="w-24 h-24 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center text-3xl font-medium">
                                        {userInitial}
                                    </div>
                                )}
                                {isUploadingAvatar && (
                                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                                    </div>
                                )}
                            </div>

                            <div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleAvatarUpload}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploadingAvatar}
                                    className="btn-outline text-sm disabled:opacity-50"
                                >
                                    {isUploadingAvatar ? 'Uploading...' : 'Change Photo'}
                                </button>
                                <p className="text-xs text-[#999] mt-2">JPG, PNG, or GIF. Max 2MB.</p>
                                {avatarError && (
                                    <p className="text-xs text-red-500 mt-1">{avatarError}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Profile Settings */}
                    <div className="bg-white border border-[#eee] p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <User className="w-6 h-6 text-[var(--color-primary)]" />
                            <h2 className="text-lg font-semibold text-[#222]">Profile Information</h2>
                        </div>

                        <form onSubmit={handleProfileSubmit} className="space-y-4">
                            {profileError && (
                                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm">
                                    {profileError}
                                </div>
                            )}
                            {profileSuccess && (
                                <div className="p-3 bg-green-50 border border-green-200 text-green-600 text-sm flex items-center gap-2">
                                    <CheckCircle size={16} />
                                    Profile updated successfully
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-[#222] mb-1">Email</label>
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    disabled
                                    className="w-full px-4 py-2 border border-[#ddd] bg-[#f9f9f9] text-[#777]"
                                />
                                <p className="text-xs text-[#999] mt-1">Email cannot be changed</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#222] mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={profileData.full_name}
                                    onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                                    className="w-full px-4 py-2 border border-[#ddd] focus:outline-none focus:border-[var(--color-primary)]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#222] mb-1">Phone</label>
                                <input
                                    type="tel"
                                    value={profileData.phone}
                                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                                    className="w-full px-4 py-2 border border-[#ddd] focus:outline-none focus:border-[var(--color-primary)]"
                                    placeholder="+91 XXXXX XXXXX"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSavingProfile}
                                className="btn-solid disabled:opacity-50"
                            >
                                {isSavingProfile ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    </div>

                    {/* Password Settings */}
                    <div className="bg-white border border-[#eee] p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Lock className="w-6 h-6 text-[var(--color-primary)]" />
                            <h2 className="text-lg font-semibold text-[#222]">Change Password</h2>
                        </div>

                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            {passwordError && (
                                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm">
                                    {passwordError}
                                </div>
                            )}
                            {passwordSuccess && (
                                <div className="p-3 bg-green-50 border border-green-200 text-green-600 text-sm flex items-center gap-2">
                                    <CheckCircle size={16} />
                                    Password updated successfully
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-[#222] mb-1">New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                    className="w-full px-4 py-2 border border-[#ddd] focus:outline-none focus:border-[var(--color-primary)]"
                                    placeholder="Minimum 8 characters"
                                    minLength={8}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#222] mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    className="w-full px-4 py-2 border border-[#ddd] focus:outline-none focus:border-[var(--color-primary)]"
                                    placeholder="Re-enter new password"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSavingPassword}
                                className="btn-solid disabled:opacity-50"
                            >
                                {isSavingPassword ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-white border border-red-200 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Trash2 className="w-6 h-6 text-red-500" />
                            <h2 className="text-lg font-semibold text-red-600">Danger Zone</h2>
                        </div>

                        <p className="text-sm text-[#777] mb-4">
                            Once you delete your account, there is no going back. Please be certain.
                        </p>

                        {!showDeleteConfirm ? (
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="px-4 py-2 border border-red-500 text-red-500 hover:bg-red-50 transition-colors text-sm"
                            >
                                Delete My Account
                            </button>
                        ) : (
                            <div className="p-4 bg-red-50 border border-red-200">
                                <p className="text-sm text-red-600 mb-4">
                                    Type <strong>DELETE</strong> to confirm account deletion:
                                </p>
                                <input
                                    type="text"
                                    value={deleteConfirmText}
                                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                                    className="w-full px-4 py-2 border border-red-300 focus:outline-none focus:border-red-500 mb-4"
                                    placeholder="Type DELETE"
                                />
                                <div className="flex gap-4">
                                    <button
                                        onClick={handleDeleteAccount}
                                        disabled={deleteConfirmText !== 'DELETE' || isDeleting}
                                        className="px-4 py-2 bg-red-500 text-white disabled:opacity-50 text-sm"
                                    >
                                        {isDeleting ? 'Deleting...' : 'Permanently Delete Account'}
                                    </button>
                                    <button
                                        onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(''); }}
                                        className="px-4 py-2 border border-[#ddd] text-[#777] text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}

export default function SettingsPage() {
    return (
        <AuthGuard>
            <SettingsContent />
        </AuthGuard>
    );
}
