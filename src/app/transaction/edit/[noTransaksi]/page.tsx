export const dynamic = 'force-dynamic';

import { getDb } from "@/db";
import { rekening, kategori, transaksi, transfer } from "@/db/schema";
import TransactionForm from "@/components/TransactionForm";
import { updateTransaction } from "@/app/actions";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function EditTransactionPage(
  props: { params: Promise<{ noTransaksi: string }> }
) {
  const params = await props.params;
  const decodeNoTransaksi = decodeURIComponent(params.noTransaksi);
  
  const rekenings = await getDb().select().from(rekening);
  const trxList = await getDb().select().from(transaksi).where(eq(transaksi.noTransaksi, decodeNoTransaksi));
  
  if (trxList.length === 0) {
    redirect('/history');
  }

  const trx = trxList[0];
  const isTransfer = trx.tipe === 'Transfer';
  
  const kategoris = await getDb().select().from(kategori).where(and(eq(kategori.isActive, true), eq(kategori.tipe, trx.tipe)));
  
  const defaultValues: Record<string, string | number | undefined> = {
    noTransaksi: trx.noTransaksi,
    nominal: trx.nominal,
    tanggal: new Date(trx.tanggal).toISOString().split('T')[0],
    keterangan: trx.keterangan || '',
  };

  if (isTransfer) {
    const transferList = await getDb().select().from(transfer).where(eq(transfer.noTransaksi, decodeNoTransaksi));
    if (transferList.length > 0) {
      defaultValues.dariRekeningId = transferList[0].dariRekeningId;
      defaultValues.keRekeningId = transferList[0].keRekeningId;
      // Keterangan di tabel transaksi transfer mungkin di-prefix "Ke Rek. X:", 
      // jadi kita ambil dari tabel transfer asli yang lebih akurat
      defaultValues.keterangan = transferList[0].keterangan || '';
    }
  } else {
    defaultValues.rekeningId = trx.rekeningId;
    defaultValues.kategoriId = trx.kategoriId;
  }

  return (
    <TransactionForm 
      type={trx.tipe} 
      title={`Edit ${trx.tipe}`} 
      rekenings={rekenings} 
      kategoris={kategoris} 
      submitAction={updateTransaction}
      defaultValues={defaultValues}
    />
  );
}

