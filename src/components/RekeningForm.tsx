"use client";
import { useState } from "react";
import { createRekening } from "@/app/actions";
import Swal from "sweetalert2";
import { faSave, faWallet, faTags } from "@fortawesome/free-solid-svg-icons";
import ModernInput from "./ui/ModernInput";
import ModernSelect from "./ui/ModernSelect";
import ModernButton from "./ui/ModernButton";

export default function RekeningForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    try {
      const res = await createRekening(formData);
      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Tersimpan',
          text: 'Rekening baru berhasil ditambahkan!',
          timer: 1500,
          showConfirmButton: false
        });
        (e.target as HTMLFormElement).reset();
      } else {
        throw new Error(res.error);
      }
    } catch (err: unknown) {
      const error = err as Error;
      Swal.fire('Gagal', error.message || 'Gagal menambahkan rekening', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
      <div className="w-full flex-1">
        <ModernInput 
          label="Nama Rekening"
          name="namaRekening"
          type="text"
          required
          placeholder="Misal: Kas Kelas 1A"
          icon={faWallet}
          iconColorClass="bg-blue-400"
        />
      </div>
      <div className="w-full md:w-1/3">
        <ModernSelect
          label="Jenis Rekening"
          name="jenis"
          required
          icon={faTags}
          iconColorClass="bg-blue-500"
          options={[
            { value: "Titipan", label: "Titipan (Tabungan/Kas)" },
            { value: "Piutang", label: "Piutang (Pinjaman Keluar)" }
          ]}
        />
      </div>
      <div className="w-full md:w-auto md:mb-1">
        <ModernButton 
          type="submit" 
          isLoading={loading}
          icon={faSave}
          className="md:px-8"
        >
          Simpan
        </ModernButton>
      </div>
    </form>
  );
}
