import { db } from './index';
import { rekening, kategori, transaksi } from './schema';

async function main() {
  console.log('Seeding database...');
  // Seed Rekening
  await db.insert(rekening).values([
    { namaRekening: 'Titipan Bu Ismi', jenis: 'Titipan', saldoAwal: 2000000 },
    { namaRekening: 'Peminjaman Pak Hendri', jenis: 'Piutang', saldoAwal: 0 }
  ]);

  // Seed Kategori
  const kategoriData = [
    { namaKategori: 'Beli Toko Bangunan', tipe: 'Pengeluaran', isDefault: true },
    { namaKategori: 'Jajan', tipe: 'Pengeluaran', isDefault: true },
    { namaKategori: 'Makan', tipe: 'Pengeluaran', isDefault: true },
    { namaKategori: 'Rokok', tipe: 'Pengeluaran', isDefault: true },
    { namaKategori: 'Beli Pasir', tipe: 'Pengeluaran', isDefault: true },
    { namaKategori: 'Gaji Tukang', tipe: 'Pengeluaran', isDefault: true },
    { namaKategori: 'Gaji Laden Tukang', tipe: 'Pengeluaran', isDefault: true },
    { namaKategori: 'Lainnya', tipe: 'Pengeluaran', isDefault: true },
  ];

  await db.insert(kategori).values(kategoriData);
  
  // Seed Transaksi Dummy

  await db.insert(transaksi).values([
    {
      noTransaksi: 'TRX-1001',
      tanggal: new Date(new Date().setDate(new Date().getDate() - 5)),
      rekeningId: 1,
      kategoriId: 1, // Beli Toko Bangunan
      nominal: 500000,
      tipe: 'Pengeluaran',
      keterangan: 'Beli semen 10 sak'
    },
    {
      noTransaksi: 'TRX-1002',
      tanggal: new Date(new Date().setDate(new Date().getDate() - 3)),
      rekeningId: 2, // Pak Hendri
      kategoriId: 8, // Lainnya
      nominal: 200000,
      tipe: 'Pinjaman',
      keterangan: 'Pinjam kas'
    },
    {
      noTransaksi: 'TRX-1003',
      tanggal: new Date(new Date().setDate(new Date().getDate() - 1)),
      rekeningId: 1,
      kategoriId: 6, // Gaji Tukang
      nominal: 150000,
      tipe: 'Pengeluaran',
      keterangan: 'Gaji harian'
    }
  ]);
  
  console.log('Seeding completed!');
}

main().catch(console.error);
