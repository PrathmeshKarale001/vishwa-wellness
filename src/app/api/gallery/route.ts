import { NextResponse } from 'next/server';
import type { CloudinaryAsset } from '@/lib/cloudinary';

const FOLDERS = [
    { name: 'Therapy Photos', type: 'image' as const },
    { name: 'Facility Photos', type: 'image' as const },
    { name: 'Vishwa Centre', type: 'image' as const },
    { name: 'Promotional Reels', type: 'video' as const },
];

async function fetchFolder(
    folder: string,
    resourceType: 'image' | 'video',
    cloud: string,
    apiKey: string,
    apiSecret: string,
): Promise<CloudinaryAsset[]> {
    const expression = `asset_folder="${folder}" AND resource_type:${resourceType}`;
    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloud}/resources/search`,
        {
            method: 'POST',
            headers: {
                Authorization: `Basic ${auth}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                expression,
                max_results: 80,
                sort_by: [{ created_at: 'desc' }],
            }),
            cache: 'no-store',
        },
    );

    if (!res.ok) {
        console.error(`[Gallery API] ${folder}: ${res.status}`);
        return [];
    }

    const data = await res.json();
    console.log(`[Gallery API] ✓ "${folder}" → ${data.total_count} total`);

    return (data.resources ?? []).map((r: any): CloudinaryAsset => {
        const isVideo = resourceType === 'video';
        return {
            public_id: r.public_id,
            secure_url: r.secure_url,
            resource_type: resourceType,
            format: r.format,
            width: r.width,
            height: r.height,
            bytes: r.bytes,
            created_at: r.created_at,
            optimizedUrl: isVideo
                ? `https://res.cloudinary.com/${cloud}/video/upload/q_auto:eco,vc_auto/${r.public_id}.mp4`
                : `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto/${r.public_id}`,
            thumbnailUrl: isVideo
                ? `https://res.cloudinary.com/${cloud}/video/upload/f_jpg,q_auto:good,w_640,so_0.5/${r.public_id}.jpg`
                : `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto:good,w_640/${r.public_id}`,
        };
    });
}

export async function GET() {
    const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? '';
    const apiKey = process.env.CLOUDINARY_API_KEY ?? '';
    const apiSecret = process.env.CLOUDINARY_API_SECRET ?? '';

    if (!cloud || !apiKey || !apiSecret) {
        return NextResponse.json({ error: 'Missing Cloudinary credentials' }, { status: 500 });
    }

    const [therapyPhotos, facilityPhotos, vishwaCentre, promoReels] = await Promise.all(
        FOLDERS.map((f) => fetchFolder(f.name, f.type, cloud, apiKey, apiSecret)),
    );

    return NextResponse.json(
        { therapyPhotos, facilityPhotos, vishwaCentre, promoReels },
        { headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate' } },
    );
}
