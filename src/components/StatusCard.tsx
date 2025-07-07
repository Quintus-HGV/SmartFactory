import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatusCardProps {
  title: string;
  value: string | number;
  unit?: string;
  status: 'normal' | 'warning' | 'critical';
  icon: LucideIcon;
  subtitle?: string;
}

const StatusCard: React.FC<StatusCardProps> = ({
  title,
  value,
  unit,
  status,
  icon: Icon,
  subtitle,
}) => {
  const getStatusColors = () => {
    switch (status) {
      case 'critical':
        return 'bg-red-900 border-red-500 text-red-100';
      case 'warning':
        return 'bg-yellow-900 border-yellow-500 text-yellow-100';
      default:
        return 'bg-green-900 border-green-500 text-green-100';
    }
  };

  const getIconColor = () => {
    switch (status) {
      case 'critical':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      default:
        return 'text-green-400';
    }
  };

  return (
    <div className={`p-6 rounded-lg border-2 transition-all duration-300 ${getStatusColors()}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <div className="flex items-baseline mt-2">
            <span className="text-3xl font-bold">
              {typeof value === 'number' ? value.toFixed(2) : value}
            </span>
            {unit && <span className="ml-2 text-lg opacity-80">{unit}</span>}
          </div>
          {subtitle && (
            <p className="text-sm opacity-70 mt-1">{subtitle}</p>
          )}
        </div>
        <Icon className={`h-12 w-12 ${getIconColor()}`} />
      </div>
    </div>
  );
};

export default StatusCard;