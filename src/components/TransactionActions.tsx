"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { deleteTransaction } from "@/app/actions";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function TransactionActions({ noTransaksi }: { noTransaksi: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Hapus Transaksi?',
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        const res = await deleteTransaction(noTransaksi);
        if (res.success) {
          Swal.fire({
            icon: 'success',
            title: 'Terhapus!',
            text: 'Transaksi berhasil dihapus.',
            timer: 1500,
            showConfirmButton: false
          });
        } else {
          throw new Error(res.error);
        }
      } catch (err: unknown) {
        const error = err as Error;
        Swal.fire('Gagal', error.message || 'Gagal menghapus transaksi', 'error');
      }
    }
  };

  const handleEdit = () => {
    router.push(`/transaction/edit/${noTransaksi}`);
  };

  return (
    <div className="flex flex-col md:flex-row gap-2 mt-2 md:mt-0 justify-end md:items-center">
      <button 
        onClick={handleEdit}
        className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 flex items-center justify-center transition-colors"
        title="Edit Transaksi"
      >
        <FontAwesomeIcon icon={faEdit} className="text-xs" />
      </button>
      <button 
        onClick={handleDelete}
        className="w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"
        title="Hapus Transaksi"
      >
        <FontAwesomeIcon icon={faTrash} className="text-xs" />
      </button>
    </div>
  );
}
