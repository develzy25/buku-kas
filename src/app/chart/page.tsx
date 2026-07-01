export const runtime = 'edge';
import { getDb } from "@/db";
import { transaksi, kategori } from "@/db/schema";
import { PieChart } from "@/components/ChartWrapperDynamic";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartPie } from "@fortawesome/free-solid-svg-icons/faChartPie";

export default async function ChartPage() {
  const transaksis = await getDb().select().from(transaksi);
  const kategoris = await getDb().select().from(kategori);

  // Filter pengeluaran
  const pengeluaran = transaksis.filter(t => t.tipe === 'Pengeluaran');

  // Group by Kategori
  const kategoriMap: Record<number, number> = {};
  pengeluaran.forEach(t => {
    kategoriMap[t.kategoriId] = (kategoriMap[t.kategoriId] || 0) + t.nominal;
  });

  const pieLabels: string[] = [];
  const pieDataValues: number[] = [];
  const pieColors = [
    'rgba(245, 101, 101, 0.8)', // red-500
    'rgba(237, 137, 54, 0.8)',  // orange-500
    'rgba(236, 201, 75, 0.8)',  // yellow-500
    'rgba(72, 187, 120, 0.8)',  // green-500
    'rgba(56, 178, 172, 0.8)',  // teal-500
    'rgba(66, 153, 225, 0.8)',  // blue-500
    'rgba(102, 126, 234, 0.8)', // indigo-500
    'rgba(159, 122, 234, 0.8)', // purple-500
    'rgba(237, 100, 166, 0.8)'  // pink-500
  ];
  
  const borderColors = pieColors.map(c => c.replace('0.8', '1'));

  for (const [katIdStr, total] of Object.entries(kategoriMap)) {
    const katId = parseInt(katIdStr);
    const kat = kategoris.find(k => k.id === katId);
    pieLabels.push(kat ? kat.namaKategori : 'Lainnya');
    pieDataValues.push(total);
  }

  const pieData = {
    labels: pieLabels,
    datasets: [
      {
        data: pieDataValues,
        backgroundColor: pieColors.slice(0, pieLabels.length),
        borderColor: borderColors.slice(0, pieLabels.length),
        borderWidth: 2,
        hoverOffset: 10
      },
    ],
  };


  return (
    <main className="min-h-screen pb-24 md:p-8">
      <div className="bg-white/80 backdrop-blur-lg px-4 md:px-8 py-5 shadow-sm text-center md:text-left border-b border-gray-100 flex justify-between items-center md:rounded-t-3xl md:border-x md:border-gray-100 md:shadow-3d">
        <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">Grafik Analisis</h1>
      </div>
      
      <div className="p-4 md:px-8 md:py-8 md:bg-white md:border-x md:border-b md:border-gray-100 md:rounded-b-3xl md:shadow-3d">
        <div className="glass-panel rounded-3xl shadow-3d border border-gray-100 p-6 md:p-10 relative overflow-hidden bg-linear-to-b from-white to-gray-50">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-100 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-14 h-14 bg-gradient-blue text-white rounded-2xl flex items-center justify-center text-2xl shadow-3d-button mb-4">
              <FontAwesomeIcon icon={faChartPie} />
            </div>
            <h2 className="text-lg md:text-xl font-extrabold text-gray-800 mb-8 text-center tracking-tight">Komposisi Pengeluaran per Kategori</h2>
            
            {pieDataValues.length > 0 ? (
              <>
                <div className="w-full max-w-[260px] md:max-w-xs mx-auto aspect-square relative drop-shadow-xl mb-8">
                  <PieChart data={pieData} />
                </div>
                
                <div className="w-full max-w-sm mx-auto space-y-3">
                  {pieLabels.map((label, index) => {
                    const value = pieDataValues[index];
                    const total = pieDataValues.reduce((a, b) => a + b, 0);
                    const percentage = ((value / total) * 100).toFixed(1);
                    return (
                      <div key={label} className="flex items-center justify-between p-3 rounded-2xl bg-white/50 border border-white/60 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full shadow-inner" 
                            style={{ backgroundColor: borderColors[index] }}
                          ></div>
                          <span className="font-bold text-gray-700 text-sm">{label}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-extrabold text-gray-800 text-sm">
                            Rp {value.toLocaleString('id-ID')}
                          </p>
                          <p className="text-xs font-bold text-gray-400">
                            {percentage}%
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center bg-white/50 backdrop-blur-sm rounded-2xl py-12 px-8 shadow-inner border border-white/50 w-full max-w-md">
                <p className="text-gray-400 font-semibold">Belum ada data pengeluaran</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
