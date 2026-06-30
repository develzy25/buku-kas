"use client";
import { useState } from "react";
import { deleteRekening } from "@/app/actions";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPiggyBank, faHandHoldingUsd } from "@fortawesome/free-solid-svg-icons";

export default function RekeningList({ initialData }: { initialData: { id: number; namaRekening: string; jenis: string }[] }) {
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleDelete = async (id: number, nama: string) => {
    const result = await Swal.fire({
      title: `Hapus ${nama}?`,
      text: "Jika rekening ini sudah memiliki transaksi, penghapusan akan ditolak.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      setLoadingId(id);
      try {
        const res = await deleteRekening(id);
        if (res.success) {
          Swal.fire('Terhapus!', 'Rekening berhasil dihapus.', 'success');
        } else {
          throw new Error(res.error);
        }
      } catch (err: unknown) {
        const error = err as Error;
        Swal.fire('Gagal', error.message || 'Gagal menghapus rekening', 'error');
      } finally {
        setLoadingId(null);
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col gap-1 p-2">
      {initialData.length === 0 ? (
        <p className="text-center p-4 text-gray-500 font-medium">Belum ada rekening.</p>
      ) : (
        initialData.map(r => (
          <div key={r.id} className="p-3 md:p-4 rounded-2xl border border-transparent hover:border-gray-100 flex justify-between items-center hover:bg-gray-50 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl shadow-inner flex items-center justify-center text-white text-lg ${r.jenis === 'Titipan' ? 'bg-linear-to-br from-purple-400 to-purple-500' : 'bg-linear-to-br from-orange-400 to-orange-500'}`}>
                <FontAwesomeIcon icon={r.jenis === 'Titipan' ? faPiggyBank : faHandHoldingUsd} />
              </div>
              <div>
                <p className="text-sm md:text-base font-bold text-gray-800">{r.namaRekening}</p>
                <p className="text-[10px] md:text-xs font-semibold text-gray-400 uppercase tracking-wide">{r.jenis}</p>
              </div>
            </div>
            
            <button 
              onClick={() => handleDelete(r.id, r.namaRekening)}
              disabled={loadingId === r.id || r.id === 1} // Jangan izinkan hapus rekening ID 1 (default)
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors
                ${r.id === 1 ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 
                  loadingId === r.id ? 'bg-gray-100 text-gray-400' : 'bg-red-50 text-red-500 hover:bg-red-100'}`}
              title={r.id === 1 ? 'Rekening Utama tidak bisa dihapus' : 'Hapus Rekening'}
            >
              <FontAwesomeIcon icon={faTrash} className="text-xs" />
            </button>
          </div>
        ))
      )}
    </div>
  );
}
