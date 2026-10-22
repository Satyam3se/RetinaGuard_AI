import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'brand' | 'neutral' | 'success' | 'warning' | 'danger' | 'demo';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'brand',
  size = 'xs',
  className = '',
}) => {
  const sizeClasses = {
    xs: 'text-[9px] px-1.5 py-0.5 tracking-widest',
    sm: 'text-[10px] px-2 py-0.5 tracking-wider',
    md: 'text-xs px-2.5 py-1 tracking-wider',
  };

  const variantClasses = {
    brand: 'bg-[#000000]/10 text-[#000000] border border-[#000000]/20 font-semibold',
    neutral: 'bg-black/5 text-[#666666] border border-black/10 font-medium',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold',
    warning: 'bg-amber-50 text-amber-900 border border-amber-300 font-semibold',
    danger: 'bg-red-50 text-red-900 border border-red-300 font-semibold',
    demo: 'bg-[#000000] text-[#ffffff] font-semibold border border-black/30',
  };

  return (
    <span
      className={`inline-flex items-center font-mono uppercase rounded-none ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

