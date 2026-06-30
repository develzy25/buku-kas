import { db } from "@/db";
import { rekening, transaksi } from "@/db/schema";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWallet, faPiggyBank, faHandHoldingUsd, faArrowUp, faArrowDown, faHistory } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default async function Dashboard() {
  const rekenings = await db.select().from(rekening);
  const transaksis = await db.select().from(transaksi);
  
  const titipanRekening = rekenings.filter(r => r.jenis === 'Titipan');
  const totalTitipanAwal = titipanRekening.reduce((acc, curr) => acc + curr.saldoAwal, 0);
  const totalTitipanMasuk = transaksis.filter(t => t.tipe === 'Titipan').reduce((acc, curr) => acc + curr.nominal, 0);
  const totalTitipan = totalTitipanAwal + totalTitipanMasuk;

  const piutangRekening = rekenings.filter(r => r.jenis === 'Piutang');
  const totalPiutangAwal = piutangRekening.reduce((acc, curr) => acc + curr.saldoAwal, 0);
  const totalPinjaman = transaksis.filter(t => t.tipe === 'Pinjaman').reduce((acc, curr) => acc + curr.nominal, 0);
  const totalPengembalian = transaksis.filter(t => t.tipe === 'Pengembalian').reduce((acc, curr) => acc + curr.nominal, 0);
  const totalPiutang = totalPiutangAwal + totalPinjaman - totalPengembalian;

  const totalPemasukan = transaksis.filter(t => t.tipe === 'Pemasukan').reduce((acc, curr) => acc + curr.nominal, 0);
  const totalPengeluaran = transaksis.filter(t => t.tipe === 'Pengeluaran').reduce((acc, curr) => acc + curr.nominal, 0);
  
  const kasFisik = totalTitipan - totalPengeluaran - totalPiutang + totalPemasukan;
  const saldoBersih = kasFisik + totalPiutang;

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);
  };

  const isIncome = (tipe: string) => ['Pemasukan', 'Titipan', 'Pengembalian'].includes(tipe);

  return (
    <main className="min-h-screen pb-20 md:p-4">
      {/* Mobile Top Header (Hidden on PC) */}
      <div className="md:hidden flex justify-between items-center px-4 pt-4 pb-2 bg-gray-50">
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">Kas<span className="text-yellow-500">SD</span></h1>
        <div className="w-8 h-8 rounded-xl bg-gradient-gold shadow-sm flex items-center justify-center text-white font-bold">M</div>
      </div>

      <div className="md:grid md:grid-cols-12 md:gap-4 max-w-5xl mx-auto">
        {/* Left Column (Cards) */}
        <div className="md:col-span-12 lg:col-span-7 flex flex-col gap-4 px-4 md:px-0">
          
          {/* Main 3D Card */}
          <div className="bg-gradient-gold p-6 md:p-6 rounded-3xl shadow-3d text-white relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/20 rounded-full blur-2xl group-hover:bg-white/30 transition-all duration-700"></div>
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-yellow-600/30 rounded-full blur-xl"></div>
            
            <div className="relative z-10 text-center md:text-left flex flex-col md:flex-row md:justify-between md:items-end">
              <div>
                <p className="text-xs md:text-sm font-semibold opacity-90 uppercase tracking-widest mb-1 shadow-sm">Total Kas Fisik</p>
                <h2 className="text-4xl md:text-4xl font-extrabold tracking-tight drop-shadow-md">{formatRupiah(kasFisik)}</h2>
              </div>
              <div className="hidden md:flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-md rounded-2xl shadow-inner border border-white/30">
                <FontAwesomeIcon icon={faWallet} className="text-lg" />
              </div>
            </div>
            
            <div className="flex justify-between mt-6 md:mt-8 pt-4 border-t border-white/20 relative z-10">
              <div className="text-center md:text-left flex-1">
                <div className="flex items-center justify-center md:justify-start gap-2 opacity-90 mb-1">
                  <FontAwesomeIcon icon={faPiggyBank} className="text-sm" />
                  <p className="text-xs font-semibold uppercase tracking-wide">Titipan</p>
                </div>
                <p className="text-lg md:text-xl font-bold drop-shadow-sm">{formatRupiah(totalTitipan)}</p>
              </div>
              <div className="w-px h-10 bg-white/30 mx-4"></div>
              <div className="text-center md:text-left flex-1">
                <div className="flex items-center justify-center md:justify-start gap-2 opacity-90 mb-1">
                  <FontAwesomeIcon icon={faHandHoldingUsd} className="text-sm" />
                  <p className="text-xs font-semibold uppercase tracking-wide">Piutang</p>
                </div>
                <p className="text-lg md:text-xl font-bold drop-shadow-sm">{formatRupiah(totalPiutang)}</p>
              </div>
            </div>
          </div>

          {/* Saldo Bersih Mini Card */}
          <div className="glass-panel rounded-2xl p-4 md:p-5 flex justify-between items-center shadow-3d-button hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-blue text-white flex items-center justify-center text-xl shadow-inner">
                <FontAwesomeIcon icon={faWallet} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Saldo Bersih (Aset)</p>
                <p className="text-lg font-extrabold text-gray-800">{formatRupiah(saldoBersih)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (History) */}
        <div className="md:col-span-12 lg:col-span-5 mt-6 md:mt-0 px-4 md:px-0">
          <div className="flex justify-between items-end mb-3">
            <h3 className="font-extrabold text-gray-800 text-base md:text-lg tracking-tight">Riwayat Terbaru</h3>
            <Link href="/history" className="text-[10px] md:text-xs text-yellow-600 font-bold hover:underline bg-yellow-50 px-3 py-1 rounded-full">Lihat Semua</Link>
          </div>
          
          {transaksis.length === 0 ? (
            <div className="text-center py-8 glass-panel rounded-3xl flex flex-col items-center justify-center shadow-sm">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-3d-button flex items-center justify-center text-gray-300 text-2xl mb-3">
                <FontAwesomeIcon icon={faHistory} />
              </div>
              <p className="text-gray-500 font-semibold text-sm">Belum ada transaksi</p>
              <p className="text-gray-400 text-xs mt-1 px-8">Mulai catat transaksi pertama Anda dengan tombol +</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col gap-1 p-2">
              {transaksis.slice(0, 5).map((t, idx) => {
                 const income = isIncome(t.tipe);
                 return (
                   <div key={idx} className="p-3 md:p-4 rounded-2xl flex justify-between items-center hover:bg-gray-50 transition-all cursor-default">
                     <div className="flex items-center gap-4">
                       <div className={`w-10 h-10 rounded-xl shadow-inner flex items-center justify-center text-white text-sm ${income ? 'bg-linear-to-br from-green-400 to-green-500' : 'bg-linear-to-br from-red-400 to-red-500'}`}>
                          <FontAwesomeIcon icon={income ? faArrowDown : faArrowUp} />
                       </div>
                       <div>
                         <p className="text-sm font-bold text-gray-800">{t.tipe}</p>
                         <p className="text-[10px] md:text-xs text-gray-500 font-medium">{t.keterangan || '-'}</p>
                       </div>
                     </div>
                     <p className={`text-sm md:text-base font-extrabold ${income ? 'text-green-600' : 'text-red-600'}`}>
                       {income ? '+' : '-'}{formatRupiah(t.nominal)}
                     </p>
                   </div>
                 );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
