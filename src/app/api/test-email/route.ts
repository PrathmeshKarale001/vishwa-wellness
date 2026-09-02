import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { to } = body;

        if (!to) {
            return NextResponse.json(
                { error: 'Missing "to" email address in request body' },
                { status: 400 }
            );
        }

        if (!process.env.RESEND_API_KEY) {
            return NextResponse.json(
                { error: 'RESEND_API_KEY not configured' },
                { status: 503 }
            );
        }

        const resend = new Resend(process.env.RESEND_API_KEY);

        const { data, error } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'Vishwa Wellness <noreply@vishwawellness.com>',
            to,
            subject: '✅ Vishwa Wellness - Email Test Successful',
            html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: #1a1a2e; padding: 24px 32px; text-align: center;">
                        <h1 style="color: #ffffff; font-size: 22px; margin: 0; letter-spacing: 2px;">VISHWA WELLNESS</h1>
                        <p style="color: #d4a574; font-size: 13px; margin: 8px 0 0; font-style: italic;">Email Service Test</p>
                    </div>
                    <div style="padding: 32px; background: #ffffff;">
                        <h2 style="color: #222; font-size: 20px; margin: 0 0 16px;">🎉 Email Delivery Confirmed!</h2>
                        <p style="color: #555; font-size: 16px; line-height: 24px;">
                            This is a test email from <strong>Vishwa Wellness</strong>. If you're reading this, the Resend email integration is working correctly.
                        </p>
                        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 24px 0;">
                            <p style="color: #166534; font-size: 14px; margin: 0;">
                                <strong>✓ API Key:</strong> Valid<br/>
                                <strong>✓ Email Delivery:</strong> Successful<br/>
                                <strong>✓ Template Rendering:</strong> Working<br/>
                                <strong>✓ Timestamp:</strong> ${new Date().toISOString()}
                            </p>
                        </div>
                        <p style="color: #777; font-size: 14px; line-height: 22px;">
                            Your contact form emails and order confirmation emails are now ready to send.
                        </p>
                    </div>
                    <div style="padding: 16px 32px; background: #f5f2f2; text-align: center;">
                        <p style="color: #999; font-size: 12px; margin: 0;">This is a test email from vishwawellness.com</p>
                    </div>
                </div>
            `,
        });

        if (error) {
            console.error('[test-email] Failed to send test email:', error);
            return NextResponse.json(
                { error: 'Failed to send test email', details: error },
                { status: 500 }
            );
        }

        console.log(`[test-email] Test email sent successfully: ${data?.id}`);
        return NextResponse.json({
            success: true,
            message: 'Test email sent successfully!',
            emailId: data?.id,
            sentTo: to,
        });

    } catch (error) {
        console.error('[test-email] Unexpected error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
