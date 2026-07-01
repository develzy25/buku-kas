"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from "@fortawesome/free-solid-svg-icons/faHome";
import { faList } from "@fortawesome/free-solid-svg-icons/faList";
import { faChartPie } from "@fortawesome/free-solid-svg-icons/faChartPie";
import { faTags } from "@fortawesome/free-solid-svg-icons/faTags";
import { faFileInvoiceDollar } from "@fortawesome/free-solid-svg-icons/faFileInvoiceDollar";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: faHome, label: 'Beranda' },
    { href: '/history', icon: faList, label: 'Riwayat' },
    { href: '/chart', icon: faChartPie, label: 'Grafik' },
    { href: '/kategori', icon: faTags, label: 'Kategori' },
    { href: '/report', icon: faFileInvoiceDollar, label: 'Laporan' },
    { href: '/profile', icon: faUser, label: 'Profil' },
  ];

  return (
    <div className="fixed bottom-0 w-full bg-white/70 backdrop-blur-xl border-t border-white/40 flex justify-between px-4 pb-safe pt-2 z-40 shadow-[0_-4px_25px_-5px_rgba(0,0,0,0.05)] md:flex-col md:w-56 lg:w-64 md:h-screen md:top-0 md:left-0 md:border-t-0 md:border-r md:px-6 md:pt-8 md:justify-start md:shadow-2xl transition-all">
      {/* PC Brand Header */}
      <div className="hidden md:flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-gold shadow-3d-button flex items-center justify-center text-white font-bold text-lg">M</div>
        <h2 className="font-bold text-xl tracking-tight text-gray-800">Kas<span className="text-yellow-500">SD</span></h2>
      </div>

      <div className="flex w-full justify-between items-center relative md:flex-col md:gap-4 md:items-start">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex flex-col md:flex-row items-center md:items-center md:justify-start flex-1 md:flex-none w-full py-2 md:py-3 md:px-4 rounded-2xl md:rounded-xl transition-all ${isActive ? 'text-yellow-500 md:bg-white md:shadow-3d' : 'text-gray-400 hover:text-yellow-500 md:hover:bg-white/50'}`}
            >
              <FontAwesomeIcon icon={item.icon} className={`text-xl md:text-lg mb-1 md:mb-0 md:mr-4 ${isActive ? 'md:text-yellow-500' : 'md:text-gray-400'}`} />
              <span className={`text-[10px] md:text-sm font-semibold tracking-wide ${isActive ? 'md:text-gray-800' : 'md:text-gray-500'}`}>{item.label}</span>
            </Link>
          );
        })}
      </div>
      
      {/* PC Bottom info */}
      <div className="hidden md:block mt-auto pb-8 text-center text-xs text-gray-400">
        <p>Buku Kas SD &copy; 2026</p>
      </div>
    </div>
  );
}
