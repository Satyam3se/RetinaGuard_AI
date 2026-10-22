import React, { useState } from 'react';
import type { GradCamTelemetry } from '../../types/screening';

export interface GradCamViewerProps {
  telemetry: GradCamTelemetry;
  fundusUrl: string;
}

export const GradCamViewer: React.FC<GradCamViewerProps> = ({ telemetry, fundusUrl }) => {
  const [overlayOpacity, setOverlayOpacity] = useState<number>(65);
  const [activeTab, setActiveTab] = useState<'blended' | 'sideBySide'>('blended');
  const [selectedBiomarkerId, setSelectedBiomarkerId] = useState<string | null>(null);

  return (
    <div className="bg-[#ffffff] border border-[#e0e0e0] p-6 space-y-6">
      {/* Viewer Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-black/[0.08]">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-[#000000] uppercase block font-semibold">
            Explainable AI Telemetry
          </span>
          <h4 className="text-sm font-medium text-[#000000]">
            Class Activation Saliency Map (Grad-CAM)
          </h4>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center border border-black/15 bg-white/80 p-0.5">
            <button
              onClick={() => setActiveTab('blended')}
              className={`px-3 py-1 text-[11px] font-mono uppercase tracking-wider transition-colors ${
                activeTab === 'blended' ? 'bg-[#000000] text-white font-semibold' : 'text-[#666666] hover:text-[#000000]'
              }`}
            >
              Blended Heatmap
            </button>
            <button
              onClick={() => setActiveTab('sideBySide')}
              className={`px-3 py-1 text-[11px] font-mono uppercase tracking-wider transition-colors ${
                activeTab === 'sideBySide' ? 'bg-[#000000] text-white font-semibold' : 'text-[#666666] hover:text-[#000000]'
              }`}
            >
              Side-by-Side
            </button>
          </div>

          {activeTab === 'blended' && (
            <div className="flex items-center gap-2 bg-white/80 border border-black/15 px-3 py-1">
              <span className="text-[10px] font-mono text-[#666666] uppercase tracking-wider">
                Opacity: {overlayOpacity}%
              </span>
              <input
                type="range"
                min="10"
                max="100"
                value={overlayOpacity}
                onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                className="w-20 accent-[#000000] cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Image Display */}
      {activeTab === 'blended' ? (
        <div className="relative aspect-[4/3] max-w-2xl mx-auto bg-black rounded-none overflow-hidden border border-black/20 shadow-inner flex items-center justify-center">
          {/* Base Fundus Image */}
          <img
            src={fundusUrl}
            alt="Fundus examination"
            className="w-full h-full object-cover"
          />

          {/* Saliency Heatmap Overlay (radial gradient simulated heatmap overlay with high-fidelity blending) */}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-screen transition-opacity duration-150"
            style={{
              opacity: overlayOpacity / 100,
              background: 'radial-gradient(circle at 62% 68%, rgba(255,0,0,0.85) 0%, rgba(255,140,0,0.65) 25%, rgba(255,255,0,0.4) 45%, rgba(0,255,0,0.15) 65%, transparent 78%), radial-gradient(circle at 45% 40%, rgba(255,50,0,0.7) 0%, rgba(255,180,0,0.4) 30%, transparent 60%)'
            }}
          />

          {/* Biomarker Interactive Pins */}
          {telemetry.biomarkers.map((bm) => {
            const isSelected = selectedBiomarkerId === bm.id;
            return (
              <button
                key={bm.id}
                onClick={() => setSelectedBiomarkerId(isSelected ? null : bm.id)}
                style={{
                  left: `${(bm.locationRatio?.x || 0.5) * 100}%`,
                  top: `${(bm.locationRatio?.y || 0.5) * 100}%`,
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-transform duration-200 ${
                  isSelected ? 'scale-125 border-white bg-red-600 text-white shadow-lg' : 'border-red-400 bg-red-600/70 hover:scale-110 text-white'
                }`}
                title={bm.label}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              </button>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#666666]">Original Fundus (Optical)</span>
            <div className="aspect-[4/3] bg-black overflow-hidden border border-black/20">
              <img src={fundusUrl} alt="Original Fundus" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#000000]">Grad-CAM Heatmap Activation</span>
            <div className="aspect-[4/3] bg-black relative overflow-hidden border border-black/20">
              <img src={fundusUrl} alt="Original Fundus Base" className="w-full h-full object-cover filter contrast-75 brightness-75" />
              <div
                className="absolute inset-0 pointer-events-none mix-blend-screen"
                style={{
                  background: 'radial-gradient(circle at 62% 68%, rgba(255,0,0,0.9) 0%, rgba(255,140,0,0.7) 25%, rgba(255,255,0,0.5) 45%, rgba(0,255,0,0.2) 65%, transparent 80%), radial-gradient(circle at 45% 40%, rgba(255,50,0,0.8) 0%, rgba(255,180,0,0.5) 30%, transparent 60%)'
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Biomarker List & Telemetry Grid */}
      <div className="border-t border-black/[0.08] pt-4">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#000000] block font-semibold mb-3">
          Predictive Biomarker Quadrants Identified by Neural Attention
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {telemetry.biomarkers.map((bm) => (
            <div
              key={bm.id}
              onClick={() => setSelectedBiomarkerId(bm.id)}
              className={`p-3 border text-xs cursor-pointer transition-colors ${
                selectedBiomarkerId === bm.id
                  ? 'border-[#000000] bg-[#000000]/5'
                  : 'border-[#e0e0e0] bg-[#ffffff] hover:border-black/30'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                <span className="text-[#000000] font-semibold uppercase">{bm.quadrant}</span>
                <span className="text-[#000000] font-semibold">{bm.confidence}%</span>
              </div>
              <div className="font-medium text-[#000000] mb-1">{bm.label}</div>
              <p className="text-[11px] text-[#666666] leading-snug">{bm.clinicalSignificance}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

