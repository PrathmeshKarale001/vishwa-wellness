// YouTube RSS Feed utility — no API key required
// Channel: @VishwaWellness — UCJ9g4NiOLQKKp8NxL2BUmQw

export interface YouTubeVideo {
  videoId: string;
  title: string;
  published: string; // ISO date string
  thumbnail: string;
  url: string;
}

const CHANNEL_ID = 'UCJ9g4NiOLQKKp8NxL2BUmQw';
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

/**
 * Fetches the latest YouTube videos from the Vishwa Wellness channel via RSS.
 * Revalidates every hour (ISR) — no API key needed.
 */
export async function fetchLatestYouTubeVideos(count = 3): Promise<YouTubeVideo[]> {
  try {
    const res = await fetch(RSS_URL, {
      next: { revalidate: 3600 }, // ISR: revalidate every hour
    });

    if (!res.ok) {
      console.error('[YouTube RSS] Failed to fetch:', res.status);
      return [];
    }

    const xml = await res.text();

    // Extract <entry> blocks
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    const videos: YouTubeVideo[] = [];
    let match;

    while ((match = entryRegex.exec(xml)) !== null && videos.length < count) {
      const entry = match[1];

      // Extract video ID
      const videoIdMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
      const videoId = videoIdMatch?.[1] ?? '';

      // Extract title (unescape basic HTML entities)
      const titleMatch = entry.match(/<title>([^<]+)<\/title>/);
      const title = (titleMatch?.[1] ?? '')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");

      // Extract published date
      const publishedMatch = entry.match(/<published>([^<]+)<\/published>/);
      const published = publishedMatch?.[1] ?? '';

      if (videoId && title) {
        videos.push({
          videoId,
          title,
          published,
          thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          url: `https://www.youtube.com/watch?v=${videoId}`,
        });
      }
    }

    return videos;
  } catch (err) {
    console.error('[YouTube RSS] Error:', err);
    return [];
  }
}

/**
 * Formats a published date string into a human-readable format.
 * e.g. "March 15, 2025"
 */
export function formatVideoDate(isoDate: string): string {
  if (!isoDate) return '';
  try {
    return new Date(isoDate).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}
