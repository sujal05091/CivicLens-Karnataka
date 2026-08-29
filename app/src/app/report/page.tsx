'use client';

import { useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Camera, Upload, ArrowLeft, Loader2, Sparkles, AlertCircle, Send, ShieldCheck } from 'lucide-react';
import { useReportStore } from '@/store/report-store';
import StitchCivicRecordDetail from '@/components/StitchCivicRecordDetail';
import {
  findNearestAsset, findProject, findTender, findContractor, findOfficer, findHigherOfficer, findAuthority,
  DEMO_LOCATION, FALLBACK_AI_ANALYSIS, FALLBACK_COMPLAINT
} from '@/lib/demo-data';
import { formatMaintenanceDisplay } from '@/lib/maintenance';
import type { CivicIntelligenceData, AIAnalysis, IssueType, IssueSeverity } from '@/lib/types';
import DisclosureBanner from '@/components/DisclosureBanner';

import CameraModal from '@/components/CameraModal';
import SampleImageModal, { SampleImageOption } from '@/components/SampleImageModal';

function ReportContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { setImage, setAiAnalysis, setLocation, setCivicIntelligence, setComplaint, setCaseId } = useReportStore();

  const [preview, setPreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('Analyzing evidence photo with Gemini Vision AI...');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showSampleModal, setShowSampleModal] = useState(false);
  const [showDemoPopupModal, setShowDemoPopupModal] = useState(false);

  // Complete Instant Analysis State
  const [analysisResult, setAnalysisResult] = useState<AIAnalysis | null>(null);
  const [intelligenceData, setIntelligenceData] = useState<CivicIntelligenceData | null>(null);
  const [complaintTitle, setComplaintTitle] = useState('');
  const [complaintDescription, setComplaintDescription] = useState('');
  const [requestedAction, setRequestedAction] = useState('');

  const processImageInstant = async (file: File) => {
    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/i)) {
      setError('Please upload a valid JPG, PNG, or WebP image.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image file must be under 10MB.');
      return;
    }

    setError(null);
    setProcessing(true);

    setProcessingStep('Analyzing evidence photo with Gemini Vision AI...');
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    try {
      const base64Data = await new Promise<string>((resolve) => {
        const b64Reader = new FileReader();
        b64Reader.onload = (e) => resolve((e.target?.result as string).split(',')[1]);
        b64Reader.readAsDataURL(file);
      });

      let aiResult: AIAnalysis = FALLBACK_AI_ANALYSIS;
      try {
        const res = await fetch('/api/analyze-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Data, mimeType: file.type }),
        });
        if (res.ok) {
          aiResult = await res.json();
        }
      } catch {
        aiResult = FALLBACK_AI_ANALYSIS;
      }

      setAiAnalysis(aiResult);
      setAnalysisResult(aiResult);

      setProcessingStep('Retrieving civic record, tender data & Higher Authority...');
      const loc = DEMO_LOCATION;
      setLocation(loc);

      const asset = findNearestAsset(loc.latitude, loc.longitude, aiResult.issueType);
      const project = findProject(asset.projectId);
      const tender = findTender(project.tenderId);
      const contractor = findContractor(project.contractorId);
      const officer = findOfficer(project.officerId);
      const higherOfficer = findHigherOfficer(project.higherAuthorityId);
      const authority = findAuthority(asset.authorityId);
      const maintenance = formatMaintenanceDisplay(project.completionDate, project.maintenanceMonths);

      const intelData: CivicIntelligenceData = {
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

      setIntelligenceData(intelData);
      setCivicIntelligence(intelData);

      setProcessingStep('Auto-formulating complaint for Higher Authority...');
      try {
        const draftRes = await fetch('/api/complaints/draft', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            issueType: aiResult.issueType,
            severity: aiResult.severity,
            description: aiResult.description,
            location: loc.address,
            projectReference: project.projectName,
            maintenanceStatus: maintenance.status,
          }),
        });

        if (draftRes.ok) {
          const draft = await draftRes.json();
          setComplaintTitle(draft.title);
          setComplaintDescription(draft.description);
          setRequestedAction(draft.requestedAction);
        } else {
          setComplaintTitle(FALLBACK_COMPLAINT.title);
          setComplaintDescription(FALLBACK_COMPLAINT.description);
          setRequestedAction(FALLBACK_COMPLAINT.requestedAction);
        }
      } catch {
        setComplaintTitle(FALLBACK_COMPLAINT.title);
        setComplaintDescription(FALLBACK_COMPLAINT.description);
        setRequestedAction(FALLBACK_COMPLAINT.requestedAction);
      }

      const dataUrl = `data:${file.type};base64,${base64Data}`;
      setImage(dataUrl, base64Data, file.type);
    } catch {
      setError('Failed to process image. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleCapturedCameraPhoto = async (imageBase64: string, file: File) => {
    setShowCameraModal(false);
    await processImageInstant(file);
  };

  const handleSelectSample = async (sample: SampleImageOption) => {
    setShowSampleModal(false);
    setProcessing(true);
    setProcessingStep(`Analyzing ${sample.title} with Gemini Vision AI...`);

    const customAnalysis: AIAnalysis = {
      issueType: sample.category.toLowerCase().replace(/ /g, '_') as IssueType,
      confidence: 0.98,
      severity: sample.severity.toLowerCase() as IssueSeverity,
      description: sample.description,
      evidenceNotes: [sample.description, `Located at ${sample.location}`],
      needsHumanReview: false,
    };

    setPreview(sample.imageUrl);
    setAiAnalysis(customAnalysis);
    setAnalysisResult(customAnalysis);

    const loc = DEMO_LOCATION;
    setLocation(loc);

    const asset = findNearestAsset(loc.latitude, loc.longitude, customAnalysis.issueType);
    const project = findProject(asset.projectId);
    const tender = findTender(project.tenderId);
    const contractor = findContractor(project.contractorId);
    const officer = findOfficer(project.officerId);
    const higherOfficer = findHigherOfficer(project.higherAuthorityId);
    const authority = findAuthority(asset.authorityId);
    const maintenance = formatMaintenanceDisplay(project.completionDate, project.maintenanceMonths);

    const intelData: CivicIntelligenceData = {
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

    setIntelligenceData(intelData);
    setCivicIntelligence(intelData);

    const sampleComplaint = {
      title: `${sample.title} — ${sample.location}`,
      description: `Formal evidence intake for ${sample.category.toLowerCase()} defect (${sample.severity} severity). ${sample.description}`,
      requestedAction: `Immediate engineering inspection and repair under Tender #${tender.tenderNumber} warranty liability period.`,
    };

    setComplaintTitle(sampleComplaint.title);
    setComplaintDescription(sampleComplaint.description);
    setRequestedAction(sampleComplaint.requestedAction);
    setImage(sample.imageUrl, null, 'image/jpeg');

    setTimeout(() => {
      setProcessing(false);
    }, 5500);
  };

  const handleDemoImage = async () => {
    setShowSampleModal(true);
  };

  const handleSubmitFinal = async (customTitle?: string, customDesc?: string, customAction?: string) => {
    if (!analysisResult || !intelligenceData) return;
    setSubmitting(true);

    const finalTitle = customTitle || complaintTitle || FALLBACK_COMPLAINT.title;
    const finalDesc = customDesc || complaintDescription || FALLBACK_COMPLAINT.description;
    const finalAction = customAction || requestedAction || FALLBACK_COMPLAINT.requestedAction;

    const draft = {
      title: finalTitle,
      category: analysisResult.issueType,
      description: finalDesc,
      location: DEMO_LOCATION.address,
      evidenceSummary: `Photographic evidence attached. ${analysisResult.evidenceNotes?.join('. ') || ''}`,
      projectReference: intelligenceData.project.projectName,
      requestedAction: finalAction,
    };

    setComplaint(draft);

    try {
      const res = await fetch('/api/mock-government/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          complaint: draft,
          location: DEMO_LOCATION,
          imageUrl: preview,
          civicAssetId: intelligenceData.asset.id,
          projectId: intelligenceData.project.id,
          authorityId: intelligenceData.authority.id,
          officerId: intelligenceData.higherOfficer.id,
        }),
      });

      const data = await res.json();
      setCaseId(data.caseId);
      router.push('/submitted');
    } catch {
      const caseId = `CIV-KAR-${10000 + Math.floor(Math.random() * 90000)}`;
      setCaseId(caseId);
      router.push('/submitted');
    }
  };

  return (
    <div className="px-4 md:px-8 pt-6 space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-[var(--color-outline-variant)] hover:bg-[var(--color-surface-container)]"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-[var(--color-text-primary)]">Civic Reporting Workspace</h1>
            <p className="text-xs text-[var(--color-text-tertiary)]">Instant AI Detection, Asset Record & Higher Authority Escalation</p>
          </div>
        </div>

        {analysisResult && (
          <button
            onClick={() => {
              setAnalysisResult(null);
              setIntelligenceData(null);
              setPreview(null);
            }}
            className="px-4 py-2 bg-white border border-[var(--color-outline-variant)] hover:bg-[var(--color-surface-container)] text-[var(--color-text-primary)] rounded-xl text-xs font-bold transition-colors shadow-sm"
          >
            Scan Different Photo
          </button>
        )}
      </div>

      {/* Processing Overlay */}
      {processing && (
        <div className="bg-white rounded-3xl border border-[var(--color-civic-blue)] p-8 text-center space-y-4 shadow-lg max-w-xl mx-auto">
          <div className="w-16 h-16 mx-auto rounded-full bg-[var(--color-ai-teal-surface)] text-[var(--color-ai-teal)] flex items-center justify-center shadow-md">
            <Loader2 size={36} className="animate-spin" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-[var(--color-text-primary)]">
              Instant Intelligence Pipeline Active
            </h3>
            <p className="text-xs text-[var(--color-civic-blue)] font-semibold mt-1">
              {processingStep}
            </p>
          </div>
        </div>
      )}

      {/* Intake State */}
      {!analysisResult && !processing && (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl border-2 border-dashed border-[var(--color-civic-blue)] p-8 md:p-12 text-center space-y-6 shadow-sm">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-[var(--color-civic-blue-container)] text-[var(--color-civic-blue)] flex items-center justify-center shadow-md">
              <Camera size={36} />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h2 className="text-xl font-extrabold text-[var(--color-text-primary)]">
                Upload Evidence of Civic Problem
              </h2>
              <p className="text-xs text-[var(--color-text-tertiary)]">
                Scans image to instantly load Project Info, Tender Data, Maintenance Lifespan, and Higher Authority routing.
              </p>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-[var(--color-error-container)] rounded-2xl text-sm font-semibold text-[var(--color-error)] flex items-center gap-3">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setShowDemoPopupModal(true)}
              className="flex items-center justify-center gap-3 py-4 px-6 bg-[var(--color-civic-blue)] text-white rounded-2xl font-bold text-base shadow-md hover:bg-[var(--color-civic-blue-dark)] active:scale-95 transition-all min-h-[56px]"
            >
              <Camera size={22} />
              Take Photo
            </button>

            <button
              onClick={() => setShowDemoPopupModal(true)}
              className="flex items-center justify-center gap-3 py-4 px-6 bg-white text-[var(--color-civic-blue)] rounded-2xl font-bold text-base border-2 border-[var(--color-civic-blue)] hover:bg-[var(--color-surface-container)] active:scale-95 transition-all min-h-[56px]"
            >
              <Upload size={20} />
              Upload Device File
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && processImageInstant(e.target.files[0])}
            />

            <button
              onClick={() => setShowSampleModal(true)}
              className="flex items-center justify-center gap-2 py-4 px-6 bg-[var(--color-ai-teal-surface)] text-[var(--color-ai-teal-dark)] rounded-2xl font-bold text-base border border-[var(--color-ai-teal)] hover:bg-teal-100 active:scale-95 transition-all min-h-[56px]"
            >
              <Sparkles size={20} />
              Use Sample Image
            </button>
          </div>
        </div>
      )}

      {/* Render Camera Modal */}
      {showCameraModal && (
        <CameraModal
          onClose={() => setShowCameraModal(false)}
          onCapture={handleCapturedCameraPhoto}
        />
      )}

      {/* Render Sample Image Selection Modal */}
      {showSampleModal && (
        <SampleImageModal
          onClose={() => setShowSampleModal(false)}
          onSelectSample={handleSelectSample}
        />
      )}

      {/* Demo Guidance Instructions Popup Window */}
      {showDemoPopupModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border-4 border-amber-400 space-y-6 text-center text-[var(--color-text-primary)] relative animate-scaleUp">
            
            {/* Top Glowing Icon */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-300 text-slate-950 flex items-center justify-center mx-auto text-4xl shadow-xl border-4 border-white animate-bounce">
              💡
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono font-extrabold text-amber-700 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full uppercase tracking-wider">
                Hackathon Demo Instructions
              </span>
              <h3 className="text-xl md:text-2xl font-black text-[var(--color-text-primary)] tracking-tight">
                Quick Demo Testing Guide
              </h3>
              <p className="text-xs md:text-sm text-slate-600 font-medium leading-relaxed">
                Welcome! For fast testing without taking a photo, click <span className="font-extrabold text-[var(--color-civic-blue)]">"Use Sample Image for Demo"</span> below to choose from 8 real evidence photos!
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => {
                  setShowDemoPopupModal(false);
                  setShowSampleModal(true);
                }}
                className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white rounded-2xl font-extrabold text-sm md:text-base shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles size={20} className="animate-spin" />
                <span>📸 Open 8 Real Sample Images</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setShowDemoPopupModal(false);
                    setShowCameraModal(true);
                  }}
                  className="py-3 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Camera size={15} />
                  <span>📷 Open Camera</span>
                </button>

                <button
                  onClick={() => {
                    setShowDemoPopupModal(false);
                    fileInputRef.current?.click();
                  }}
                  className="py-3 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Upload size={15} />
                  <span>📁 Upload File</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RENDER 100% MATCHING STITCH CIVIC RECORD DETAIL SCREEN (RIGHT SIDE EVIDENCE IMAGE, OFFICER EMBEDDED INSIDE PROJECT INFO) */}
      {analysisResult && intelligenceData && !processing && (
        <div className="space-y-8 animate-fadeIn">
          {/* Stitch Civic Record Detail Layout with Scanned Image on Right Column & Officer embedded in Project Info */}
          <StitchCivicRecordDetail
            data={intelligenceData}
            analysis={analysisResult}
            imageUrl={preview || undefined}
            onSubmitCase={handleSubmitFinal}
            submitting={submitting}
          />

          {/* Auto-Formulated Complaint Form & One-Click Submit */}
          <div className="bg-white rounded-3xl border border-[var(--color-outline-variant)] p-6 md:p-8 space-y-5 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--color-outline-variant)]">
              <div className="flex items-center gap-2">
                <ShieldCheck size={22} className="text-[var(--color-civic-blue)]" />
                <h3 className="text-lg font-bold">Auto-Formulated Complaint for Higher Authority</h3>
              </div>
              <span className="text-xs font-bold text-[var(--color-civic-blue)]">
                Recipient: {intelligenceData.higherOfficer?.name || intelligenceData.officer.name}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-1">
                  Complaint Title
                </label>
                <input
                  type="text"
                  value={complaintTitle}
                  onChange={(e) => setComplaintTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] font-bold text-sm text-[var(--color-text-primary)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-1">
                  Factual Description & Evidence Summary
                </label>
                <textarea
                  value={complaintDescription}
                  onChange={(e) => setComplaintDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] text-sm text-[var(--color-text-primary)] font-medium focus:outline-none leading-relaxed resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-1">
                  Requested Inspection & Enforcement
                </label>
                <textarea
                  value={requestedAction}
                  onChange={(e) => setRequestedAction(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] text-sm text-[var(--color-text-primary)] font-medium focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Instant Submit Button */}
            <button
              onClick={() => handleSubmitFinal()}
              disabled={submitting}
              className="flex items-center justify-center gap-2 w-full py-4 px-6 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-extrabold text-base shadow-xl active:scale-95 transition-all disabled:opacity-50 min-h-[56px]"
            >
              {submitting ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              Submit Case to Higher Authority ({intelligenceData.higherOfficer?.name || intelligenceData.officer.name})
            </button>
          </div>

          <DisclosureBanner />
        </div>
      )}
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-sm font-bold text-[var(--color-text-tertiary)] flex items-center justify-center gap-2">
          <Loader2 size={24} className="animate-spin text-[var(--color-civic-blue)]" />
          <span>Loading Reporting Workspace...</span>
        </div>
      }
    >
      <ReportContent />
    </Suspense>
  );
}
