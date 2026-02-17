import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  actions?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, actions }) => {
  return (
    <div className={`card bg-base-100 shadow-lg ${className}`}>
      {(title || actions) && (
        <div className="card-header flex items-center justify-between p-4 border-b border-base-300">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      )}
      <div className="card-body p-4">{children}</div>
    </div>
  );
};
