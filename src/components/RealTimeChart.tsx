import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { LiveData } from '../hooks/useRealTimeData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface RealTimeChartProps {
  data: LiveData[];
  metric: 'decibel' | 'humidity' | 'temperature' | 'vibration_magnitude' | 'vibration_x' | 'vibration_y' | 'vibration_z';
  title: string;
  unit: string;
  color: string;
}

const RealTimeChart: React.FC<RealTimeChartProps> = ({
  data,
  metric,
  title,
  unit,
  color,
}) => {
  const chartData = {
    labels: data.map(item => {
      try {
        // Try to parse the timestamp from Firebase format
        return new Date(item.timestamp.replace(' ', 'T'));
      } catch {
        // Fallback to current time if parsing fails
        return new Date();
      }
    }),
    datasets: [
      {
        label: title,
        data: data.map(item => {
          const value = item[metric];
          return typeof value === 'number' ? value : 0;
        }),
        borderColor: color,
        backgroundColor: color + '20',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: title,
        color: '#ffffff',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: color,
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)} ${unit}`;
          }
        }
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          displayFormats: {
            minute: 'HH:mm',
          },
          tooltipFormat: 'MMM dd, HH:mm:ss',
        },
        grid: {
          color: 'rgba(107, 114, 128, 0.3)',
        },
        ticks: {
          color: '#9CA3AF',
        },
      },
      y: {
        beginAtZero: metric !== 'vibration_x' && metric !== 'vibration_y' && metric !== 'vibration_z',
        grid: {
          color: 'rgba(107, 114, 128, 0.3)',
        },
        ticks: {
          color: '#9CA3AF',
          callback: function(value) {
            return value + ' ' + unit;
          },
        },
      },
    },
    elements: {
      point: {
        hoverBackgroundColor: color,
      },
    },
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default RealTimeChart;