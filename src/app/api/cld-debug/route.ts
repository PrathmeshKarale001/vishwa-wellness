import { NextResponse } from 'next/server';

export async function GET() {
    const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const API_KEY = process.env.CLOUDINARY_API_KEY;
    const API_SECRET = process.env.CLOUDINARY_API_SECRET;

    if (!CLOUD || !API_KEY || !API_SECRET) {
        return NextResponse.json({
            error: 'Missing env vars',
            CLOUD: CLOUD ?? 'MISSING',
            API_KEY: API_KEY ? `${API_KEY.slice(0, 5)}...` : 'MISSING',
            API_SECRET: API_SECRET ? `${API_SECRET.slice(0, 5)}...` : 'MISSING',
        });
    }

    const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');
    const folders = [
        { name: 'Therapy Photos', type: 'image' },
        { name: 'Facility Photos', type: 'image' },
        { name: 'Vishwa Centre', type: 'image' },
        { name: 'Promotional Reels', type: 'video' },
    ];

    const results: Record<string, any> = {};

    for (const { name, type } of folders) {
        const expression = `asset_folder="${name}" AND resource_type:${type}`;
        try {
            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD}/resources/search`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Basic ${auth}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ expression, max_results: 5 }),
                    cache: 'no-store',
                },
            );
            const data = await res.json();
            results[name] = {
                status: res.status,
                total_count: data.total_count ?? 0,
                sample_id: data.resources?.[0]?.public_id ?? null,
                sample_asset_folder: data.resources?.[0]?.asset_folder ?? '(not returned)',
                error: data.error ?? null,
            };
        } catch (e: any) {
            results[name] = { error: e.message };
        }
    }

    return NextResponse.json({ cloud: CLOUD, apiKey: `${API_KEY.slice(0,5)}...`, results });
}
