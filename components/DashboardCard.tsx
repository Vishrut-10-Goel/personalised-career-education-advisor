import { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function DashboardCard({ title, children, className }: DashboardCardProps) {
  return (
    <div className={`glass-card p-6 rounded-xl ${className || ''}`}>
      {title && <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>}
      {children}
    </div>
  );
}
