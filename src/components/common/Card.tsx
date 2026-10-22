import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  indexNumber?: string;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  variant?: 'default' | 'glass' | 'subtle';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  indexNumber,
  title,
  subtitle,
  footer,
  variant = 'default',
}) => {
  const variantStyles = {
    default: 'bg-[#ffffff] sm:bg-white/90 border border-[#e0e0e0] shadow-[0_4px_20px_rgba(0,0,0,0.03)]',
    glass: 'glass-editorial',
    subtle: 'bg-[#f5f5f5] border border-[#d9d9d9]',
  };

  return (
    <div className={`p-6 sm:p-8 flex flex-col justify-between ${variantStyles[variant]} ${className}`}>
      <div>
        {indexNumber && (
          <div className="w-9 h-9 rounded bg-[#000000]/10 flex items-center justify-center text-[#000000] mb-6 font-mono text-xs font-semibold">
            {indexNumber}
          </div>
        )}
        {title && (
          <h3 className="text-lg sm:text-xl font-medium tracking-tight text-[#111111] mb-2">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-xs text-[#666666] font-normal mb-4">
            {subtitle}
          </p>
        )}
        <div>{children}</div>
      </div>
      {footer && (
        <div className="mt-6 pt-5 border-t border-[#e0e0e0]">
          {footer}
        </div>
      )}
    </div>
  );
};

