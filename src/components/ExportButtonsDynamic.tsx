"use client";
import dynamic from 'next/dynamic';

const ExportButtonsDynamic = dynamic(() => import('./ExportButtons'), { ssr: false });

export default function ExportButtons(props: any) {
  return <ExportButtonsDynamic {...props} />;
}
