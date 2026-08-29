'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { useReportStore } from '@/store/report-store';
import StitchCivicRecordDetail from '@/components/StitchCivicRecordDetail';
import {
  findNearestAsset, findProject, findTender, findContractor, findOfficer, findHigherOfficer, findAuthority,
  findNearbyDuplicates, DEMO_LOCATION,
} from '@/lib/demo-data';
import { formatMaintenanceDisplay } from '@/lib/maintenance';
import type { CivicIntelligenceData, CivicIssue } from '@/lib/types';

export default function IntelligencePage() {
  const router = useRouter();
  const { location, aiAnalysis, imageUrl, setCivicIntelligence } = useReportStore();
  const [intelligence, setIntelligence] = useState<CivicIntelligenceData | null>(null);
  const [duplicates, setDuplicates] = useState<(CivicIssue & { distance: number })[]>([]);
  const [noMatch, setNoMatch] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

  useEffect(() => {
    if (!aiAnalysis) {
      router.replace('/report');
      return;
    }

    const loc = location || DEMO_LOCATION;
    const issueType = aiAnalysis.issueType;

    const asset = findNearestAsset(loc.latitude, loc.longitude, issueType);
    if (!asset) {
      setNoMatch(true);
      return;
    }

    const project = findProject(asset.projectId);
    const tender = project ? findTender(project.tenderId) : null;
    const contractor = project ? findContractor(project.contractorId) : null;
    const officer = project ? findOfficer(project.officerId) : null;
    const higherOfficer = project ? findHigherOfficer(project.higherAuthorityId) : null;
    const authority = findAuthority(asset.authorityId);

    if (!project || !tender || !contractor || !officer || !higherOfficer || !authority) {
      setNoMatch(true);
      return;
    }

    const maintenance = formatMaintenanceDisplay(project.completionDate, project.maintenanceMonths);

    const data: CivicIntelligenceData = {
      asset,
      project,
      tender,
      contractor,
      officer,
      higherOfficer,
      authority,
      maintenanceStatus: maintenance.status,
      maintenanceEndDate: maintenance.endDate,
      remainingMonths: maintenance.remainingMonths,
    };

    setIntelligence(data);
    setCivicIntelligence(data);

    const dupes = findNearbyDuplicates(loc.latitude, loc.longitude, issueType);
    if (dupes.length > 0) {
      setDuplicates(dupes);
      setShowDuplicateModal(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleContinue = () => {
    router.push('/review');
  };

  return (
    <div className="px-4 md:px-8 pt-6 space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-[var(--color-outline-variant)] hover:bg-[var(--color-surface-container)]"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--color-text-primary)]">Civic Record Detail</h1>
          <p className="text-xs text-[var(--color-text-tertiary)]">Public Asset & Procurement Intelligence</p>
        </div>
      </div>

      {/* Duplicate Check Alert Box */}
      {showDuplicateModal && duplicates.length > 0 && (
        <div className="bg-[var(--color-alert-amber-light)] rounded-2xl border border-[var(--color-alert-amber)] p-6 space-y-4 shadow-md">
          <div className="flex items-start gap-3">
            <AlertTriangle size={24} className="text-[var(--color-alert-amber-dark)] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-extrabold text-base text-[var(--color-alert-amber-dark)]">
                This issue may already be reported nearby.
              </h3>
              <p className="text-xs text-[var(--color-alert-amber-dark)] mt-0.5">
                We detected active complaints within 200m matching your issue type.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {duplicates.map((dup) => (
              <div key={dup.id} className="bg-white rounded-xl p-4 space-y-2 border border-[var(--color-outline-variant)]">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-sm text-[var(--color-text-primary)] capitalize">
                      {dup.issueType.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-[var(--color-text-tertiary)]">{dup.distance} meters away</p>
                  </div>
                  <span className="text-xs font-mono font-bold bg-[var(--color-surface-container)] px-2.5 py-1 rounded-lg">
                    {dup.id}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => router.push('/review')}
              className="py-3 px-6 bg-[var(--color-civic-blue)] text-white rounded-xl font-bold text-sm flex-1"
            >
              Add My Evidence to Case
            </button>
            <button
              onClick={() => setShowDuplicateModal(false)}
              className="py-3 px-6 bg-white border border-[var(--color-outline-variant)] rounded-xl font-bold text-sm text-[var(--color-text-primary)] flex-1"
            >
              Report Separately
            </button>
          </div>
        </div>
      )}

      {/* Render 100% Matching Stitch Civic Record Detail */}
      {intelligence && !noMatch && (
        <StitchCivicRecordDetail
          data={intelligence}
          imageUrl={imageUrl || undefined}
          onProceedToComplaint={handleContinue}
        />
      )}
    </div>
  );
}
