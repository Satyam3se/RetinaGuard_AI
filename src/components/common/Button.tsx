import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-mono uppercase tracking-wider transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const sizeClasses = {
    sm: 'text-[11px] px-3.5 py-2 font-medium',
    md: 'text-xs px-6 py-3 font-semibold',
    lg: 'text-xs px-8 py-3.5 font-semibold',
  };

  const variantClasses = {
    primary: 'bg-[#00C2A8] hover:bg-[#009E88] text-black border border-transparent shadow-md',
    secondary: 'bg-white hover:bg-black/5 text-black border border-black/15 shadow-sm',
    outline: 'bg-transparent hover:bg-black text-black hover:text-white border border-black',
    danger: 'bg-red-700 hover:bg-red-800 text-white border border-transparent shadow-sm',
    ghost: 'bg-transparent hover:bg-black/5 text-black/60 hover:text-black',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Processing...
        </span>
      ) : (
        children
      )}
    </button>
  );
};
