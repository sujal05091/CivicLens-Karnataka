'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Send, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useReportStore } from '@/store/report-store';
import { FALLBACK_COMPLAINT, DEMO_LOCATION } from '@/lib/demo-data';
import DisclosureBanner from '@/components/DisclosureBanner';

export default function ReviewPage() {
  const router = useRouter();
  const { aiAnalysis, location, civicIntelligence, imageUrl, setComplaint } = useReportStore();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requestedAction, setRequestedAction] = useState('');

  const loc = location || DEMO_LOCATION;
  const issueType = aiAnalysis?.issueType || 'pothole';
  const severity = aiAnalysis?.severity || 'high';

  useEffect(() => {
    fetchComplaintDraft();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchComplaintDraft = async () => {
    setLoading(true);

    try {
      const res = await fetch('/api/complaints/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issueType,
          severity,
          description: aiAnalysis?.description || 'Civic infrastructure defect',
          location: loc.address,
          projectReference: civicIntelligence?.project?.projectName || 'N/A',
          maintenanceStatus: civicIntelligence?.maintenanceStatus || 'N/A',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setTitle(data.title);
        setDescription(data.description);
        setRequestedAction(data.requestedAction);
      } else {
        throw new Error('Failed');
      }
    } catch {
      setTitle(FALLBACK_COMPLAINT.title);
      setDescription(FALLBACK_COMPLAINT.description);
      setRequestedAction(FALLBACK_COMPLAINT.requestedAction);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    const draft = {
      title,
      category: issueType,
      description,
      location: loc.address,
      evidenceSummary: `Photographic evidence attached. ${aiAnalysis?.evidenceNotes?.join('. ') || ''}`,
      projectReference: civicIntelligence?.project?.projectName || 'No project match',
      requestedAction,
    };

    setComplaint(draft);

    try {
      const res = await fetch('/api/mock-government/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          complaint: draft,
          location: loc,
          imageUrl,
          civicAssetId: civicIntelligence?.asset?.id,
          projectId: civicIntelligence?.project?.id,
          authorityId: civicIntelligence?.authority?.id,
        }),
      });

      const data = await res.json();
      useReportStore.getState().setCaseId(data.caseId);
      router.push('/submitted');
    } catch {
      const caseId = `DEMO-CIV-${10000 + Math.floor(Math.random() * 90000)}`;
      useReportStore.getState().setCaseId(caseId);
      router.push('/submitted');
    }
  };

  return (
    <div className="px-4 md:px-8 pt-6 space-y-6 max-w-4xl mx-auto pb-10">
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
          <h1 className="text-2xl font-extrabold text-[var(--color-text-primary)]">Complaint Builder & Final Review</h1>
          <p className="text-xs text-[var(--color-text-tertiary)]">Step 5 of 5: Complaint Formulation</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)] p-6 md:p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-2 pb-4 border-b border-[var(--color-outline-variant)]">
          <FileText size={20} className="text-[var(--color-civic-blue)]" />
          <h2 className="text-lg font-bold">Generated Factual Complaint</h2>
        </div>

        {loading ? (
          <div className="py-12 text-center space-y-3">
            <Loader2 size={36} className="animate-spin text-[var(--color-civic-blue)] mx-auto" />
            <p className="font-semibold text-sm text-[var(--color-text-secondary)]">
              Formulating factual complaint draft using AI assistance...
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Context Summary Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-[var(--color-surface-container-low)] p-4 rounded-xl border border-[var(--color-outline-variant)]">
              <div>
                <p className="text-xs font-bold text-[var(--color-text-tertiary)] uppercase">Issue Category</p>
                <p className="font-bold text-sm text-[var(--color-text-primary)] capitalize mt-0.5">
                  {issueType.replace(/_/g, ' ')}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--color-text-tertiary)] uppercase">Location</p>
                <p className="font-semibold text-xs text-[var(--color-text-primary)] truncate mt-0.5">{loc.address}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--color-text-tertiary)] uppercase">Project Context</p>
                <p className="font-semibold text-xs text-[var(--color-civic-blue)] truncate mt-0.5">
                  {civicIntelligence?.project?.projectName || 'General Civic Area'}
                </p>
              </div>
            </div>

            {/* Editable Form */}
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-xs font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-1">
                  Complaint Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] font-semibold text-sm focus:border-[var(--color-civic-blue)] focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-xs font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-1">
                  Factual Description (Editable)
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] text-sm text-[var(--color-text-primary)] font-normal focus:border-[var(--color-civic-blue)] focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <div>
                <label htmlFor="action" className="block text-xs font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-1">
                  Requested Inspection / Action
                </label>
                <textarea
                  id="action"
                  value={requestedAction}
                  onChange={(e) => setRequestedAction(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] text-sm text-[var(--color-text-primary)] font-normal focus:border-[var(--color-civic-blue)] focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Non-accusatory reminder */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center gap-2">
              <ShieldAlert size={16} className="text-[var(--color-civic-blue)] flex-shrink-0" />
              <span>Complaints are compiled objectively without personal allegations or legal accusations.</span>
            </div>

            {/* Submit CTA */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center justify-center gap-2 w-full py-4 px-6 bg-[var(--color-civic-blue)] text-white rounded-2xl font-bold text-base shadow-lg hover:bg-[var(--color-civic-blue-dark)] active:scale-95 transition-all disabled:opacity-50 min-h-[56px]"
            >
              {submitting ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              Submit Demo Case
            </button>
          </div>
        )}
      </div>

      <DisclosureBanner />
    </div>
  );
}
