export const runtime = 'edge';
import { getDb } from "@/db";
import { rekening } from "@/db/schema";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { faBuilding } from "@fortawesome/free-solid-svg-icons/faBuilding";
import RekeningForm from "@/components/RekeningForm";
import RekeningList from "@/components/RekeningList"; // refresh imports

export const dynamic = 'force-dynamic';

export default async function RekeningPage() {
  const rekenings = await getDb().select().from(rekening);

  return (
    <main className="min-h-screen pb-24 md:p-4 bg-gray-50">
      <div className="bg-white/80 backdrop-blur-lg px-4 md:px-8 py-5 shadow-sm border-b border-gray-100 flex justify-between items-center md:rounded-t-3xl md:border-x md:border-gray-100 md:shadow-3d max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-inner">
            <FontAwesomeIcon icon={faBuilding} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">Pengaturan Rekening</h1>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">Kelola Dompet & Kas</p>
          </div>
        </div>
      </div>
      
      <div className="p-4 md:px-8 md:py-8 md:bg-white md:border-x md:border-b md:border-gray-100 md:rounded-b-3xl md:shadow-3d max-w-5xl mx-auto space-y-6">
        
        {/* Form Tambah Rekening (Client Component) */}
        <div className="glass-panel bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-sm font-extrabold text-gray-800 uppercase tracking-widest mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faPlus} className="text-blue-500" /> Tambah Rekening Baru
          </h2>
          <RekeningForm />
        </div>

        {/* Daftar Rekening */}
        <div>
          <h2 className="text-sm font-extrabold text-gray-800 uppercase tracking-widest mb-4 mt-8">Daftar Rekening Saat Ini</h2>
          <RekeningList initialData={rekenings} />
        </div>

      </div>
    </main>
  );
}
