import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthLayout } from '../components/layout/AuthLayout';
import { screeningService } from '../services/screeningService';
import type { ScreeningSession } from '../types/screening';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const QualityAssessmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<ScreeningSession | null>(null);
  const [loading, setLoading] = useState(true);
  // Toggle for testing both pass and fail states in the prototype (as per Slide 5)
  const [simulatedFail, setSimulatedFail] = useState(false);
  const [preprocessView, setPreprocessView] = useState<'raw' | 'clahe' | 'circular'>('clahe');

  useEffect(() => {
    async function load() {
      if (!id) return;
      const res = await screeningService.getScreeningById(id);
      setSession(res.data);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <AuthLayout>
        <LoadingSpinner label="Evaluating Optical Quality Checks (Step 4)..." />
      </AuthLayout>
    );
  }

  if (!session) {
    return (
      <AuthLayout>
        <div className="text-center py-16 space-y-4">
          <p className="text-sm text-gray-500 font-mono">Screening record not found or inaccessible.</p>
          <Link to="/dashboard" className="text-xs font-mono text-black uppercase underline">
            Return to Dashboard
          </Link>
        </div>
      </AuthLayout>
    );
  }

  const isPassing = !simulatedFail && session.quality.status === 'acceptable';

  return (
    <AuthLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono tracking-widest text-[#000000] uppercase font-bold bg-teal-dim px-2 py-0.5 border border-teal/30">
                10-Step Pipeline · Step 04 & 05
              </span>
              <span className="text-[10px] font-mono text-gray-500 uppercase">
                Slide 5 Architecture
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-[#000000]">
              Image Quality Check & Preprocessing
            </h1>
            <p className="text-xs text-gray-500 font-mono mt-0.5">
              Study ID: {session.id} · Eye: {session.eyeExamined} · Device: {session.deviceModel}
            </p>
          </div>

          {/* Test toggle between Pass and Needs Recapture (from Slide 5) */}
          <div className="flex items-center gap-2 bg-gray-100 p-1.5 border border-[#d9d9d9] text-[10px] font-mono self-start sm:self-auto">
            <span className="text-gray-500">Test Gate:</span>
            <button
              type="button"
              onClick={() => setSimulatedFail(false)}
              className={`px-2.5 py-1 uppercase cursor-pointer transition-colors ${
                !simulatedFail ? 'bg-[#000000] text-white font-semibold' : 'text-[#374151] hover:text-black'
              }`}
            >
              Pass (Gradable)
            </button>
            <button
              type="button"
              onClick={() => setSimulatedFail(true)}
              className={`px-2.5 py-1 uppercase cursor-pointer transition-colors ${
                simulatedFail ? 'bg-red-800 text-white font-semibold' : 'text-[#374151] hover:text-red-700'
              }`}
            >
              Poor Quality (Recapture)
            </button>
          </div>
        </div>

        {/* Progress Steps Indicator */}
        <div className="bg-[#ffffff] border border-[#e0e0e0] p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-2.5 bg-emerald-50 text-emerald-800 flex items-center gap-2 border border-emerald-200">
              <span className="font-semibold">✓ 01-03</span>
              <span>Intake & Upload</span>
            </div>
            <div className="p-2.5 bg-[#000000] text-white flex items-center gap-2">
              <span className="font-semibold">04-05</span>
              <span>Quality & Preprocess</span>
            </div>
            <div className="p-2.5 bg-gray-100 text-gray-500 flex items-center gap-2 border border-gray-200">
              <span className="font-semibold">06-07</span>
              <span>AI & Grad-CAM</span>
            </div>
            <div className="p-2.5 bg-gray-100 text-gray-500 flex items-center gap-2 border border-gray-200">
              <span className="font-semibold">08-10</span>
              <span>Report & Review</span>
            </div>
          </div>
        </div>

        {/* Quality Check Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Fundus Preview & Step 5 Preprocessing Comparison */}
          <div className="bg-[#ffffff] p-6 border border-[#e0e0e0] shadow-sm space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                Step 5 · Preprocessing & Normalization
              </span>
              <span className="text-[10px] text-teal font-bold uppercase">
                {preprocessView === 'clahe' ? 'CLAHE Enhanced' : preprocessView === 'circular' ? 'Circular Mask' : 'Raw Capture'}
              </span>
            </div>

            {/* Preprocessing View Mode Selector */}
            <div className="grid grid-cols-3 gap-1 text-[10px] text-center">
              <button
                type="button"
                onClick={() => setPreprocessView('raw')}
                className={`py-1.5 border uppercase transition-colors ${
                  preprocessView === 'raw' ? 'bg-black text-white font-bold border-black' : 'bg-gray-100 text-gray-600 border-gray-300'
                }`}
              >
                1. Raw Input
              </button>
              <button
                type="button"
                onClick={() => setPreprocessView('clahe')}
                className={`py-1.5 border uppercase transition-colors ${
                  preprocessView === 'clahe' ? 'bg-black text-white font-bold border-black' : 'bg-gray-100 text-gray-600 border-gray-300'
                }`}
              >
                2. CLAHE Filter
              </button>
              <button
                type="button"
                onClick={() => setPreprocessView('circular')}
                className={`py-1.5 border uppercase transition-colors ${
                  preprocessView === 'circular' ? 'bg-black text-white font-bold border-black' : 'bg-gray-100 text-gray-600 border-gray-300'
                }`}
              >
                3. Circular FOV
              </button>
            </div>

            <div className="aspect-[4/3] bg-black overflow-hidden border border-black/20 relative">
              <img
                src={session.fundusImageUrl}
                alt="Fundus examination"
                className={`w-full h-full object-cover transition-all duration-300 ${
                  simulatedFail
                    ? 'filter blur-[2.5px] brightness-75'
                    : preprocessView === 'clahe'
                    ? 'filter contrast-150 brightness-110 saturate-125'
                    : preprocessView === 'circular'
                    ? 'rounded-full scale-90 border-4 border-teal'
                    : ''
                }`}
              />
              {preprocessView === 'clahe' && !simulatedFail && (
                <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md px-2 py-0.5 text-[9px] text-teal uppercase font-bold border border-teal/30">
                  OpenCV CLAHE (ClipLimit 2.0, Grid 8x8)
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-500 pt-2 border-t border-gray-200">
              <div>Resolution: <span className="text-[#000000]">512 × 512 Tensor</span></div>
              <div>Field: <span className="text-[#000000]">45° Posterior Pole</span></div>
              <div>Norm: <span className="text-[#000000]">Z-Score (ImageNet)</span></div>
              <div>Target: <span className="text-[#000000]">EfficientNet-B0</span></div>
            </div>
          </div>

          {/* 3 Explicit Quality Checks (Slide 5: Blur detection, Contrast/illumination, Field of view) */}
          <div className="bg-[#ffffff] p-6 sm:p-8 border border-[#e0e0e0] shadow-sm space-y-6 font-mono">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-gray-500 block">
                  Step 4 · Automated Optical Gate
                </span>
                <span className="text-xs font-semibold text-black uppercase">
                  Optical Assessment Verification
                </span>
              </div>
              <span
                className={`px-2.5 py-1 text-xs font-semibold uppercase ${
                  isPassing
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-900 border border-red-300'
                }`}
              >
                {isPassing ? 'Gate: PASSED' : 'Gate: POOR (RECAPTURE)'}
              </span>
            </div>

            {/* Check 1: Blur detection (Laplacian Variance) */}
            <div className="p-4 bg-[#ffffff] border border-[#e0e0e0] space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#000000]">1. Focus & Blur Detection (Laplacian)</span>
                <span className={isPassing ? 'text-emerald-700 font-semibold' : 'text-red-700 font-semibold'}>
                  {isPassing ? '✓ Pass (95%)' : '⚠ Defect Detected (48%)'}
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                {isPassing
                  ? 'Retinal vascular borders and foveal avascular zone margins are sharply resolved.'
                  : 'Significant motion blur detected in temporal quadrant. Microaneurysm detection impeded.'}
              </p>
            </div>

            {/* Check 2: Contrast & Illumination Uniformity */}
            <div className="p-4 bg-[#ffffff] border border-[#e0e0e0] space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#000000]">2. Contrast & Illumination Uniformity</span>
                <span className={isPassing ? 'text-emerald-700 font-semibold' : 'text-red-700 font-semibold'}>
                  {isPassing ? '✓ Pass (93%)' : '⚠ Suboptimal Illumination (52%)'}
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                {isPassing
                  ? 'Balanced illumination across 45° posterior pole without blinding corneal flash reflex.'
                  : 'Uneven crescent illumination. Nasal half under-exposed due to pupil misalignment.'}
              </p>
            </div>

            {/* Check 3: Field of View Check (Optic disc & Macula Centering) */}
            <div className="p-4 bg-[#ffffff] border border-[#e0e0e0] space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#000000]">3. Field of View & Centering Check</span>
                <span className="text-emerald-700 font-semibold">✓ Pass (91%)</span>
              </div>
              <p className="text-[11px] text-gray-500">
                Optic disc and macula both positioned within designated 45° standard diagnostic boundary.
              </p>
            </div>

            {/* Action Buttons depending on Pass vs Fail (Slide 5: "If quality is poor: Request Recapture") */}
            <div className="pt-4 border-t border-gray-200">
              {isPassing ? (
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => navigate(`/screening/${session.id}/result`)}
                    className="w-full text-xs font-mono font-bold uppercase tracking-wider py-3.5"
                  >
                    Continue to Step 6: AI Classification →
                  </Button>
                  <p className="text-[10px] font-mono text-center text-gray-500">
                    Quality verified · Enhanced with CLAHE · Ready for EfficientNet-B0 inference.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-900 leading-snug">
                    <span className="font-bold block font-mono uppercase text-[10px] mb-1">
                      Slide 5 Trigger · Request Recapture:
                    </span>
                    Instill lubricating drops or ask patient to blink. Re-align camera optic axis before next exposure. AI classification gate is safely blocked.
                  </div>
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => navigate('/screening/new')}
                    className="w-full text-xs font-mono font-bold uppercase tracking-wider py-3.5"
                  >
                    ↺ Request Recapture & Upload New Scan
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};
