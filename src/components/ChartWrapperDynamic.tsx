"use client";
import dynamic from 'next/dynamic';

const PieChartDynamic = dynamic(() => import('./ChartWrapper').then(m => m.PieChart), { ssr: false });
const BarChartDynamic = dynamic(() => import('./ChartWrapper').then(m => m.BarChart), { ssr: false });
const LineChartDynamic = dynamic(() => import('./ChartWrapper').then(m => m.LineChart), { ssr: false });

export function PieChart(props: any) {
  return <PieChartDynamic {...props} />;
}

export function BarChart(props: any) {
  return <BarChartDynamic {...props} />;
}

export function LineChart(props: any) {
  return <LineChartDynamic {...props} />;
}
