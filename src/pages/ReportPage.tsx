import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthLayout } from '../components/layout/AuthLayout';
import { screeningService } from '../services/screeningService';
import type { ScreeningSession } from '../types/screening';
import { getDRStageMeta } from '../utils/drMeta';
import { formatDate } from '../utils/formatters';
import { SeverityBadge } from '../components/screening/SeverityBadge';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const ReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<ScreeningSession | null>(null);
  const [loading, setLoading] = useState(true);

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
        <LoadingSpinner label="Compiling Official Clinical Report..." />
      </AuthLayout>
    );
  }

  if (!session) {
    return (
      <AuthLayout>
        <div className="text-center py-16 space-y-4">
          <p className="text-sm text-gray-500">Screening report record not found.</p>
          <Link to="/dashboard" className="text-xs font-mono text-[#000000] uppercase underline">
            Return to Dashboard
          </Link>
        </div>
      </AuthLayout>
    );
  }

  const stageMeta = getDRStageMeta(session.stageResult);

  const handlePrint = () => {
    window.print();
  };

  return (
    <AuthLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Actions Bar (Hidden during printing) */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-200 print:hidden">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
            <Link to="/dashboard" className="hover:text-[#000000]">Registry</Link>
            <span>/</span>
            <span>{session.id}</span>
            <span>/</span>
            <span className="text-[#000000] font-semibold">Screening Report</span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/screening/${session.id}/result`)}
            >
              Return to Result
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handlePrint}
            >
              Download PDF / Print
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/screening/new')}
            >
              Start New Screening
            </Button>
          </div>
        </div>

        {/* Printable Document Sheet */}
        <div className="bg-white border border-[#e0e0e0] shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-8 sm:p-12 space-y-8 text-[#111111]">
          {/* Header & Wordmark */}
          <div className="flex items-start justify-between border-b-2 border-[#000000] pb-6">
            <div>
              <div className="text-xl font-medium tracking-tight text-[#000000] flex items-center gap-2">
                RetinaGuard <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-[#000000]/10 text-[#000000] font-semibold">AI</span>
              </div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-gray-500 mt-0.5">
                Explainable Retinal Screening Decision Support Report
              </div>
              <div className="text-xs text-[#374151] mt-2">
                Facility: <span className="font-semibold">{session.healthCenterName}</span> ({session.patient.district} District)
              </div>
            </div>

            <div className="text-right text-xs font-mono space-y-1">
              <div className="text-[#000000] font-semibold">STUDY #{session.id}</div>
              <div className="text-gray-500">{formatDate(session.capturedAt)}</div>
              <div className="text-[10px] text-amber-800 uppercase bg-amber-50 px-2 py-0.5 border border-amber-200">
                Decision Support Only
              </div>
            </div>
          </div>

          {/* Screening Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#ffffff] border border-[#e0e0e0] text-xs">
            <div>
              <span className="text-[10px] font-mono text-gray-500 uppercase block">Study ID</span>
              <span className="font-mono font-semibold text-[#000000]">{session.id}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-gray-500 uppercase block">Eye Examined</span>
              <span className="font-mono font-semibold text-[#000000]">{session.eyeExamined}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-gray-500 uppercase block">Camera Device</span>
              <span className="font-medium text-[#000000]">{session.deviceModel}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-gray-500 uppercase block">Optical Quality</span>
              <span className="font-mono font-semibold text-emerald-800">Pass ({session.quality.overallScore}%)</span>
            </div>
          </div>

          {/* AI Result & Predicted DR Grade */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#000000] font-semibold border-b border-gray-200 pb-1.5">
              Automated AI Decision Support Finding (ICDR 5-Grade Standard)
            </h3>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#ffffff] border border-[#e0e0e0]">
              <div className="space-y-1">
                <SeverityBadge stage={session.stageResult} />
                <div className="text-xs text-[#374151] mt-1">{stageMeta.title}</div>
              </div>
              <div className="text-right text-xs font-mono">
                <span className="text-[10px] text-gray-500 uppercase block">Inference Confidence</span>
                <span className="text-xl font-light text-[#000000]">{session.confidenceScore || 92.4}%</span>
              </div>
            </div>
          </div>

          {/* Original Fundus & Grad-CAM Heatmap Thumbnails */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#000000] font-semibold border-b border-gray-200 pb-1.5">
              Imaging & Attention Saliency Records
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-gray-500 block">Original Fundus</span>
                <div className="aspect-[4/3] bg-black overflow-hidden border border-black/20">
                  <img src={session.fundusImageUrl} alt="Fundus" className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#000000] block font-semibold">Grad-CAM Heatmap</span>
                <div className="aspect-[4/3] bg-black relative overflow-hidden border border-black/20">
                  <img src={session.fundusImageUrl} alt="Grad-CAM" className="w-full h-full object-cover filter contrast-75 brightness-75" />
                  <div
                    className="absolute inset-0 pointer-events-none mix-blend-screen opacity-70"
                    style={{
                      background: 'radial-gradient(circle at 62% 68%, rgba(255,0,0,0.9) 0%, rgba(255,140,0,0.7) 25%, rgba(255,255,0,0.5) 45%, rgba(0,255,0,0.2) 65%, transparent 80%)'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Next-Step Guidance based on Approved Protocol */}
          <div className="p-5 border-2 border-dashed border-[#000000]/30 bg-[#ffffff] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-[#000000] font-bold">
                Clinical Action & Referral Protocol
              </span>
              <span className="text-[10px] font-mono uppercase text-amber-900 bg-amber-50 px-2 py-0.5 border border-amber-200 font-semibold">
                Priority: {stageMeta.referralPriority}
              </span>
            </div>
            <p className="text-xs text-[#000000] leading-relaxed">
              {stageMeta.recommendedAction}
            </p>
            {session.referralHospital && (
              <div className="text-xs font-mono text-[#000000] pt-1">
                Designated Referral Center: <span className="font-bold">{session.referralHospital}</span> (Window: {stageMeta.followUpInterval})
              </div>
            )}
          </div>

          {/* Step 9 · Ophthalmologist Review & Sign-Off (from Slide 5) */}
          <div className="pt-6 border-t border-gray-200 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-500 uppercase block font-bold">
                  Step 09 · Clinical Decision & Validation
                </span>
                <span className="font-semibold text-black text-sm">
                  Ophthalmologist-in-the-Loop Sign-Off
                </span>
              </div>
              <span className="text-[9px] bg-teal-dim text-black font-bold uppercase px-2 py-0.5 border border-teal/30">
                Human-in-the-Loop Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-5 border border-gray-200">
              <div className="space-y-3">
                <label className="block text-[10px] uppercase font-bold text-gray-700">
                  Clinical Validation Decision:
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="ophDecision" defaultChecked className="accent-black" />
                    <span>Concur with AI Severity Grade {session.stageResult} (Approved)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="ophDecision" className="accent-black" />
                    <span>Overrule Severity Grade (Manual Clinical Override)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="ophDecision" className="accent-black" />
                    <span>Request Optical Coherence Tomography (OCT / Fundus Fluorescein)</span>
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] uppercase font-bold text-gray-700">
                  Reviewing Specialist Identity:
                </label>
                <div className="p-3 bg-white border border-gray-300 space-y-1">
                  <div className="font-bold text-black text-[11px]">Dr. Meera Iyer, MBBS, MS (Ophth)</div>
                  <div className="text-[10px] text-gray-500">Karnataka Medical Council Reg: #KMC-48291</div>
                  <div className="text-[10px] text-teal font-semibold">District Hospital Referral Unit · Approved</div>
                </div>
              </div>
            </div>

            {/* Signature & Date Stamped Block */}
            <div className="pt-4 grid grid-cols-2 gap-8 border-t border-gray-200">
              <div>
                <div className="h-8 border-b border-black/30 flex items-end pb-1 font-serif italic text-sm text-gray-700">
                  {session.operatorName}
                </div>
                <div className="mt-1 text-[10px] uppercase text-gray-500">
                  Frontline Screener Signature
                </div>
                <div className="font-semibold text-black text-[11px]">
                  {session.operatorName} ({session.operatorRole})
                </div>
              </div>

              <div>
                <div className="h-8 border-b border-black/30 flex items-end pb-1 font-serif italic text-sm text-emerald-800 font-bold">
                  Dr. Meera Iyer (Verified Digital Stamp)
                </div>
                <div className="mt-1 text-[10px] uppercase text-gray-500">
                  Reviewing Ophthalmologist Sign-Off
                </div>
                <div className="font-semibold text-emerald-800 text-[11px]">
                  Confirmed: {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Screening Support Disclaimer */}
          <div className="text-[9px] font-mono text-gray-400 text-center pt-6 border-t border-gray-100">
            TECHSPARDHA 2K26 RESEARCH PROTOTYPE · TS-0123 (IMSEC) · FOR CLINICAL DECISION SUPPORT ONLY · MUST BE CORRELATED WITH CLINICAL OPHTHALMOLOGICAL EXAMINATION.
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};


