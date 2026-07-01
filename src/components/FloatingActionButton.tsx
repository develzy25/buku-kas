"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons/faArrowDown";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons/faArrowUp";
import { faExchangeAlt } from "@fortawesome/free-solid-svg-icons/faExchangeAlt";
import { faPiggyBank } from "@fortawesome/free-solid-svg-icons/faPiggyBank";
import { faHandHoldingUsd } from "@fortawesome/free-solid-svg-icons/faHandHoldingUsd";
import Link from "next/link";

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 md:left-auto md:right-10 md:bottom-10 md:translate-x-0">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 bg-gradient-gold rounded-full text-white flex items-center justify-center text-2xl shadow-3d-button transition-transform duration-300 hover:scale-105 active:scale-95 ${isOpen ? 'rotate-45' : ''}`}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:left-64 lg:left-72 transition-opacity" onClick={() => setIsOpen(false)}></div>
          <div className="fixed bottom-36 left-1/2 -translate-x-1/2 z-50 glass-panel rounded-2xl p-4 shadow-3d w-64 md:left-auto md:right-10 md:translate-x-0 md:w-56 md:bottom-28 border border-white/50">
            <div className="flex flex-col gap-2">
              <Link href="/transaction/income" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/80 text-gray-800 transition-all font-semibold" onClick={() => setIsOpen(false)}>
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shadow-inner"><FontAwesomeIcon icon={faArrowDown} /></div>
                <span className="text-sm tracking-wide">Pemasukan</span>
              </Link>
              <Link href="/transaction/expense" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/80 text-gray-800 transition-all font-semibold" onClick={() => setIsOpen(false)}>
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center shadow-inner"><FontAwesomeIcon icon={faArrowUp} /></div>
                <span className="text-sm tracking-wide">Pengeluaran</span>
              </Link>
              <Link href="/transaction/transfer" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/80 text-gray-800 transition-all font-semibold" onClick={() => setIsOpen(false)}>
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shadow-inner"><FontAwesomeIcon icon={faExchangeAlt} /></div>
                <span className="text-sm tracking-wide">Transfer</span>
              </Link>
              <div className="h-px w-full bg-white/40 my-1"></div>
              <Link href="/transaction/titipan" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/80 text-gray-800 transition-all font-semibold" onClick={() => setIsOpen(false)}>
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shadow-inner"><FontAwesomeIcon icon={faPiggyBank} /></div>
                <span className="text-sm tracking-wide">Titipan Masuk</span>
              </Link>
              <Link href="/transaction/pinjaman" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/80 text-gray-800 transition-all font-semibold" onClick={() => setIsOpen(false)}>
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shadow-inner"><FontAwesomeIcon icon={faHandHoldingUsd} /></div>
                <span className="text-sm tracking-wide">Pinjaman (Keluar)</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
