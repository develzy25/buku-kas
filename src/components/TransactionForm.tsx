"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSave, faCalendarAlt, faMoneyBillWave, faTags, faBuilding, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Swal from "sweetalert2";
import ModernInput from "./ui/ModernInput";
import ModernSelect from "./ui/ModernSelect";
import ModernButton from "./ui/ModernButton";
import ModernTextarea from "./ui/ModernTextarea";

export default function TransactionForm({ 
  type, 
  title, 
  rekenings, 
  kategoris,
  submitAction,
  defaultValues
}: { 
  type: string, 
  title: string,
  rekenings: { id: number; namaRekening: string }[],
  kategoris: { id: number; namaKategori: string }[],
  submitAction: (data: FormData) => Promise<{ success: boolean; error?: string }>,
  defaultValues?: {
    noTransaksi?: string;
    nominal?: number;
    tanggal?: string;
    rekeningId?: number;
    kategoriId?: number;
    dariRekeningId?: number;
    keRekeningId?: number;
    keterangan?: string;
  }
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("tipe", type);
    
    try {
      const res = await submitAction(formData);
      if (res?.success) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Transaksi berhasil disimpan',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          router.push('/');
          router.refresh();
        });
      } else {
        throw new Error(res?.error || "Gagal menyimpan transaksi");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const isIncome = type === 'Pemasukan' || type === 'Titipan' || type === 'Pengembalian';
  const isTransfer = type === 'Transfer';
  const headerGradient = isIncome 
    ? 'bg-gradient-to-r from-green-400 to-green-600' 
    : isTransfer 
      ? 'bg-gradient-to-r from-blue-400 to-blue-600' 
      : 'bg-gradient-to-r from-red-400 to-red-600';

  const iconColor = isIncome ? 'bg-green-500' : isTransfer ? 'bg-blue-500' : 'bg-red-500';
  const btnVariant = isIncome ? 'success' : isTransfer ? 'primary' : 'danger';

  return (
    <div className="min-h-screen pb-20 md:p-8 bg-gray-50 flex justify-center items-start">
      <div className="w-full max-w-2xl bg-white md:rounded-3xl md:shadow-3d overflow-hidden">
        
        {/* Header */}
        <div className={`px-4 md:px-8 pt-8 pb-10 text-white flex items-center justify-between shadow-sm relative overflow-hidden ${headerGradient}`}>
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
          
          <Link href="/" className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors z-10">
            <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tight z-10 drop-shadow-md">{title}</h1>
          <div className="w-10"></div>
        </div>

        {/* Form Container */}
        <div className="px-4 md:px-8 -mt-6 relative z-10 pb-8">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-3d p-6 md:p-8 space-y-6 border border-gray-100">
            {defaultValues?.noTransaksi && (
              <input type="hidden" name="noTransaksi" value={defaultValues.noTransaksi} />
            )}
            
            <ModernInput
              label="Nominal Transaksi"
              name="nominal"
              type="number"
              required
              placeholder="0"
              defaultValue={defaultValues?.nominal}
              icon={faMoneyBillWave}
              iconColorClass={iconColor}
              prefixText="Rp"
              isLarge
            />

            <ModernInput
              label="Tanggal"
              name="tanggal"
              type="date"
              required
              defaultValue={defaultValues?.tanggal || new Date().toISOString().split('T')[0]}
              icon={faCalendarAlt}
              iconColorClass="bg-gray-400"
            />

            {type === 'Transfer' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ModernSelect
                  label="Dari Rekening"
                  name="dariRekeningId"
                  required
                  defaultValue={defaultValues?.dariRekeningId}
                  icon={faBuilding}
                  iconColorClass="bg-blue-400"
                  options={rekenings.map(r => ({ value: r.id, label: r.namaRekening }))}
                  placeholder="Pilih Asal"
                />
                <ModernSelect
                  label="Ke Rekening"
                  name="keRekeningId"
                  required
                  defaultValue={defaultValues?.keRekeningId}
                  icon={faBuilding}
                  iconColorClass="bg-blue-500"
                  options={rekenings.map(r => ({ value: r.id, label: r.namaRekening }))}
                  placeholder="Pilih Tujuan"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ModernSelect
                  label="Rekening"
                  name="rekeningId"
                  required
                  defaultValue={defaultValues?.rekeningId}
                  icon={faBuilding}
                  iconColorClass={iconColor}
                  options={rekenings.map(r => ({ value: r.id, label: r.namaRekening }))}
                  placeholder="Pilih Rekening"
                />

                <ModernSelect
                  label="Kategori"
                  name="kategoriId"
                  required
                  defaultValue={defaultValues?.kategoriId}
                  icon={faTags}
                  iconColorClass="bg-gray-500"
                  options={kategoris.map(k => ({ value: k.id, label: k.namaKategori }))}
                  placeholder="Pilih Kategori"
                />
              </div>
            )}

            <ModernTextarea
              label="Keterangan Tambahan"
              name="keterangan"
              rows={2}
              placeholder="Catatan opsional..."
              defaultValue={defaultValues?.keterangan}
              icon={faInfoCircle}
              iconColorClass="bg-gray-400"
            />

            <div className="pt-4">
              <ModernButton 
                type="submit" 
                isLoading={loading}
                variant={btnVariant as "primary" | "success" | "danger"}
                icon={faSave}
              >
                Simpan Transaksi
              </ModernButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
