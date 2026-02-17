import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  className = '',
}) => {
  return (
    <div className={`stat bg-base-100 rounded-lg shadow p-6 ${className}`}>
      <div className="stat-figure text-primary">{icon}</div>
      <div className="stat-title text-base-content/70">{title}</div>
      <div className="stat-value text-primary">{value}</div>
      {trend && (
        <div className={`stat-desc ${trend.isPositive ? 'text-success' : 'text-error'}`}>
          {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
        </div>
      )}
    </div>
  );
};
