CREATE TABLE `kategori` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nama_kategori` text NOT NULL,
	`tipe` text NOT NULL,
	`is_default` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `rekening` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nama_rekening` text NOT NULL,
	`jenis` text NOT NULL,
	`saldo_awal` real DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `transaksi` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`no_transaksi` text NOT NULL,
	`tanggal` integer NOT NULL,
	`rekening_id` integer NOT NULL,
	`kategori_id` integer NOT NULL,
	`nominal` real NOT NULL,
	`tipe` text NOT NULL,
	`keterangan` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`rekening_id`) REFERENCES `rekening`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`kategori_id`) REFERENCES `kategori`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `transfer` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`no_transaksi` text NOT NULL,
	`tanggal` integer NOT NULL,
	`dari_rekening_id` integer NOT NULL,
	`ke_rekening_id` integer NOT NULL,
	`nominal` real NOT NULL,
	`keterangan` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`dari_rekening_id`) REFERENCES `rekening`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`ke_rekening_id`) REFERENCES `rekening`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL,
	`role` text DEFAULT 'Admin' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);