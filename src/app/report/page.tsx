export const runtime = 'edge';
import { getDb } from "@/db";
import { rekening, transaksi } from "@/db/schema";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPiggyBank } from "@fortawesome/free-solid-svg-icons/faPiggyBank";
import { faHandHoldingUsd } from "@fortawesome/free-solid-svg-icons/faHandHoldingUsd";
import { faWallet } from "@fortawesome/free-solid-svg-icons/faWallet";
import ExportButtons from "@/components/ExportButtonsDynamic";

export default async function ReportPage() {
  const rekenings = await getDb().select().from(rekening);
  const transaksis = await getDb().select().from(transaksi);

  // Calculate balances per rekening
  const rekeningBalances = rekenings.map(rek => {
    let balance = rek.saldoAwal;
    const trx = transaksis.filter(t => t.rekeningId === rek.id);
    
    if (rek.jenis === 'Titipan') {
      const masuk = trx.filter(t => t.tipe === 'Titipan').reduce((acc, curr) => acc + curr.nominal, 0);
      balance += masuk;
    } else if (rek.jenis === 'Piutang') {
      const pinjam = trx.filter(t => t.tipe === 'Pinjaman').reduce((acc, curr) => acc + curr.nominal, 0);
      const kembali = trx.filter(t => t.tipe === 'Pengembalian').reduce((acc, curr) => acc + curr.nominal, 0);
      balance = balance + pinjam - kembali;
    }
    
    return { ...rek, balance };
  });

  const totalAset = rekeningBalances.filter(r => r.jenis === 'Titipan').reduce((acc, curr) => acc + curr.balance, 0); 
  const totalPiutang = rekeningBalances.filter(r => r.jenis === 'Piutang').reduce((acc, curr) => acc + curr.balance, 0);
  
  const totalPemasukan = transaksis.filter(t => t.tipe === 'Pemasukan').reduce((acc, curr) => acc + curr.nominal, 0);
  const totalPengeluaran = transaksis.filter(t => t.tipe === 'Pengeluaran').reduce((acc, curr) => acc + curr.nominal, 0);
  const kasFisik = totalAset - totalPengeluaran - totalPiutang + totalPemasukan;
  
  const saldoBersih = kasFisik + totalPiutang;

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);
  };

  return (
    <main className="min-h-screen pb-24 md:p-8">
      <div className="bg-white/80 backdrop-blur-lg px-4 md:px-8 py-5 shadow-sm text-center md:text-left border-b border-gray-100 flex justify-between items-center md:rounded-t-3xl md:border-x md:border-gray-100 md:shadow-3d">
        <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">Laporan Rekening</h1>
      </div>
      
      <div className="p-4 md:px-8 md:py-6 md:bg-white md:border-x md:border-b md:border-gray-100 md:rounded-b-3xl md:shadow-3d space-y-6">
        
        {/* Export Buttons */}
        <div className="md:w-1/2">
          <ExportButtons data={rekeningBalances} />
        </div>

        <div className="md:grid md:grid-cols-2 md:gap-8">
          {/* Ringkasan */}
          <div>
            <h2 className="font-extrabold text-gray-800 text-sm mb-3 uppercase tracking-wider">Ringkasan</h2>
            <div className="glass-panel bg-linear-to-br from-gray-900 to-slate-800 rounded-3xl shadow-3d p-6 text-white relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"></div>
              
              <div className="flex justify-between items-end mb-6 relative z-10">
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest drop-shadow-md">Saldo Bersih</span>
                  <div className="text-3xl font-extrabold text-white mt-1 drop-shadow-lg">{formatRupiah(saldoBersih)}</div>
                </div>
                <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                   <FontAwesomeIcon icon={faWallet} className="text-blue-300" />
                </div>
              </div>
              
              <div className="space-y-3 relative z-10">
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <FontAwesomeIcon icon={faPiggyBank} className="text-xs text-purple-400" /> Total Titipan
                  </span>
                  <span className="text-sm font-bold text-white">{formatRupiah(totalAset)}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <FontAwesomeIcon icon={faHandHoldingUsd} className="text-xs text-orange-400" /> Piutang Aktif
                  </span>
                  <span className="text-sm font-bold text-white">{formatRupiah(totalPiutang)}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-sm font-bold text-green-400">Kas Fisik Tersedia</span>
                  <span className="text-sm font-extrabold text-green-400">{formatRupiah(kasFisik)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Daftar Rekening */}
          <div className="mt-8 md:mt-0">
            <h2 className="font-extrabold text-gray-800 text-sm mb-3 uppercase tracking-wider">Daftar Rekening</h2>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col gap-1 p-2">
              {rekeningBalances.map(r => (
                 <div key={r.id} className="p-3 md:p-4 rounded-2xl border border-transparent hover:border-gray-100 flex justify-between items-center hover:bg-gray-50 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300 cursor-default">
                   <div className="flex items-center gap-4">
                     <div className={`w-12 h-12 rounded-xl shadow-inner flex items-center justify-center text-white text-lg ${r.jenis === 'Titipan' ? 'bg-linear-to-br from-purple-400 to-purple-500' : 'bg-linear-to-br from-orange-400 to-orange-500'}`}>
                        <FontAwesomeIcon icon={r.jenis === 'Titipan' ? faPiggyBank : faHandHoldingUsd} />
                     </div>
                     <div>
                       <p className="text-base font-bold text-gray-800">{r.namaRekening}</p>
                       <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{r.jenis}</p>
                     </div>
                   </div>
                   <p className="text-base md:text-lg font-extrabold text-gray-800">
                     {formatRupiah(r.balance)}
                   </p>
                 </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
