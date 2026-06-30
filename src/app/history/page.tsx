import { db } from "@/db";
import { transaksi } from "@/db/schema";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp, faExchangeAlt, faFilter } from "@fortawesome/free-solid-svg-icons";
import { desc } from "drizzle-orm";
import TransactionActions from "@/components/TransactionActions";

export default async function HistoryPage() {
  const transaksis = await db.select().from(transaksi).orderBy(desc(transaksi.tanggal));

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const isIncome = (tipe: string) => ['Pemasukan', 'Titipan', 'Pengembalian'].includes(tipe);

  return (
    <main className="min-h-screen pb-24 md:p-8">
      <div className="bg-white/80 backdrop-blur-lg px-4 md:px-8 py-5 shadow-sm text-center md:text-left border-b border-gray-100 flex justify-between items-center md:rounded-t-3xl md:border-x md:border-gray-100 md:shadow-3d">
        <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">Riwayat Transaksi</h1>
        <button className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-100 hover:shadow-inner transition-all shadow-sm">
          <FontAwesomeIcon icon={faFilter} />
        </button>
      </div>
      
      <div className="p-4 md:px-8 md:py-6 md:bg-white md:border-x md:border-b md:border-gray-100 md:rounded-b-3xl md:shadow-3d">
        {transaksis.length === 0 ? (
          <div className="text-center bg-gray-50 rounded-2xl py-12 shadow-inner border border-gray-100">
            <p className="text-gray-400 font-semibold">Belum ada transaksi</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {transaksis.map((t) => {
               const income = isIncome(t.tipe);
               const isTransfer = t.tipe === 'Transfer';
               return (
                 <div key={t.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                   <div className="flex items-center gap-4">
                     <div className={`w-12 h-12 rounded-xl shadow-inner flex items-center justify-center text-white text-lg ${income ? 'bg-linear-to-br from-green-400 to-green-500' : isTransfer ? 'bg-linear-to-br from-blue-400 to-blue-500' : 'bg-linear-to-br from-red-400 to-red-500'}`}>
                        <FontAwesomeIcon icon={income ? faArrowDown : isTransfer ? faExchangeAlt : faArrowUp} />
                     </div>
                     <div>
                       <p className="text-base font-bold text-gray-800">{t.tipe}</p>
                       <p className="text-xs text-gray-500 font-medium">{t.keterangan || '-'}</p>
                       <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wide font-semibold">{formatDate(t.tanggal)}</p>
                     </div>
                   </div>
                   <div className="flex flex-col items-end gap-1">
                     <p className={`text-base md:text-lg font-extrabold tracking-tight ${income ? 'text-green-600' : isTransfer ? 'text-blue-600' : 'text-red-600'}`}>
                       {income ? '+' : isTransfer ? '' : '-'}{formatRupiah(t.nominal)}
                     </p>
                     <TransactionActions noTransaksi={t.noTransaksi} />
                   </div>
                 </div>
               );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
