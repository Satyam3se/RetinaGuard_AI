import React from 'react';
import type { DRStageNumber } from '../../types/screening';
import { getDRStageMeta } from '../../utils/drMeta';

export interface SeverityBadgeProps {
  stage?: DRStageNumber;
  showDetails?: boolean;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ stage, showDetails = false }) => {
  const meta = getDRStageMeta(stage);

  return (
    <div className="inline-flex items-center gap-2">
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-semibold tracking-wider uppercase border ${meta.badgeColor.bg}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        {meta.shortLabel}
      </span>
      {showDetails && (
        <span className="text-[11px] font-mono text-[#666666]">
          Priority: <span className="font-semibold text-[#000000]">{meta.referralPriority}</span>
        </span>
      )}
    </div>
  );
};

