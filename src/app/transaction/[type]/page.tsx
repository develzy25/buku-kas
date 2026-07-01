export const dynamic = 'force-dynamic';

import { getDb } from "@/db";
import { rekening, kategori } from "@/db/schema";
import { and, eq } from "drizzle-orm";
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
  const rekenings = await getDb().select().from(rekening);
  const kategoris = await getDb().select().from(kategori).where(and(eq(kategori.isActive, true), eq(kategori.tipe, type)));

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

