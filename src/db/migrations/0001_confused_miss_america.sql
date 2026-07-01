ALTER TABLE `kategori` ADD `is_active` integer DEFAULT true NOT NULL;--> statement-breakpoint
INSERT INTO kategori (nama_kategori, tipe, is_default, is_active, created_at) VALUES 
('Lain-lain', 'Transfer', 1, 1, strftime('%s','now')*1000),
('BOS', 'Pemasukan', 1, 1, strftime('%s','now')*1000),
('Sumbangan', 'Pemasukan', 1, 1, strftime('%s','now')*1000),
('Lainnya', 'Pemasukan', 1, 1, strftime('%s','now')*1000),
('ATK', 'Pengeluaran', 1, 1, strftime('%s','now')*1000),
('Konsumsi', 'Pengeluaran', 1, 1, strftime('%s','now')*1000),
('Transportasi', 'Pengeluaran', 1, 1, strftime('%s','now')*1000),
('Honor', 'Pengeluaran', 1, 1, strftime('%s','now')*1000),
('Lainnya', 'Pengeluaran', 1, 1, strftime('%s','now')*1000);
