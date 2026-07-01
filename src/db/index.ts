import { drizzle } from 'drizzle-orm/d1';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import * as schema from './schema';

// Helper untuk mendapatkan instance D1 dari request context
// Catatan: Ini hanya berfungsi di Edge Runtime (Cloudflare Pages atau fungsi Server Actions dengan runtime = 'edge')
export function getDb() {
  const ctx = getCloudflareContext();
  if (!ctx || !ctx.env || !ctx.env.DB) {
    throw new Error('Database binding (DB) tidak ditemukan di Request Context! Pastikan binding DB ada di wrangler.toml');
  }
  return drizzle(ctx.env.DB, { schema });
}
