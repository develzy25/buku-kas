"use client";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

import type { ChartData } from 'chart.js';

export function PieChart({ data }: { data: ChartData<'pie'> }) {
  return <Pie data={data as any} />;
}

export function BarChart({ data }: { data: ChartData<'bar'> }) {
  return <Bar data={data as any} />;
}

export function LineChart({ data }: { data: ChartData<'line'> }) {
  return <Line data={data as any} />;
}
