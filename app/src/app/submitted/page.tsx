'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, CheckCircle2, Building2, History, Hash, ShieldAlert } from 'lucide-react';
import { useReportStore } from '@/store/report-store';
import DisclosureBanner from '@/components/DisclosureBanner';
import { getSavedPersonalCases } from '@/lib/personal-data';

function SubmittedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeCaseId = useReportStore((s) => s.caseId);
  const civicIntelligence = useReportStore((s) => s.civicIntelligence);

  const queryCaseId = searchParams.get('caseId');
  const refNumber = queryCaseId || storeCaseId || 'CIV-KAR-10482';
  const isSakalaCase = refNumber.includes('SAK') || refNumber.includes('KAR-SAK');

  const savedCases = getSavedPersonalCases();
  const matchedPersonal = savedCases.find((c) => c.id === refNumber || c.displayId === refNumber);

  const higherOfficer = civicIntelligence?.higherOfficer;
  const destination = isSakalaCase
    ? (matchedPersonal?.officerName
        ? `Women & Child Development Dept — ${matchedPersonal.officerName} (Sakala Officer)`
        : 'Women & Child Development Department (Karnataka Sakala Mission)')
    : higherOfficer
    ? `${higherOfficer.department} (${higherOfficer.name})`
    : civicIntelligence?.authority?.name || 'Public Works & Urban Infrastructure Directorate';

  return (
    <div className="px-4 py-12 max-w-xl mx-auto space-y-6 animate-fadeIn">
      {/* Stitch Submission Success Card 1:1 */}
      <div className="bg-white rounded-3xl border border-[var(--color-outline-variant)] p-8 text-center space-y-6 shadow-xl">
        
        {/* Top Check Icon */}
        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl shadow-inner ${isSakalaCase ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
          {isSakalaCase ? <ShieldAlert size={44} className="text-red-600" /> : <CheckCircle2 size={44} className="text-emerald-600 fill-emerald-100" />}
        </div>

        {/* Heading & Subtitle */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-black text-[var(--color-text-primary)] tracking-tight">
            {isSakalaCase ? 'Sakala Legal Petition Registered' : 'Your case is ready'}
          </h1>
          <p className="text-xs md:text-sm text-[var(--color-text-secondary)] font-medium max-w-sm mx-auto leading-relaxed">
            {isSakalaCase
              ? 'Statutory penalty notice registered under Section 8 of Karnataka Sakala Services Act 2011. Transmitted to Designated Officer.'
              : 'The report has been securely registered. It is now in the queue for the appropriate civic department.'}
          </p>
        </div>

        {/* Details Box (1:1 Stitch Box) */}
        <div className="bg-blue-50/70 rounded-2xl border border-blue-100 p-5 space-y-4 text-left text-xs">
          
          {/* Row 1: Case ID */}
          <div className="flex items-center justify-between border-b border-blue-100 pb-3">
            <span className="text-[var(--color-text-tertiary)] font-bold flex items-center gap-1.5">
              <Hash size={14} className="text-[var(--color-civic-blue)]" /> Case ID
            </span>
            <span className="bg-blue-100 text-[var(--color-civic-blue)] font-mono font-extrabold text-xs px-3 py-1 rounded-lg">
              {refNumber}
            </span>
          </div>

          {/* Row 2: Destination */}
          <div className="flex items-center justify-between border-b border-blue-100 pb-3 gap-4">
            <span className="text-[var(--color-text-tertiary)] font-bold flex items-center gap-1.5 flex-shrink-0">
              <Building2 size={14} className="text-[var(--color-civic-blue)]" /> Destination Department
            </span>
            <span className="font-extrabold text-[var(--color-text-primary)] text-right leading-tight">
              {destination}
            </span>
          </div>

          {/* Row 3: Timeline Status */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[var(--color-text-tertiary)] font-bold flex items-center gap-1.5">
              <History size={14} className="text-[var(--color-civic-blue)]" /> Timeline
            </span>
            <span className="bg-emerald-100 text-emerald-800 font-extrabold text-xs px-3 py-1 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
              Submitted: Just now
            </span>
          </div>

        </div>

        {/* Action Buttons 1:1 */}
        <div className="space-y-3 pt-2">
          {/* Primary Button */}
          <button
            onClick={() => router.push(`/track/${refNumber}`)}
            className="w-full py-4 px-6 bg-[var(--color-civic-blue)] hover:bg-[var(--color-civic-blue-dark)] active:scale-95 text-white rounded-full font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 min-h-[50px]"
          >
            <span>Track your case</span>
            <ArrowRight size={18} />
          </button>

          {/* Secondary Button */}
          <button
            onClick={() => router.push('/')}
            className="w-full py-4 px-6 bg-white hover:bg-gray-50 border border-[var(--color-outline-variant)] text-[var(--color-text-primary)] rounded-full font-black text-sm transition-all text-center min-h-[50px]"
          >
            Back to Home
          </button>
        </div>

      </div>

      <DisclosureBanner />
    </div>
  );
}

export default function SubmittedPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center font-extrabold text-sm text-slate-500">Loading case confirmation...</div>}>
      <SubmittedContent />
    </Suspense>
  );
}
