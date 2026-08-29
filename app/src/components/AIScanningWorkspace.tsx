'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, ShieldAlert, Sparkles, ArrowLeft, Loader2, RefreshCw, Check } from 'lucide-react';
import type { AIAnalysis } from '@/lib/types';

interface AIScanningWorkspaceProps {
  imageUrl: string;
  analysis: AIAnalysis;
  onConfirm: () => void;
  onChangeCategory?: () => void;
  onBack?: () => void;
}

export default function AIScanningWorkspace({
  imageUrl,
  analysis,
  onConfirm,
  onChangeCategory,
  onBack,
}: AIScanningWorkspaceProps) {
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    // Scan animation duration (5.5 seconds)
    const timer = setTimeout(() => setScanning(false), 5500);
    return () => clearTimeout(timer);
  }, []);

  const issueTitle = analysis.issueType.replace(/_/g, ' ').toUpperCase();
  const confidencePercent = Math.round((analysis.confidence || 0.96) * 100);

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-[var(--color-text-primary)] animate-fadeIn">
      {/* Top Bar Header */}
      <div className="flex items-center justify-between border-b border-[var(--color-outline-variant)] pb-4">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-extrabold text-[var(--color-civic-blue)] hover:underline"
          >
            <ArrowLeft size={16} /> Back to Report
          </button>
        )}
        <div className="text-center flex-1">
          <span className="font-extrabold text-sm text-[var(--color-civic-blue)]">CivicLens</span>
        </div>
      </div>

      {/* Main Heading & Subtitle */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-black text-[var(--color-text-primary)] tracking-tight">
          Understanding your evidence
        </h1>
        <p className="text-xs md:text-sm text-[var(--color-text-secondary)] font-medium">
          Our system is analyzing your submission to help route it efficiently.
        </p>
      </div>

      {/* Main Card Container (2-Column Grid) */}
      <div className="bg-white rounded-3xl border border-[var(--color-outline-variant)] p-6 md:p-8 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Image with Glowing Laser Line Scanning Animation */}
          <div className="md:col-span-6 relative rounded-2xl overflow-hidden border border-[var(--color-outline-variant)] shadow-md bg-slate-900 group">
            <img
              src={imageUrl}
              alt="Uploaded civic evidence"
              className="w-full h-72 md:h-96 object-cover filter contrast-[1.05]"
            />

            {/* Glowing Teal Laser Scanning Bar Animation */}
            {scanning && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Vertical Moving Cyan Laser Beam Line */}
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-scanLine absolute top-0" />
                
                {/* Laser Grid Mask Tint */}
                <div className="absolute inset-0 bg-cyan-500/10 backdrop-hue-rotate-15 transition-opacity" />
              </div>
            )}

            {/* AI Targeted Bounding Box Overlay */}
            <div className="absolute top-1/3 left-1/4 w-1/2 h-1/3 border-2 border-cyan-400 bg-cyan-400/10 rounded-2xl shadow-[0_0_20px_rgba(34,211,238,0.6)] pointer-events-none flex items-start justify-end p-2 animate-pulse">
              <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
            </div>

            {/* Bottom Pill Badge: Processing Visual Data */}
            <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-cyan-300 shadow-md border border-cyan-500/30 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>{scanning ? 'PROCESSING VISUAL DATA...' : 'VISION DATA SCAN COMPLETE'}</span>
            </div>
          </div>

          {/* Right Column: AI Analysis Results Card */}
          <div className="md:col-span-6 space-y-6">
            
            {/* Top Detected Header & Confidence Pill */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
                  ⚙️
                </div>
                <h2 className="text-xl md:text-2xl font-black text-teal-700 tracking-tight">
                  {issueTitle} DETECTED
                </h2>
              </div>

              {/* 96% Confidence Pill Badge */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 border border-teal-300 font-extrabold text-xs shadow-sm">
                <Sparkles size={13} /> {confidencePercent}% Confidence
              </span>
            </div>

            {/* Severity Assessment Box */}
            <div className="bg-blue-50/80 p-5 rounded-2xl border border-blue-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-blue-900 uppercase tracking-wider">
                  SEVERITY ASSESSMENT
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-600 text-white font-black text-[10px] uppercase">
                  🔴 {analysis.severity || 'HIGH'}
                </span>
              </div>
              <p className="text-xs md:text-sm text-blue-950 font-medium leading-relaxed">
                {analysis.description || 'Large visible road-surface depression. Poses immediate risk to vehicle suspension and two-wheeler traffic.'}
              </p>
            </div>

            {/* Identified Evidence Points */}
            <div className="space-y-3">
              <span className="text-[10px] font-extrabold text-[var(--color-text-tertiary)] uppercase tracking-wider block">
                IDENTIFIED EVIDENCE POINTS
              </span>

              <div className="space-y-2 text-xs font-semibold text-[var(--color-text-primary)]">
                {analysis.evidenceNotes && analysis.evidenceNotes.length > 0 ? (
                  analysis.evidenceNotes.map((note, idx) => (
                    <div key={idx} className="flex items-center gap-2.5">
                      <CheckCircle2 size={16} className="text-teal-600 flex-shrink-0" />
                      <span>{note}</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 size={16} className="text-teal-600 flex-shrink-0" />
                      <span>Significant road surface damage detected</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 size={16} className="text-teal-600 flex-shrink-0" />
                      <span>Visible depth indicating structural failure</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 size={16} className="text-teal-600 flex-shrink-0" />
                      <span>Potential immediate traffic hazard</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Footer Disclaimer */}
            <p className="text-[11px] text-[var(--color-text-tertiary)] font-medium">
              ⓘ AI-assisted detection — please confirm to proceed.
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              {onChangeCategory && (
                <button
                  onClick={onChangeCategory}
                  className="flex-1 py-3 px-4 bg-white border border-[var(--color-outline-variant)] hover:bg-[var(--color-surface-container)] text-[var(--color-text-primary)] rounded-xl font-extrabold text-xs transition-colors shadow-sm"
                >
                  Change category
                </button>
              )}

              <button
                onClick={onConfirm}
                className="flex-1 py-3 px-6 bg-[var(--color-civic-blue)] hover:bg-[var(--color-civic-blue-dark)] active:scale-95 text-white rounded-xl font-extrabold text-xs md:text-sm shadow-md transition-all flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Check size={18} /> Looks right
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
