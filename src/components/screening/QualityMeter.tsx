import React from 'react';
import type { ImageQualityMetrics } from '../../types/screening';

export interface QualityMeterProps {
  metrics: ImageQualityMetrics;
}

export const QualityMeter: React.FC<QualityMeterProps> = ({ metrics }) => {
  const isAcceptable = metrics.status === 'acceptable';

  return (
    <div className="space-y-5">
      {/* Overall Quality Status Header */}
      <div className="flex items-center justify-between pb-3 border-b border-black/[0.08]">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-[#000000] uppercase block font-semibold">
            Optical Quality Gate
          </span>
          <span className="text-xs font-mono font-semibold text-[#000000]">
            {isAcceptable ? 'PASSED Â· SUFFICIENT FOR AI INFERENCE' : 'FLAGGED Â· RETAKE RECOMMENDED'}
          </span>
        </div>
        <div className={`px-2 py-0.5 text-xs font-mono font-semibold uppercase ${isAcceptable ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-900 border border-amber-300'}`}>
          Score: {metrics.overallScore}%
        </div>
      </div>

      {/* Telemetry Indicator Bars matching approved UI reference */}
      <div className="space-y-3.5">
        <div>
          <div className="flex justify-between text-[10px] font-mono tracking-wider text-[#666666] mb-1">
            <span>IMAGE CLARITY & SHARPNESS</span>
            <span className="text-[#000000] font-semibold">{metrics.clarityScore}%</span>
          </div>
          <div className="w-full bg-black/10 h-1.5 rounded-none overflow-hidden">
            <div className="bg-[#000000] h-full" style={{ width: `${metrics.clarityScore}%` }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] font-mono tracking-wider text-[#666666] mb-1">
            <span>MACULAR CENTERING</span>
            <span className="text-[#000000] font-semibold">{metrics.macularCenteringScore}%</span>
          </div>
          <div className="w-full bg-black/10 h-1.5 rounded-none overflow-hidden">
            <div className="bg-[#000000] h-full" style={{ width: `${metrics.macularCenteringScore}%` }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] font-mono tracking-wider text-[#666666] mb-1">
            <span>ILLUMINATION UNIFORMITY</span>
            <span className="text-[#000000] font-semibold">{metrics.illuminationUniformity}%</span>
          </div>
          <div className="w-full bg-black/10 h-1.5 rounded-none overflow-hidden">
            <div className="bg-[#000000] h-full" style={{ width: `${metrics.illuminationUniformity}%` }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] font-mono tracking-wider text-[#666666] mb-1">
            <span>FOCUS FIDELITY</span>
            <span className="text-[#000000] font-semibold">{metrics.focusSharpness}%</span>
          </div>
          <div className="w-full bg-black/10 h-1.5 rounded-none overflow-hidden">
            <div className="bg-[#000000] h-full" style={{ width: `${metrics.focusSharpness}%` }} />
          </div>
        </div>
      </div>

      {/* Artifacts or Recommendations */}
      {metrics.artifacts.length > 0 && (
        <div className="pt-3 border-t border-black/[0.08]">
          <span className="text-[9px] font-mono uppercase tracking-widest text-amber-800 font-semibold block mb-1">
            Detected Optical Artifacts
          </span>
          <ul className="text-xs text-[#666666] space-y-1 list-disc list-inside">
            {metrics.artifacts.map((art, idx) => (
              <li key={idx}>{art}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

