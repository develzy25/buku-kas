"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons/faFileExcel";
import { faPrint } from "@fortawesome/free-solid-svg-icons/faPrint";

export interface LedgerItem {
  tanggal: string;
  rekening: string;
  jenis: "Masuk" | "Keluar";
  nominal: number;
  catatan: string;
  saldo: number;
}

export default function ExportButtons({ data }: { data: LedgerItem[] }) {
  const exportCSV = () => {
    const headers = ["Tanggal Transaksi", "Rekening", "Jenis (Masuk / Keluar)", "Transaksi", "Catatan", "Saldo"];
    const rows = data.map(r => [
      r.tanggal,
      r.rekening,
      r.jenis,
      r.nominal,
      r.catatan,
      r.saldo
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
        + headers.join(",") + "\n" 
        + rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(",")).join("\n");
        
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "laporan_transaksi.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    import("jspdf").then(({ default: jsPDF }) => {
      import("jspdf-autotable").then(({ default: autoTable }) => {
        const doc = new jsPDF();
        
        // Add Title
        doc.setFontSize(18);
        doc.text("Laporan Transaksi Buku Kas SD", 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID')}`, 14, 30);
        
        // Add Table
        autoTable(doc, {
          startY: 35,
          head: [['Tanggal Transaksi', 'Rekening', 'Jenis (Masuk / Keluar)', 'Transaksi', 'Catatan', 'Saldo']],
          body: data.map(r => [
            r.tanggal,
            r.rekening,
            r.jenis,
            `Rp ${r.nominal.toLocaleString('id-ID')}`,
            r.catatan || '-',
            `Rp ${r.saldo.toLocaleString('id-ID')}`
          ]),
          theme: 'grid',
          headStyles: { fillColor: [41, 128, 185] },
          alternateRowStyles: { fillColor: [245, 245, 245] },
        });
        
        doc.save("laporan_transaksi.pdf");
      });
    });
  };

  return (
    <div className="flex gap-2 mt-4 print:hidden">
      <button onClick={exportCSV} className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors">
        <FontAwesomeIcon icon={faFileExcel} /> Export Excel
      </button>
      <button onClick={exportPDF} className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors">
        <FontAwesomeIcon icon={faPrint} /> Export PDF
      </button>
    </div>
  );
}

