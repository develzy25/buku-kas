"use client";
import { useState } from "react";
import { createKategori } from "@/app/actions";
import ModernInput from "./ui/ModernInput";
import ModernSelect from "./ui/ModernSelect";
import ModernButton from "./ui/ModernButton";
import { faTag } from "@fortawesome/free-solid-svg-icons/faTag";
import { faSave } from "@fortawesome/free-solid-svg-icons/faSave";
import { faListAlt } from "@fortawesome/free-solid-svg-icons/faListAlt";

export default function KategoriForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    
    try {
      const res = await createKategori(formData);
      if (res?.success) {
        (await import('sweetalert2')).default.fire({
          icon: 'success',
          title: 'Tersimpan',
          text: 'Kategori baru berhasil ditambahkan',
          timer: 1500,
          showConfirmButton: false
        });
        (e.target as HTMLFormElement).reset();
      } else {
        throw new Error(res?.error || "Gagal menyimpan");
      }
    } catch (err: unknown) {
      (await import('sweetalert2')).default.fire({
        icon: 'error',
        title: 'Gagal',
        text: (err as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ModernInput
          label="Nama Kategori"
          name="namaKategori"
          type="text"
          required
          placeholder="Cth: Sumbangan Alumni"
          icon={faTag}
          iconColorClass="bg-green-500"
        />
        <ModernSelect
          label="Tipe Kategori"
          name="tipe"
          required
          options={[
            { value: 'Pemasukan', label: 'Pemasukan' },
            { value: 'Pengeluaran', label: 'Pengeluaran' },
          ]}
          placeholder="Pilih Tipe"
          icon={faListAlt}
          iconColorClass="bg-blue-500"
        />
      </div>
      <div className="pt-2">
        <ModernButton type="submit" variant="success" icon={faSave} isLoading={loading}>
          Simpan Kategori
        </ModernButton>
      </div>
    </form>
  );
}
