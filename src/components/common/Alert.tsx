import React from 'react';

export interface AlertProps {
  children: React.ReactNode;
  type?: 'info' | 'warning' | 'clinical' | 'success';
  title?: string;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  children,
  type = 'info',
  title,
  className = '',
}) => {
  const styles = {
    info: 'bg-[#f5f5f5] border-[#d9d9d9] text-[#111111]',
    warning: 'bg-amber-50/80 border-amber-200 text-amber-900',
    clinical: 'bg-[#000000]/5 border-[#000000]/20 text-[#111111]',
    success: 'bg-emerald-50/80 border-emerald-200 text-emerald-900',
  };

  const indicatorColors = {
    info: 'bg-[#666666]',
    warning: 'bg-amber-600',
    clinical: 'bg-[#000000]',
    success: 'bg-emerald-600',
  };

  return (
    <div className={`border p-4 sm:p-5 flex items-start gap-3.5 ${styles[type]} ${className}`}>
      <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${indicatorColors[type]}`} />
      <div className="text-xs leading-relaxed">
        {title && (
          <div className="font-mono text-[11px] uppercase tracking-wider font-semibold mb-1">
            {title}
          </div>
        )}
        <div className="text-[#374151] font-normal">{children}</div>
      </div>
    </div>
  );
};

