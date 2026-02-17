import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  actions?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  actions,
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="modal modal-open">
      <div className={`modal-box ${sizeClasses[size]}`}>
        {title && (
          <h3 className="font-bold text-lg mb-4">{title}</h3>
        )}
        <div>{children}</div>
        {actions && (
          <div className="modal-action">
            {actions}
          </div>
        )}
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};
