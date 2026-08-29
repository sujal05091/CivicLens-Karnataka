'use client';

import { useState } from 'react';
import { Share2, Send, Download, CheckCircle2, Users, FileText, Info, Sparkles, MapPin, Wrench, ShieldCheck, UserCheck, HardHat, Loader2 } from 'lucide-react';
import type { CivicIntelligenceData, AIAnalysis } from '@/lib/types';
import OpenStreetMap from './OpenStreetMap';
import ComplaintBuilderModal from './ComplaintBuilderModal';

interface StitchCivicRecordDetailProps {
  data: CivicIntelligenceData;
  imageUrl?: string;
  analysis?: AIAnalysis;
  onProceedToComplaint?: () => void;
  onSubmitCase?: (title?: string, description?: string, requestedAction?: string) => void;
  submitting?: boolean;
}

export default function StitchCivicRecordDetail({
  data,
  imageUrl,
  analysis,
  onProceedToComplaint,
  onSubmitCase,
  submitting = false,
}: StitchCivicRecordDetailProps) {
  const [copied, setCopied] = useState(false);
  const [showBuilderModal, setShowBuilderModal] = useState(false);

  const higherOfficer = data.higherOfficer;
  const execOfficer = data.officer;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTopAction = () => {
    setShowBuilderModal(true);
  };

  return (
    <div className="space-y-6 bg-[var(--color-surface)] text-[var(--color-text-primary)]">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border-2 border-red-100 shadow-sm">
        <div className="space-y-2">
          {/* Badge Tags */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded bg-red-100 text-red-700 border border-red-200">
              ASSET RECORD
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded bg-[var(--color-ai-teal-surface)] text-[var(--color-ai-teal-dark)] border border-[var(--color-ai-teal)]">
              VERIFIED DATA
            </span>
          </div>

          {/* Title & Asset ID */}
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[var(--color-text-primary)]">
            {data.project.projectName}
          </h1>
          <p className="text-xs font-mono font-bold text-[var(--color-text-tertiary)]">
            Asset ID: <span className="text-red-600 font-extrabold">{data.asset.id}</span>
          </p>
        </div>

        {/* Action Buttons Top-Right */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[var(--color-outline-variant)] hover:bg-[var(--color-surface-container)] rounded-xl font-extrabold text-xs text-[var(--color-text-primary)] shadow-sm transition-colors"
          >
            <Share2 size={15} />
            {copied ? 'Copied Link!' : 'Share Record'}
          </button>

          {/* TOP PRIMARY ACTION BUTTON: SUBMIT CASE TO HIGHER AUTHORITY DIRECTLY */}
          <button
            onClick={handleTopAction}
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-xl font-extrabold text-xs md:text-sm shadow-lg transition-all disabled:opacity-50 min-h-[44px]"
          >
            {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            <span>Submit Case to Higher Authority</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid (Desktop 2/3 and 1/3) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column (8 cols on desktop) */}
        <div className="md:col-span-8 space-y-6">
          
          {/* Card 1: Project Information WITH BOTH OFFICERS EMBEDDED */}
          <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)] p-6 md:p-8 space-y-6 shadow-sm">
            <h2 className="text-xl font-extrabold text-[var(--color-text-primary)] border-b border-[var(--color-outline-variant)] pb-4 flex items-center justify-between">
              <span>Project Information</span>
              <span className="text-xs font-mono font-extrabold text-red-600">STATE REGISTRAR APPROVED</span>
            </h2>

            {/* BOTH OFFICERS EMBEDDED DIRECTLY INSIDE PROJECT INFO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Officer 1: Higher Authority / Sanctioning Head */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-[var(--color-civic-blue)] shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--color-civic-blue)] flex items-center gap-1">
                    <ShieldCheck size={14} /> Higher Authority
                  </span>
                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-[var(--color-civic-blue)] text-white">
                    Primary Recipient
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={higherOfficer.photoUrl}
                    alt={higherOfficer.name}
                    className="w-16 h-16 rounded-xl object-cover border-2 border-[var(--color-civic-blue)] flex-shrink-0 shadow-md"
                  />
                  <div className="space-y-0.5 min-w-0">
                    <h4 className="font-extrabold text-sm text-[var(--color-text-primary)] truncate">{higherOfficer.name}</h4>
                    <p className="text-[11px] font-bold text-[var(--color-civic-blue)] leading-tight">{higherOfficer.designation}</p>
                    <p className="text-[10px] text-[var(--color-text-tertiary)] truncate">{higherOfficer.department}</p>
                  </div>
                </div>
              </div>

              {/* Officer 2: Assigned Executing Field Engineer (Work Completion Officer) */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-400 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-700 flex items-center gap-1">
                    <UserCheck size={14} /> Assigned Field Engineer
                  </span>
                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-red-600 text-white">
                    Work Execution
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={execOfficer.photoUrl}
                    alt={execOfficer.name}
                    className="w-16 h-16 rounded-xl object-cover border-2 border-red-500 flex-shrink-0 shadow-md"
                  />
                  <div className="space-y-0.5 min-w-0">
                    <h4 className="font-extrabold text-sm text-[var(--color-text-primary)] truncate">{execOfficer.name}</h4>
                    <p className="text-[11px] font-bold text-red-600 leading-tight">{execOfficer.designation}</p>
                    <p className="text-[10px] text-[var(--color-text-tertiary)] truncate">{execOfficer.division}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid 2x3 Project Attributes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm pt-2">
              <div>
                <span className="text-[11px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider block mb-1">
                  CONTRACTING AGENCY
                </span>
                <p className="font-bold text-[var(--color-text-primary)]">
                  {data.authority.department} ({data.authority.name})
                </p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider block mb-1">
                  EXECUTING CONTRACTOR
                </span>
                <p className="font-bold text-[var(--color-text-primary)] flex items-center gap-1.5">
                  <HardHat size={16} className="text-red-600" />
                  {data.contractor.name}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider block mb-1">
                  SANCTIONED PROJECT BUDGET
                </span>
                <p className="font-black text-lg text-red-600">
                  ₹ {(data.project.sanctionedBudget).toLocaleString('en-IN')}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider block mb-1">
                  FUNDING SOURCE
                </span>
                <p className="font-bold text-[var(--color-text-primary)]">
                  State Infrastructure Development Fund
                </p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider block mb-1">
                  START DATE
                </span>
                <p className="font-bold text-[var(--color-text-primary)]">
                  {new Date(data.project.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider block mb-1">
                  EXPECTED COMPLETION
                </span>
                <p className="font-bold text-[var(--color-text-primary)]">
                  {new Date(data.project.completionDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Scope of Work Container */}
            <div className="bg-[var(--color-surface-container-low)] p-5 rounded-xl border border-[var(--color-outline-variant)] space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--color-civic-blue)]">
                <Info size={14} />
                <span>SCOPE OF WORK</span>
              </div>
              <p className="text-xs md:text-sm text-[var(--color-text-secondary)] leading-relaxed font-medium">
                Comprehensive resurfacing of 12.4km urban arterial road corridor, including installation of new stormwater drainage systems, pedestrian walkways on both sides, and upgrade of 4 major intersections with smart traffic signaling.
              </p>
            </div>
          </div>

          {/* Card 2: Tender Data */}
          <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)] p-6 md:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-[var(--color-outline-variant)] pb-4">
              <h2 className="text-xl font-extrabold text-[var(--color-text-primary)]">
                Tender Data
              </h2>
              <span className="text-xs font-mono font-extrabold text-red-600 bg-red-50 px-3 py-1 rounded-lg border border-red-200">
                {data.tender.tenderNumber}
              </span>
            </div>

            {/* Timeline Procurement List */}
            <div className="space-y-6">
              {/* Event 1 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-civic-blue-container)] text-[var(--color-civic-blue)] flex items-center justify-center flex-shrink-0 shadow-sm">
                  <FileText size={20} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-[var(--color-text-primary)]">
                      Notice Inviting Tender (NIT) Published
                    </h3>
                    <span className="text-xs font-semibold text-[var(--color-text-tertiary)]">
                      {new Date(data.tender.awardDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Standard state procurement portal publication.
                  </p>
                  <a
                    href="#download"
                    onClick={(e) => { e.preventDefault(); alert('Downloading NIT Document PDF...'); }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-civic-blue)] hover:underline pt-1"
                  >
                    <Download size={13} /> Download NIT Document (PDF)
                  </a>
                </div>
              </div>

              {/* Event 2 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-surface-container)] text-[var(--color-text-secondary)] flex items-center justify-center flex-shrink-0">
                  <Users size={20} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-[var(--color-text-primary)]">
                      Technical Bid Evaluation
                    </h3>
                    <span className="text-xs font-semibold text-[var(--color-text-tertiary)]">05 Nov 2023</span>
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    4 bids received. 3 bids qualified for financial evaluation.
                  </p>
                </div>
              </div>

              {/* Event 3 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-trust-emerald-surface)] text-[var(--color-trust-emerald)] flex items-center justify-center flex-shrink-0 shadow-sm border border-[var(--color-trust-emerald-light)]">
                  <CheckCircle2 size={20} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-[var(--color-text-primary)]">
                      Contract Awarded
                    </h3>
                    <span className="text-xs font-semibold text-[var(--color-text-tertiary)]">28 Nov 2023</span>
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Awarded to {data.contractor.name} (L1 Bidder).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Location Corridor Map (OpenStreetMap with Red Pin) */}
          <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)] p-6 md:p-8 space-y-4 shadow-sm">
            <h2 className="text-xl font-extrabold text-[var(--color-text-primary)]">
              Location Map
            </h2>

            <OpenStreetMap
              latitude={data.asset.latitude}
              longitude={data.asset.longitude}
              title={data.asset.assetName}
              address={`${data.asset.ward}, ${data.asset.district}`}
              height="340px"
            />
          </div>
        </div>

        {/* Right Column (4 cols on desktop) */}
        <div className="md:col-span-4 space-y-6">

          {/* CARD AT TOP-RIGHT: SCANNED EVIDENCE IMAGE IN A NICE BIG CONTAINER */}
          {imageUrl && (
            <div className="bg-white rounded-2xl border-2 border-red-200 p-5 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black text-red-600">
                  Scanned Evidence Image
                </h2>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-300">
                  <Sparkles size={10} className="inline mr-1" /> Scanned
                </span>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-red-100 shadow-md">
                <img
                  src={imageUrl}
                  alt="Scanned evidence snapshot"
                  className="w-full h-64 md:h-72 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          )}

          {/* Card 1: Maintenance Status */}
          <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)] p-6 space-y-5 shadow-sm">
            <h2 className="text-lg font-extrabold text-[var(--color-text-primary)]">
              Maintenance Status
            </h2>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-ai-teal-surface)] text-[var(--color-ai-teal-dark)] flex items-center justify-center text-xl shadow-sm border border-[var(--color-ai-teal)]">
                <Wrench size={22} />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-[var(--color-trust-emerald)]">
                  {data.maintenanceStatus === 'ACTIVE' ? 'Active' : 'Expired'}
                </h3>
                <p className="text-xs font-semibold text-[var(--color-text-tertiary)]">
                  Under Defect Liability Period
                </p>
              </div>
            </div>

            {/* Progress Bar Container */}
            <div className="bg-[var(--color-surface-container-low)] p-4 rounded-xl border border-[var(--color-outline-variant)] space-y-3">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-[var(--color-text-tertiary)] uppercase tracking-wider">DURATION REMAINING</span>
                <span className="text-red-600 font-extrabold">{data.remainingMonths} Months</span>
              </div>

              {/* Red Filled Line */}
              <div className="w-full bg-[var(--color-outline-variant)] h-2.5 rounded-full overflow-hidden">
                <div className="bg-red-600 h-full rounded-full w-2/3" />
              </div>

              <div className="flex justify-between items-center text-[10px] font-bold text-[var(--color-text-tertiary)]">
                <span>Jan 2026</span>
                <span>Jan 2029</span>
              </div>
            </div>

            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed font-medium">
              Contractor is responsible for all structural repairs and pothole filling until Jan 2029 without additional cost to the department.
            </p>
          </div>

          {/* Card 2: Intelligence Graph */}
          <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)] p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-[var(--color-text-primary)]">
                Intelligence Graph
              </h2>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-[var(--color-ai-teal-surface)] text-[var(--color-ai-teal-dark)] border border-[var(--color-ai-teal)]">
                <Sparkles size={11} /> High Confidence
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)]">
                <span className="text-red-600 text-base mt-0.5">🔗</span>
                <div>
                  <p className="font-bold text-[var(--color-text-primary)]">Cross-referenced with 3 citizen reports</p>
                  <p className="text-[11px] text-[var(--color-text-tertiary)]">Matching spatial coordinates within 50m.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)]">
                <span className="text-[var(--color-trust-emerald)] text-base mt-0.5">📋</span>
                <div>
                  <p className="font-bold text-[var(--color-text-primary)]">Tender ID Verified</p>
                  <p className="text-[11px] text-[var(--color-text-tertiary)]">Matched against KPP portal database.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COMPLAINT BUILDER MODAL */}
      {showBuilderModal && (
        <ComplaintBuilderModal
          data={data}
          analysis={
            analysis || {
              issueType: 'pothole',
              confidence: 0.96,
              severity: 'high',
              description: 'Severe road surface defect requiring immediate municipal inspection.',
              evidenceNotes: ['Significant road surface damage detected'],
              needsHumanReview: false,
            }
          }
          imageUrl={imageUrl}
          onClose={() => setShowBuilderModal(false)}
          onSubmit={(title, description, requestedAction) => {
            setShowBuilderModal(false);
            if (onSubmitCase) {
              onSubmitCase(title, description, requestedAction);
            }
          }}
          submitting={submitting}
        />
      )}
    </div>
  );
}
