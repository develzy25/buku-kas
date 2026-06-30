"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faPrint } from "@fortawesome/free-solid-svg-icons";

export default function ExportButtons({ data }: { data: { id: number; namaRekening: string; jenis: string; balance: number }[] }) {
  const exportCSV = () => {
    // Generate CSV
    const headers = ["ID", "Nama Rekening", "Jenis", "Saldo"];
    const rows = data.map(r => [r.id, r.namaRekening, r.jenis, r.balance]);
    const csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n" 
        + rows.map(e => e.join(",")).join("\n");
        
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "laporan_rekening.csv");
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
        doc.text("Laporan Saldo Buku Kas SD", 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID')}`, 14, 30);
        
        // Add Table
        autoTable(doc, {
          startY: 35,
          head: [['ID', 'Nama Rekening', 'Jenis', 'Saldo']],
          body: data.map(r => [
            r.id.toString(), 
            r.namaRekening, 
            r.jenis, 
            `Rp ${r.balance.toLocaleString('id-ID')}`
          ]),
          theme: 'grid',
          headStyles: { fillColor: [41, 128, 185] },
          alternateRowStyles: { fillColor: [245, 245, 245] },
        });
        
        doc.save("laporan_rekening.pdf");
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
