"use client";
import dynamic from 'next/dynamic';
import type { LedgerItem } from './ExportButtons';

const ExportButtonsDynamic = dynamic(() => import('./ExportButtons'), { ssr: false });

export default function ExportButtons(props: { data: LedgerItem[] }) {
  return <ExportButtonsDynamic {...props} />;
}

