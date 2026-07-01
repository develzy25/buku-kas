"use client";
import dynamic from 'next/dynamic';

import type { ChartData } from 'chart.js';

const PieChartDynamic = dynamic(() => import('./ChartWrapper').then(m => m.PieChart), { ssr: false });
const BarChartDynamic = dynamic(() => import('./ChartWrapper').then(m => m.BarChart), { ssr: false });
const LineChartDynamic = dynamic(() => import('./ChartWrapper').then(m => m.LineChart), { ssr: false });

export function PieChart(props: { data: ChartData<'pie'> }) {
  return <PieChartDynamic {...props} />;
}

export function BarChart(props: { data: ChartData<'bar'> }) {
  return <BarChartDynamic {...props} />;
}

export function LineChart(props: { data: ChartData<'line'> }) {
  return <LineChartDynamic {...props} />;
}
