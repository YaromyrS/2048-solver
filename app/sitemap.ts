import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

// A single-page app: the start screen is the only URL worth indexing.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE_URL, changeFrequency: 'monthly', priority: 1 }];
}
