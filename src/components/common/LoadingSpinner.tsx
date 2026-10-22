import React from 'react';

export const LoadingSpinner: React.FC<{ label?: string }> = ({ label = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center gap-4">
      <div className="w-8 h-8 border-2 border-gray-200 border-t-[#00C2A8] rounded-full animate-spin" />
      <div className="text-xs text-gray-400 font-medium">{label}</div>
    </div>
  );
};
