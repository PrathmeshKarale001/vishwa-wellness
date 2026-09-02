import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { contactFormSchema } from '@/lib/validations/contact';

// Lazy initialize Resend
let resend: Resend | null = null;

function getResendClient(): Resend | null {
    if (!process.env.RESEND_API_KEY) {
        return null;
    }
    if (!resend) {
        resend = new Resend(process.env.RESEND_API_KEY);
    }
    return resend;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate form data
        const result = contactFormSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: 'Invalid form data', details: result.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { name, email, phone, interest, retreat, message } = result.data;

        const resendClient = getResendClient();

        if (!resendClient) {
            console.warn('[contact] RESEND_API_KEY not configured - skipping email');
            return NextResponse.json(
                { error: 'Email service not configured' },
                { status: 503 }
            );
        }

        // Build the email body
        const interestLabels: Record<string, string> = {
            products: 'Product Purchase',
            retreat: 'Retreat Booking',
            consultation: 'Wellness Consultation',
            wholesale: 'Wholesale / Business',
            other: 'Other Inquiry',
        };

        const retreatLabels: Record<string, string> = {
            '3-day': '3-Day Pain & Stress Reset — ₹45,000',
            '7-day': '7-Day Detox & Metabolic Reset — ₹95,000',
            '15-day': '15-Day Advanced Rejuvenation — ₹1,85,000',
        };

        const { data, error } = await resendClient.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'Vishwa Wellness <noreply@vishwawellness.com>',
            to: 'CRM@VISHWAGLOBAL.COM',
            replyTo: email,
            subject: `New Contact Form: ${interest ? (interestLabels[interest] || interest) : 'General Inquiry'} — ${name}`,
            html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: #1a1a2e; padding: 24px 32px; text-align: center;">
                        <h1 style="color: #ffffff; font-size: 22px; margin: 0; letter-spacing: 2px;">VISHWA WELLNESS</h1>
                        <p style="color: #d4a574; font-size: 13px; margin: 8px 0 0; font-style: italic;">New Contact Form Submission</p>
                    </div>
                    <div style="padding: 32px; background: #ffffff;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #777; width: 140px; vertical-align: top;">Name</td>
                                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #222; font-weight: 500;">${name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #777; vertical-align: top;">Email</td>
                                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #222;"><a href="mailto:${email}" style="color: #C73C2E;">${email}</a></td>
                            </tr>
                            ${phone ? `
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #777; vertical-align: top;">Phone</td>
                                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #222;"><a href="tel:${phone}" style="color: #C73C2E;">${phone}</a></td>
                            </tr>` : ''}
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #777; vertical-align: top;">Interest</td>
                                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #222; font-weight: 500;">${interest ? (interestLabels[interest] || interest) : 'General Inquiry'}</td>
                            </tr>
                            ${retreat ? `
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #777; vertical-align: top;">Preferred Retreat</td>
                                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #222;">${retreatLabels[retreat] || retreat}</td>
                            </tr>` : ''}
                            <tr>
                                <td style="padding: 12px 0; color: #777; vertical-align: top;">Message</td>
                                <td style="padding: 12px 0; color: #222; white-space: pre-wrap;">${message}</td>
                            </tr>
                        </table>
                    </div>
                    <div style="padding: 16px 32px; background: #f5f2f2; text-align: center;">
                        <p style="color: #999; font-size: 12px; margin: 0;">Sent from vishwawellness.com contact form</p>
                    </div>
                </div>
            `,
        });

        if (error) {
            console.error('[contact] Failed to send contact form email:', error);
            return NextResponse.json(
                { error: 'Failed to send message' },
                { status: 500 }
            );
        }

        console.log(`[contact] Contact form email sent successfully: ${data?.id}`);
        return NextResponse.json({ success: true, emailId: data?.id });

    } catch (error) {
        console.error('[contact] Unexpected error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
