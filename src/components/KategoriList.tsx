"use client";
import { useState } from "react";
import { toggleKategoriActive, deleteKategori } from "@/app/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/free-solid-svg-icons/faTag";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons/faTrashAlt";

export default function KategoriList({ kategoris }: { kategoris: { id: number; namaKategori: string; tipe: string; isDefault: boolean; isActive: boolean }[] }) {
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleToggle = async (id: number, currentStatus: boolean) => {
    setLoadingId(id);
    try {
      const res = await toggleKategoriActive(id, currentStatus);
      if (!res.success) {
        throw new Error(res.error);
      }
    } catch (err: unknown) {
      alert((err as Error).message);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus kategori ini?')) return;
    setLoadingId(id);
    try {
      const res = await deleteKategori(id);
      if (res?.success) {
        (await import('sweetalert2')).default.fire({
          icon: 'success',
          title: 'Terhapus',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        throw new Error(res?.error);
      }
    } catch (err: unknown) {
      (await import('sweetalert2')).default.fire({
        icon: 'error',
        title: 'Gagal',
        text: (err as Error).message,
      });
    } finally {
      setLoadingId(null);
    }
  };

  if (kategoris.length === 0) {
    return <div className="text-center text-gray-500 py-4">Belum ada kategori</div>;
  }

  return (
    <div className="space-y-3">
      {kategoris.map((kat) => (
        <div key={kat.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${kat.isActive ? 'bg-white border-gray-100 shadow-sm' : 'bg-gray-50 border-gray-200 opacity-60'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${kat.tipe === 'Pemasukan' ? 'bg-green-500' : kat.tipe === 'Pengeluaran' ? 'bg-red-500' : 'bg-blue-500'}`}>
              <FontAwesomeIcon icon={faTag} />
            </div>
            <div>
              <h3 className={`font-bold ${kat.isActive ? 'text-gray-800' : 'text-gray-500 line-through'}`}>
                {kat.namaKategori} {kat.isDefault && <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full ml-2">Bawaan</span>}
              </h3>
              <p className="text-xs text-gray-500 uppercase tracking-wider">{kat.tipe}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={kat.isActive}
                onChange={() => handleToggle(kat.id, kat.isActive)}
                disabled={loadingId === kat.id}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
            {!kat.isDefault && (
              <button 
                onClick={() => handleDelete(kat.id)}
                disabled={loadingId === kat.id}
                className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                title="Hapus"
              >
                <FontAwesomeIcon icon={faTrashAlt} className={loadingId === kat.id ? 'animate-spin' : ''} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
