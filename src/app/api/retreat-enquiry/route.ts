import { NextRequest, NextResponse } from 'next/server';
import { retreatEnquirySchema } from '@/lib/validations/contact';
import { sendRetreatEnquiryEmails } from '@/lib/email';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const result = retreatEnquirySchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: 'Invalid form data', details: result.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        // Retreat identity comes from the page, not the validated form fields
        const retreatTitle = typeof body.retreatTitle === 'string' ? body.retreatTitle : 'Agnihotra Wellness Retreat';
        const retreatSlug = typeof body.retreatSlug === 'string' ? body.retreatSlug : '';

        const emailResult = await sendRetreatEnquiryEmails({
            ...result.data,
            retreatTitle,
            retreatSlug,
        });

        if (!emailResult.success) {
            console.error('[retreat-enquiry] Failed to send enquiry email:', emailResult.error);
            return NextResponse.json(
                { error: 'Failed to send your enquiry. Please try again.' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, emailId: emailResult.emailId });

    } catch (error) {
        console.error('[retreat-enquiry] Unexpected error:', error);
        return NextResponse.json(
            { error: 'Something went wrong. Please try again.' },
            { status: 500 }
        );
    }
}
