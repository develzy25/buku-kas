export const dynamic = 'force-dynamic';

import { getDb } from "@/db";
import { kategori } from "@/db/schema";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTags } from "@fortawesome/free-solid-svg-icons/faTags";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import KategoriForm from "@/components/KategoriForm";
import KategoriList from "@/components/KategoriList";

export default async function KategoriPage() {
  const kategoris = await getDb().select().from(kategori);

  return (
    <main className="min-h-screen pb-24 md:p-4 bg-gray-50">
      <div className="bg-white/80 backdrop-blur-lg px-4 md:px-8 py-5 shadow-sm border-b border-gray-100 flex justify-between items-center md:rounded-t-3xl md:border-x md:border-gray-100 md:shadow-3d max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-green-500 to-green-600 text-white flex items-center justify-center shadow-inner">
            <FontAwesomeIcon icon={faTags} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">Kategori</h1>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">Manajemen Kategori</p>
          </div>
        </div>
      </div>
      
      <div className="p-4 md:px-8 md:py-8 md:bg-white md:border-x md:border-b md:border-gray-100 md:rounded-b-3xl md:shadow-3d max-w-5xl mx-auto space-y-6">
        
        {/* Form Tambah Kategori */}
        <div className="glass-panel bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-sm font-extrabold text-gray-800 uppercase tracking-widest mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faPlus} className="text-green-500" /> Tambah Kategori Baru
          </h2>
          <KategoriForm />
        </div>

        {/* Daftar Kategori */}
        <div className="glass-panel bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-sm font-extrabold text-gray-800 uppercase tracking-widest mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faTags} className="text-green-500" /> Daftar Kategori
          </h2>
          <KategoriList kategoris={kategoris} />
        </div>

      </div>
    </main>
  );
}
