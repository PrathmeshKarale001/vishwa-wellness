// Cloudinary Admin API utility — server-only
// Fetches assets from a folder using the Resources API with HTTP Basic Auth

export interface CloudinaryAsset {
    public_id: string;
    secure_url: string;
    resource_type: 'image' | 'video';
    format: string;
    width?: number;
    height?: number;
    bytes: number;
    created_at: string;
    // Derived helpers
    thumbnailUrl: string;
    optimizedUrl: string;
}

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? 'dlxfsjx9t';
const API_KEY = process.env.CLOUDINARY_API_KEY ?? '';
const API_SECRET = process.env.CLOUDINARY_API_SECRET ?? '';

function basicAuth() {
    return Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');
}

/**
 * Lists all resources inside a Cloudinary folder (prefix-based).
 * Uses ISR — revalidates every hour.
 */
async function fetchFolder(
    folder: string,
    resourceType: 'image' | 'video',
    maxResults = 50,
): Promise<CloudinaryAsset[]> {
    const API_KEY = process.env.CLOUDINARY_API_KEY ?? '';
    const API_SECRET = process.env.CLOUDINARY_API_SECRET ?? '';
    const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? CLOUD;

    if (!API_KEY || !API_SECRET) {
        console.error('[Cloudinary] Missing API credentials in environment variables');
        return [];
    }

    // Use Search API with asset_folder expression (works for both dynamic & fixed folder modes)
    // asset_folder is the metadata field Cloudinary sets when you move assets into folder via the UI
    const expression = `asset_folder="${folder}" AND resource_type:${resourceType}`;
    const searchUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/search`;

    const body = JSON.stringify({
        expression,
        max_results: maxResults,
        with_field: ['asset_folder', 'context'],
        sort_by: [{ created_at: 'desc' }],
    });

    try {
        const res = await fetch(searchUrl, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64')}`,
                'Content-Type': 'application/json',
            },
            body,
            next: { revalidate: 3600 },
        });

        if (!res.ok) {
            const errorBody = await res.text();
            console.error(`[Cloudinary] Search "${folder}": ${res.status}`, errorBody);
            return [];
        }

        const data = await res.json();
        console.log(`[Cloudinary] ✓ "${folder}" → ${data.total_count ?? 0} assets (returned: ${data.resources?.length ?? 0})`);

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
                    ? `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/q_auto:eco,vc_auto/${r.public_id}.mp4`
                    : `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto/${r.public_id}`,
                thumbnailUrl: isVideo
                    ? `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/f_jpg,q_auto:good,w_640,so_0.5/${r.public_id}.jpg`
                    : `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto:good,w_640/${r.public_id}`,
            };
        });
    } catch (err) {
        console.error(`[Cloudinary] Failed to fetch "${folder}":`, err);
        return [];
    }
}



export async function fetchGalleryAssets() {
    const [therapyPhotos, facilityPhotos, vishwaCentre, promoReels] = await Promise.all([
        fetchFolder('Therapy Photos', 'image'),
        fetchFolder('Facility Photos', 'image'),
        fetchFolder('Vishwa Centre', 'image'),
        fetchFolder('Promotional Reels', 'video'),
    ]);

    return { therapyPhotos, facilityPhotos, vishwaCentre, promoReels };
}
