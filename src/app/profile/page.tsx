"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons/faCog";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons/faQuestionCircle";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { faShieldAlt } from "@fortawesome/free-solid-svg-icons/faShieldAlt";
import Link from "next/link";
import { resetAllData } from "@/app/actions";
import { useRouter } from "next/navigation";
import ModernButton from "@/components/ui/ModernButton";

export default function ProfilePage() {
  const router = useRouter();

  const handleReset = async () => {
    const result = await (await import('sweetalert2')).default.fire({
      title: 'Hapus Seluruh Data?',
      text: "PERINGATAN: Semua riwayat transaksi akan dihapus secara permanen. Rekening tidak akan dihapus. Anda yakin?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Reset Semua!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        const res = await resetAllData();
        if (res.success) {
          (await import('sweetalert2')).default.fire('Berhasil!', 'Semua transaksi telah dihapus.', 'success').then(() => {
            router.push('/');
          });
        } else {
          throw new Error(res.error);
        }
      } catch (err: unknown) {
        const error = err as Error;
        (await import('sweetalert2')).default.fire('Gagal', error.message || 'Terjadi kesalahan saat menghapus data.', 'error');
      }
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-24 md:p-8 flex justify-center items-start">
      <div className="w-full max-w-md">
        {/* Profile Card */}
        <div className="bg-white rounded-b-3xl md:rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-gray-100 p-8 flex flex-col items-center mt-0 md:mt-4 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
          
          <div className="w-24 h-24 bg-linear-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white shadow-[0_4px_20px_rgba(59,130,246,0.4)] mb-4 border-4 border-white z-10 relative">
            <FontAwesomeIcon icon={faShieldAlt} className="text-4xl" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight z-10 relative">Administrator</h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1 z-10 relative">Buku Kas SD</p>
        </div>

        {/* Menu List */}
        <div className="mt-6 px-4 md:px-0 space-y-4">
          <Link href="/rekening" className="block group">
            <div className="p-4 bg-white rounded-2xl shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 flex items-center gap-4 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300 shadow-inner">
                <FontAwesomeIcon icon={faCog} className="text-lg" />
              </div>
              <div className="flex-1">
                <span className="block font-bold text-gray-800 text-lg">Pengaturan Rekening</span>
                <span className="block text-xs text-gray-400 font-medium mt-0.5">Kelola kas & piutang</span>
              </div>
            </div>
          </Link>

          <div className="p-4 bg-white rounded-2xl shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 flex items-center gap-4 cursor-pointer group transition-all duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center text-yellow-500 group-hover:bg-yellow-500 group-hover:text-white transition-colors duration-300 shadow-inner">
              <FontAwesomeIcon icon={faQuestionCircle} className="text-lg" />
            </div>
            <div className="flex-1">
              <span className="block font-bold text-gray-800 text-lg">Bantuan & FAQ</span>
              <span className="block text-xs text-gray-400 font-medium mt-0.5">Panduan penggunaan aplikasi</span>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-10 px-4 md:px-0">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2">Zona Berbahaya</p>
          <ModernButton
            onClick={handleReset}
            variant="danger"
            icon={faTrash}
          >
            Hapus Seluruh Data
          </ModernButton>
        </div>
      </div>
    </main>
  );
}
