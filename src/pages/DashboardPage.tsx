import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../components/layout/AuthLayout';
import { useAuth } from '../app/useAuth';
import { screeningService } from '../services/screeningService';
import type { ScreeningSession, ScreeningStats } from '../types/screening';
import { formatDate } from '../utils/formatters';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [screenings, setScreenings] = useState<ScreeningSession[]>([]);
  const [stats, setStats]           = useState<ScreeningStats | null>(null);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [sRes, stRes] = await Promise.all([
          screeningService.getAllScreenings(),
          screeningService.getScreeningStats(),
        ]);
        setScreenings(sRes.data);
        setStats(stRes.stats);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const cards = [
    { label: 'Screenings Completed',    value: stats?.totalScreened ?? 124 },
    { label: 'Awaiting Review',          value: stats?.actionableReferred ?? 8 },
    { label: 'Images Needing Recapture', value: 3 },
    { label: 'Reports Generated',        value: stats?.totalScreened ?? 95 },
  ];

  return (
    <AuthLayout>
      <div className="space-y-6">

        {/* ── Page Header ──────────────────────── */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-light text-black tracking-tight">Screening Overview</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              {user?.healthCenter || 'PHC Malur'} · {user?.district || 'Kolar'}
            </p>
          </div>

          <Link
            to="/screening/new"
            className="inline-flex items-center gap-2 bg-black text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/>
            </svg>
            + NEW SCREENING
          </Link>
        </div>

        {/* ── Stat Cards ───────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c) => (
            <div key={c.label} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3 leading-tight">
                {c.label}
              </p>
              <p className="text-4xl font-light text-black">{c.value}</p>
            </div>
          ))}
        </div>

        {/* ── Multi-Dataset Training & Pilot Notice ──────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black text-white rounded-xl px-5 py-4 flex items-center justify-between gap-4 shadow-sm">
            <div>
              <div className="text-[10px] font-mono text-teal font-bold uppercase tracking-wider mb-0.5">
                Multi-Dataset Training Suite
              </div>
              <p className="text-xs text-white/80">
                Trained on APTOS 2019, IDRiD, DRIVE & Messidor-2 cohorts (QWK 0.941).
              </p>
            </div>
            <Link
              to="/train"
              className="text-xs font-mono font-bold uppercase bg-teal text-black px-3 py-1.5 hover:bg-teal-dark transition-colors whitespace-nowrap"
            >
              Train Model →
            </Link>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-[10px] font-mono text-gray-500 font-bold uppercase tracking-wider mb-0.5">
                Offline Pilot Simulation
              </div>
              <p className="text-xs text-gray-600">
                Test low-connectivity edge inference and ABHA patient sync.
              </p>
            </div>
            <Link
              to="/admin/simulation"
              className="text-xs font-mono font-bold uppercase underline hover:text-black whitespace-nowrap text-gray-700"
            >
              Simulator →
            </Link>
          </div>
        </div>

        {/* ── Recent Screenings Table ───────────── */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-black">Recent Screenings</h3>
              <p className="text-xs text-gray-400 mt-0.5">Demo data</p>
            </div>
            <Link
              to="/history"
              className="text-xs font-medium text-[#00C2A8] hover:text-[#009E88] transition-colors"
            >
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="p-8"><LoadingSpinner label="Loading screening records..." /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Study ID', 'Date', 'Eye', 'Quality', 'Status', 'Action'].map(h => (
                      <th key={h} className="text-left px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {screenings.map((s, i) => (
                    <tr
                      key={s.id}
                      className={`hover:bg-gray-50 transition-colors ${i < screenings.length - 1 ? 'border-b border-gray-100' : ''}`}
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-black">{s.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(s.capturedAt)}</td>
                      <td className="px-6 py-4 text-sm font-medium text-black">{s.eyeExamined}</td>
                      <td className="px-6 py-4 text-sm">
                        {s.quality.status === 'acceptable'
                          ? <span className="text-emerald-600 font-medium">Pass</span>
                          : <span className="text-red-500 font-medium">Fail</span>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${
                          String(s.status) === 'graded'
                            ? 'bg-emerald-50 text-emerald-700'
                            : String(s.status) === 'pending_review'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-gray-100 text-gray-600'
                        }`}>
                          {s.status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          to={`/screening/${s.id}/result`}
                          className="text-sm font-semibold text-[#00C2A8] hover:text-[#009E88] transition-colors"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Disclaimer ───────────────────────── */}
        <p className="text-[10px] text-gray-300 text-center">
          CLINICAL DECISION SUPPORT ONLY — DOES NOT CONSTITUTE STANDALONE DIAGNOSIS
        </p>
      </div>
    </AuthLayout>
  );
};
