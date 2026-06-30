import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').notNull().default('Admin'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const rekening = sqliteTable('rekening', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  namaRekening: text('nama_rekening').notNull(),
  jenis: text('jenis').notNull(), // 'Titipan', 'Piutang', 'Kas'
  saldoAwal: real('saldo_awal').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const kategori = sqliteTable('kategori', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  namaKategori: text('nama_kategori').notNull(),
  tipe: text('tipe').notNull(), // 'Pemasukan', 'Pengeluaran', 'Transfer'
  isDefault: integer('is_default', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const transaksi = sqliteTable('transaksi', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  noTransaksi: text('no_transaksi').notNull(),
  tanggal: integer('tanggal', { mode: 'timestamp' }).notNull(),
  rekeningId: integer('rekening_id').notNull().references(() => rekening.id),
  kategoriId: integer('kategori_id').notNull().references(() => kategori.id),
  nominal: real('nominal').notNull(),
  tipe: text('tipe').notNull(), // 'Pemasukan', 'Pengeluaran', 'Titipan', 'Pinjaman', 'Pengembalian'
  keterangan: text('keterangan'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const transfer = sqliteTable('transfer', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  noTransaksi: text('no_transaksi').notNull(),
  tanggal: integer('tanggal', { mode: 'timestamp' }).notNull(),
  dariRekeningId: integer('dari_rekening_id').notNull().references(() => rekening.id),
  keRekeningId: integer('ke_rekening_id').notNull().references(() => rekening.id),
  nominal: real('nominal').notNull(),
  keterangan: text('keterangan'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});
