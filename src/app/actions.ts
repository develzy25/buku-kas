"use server";

import { getDb } from "@/db";
import { transaksi, transfer, users, rekening, kategori } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";

export async function createTransaction(formData: FormData) {
  try {
    const tipe = formData.get("tipe") as string;
    const tanggalStr = formData.get("tanggal") as string;
    const nominal = parseFloat(formData.get("nominal") as string);
    const keterangan = formData.get("keterangan") as string;

    const tanggal = new Date(tanggalStr);
    const noTransaksi = `TRX-${Date.now()}`;

    if (tipe === 'Transfer') {
      const dariRekeningId = parseInt(formData.get("dariRekeningId") as string);
      const keRekeningId = parseInt(formData.get("keRekeningId") as string);
      
      await getDb().insert(transfer).values({
        noTransaksi,
        tanggal,
        dariRekeningId,
        keRekeningId,
        nominal,
        keterangan,
      });

      // Juga catat di tabel transaksi agar muncul di riwayat terpadu
      await getDb().insert(transaksi).values({
        noTransaksi,
        tanggal,
        rekeningId: dariRekeningId,
        kategoriId: 1, // Kategori dummy
        nominal,
        tipe: 'Transfer',
        keterangan: `Ke Rek. ${keRekeningId}: ${keterangan}`,
      });
    } else {
      const rekeningId = parseInt(formData.get("rekeningId") as string);
      let kategoriId = parseInt(formData.get("kategoriId") as string);
      
      if (isNaN(kategoriId)) {
          kategoriId = 1; // Default fallback
      }

      await getDb().insert(transaksi).values({
        noTransaksi,
        tanggal,
        rekeningId,
        kategoriId,
        nominal,
        tipe,
        keterangan,
      });
    }

    revalidatePath('/');
    revalidatePath('/history');
    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, error: err.message };
  }
}

export async function deleteTransaction(noTransaksi: string) {
  try {
    // Hapus dari tabel transfer (jika ada)
    await getDb().delete(transfer).where(eq(transfer.noTransaksi, noTransaksi));
    // Hapus dari tabel transaksi
    await getDb().delete(transaksi).where(eq(transaksi.noTransaksi, noTransaksi));

    revalidatePath('/');
    revalidatePath('/history');
    revalidatePath('/report');
    revalidatePath('/chart');
    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, error: err.message };
  }
}

export async function updateTransaction(formData: FormData) {
  try {
    const noTransaksi = formData.get("noTransaksi") as string;
    const tipe = formData.get("tipe") as string;
    const tanggalStr = formData.get("tanggal") as string;
    const nominal = parseFloat(formData.get("nominal") as string);
    const keterangan = formData.get("keterangan") as string;

    const tanggal = new Date(tanggalStr);

    // Untuk mempermudah, kita hapus yang lama, lalu masukkan yang baru dengan ID transaksi yang sama.
    await getDb().delete(transfer).where(eq(transfer.noTransaksi, noTransaksi));
    await getDb().delete(transaksi).where(eq(transaksi.noTransaksi, noTransaksi));

    if (tipe === 'Transfer') {
      const dariRekeningId = parseInt(formData.get("dariRekeningId") as string);
      const keRekeningId = parseInt(formData.get("keRekeningId") as string);
      
      await getDb().insert(transfer).values({
        noTransaksi,
        tanggal,
        dariRekeningId,
        keRekeningId,
        nominal,
        keterangan,
      });

      await getDb().insert(transaksi).values({
        noTransaksi,
        tanggal,
        rekeningId: dariRekeningId,
        kategoriId: 1, 
        nominal,
        tipe: 'Transfer',
        keterangan: `Ke Rek. ${keRekeningId}: ${keterangan}`,
      });
    } else {
      const rekeningId = parseInt(formData.get("rekeningId") as string);
      let kategoriId = parseInt(formData.get("kategoriId") as string);
      if (isNaN(kategoriId)) kategoriId = 1;

      await getDb().insert(transaksi).values({
        noTransaksi,
        tanggal,
        rekeningId,
        kategoriId,
        nominal,
        tipe,
        keterangan,
      });
    }

    revalidatePath('/');
    revalidatePath('/history');
    revalidatePath('/report');
    revalidatePath('/chart');
    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, error: err.message };
  }
}

export async function loginAction(formData: FormData) {
  try {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (username === "admin" && password === "admin123") {
      (await cookies()).set("auth-token", "session-admin-123", { httpOnly: true, secure: true });
      return { success: true };
    }

    const userList = await getDb().select().from(users).where(eq(users.username, username));
    if (userList.length > 0) {
       const user = userList[0];
       if (user.password === password) {
         (await cookies()).set("auth-token", "session-" + user.id, { httpOnly: true, secure: true });
         return { success: true };
       }
    }

    return { success: false, error: "Username atau password salah" };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, error: err.message };
  }
}

export async function logoutAction() {
    (await cookies()).delete("auth-token");
  return { success: true };
}

export async function createRekening(formData: FormData) {
  try {
    const namaRekening = formData.get("namaRekening") as string;
    const jenis = formData.get("jenis") as string;

    await getDb().insert(rekening).values({
      namaRekening,
      jenis,
    });

    revalidatePath('/rekening');
    revalidatePath('/report');
    revalidatePath('/');
    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, error: err.message };
  }
}

export async function deleteRekening(id: number) {
  try {
    // Cek apakah ada transaksi yang terkait dengan rekening ini
    const trxList = await getDb().select().from(transaksi).where(eq(transaksi.rekeningId, id));
    if (trxList.length > 0) {
      return { success: false, error: "Rekening tidak bisa dihapus karena masih memiliki riwayat transaksi." };
    }

    await getDb().delete(rekening).where(eq(rekening.id, id));

    revalidatePath('/rekening');
    revalidatePath('/report');
    revalidatePath('/');
    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, error: err.message };
  }
}

export async function resetAllData() {
  try {
    await getDb().delete(transfer);
    await getDb().delete(transaksi);
    await getDb().update(rekening).set({ saldoAwal: 0 });
    
    revalidatePath('/');
    revalidatePath('/history');
    revalidatePath('/chart');
    revalidatePath('/report');
    revalidatePath('/rekening');
    
    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, error: err.message };
  }
}
export async function createKategori(formData: FormData) {
  try {
    const namaKategori = formData.get('namaKategori') as string;
    const tipe = formData.get('tipe') as string;
    await getDb().insert(kategori).values({
      namaKategori,
      tipe,
      isDefault: false,
      isActive: true,
    });
    revalidatePath('/kategori');
    revalidatePath('/transaction/income');
    revalidatePath('/transaction/expense');
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
}

export async function toggleKategoriActive(id: number, currentStatus: boolean) {
  try {
    await getDb().update(kategori).set({ isActive: !currentStatus }).where(eq(kategori.id, id));
    revalidatePath('/kategori');
    revalidatePath('/transaction/income');
    revalidatePath('/transaction/expense');
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteKategori(id: number) {
  try {
    const trxList = await getDb().select().from(transaksi).where(eq(transaksi.kategoriId, id));
    if (trxList.length > 0) {
      return { success: false, error: 'Kategori tidak bisa dihapus karena masih digunakan di transaksi.' };
    }
    await getDb().delete(kategori).where(eq(kategori.id, id));
    revalidatePath('/kategori');
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
}
