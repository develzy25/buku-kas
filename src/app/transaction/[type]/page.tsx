import { db } from "@/db";
import { rekening, kategori } from "@/db/schema";
import TransactionForm from "@/components/TransactionForm";
import { createTransaction } from "@/app/actions";
import { notFound } from "next/navigation";

export default async function TransactionPage({ params }: { params: Promise<{ type: string }> }) {
  const { type: typeParam } = await params;

  const typeMap: Record<string, string> = {
    income: 'Pemasukan',
    expense: 'Pengeluaran',
    transfer: 'Transfer',
    titipan: 'Titipan',
    pinjaman: 'Pinjaman'
  };

  const type = typeMap[typeParam];
  
  if (!type) {
    notFound();
  }

  const title = `Tambah ${type}`;
  
  // Fetch master data
  const rekenings = await db.select().from(rekening);
  const kategoris = await db.select().from(kategori);

  return (
    <TransactionForm 
      type={type} 
      title={title}
      rekenings={rekenings}
      kategoris={kategoris}
      submitAction={createTransaction}
    />
  );
}
