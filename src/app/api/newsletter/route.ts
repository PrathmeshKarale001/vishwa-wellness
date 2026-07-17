import { NextRequest, NextResponse } from 'next/server';
import { newsletterSchema } from '@/lib/validations/contact';
import { sendNewsletterConfirmationEmail } from '@/lib/email';
import { createAdminSupabaseClient } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate email
        const result = newsletterSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: 'Please enter a valid email address' },
                { status: 400 }
            );
        }

        const { email } = result.data;

        // Store subscriber in Supabase (upsert to avoid duplicates)
        try {
            const supabase = createAdminSupabaseClient();
            const { error: dbError } = await supabase
                .from('newsletter_subscribers')
                .upsert(
                    { email: email.toLowerCase(), subscribed_at: new Date().toISOString() },
                    { onConflict: 'email' }
                );

            if (dbError) {
                // Log but don't fail — the table might not exist yet
                console.warn('[newsletter] Failed to store subscriber in DB:', dbError.message);
            }
        } catch (dbErr) {
            // DB storage is optional — continue to send email even if it fails
            console.warn('[newsletter] DB storage skipped:', dbErr);
        }

        // Send confirmation email to subscriber + notify CRM
        const emailResult = await sendNewsletterConfirmationEmail(email);

        if (!emailResult.success) {
            console.error('[newsletter] Failed to send confirmation email:', emailResult.error);
            return NextResponse.json(
                { error: 'Failed to send confirmation email. Please try again.' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('[newsletter] Unexpected error:', error);
        return NextResponse.json(
            { error: 'Something went wrong. Please try again.' },
            { status: 500 }
        );
    }
}
