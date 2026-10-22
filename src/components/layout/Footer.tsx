import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#ffffff] text-[#666666] border-t border-black/[0.08] py-16 text-sm" data-purpose="site-footer">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        {/* Brand & Mission Statement */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="font-semibold text-[#000000] tracking-tight text-base">RetinaGuard AI</span>
            <span className="text-[10px] font-mono bg-[#000000]/10 text-[#000000] px-2 py-0.5 rounded font-medium">
              ICMR Collaborative Project
            </span>
          </div>
          <p className="text-xs text-[#666666] max-w-md">
            A clinical decision support initiative dedicated to eliminating preventable blindness through auditable artificial intelligence.
          </p>
        </div>

        {/* Regulatory & Clinical Disclaimer */}
        <div className="text-[11px] font-mono text-[#888888] md:text-right max-w-sm">
          <p>
            RESEARCH PROTOTYPE. NOT INTENDED AS A STANDALONE DIAGNOSTIC DEVICE. DESIGNED EXCLUSIVELY TO ASSIST QUALIFIED OPHTHALMOLOGISTS AND TRAINED RURAL HEALTH WORKERS.
          </p>
          <p className="mt-2 text-[#000000] font-medium">
            Â© 2025 RetinaGuard AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

