import { db } from './index';
import { sql } from 'drizzle-orm';
import { rekening, kategori, transaksi, transfer } from './schema';

async function reset() {
  console.log('Clearing database...');
  await db.delete(transfer);
  await db.delete(transaksi);
  await db.delete(rekening);
  await db.delete(kategori);
  
  // Reset auto increment so IDs start from 1 again
  try {
    await db.run(sql`DELETE FROM sqlite_sequence`);
  } catch {
    // sqlite_sequence might not exist if no inserts ever happened
  }
  
  console.log("DB Cleared!");
}

reset().catch(console.error);
