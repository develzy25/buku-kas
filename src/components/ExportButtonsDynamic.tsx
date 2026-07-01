"use client";
import dynamic from 'next/dynamic';

const ExportButtonsDynamic = dynamic(() => import('./ExportButtons'), { ssr: false });

export default function ExportButtons(props: { data: { id: number; namaRekening: string; jenis: string; balance: number }[] }) {
  return <ExportButtonsDynamic {...props} />;
}
