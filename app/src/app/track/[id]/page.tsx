'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft, Share2, CheckCircle2, MapPin, Sparkles, Award, RefreshCw, Info, Calendar, ShieldCheck, ArrowRight
} from 'lucide-react';
import { useReportStore } from '@/store/report-store';
import OpenStreetMap from '@/components/OpenStreetMap';
import DisclosureBanner from '@/components/DisclosureBanner';
import type { CaseStatus } from '@/lib/types';
import { getSavedPersonalCases } from '@/lib/personal-data';

const STAGES: { id: CaseStatus; title: string; desc: string; date: string; badge?: string }[] = [
  {
    id: 'RECEIVED',
    title: 'Evidence Received',
    desc: 'Initial report and media uploaded successfully.',
    date: 'Oct 24, 10:14 AM',
  },
  {
    id: 'VERIFIED',
    title: 'Location Confirmed',
    desc: 'Geospatial data verified against civic boundaries.',
    date: 'Oct 24, 10:15 AM',
  },
  {
    id: 'VERIFIED',
    title: 'Asset Matched',
    desc: 'Matched to existing infrastructure record: Shanthinagar Corridor Segment R-842.',
    date: 'Oct 24, 10:15 AM',
    badge: '✨ AI Verified (98%)',
  },
  {
    id: 'ROUTED',
    title: 'Case Prepared',
    desc: 'Dossier generated with automated severity assessment.',
    date: 'Oct 24, 10:18 AM',
  },
  {
    id: 'ROUTED',
    title: 'Routed to Department',
    desc: 'Assigned to Office of Sri Dr. M. G. Parameshwara, IAS (Commissioner & Higher Authority).',
    date: 'Oct 24, 11:30 AM',
  },
  {
    id: 'INSPECTION',
    title: 'Inspection',
    desc: 'Field officer Er. Rajesh V. Gowda dispatched to site for physical evaluation.',
    date: 'In Progress since Oct 25, 09:00 AM',
    badge: 'CURRENT',
  },
  {
    id: 'REPAIR',
    title: 'Repair & Resolution',
    desc: 'Pending inspection outcome and contractor work order issuance.',
    date: 'Scheduled after site review',
  },
  {
    id: 'RESOLVED',
    title: 'Case Resolved',
    desc: 'Final sign-off, quality audit & case closure.',
    date: 'Awaiting completion',
  },
];

const PHASE_EXPLANATIONS: Record<string, { title: string; desc: string; duration: string }> = {
  RECEIVED: {
    title: 'Understanding this Phase',
    desc: 'Your evidence and photos are logged in the secure Karnataka Civic Registry queue awaiting spatial coordinate validation.',
    duration: '0 - 2 hours',
  },
  VERIFIED: {
    title: 'Understanding this Phase',
    desc: 'Geospatial coordinates have been validated and cross-referenced with public infrastructure asset records and active tenders.',
    duration: '2 - 6 hours',
  },
  ROUTED: {
    title: 'Understanding this Phase',
    desc: 'The official dossier has been transmitted to the Office of the Commissioner & Higher Authority for executive assignment.',
    duration: '6 - 12 hours',
  },
  INSPECTION: {
    title: 'Understanding this Phase',
    desc: 'The Inspection phase means a municipal engineer has been physically dispatched to the reported coordinates. They will assess the severity of the damage, estimate required materials, and finalize the repair work order.',
    duration: '24 - 48 hours',
  },
  REPAIR: {
    title: 'Understanding this Phase',
    desc: 'The contractor under defect liability warranty has been issued an emergency work order to perform asphalt resurfacing and site restoration.',
    duration: '48 - 72 hours',
  },
  RESOLVED: {
    title: 'Understanding this Phase',
    desc: 'The site has been inspected, repaired under warranty, and audited. Case is fully closed with citizen contributor credit.',
    duration: 'Completed',
  },
};

const STATUS_ORDER: CaseStatus[] = ['RECEIVED', 'VERIFIED', 'ROUTED', 'INSPECTION', 'REPAIR', 'RESOLVED'];

export default function TrackPage() {
  const router = useRouter();
  const params = useParams();
  const caseId = (params.id as string) || 'CIV-KAR-10482';
  const isSakalaCase = caseId.includes('SAK') || caseId.includes('KAR-SAK');
  const { imageUrl, location } = useReportStore();

  const savedCases = getSavedPersonalCases();
  const matchedPersonal = savedCases.find((c) => c.id === caseId || c.displayId === caseId);

  const [currentStatus, setCurrentStatus] = useState<CaseStatus>('INSPECTION');
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateNext = () => {
    const currentIdx = STATUS_ORDER.indexOf(currentStatus);
    if (currentIdx < STATUS_ORDER.length - 1) {
      const next = STATUS_ORDER[currentIdx + 1];
      setCurrentStatus(next);
      if (next === 'RESOLVED') {
        setShowBadgeModal(true);
      }
    }
  };

  const phaseInfo = PHASE_EXPLANATIONS[currentStatus] || PHASE_EXPLANATIONS.INSPECTION;
  const activeImage = imageUrl || '/demo-pothole.jpg';

  return (
    <div className="px-4 md:px-8 pt-6 space-y-6 max-w-7xl mx-auto pb-16 animate-fadeIn text-[var(--color-text-primary)]">
      
      {/* Sakala Case Banner if personal grievance */}
      {isSakalaCase && (
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-2xl shadow-md flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏛️</span>
            <div>
              <h4 className="font-extrabold text-sm text-white">Karnataka Sakala Act 2011 Legal Petition Track</h4>
              <p className="text-xs text-red-100 font-mono">Case ID: {caseId} • Statutory Penalty Notice Active</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-white/20 text-white text-xs font-mono font-extrabold rounded-full border border-white/30">
            Section 8 Fine Active
          </span>
        </div>
      )}

      {/* Top Header Bar 1:1 Stitch */}
      <div className="flex items-center justify-between border-b border-[var(--color-outline-variant)] pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/cases')}
            className="w-9 h-9 rounded-xl bg-white border border-[var(--color-outline-variant)] hover:bg-[var(--color-surface-container)] flex items-center justify-center text-[var(--color-text-primary)] transition-colors"
            aria-label="Go back to cases"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--color-text-tertiary)] block">
              {isSakalaCase ? 'SAKALA CITIZEN CASE DETAILS' : 'CIVIC CASE DETAILS'}
            </span>
            <h1 className="text-xl md:text-2xl font-black text-[var(--color-text-primary)] font-mono">
              {caseId}
            </h1>
          </div>
        </div>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-4 py-2 bg-white border border-[var(--color-outline-variant)] hover:bg-[var(--color-surface-container)] rounded-xl text-xs font-extrabold text-[var(--color-text-primary)] shadow-sm transition-colors"
        >
          <Share2 size={15} />
          {copied ? 'Copied!' : 'Share'}
        </button>
      </div>

      {/* Main Status Banner Card 1:1 Stitch */}
      <div className="bg-blue-50/80 rounded-3xl border-2 border-blue-200 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-4xl font-black text-[var(--color-text-primary)] tracking-tight">
            {currentStatus === 'INSPECTION' ? 'Inspection in Progress' : `${currentStatus} Stage`}
          </h2>
          <p className="text-xs text-[var(--color-text-secondary)] font-semibold flex items-center gap-1.5">
            <Calendar size={14} className="text-[var(--color-civic-blue)]" /> Reported on Oct 24, 2024 at 10:14 AM
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[var(--color-civic-blue)] text-white font-extrabold text-xs shadow-md">
            <span className="w-2 h-2 rounded-full bg-cyan-300 animate-ping" />
            ACTIVE STATUS
          </span>
        </div>
      </div>

      {/* Main 2-Column Layout (Left 8 cols, Right 4 cols) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Case Tracking Journey Timeline */}
        <div className="md:col-span-7 bg-white rounded-3xl border border-[var(--color-outline-variant)] p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-[var(--color-outline-variant)] pb-4">
            <h3 className="text-lg font-extrabold text-[var(--color-text-primary)] flex items-center gap-2">
              <span className="text-[var(--color-civic-blue)]">📈</span> Case Tracking Journey
            </h3>

            {currentStatus !== 'RESOLVED' && (
              <button
                onClick={handleSimulateNext}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
              >
                <RefreshCw size={13} /> Simulate Next Stage →
              </button>
            )}
          </div>

          {/* 8-Stage Connected Vertical Timeline List */}
          <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-blue-100">
            {STAGES.map((stage, idx) => {
              const isPast = STATUS_ORDER.indexOf(currentStatus) > STATUS_ORDER.indexOf(stage.id);
              const isCurrent = currentStatus === stage.id && idx === 5; // Highlight active inspection step
              
              return (
                <div key={idx} className="relative flex items-start gap-4">
                  {/* Timeline Dot Icon */}
                  <div
                    className={`absolute -left-6 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all z-10 ${
                      isPast
                        ? 'bg-teal-600 text-white shadow-sm'
                        : isCurrent
                        ? 'bg-[var(--color-civic-blue)] text-white shadow-md ring-4 ring-blue-100'
                        : 'bg-white border-2 border-gray-300 text-gray-400'
                    }`}
                  >
                    {isPast ? <CheckCircle2 size={14} /> : isCurrent ? <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" /> : ''}
                  </div>

                  {/* Stage Content Container */}
                  <div
                    className={`flex-1 p-4 rounded-2xl border transition-all ${
                      isCurrent
                        ? 'bg-blue-50/80 border-2 border-[var(--color-civic-blue)] shadow-md'
                        : isPast
                        ? 'bg-white border-gray-200'
                        : 'bg-gray-50/50 border-gray-100 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-[var(--color-text-primary)]">
                          {stage.title}
                        </h4>
                        {stage.badge && (
                          <span
                            className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                              stage.badge === 'CURRENT'
                                ? 'bg-[var(--color-civic-blue)] text-white'
                                : 'bg-teal-100 text-teal-800 border border-teal-300'
                            }`}
                          >
                            {stage.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-[var(--color-text-tertiary)]">
                        {stage.date}
                      </span>
                    </div>

                    <p className="text-xs text-[var(--color-text-secondary)] font-medium leading-relaxed">
                      {stage.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Understanding this Phase + Case Summary 1:1 Stitch */}
        <div className="md:col-span-5 space-y-6">
          
          {/* Card 1: Understanding this Phase 1:1 */}
          <div className="bg-blue-50/80 rounded-3xl border border-blue-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-[var(--color-civic-blue)] font-extrabold text-sm">
              <Info size={18} />
              <span>{phaseInfo.title}</span>
            </div>

            <p className="text-xs text-blue-950 font-medium leading-relaxed">
              {phaseInfo.desc}
            </p>

            <div className="pt-3 border-t border-blue-200/80 flex justify-between items-center text-xs font-bold">
              <span className="text-[var(--color-text-tertiary)] uppercase tracking-wider text-[10px]">Estimated phase duration:</span>
              <span className="text-[var(--color-civic-blue)] font-mono">{phaseInfo.duration}</span>
            </div>
          </div>

          {/* Card 2: Case Summary 1:1 Stitch */}
          <div className="bg-white rounded-3xl border border-[var(--color-outline-variant)] p-6 space-y-6 shadow-sm">
            <h3 className="text-base font-extrabold text-[var(--color-text-primary)] border-b border-[var(--color-outline-variant)] pb-3">
              Case Summary
            </h3>

            {/* Issue Category */}
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-[var(--color-text-tertiary)] uppercase tracking-wider block">
                ISSUE CATEGORY
              </span>
              <p className="font-extrabold text-sm text-[var(--color-text-primary)]">
                {isSakalaCase
                  ? matchedPersonal?.title || 'Gruha Lakshmi ₹2,000 Monthly DBT Payment Delayed'
                  : 'Deep Pothole & Surface Degradation'}
              </p>
            </div>

            {/* Verified Location */}
            <div className="space-y-3 pt-2 border-t border-[var(--color-outline-variant)]">
              <span className="text-[10px] font-extrabold text-[var(--color-text-tertiary)] uppercase tracking-wider block">
                VERIFIED LOCATION
              </span>
              <div className="flex items-start gap-2 text-xs font-bold text-[var(--color-text-primary)]">
                <MapPin size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                <span>{location?.address || '12th Main Road, Sector 4, Indiranagar, Bengaluru, 560038'}</span>
              </div>

              {/* OpenStreetMap Component Box */}
              <OpenStreetMap
                latitude={location?.latitude || 12.9716}
                longitude={location?.longitude || 77.5946}
                title="Case Location Map"
                address={location?.address || 'Shanthinagar Main Road, Ward 42'}
                height="200px"
              />
            </div>

            {/* Submitted Evidence (For public civic cases) */}
            {!isSakalaCase && (
              <div className="space-y-3 pt-2 border-t border-[var(--color-outline-variant)]">
                <span className="text-[10px] font-extrabold text-[var(--color-text-tertiary)] uppercase tracking-wider block">
                  SUBMITTED EVIDENCE (2)
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl overflow-hidden border border-[var(--color-outline-variant)] h-32 relative group shadow-sm bg-slate-100">
                    <img
                      src={activeImage}
                      alt="Evidence photo 1"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/demo-pothole.jpg';
                      }}
                    />
                  </div>
                  <div className="rounded-xl overflow-hidden border border-[var(--color-outline-variant)] h-32 relative group shadow-sm bg-slate-100">
                    <img
                      src="/demo-pothole.jpg"
                      alt="Evidence photo 2"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Badge Award Banner on Resolution */}
      {showBadgeModal && (
        <div className="bg-gradient-to-br from-[var(--color-civic-blue)] via-[var(--color-civic-blue-dark)] to-[#001946] text-white rounded-3xl p-8 space-y-4 shadow-2xl text-center relative overflow-hidden animate-fadeIn">
          <div className="w-20 h-20 mx-auto rounded-full bg-[var(--color-trust-emerald-light)] text-[var(--color-trust-emerald-dark)] flex items-center justify-center shadow-lg">
            <Award size={44} />
          </div>
          <div>
            <h3 className="text-2xl font-black">Verified Civic Contributor Badge Earned!</h3>
            <p className="text-xs text-white/80 max-w-md mx-auto mt-1 font-medium">
              Your reported issue has been verified and resolved by the department. You earned the Verified Civic Contributor badge for Ward 42.
            </p>
          </div>
          <button
            onClick={() => router.push('/badge/sujal-civic')}
            className="px-6 py-3 bg-white text-[var(--color-civic-blue)] rounded-xl font-extrabold text-xs shadow-md hover:bg-gray-100 transition-all inline-flex items-center gap-2"
          >
            View Shareable Contributor Badge <ArrowRight size={14} />
          </button>
        </div>
      )}

      <DisclosureBanner />
    </div>
  );
}
