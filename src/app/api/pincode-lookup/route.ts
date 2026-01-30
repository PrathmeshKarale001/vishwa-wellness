import { NextRequest, NextResponse } from 'next/server';
import { cacheGetOrSet, CacheKeys, CacheTTL } from '@/lib/redis';

interface PincodeData {
    Name: string;
    Description: string | null;
    BranchType: string;
    DeliveryStatus: string;
    Circle: string;
    District: string;
    Division: string;
    Region: string;
    Block: string;
    State: string;
    Country: string;
    Pincode: string;
}

interface PincodeAPIResponse {
    Message: string;
    Status: string;
    PostOffice: PincodeData[] | null;
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const pincode = searchParams.get('pincode');

        // Validate pincode
        if (!pincode) {
            return NextResponse.json(
                { error: 'PIN code is required' },
                { status: 400 }
            );
        }

        // Validate pincode format (6 digits)
        if (!/^\d{6}$/.test(pincode)) {
            return NextResponse.json(
                { error: 'PIN code must be exactly 6 digits' },
                { status: 400 }
            );
        }

        // Try to get from cache or fetch
        const cachedResult = await cacheGetOrSet(
            CacheKeys.api.pincode(pincode),
            async () => {
                // Fetch from postpincode.in API
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

                const response = await fetch(
                    `https://api.postalpincode.in/pincode/${pincode}`,
                    {
                        signal: controller.signal,
                        headers: {
                            'Accept': 'application/json',
                        },
                    }
                );

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`API responded with status: ${response.status}`);
                }

                const data: PincodeAPIResponse[] = await response.json();

                // Check if data is valid
                if (!data || data.length === 0) {
                    throw new Error('Invalid response from PIN code service');
                }

                const result = data[0];

                // Check if PIN code was found
                if (result.Status !== 'Success' || !result.PostOffice || result.PostOffice.length === 0) {
                    throw new Error('Invalid PIN code');
                }

                // Get the first post office data (usually the main one)
                const postOffice = result.PostOffice[0];

                // Return structured data to be cached
                return {
                    success: true,
                    data: {
                        pincode: postOffice.Pincode,
                        city: postOffice.District,
                        state: postOffice.State,
                        district: postOffice.District,
                        region: postOffice.Region,
                        country: postOffice.Country,
                    },
                };
            },
            { ttl: CacheTTL.EXTRA_LONG } // Cache for 24 hours
        );

        // Return the cached or fresh result
        return NextResponse.json(cachedResult);

    } catch (error) {
        // Handle timeout
        if (error instanceof Error && error.name === 'AbortError') {
            return NextResponse.json(
                { error: 'Request timed out. Please try again.' },
                { status: 504 }
            );
        }

        // Handle invalid PIN code
        if (error instanceof Error && error.message === 'Invalid PIN code') {
            return NextResponse.json(
                { error: 'Invalid PIN code. Please check and try again.' },
                { status: 404 }
            );
        }

        console.error('[pincode-lookup] Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch PIN code details. Please enter manually.' },
            { status: 500 }
        );
    }
}
