'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Camera, Upload, Sparkles, Loader2, Send, ShieldCheck, MapPin, AlertCircle, ArrowRight, X, Image as ImageIcon, CheckCircle2, Award, Info
} from 'lucide-react';
import { useReportStore } from '@/store/report-store';
import StitchCivicRecordDetail from '@/components/StitchCivicRecordDetail';
import DisclosureBanner from '@/components/DisclosureBanner';
import CameraModal from '@/components/CameraModal';
import SampleImageModal, { SampleImageOption } from '@/components/SampleImageModal';
import {
  findNearestAsset, findProject, findTender, findContractor, findOfficer, findHigherOfficer, findAuthority,
  DEMO_LOCATION, FALLBACK_AI_ANALYSIS, FALLBACK_COMPLAINT, DEMO_EXISTING_ISSUES
} from '@/lib/demo-data';
import { formatMaintenanceDisplay } from '@/lib/maintenance';
import type { CivicIntelligenceData, AIAnalysis, IssueType, IssueSeverity } from '@/lib/types';
import { ISSUE_TYPE_CONFIG } from '@/lib/types';

const CATEGORIES: { id: IssueType; label: string; icon: string }[] = [
  { id: 'pothole', label: 'Pothole', icon: '⚠️' },
  { id: 'road_damage', label: 'Road Damage', icon: '🛠️' },
  { id: 'broken_streetlight', label: 'Streetlight', icon: '💡' },
  { id: 'garbage_dumping', label: 'Garbage', icon: '🗑️' },
  { id: 'water_leakage', label: 'Water', icon: '💧' },
  { id: 'drainage_overflow', label: 'Drainage', icon: '🌊' },
  { id: 'damaged_footpath', label: 'Footpath', icon: '🚶' },
  { id: 'fallen_tree', label: 'Fallen Tree', icon: '🌲' },
  { id: 'poster_advertisement', label: 'Public Poster', icon: '📄' },
  { id: 'public_littering', label: 'Other', icon: '💬' },
];

export default function HomePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const intakeSectionRef = useRef<HTMLDivElement>(null);

  const { setImage, setAiAnalysis, setLocation, setCivicIntelligence, setComplaint, setCaseId } = useReportStore();

  const [preview, setPreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [isScanningPhase, setIsScanningPhase] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showSampleModal, setShowSampleModal] = useState(false);
  const [showDemoPopupModal, setShowDemoPopupModal] = useState(false);

  // Category Selection Prompt State
  const [selectedCategory, setSelectedCategory] = useState<IssueType | null>(null);
  const [showCategoryPrompt, setShowCategoryPrompt] = useState(false);

  // Instant Analysis Result State
  const [analysisResult, setAnalysisResult] = useState<AIAnalysis | null>(null);
  const [intelligenceData, setIntelligenceData] = useState<CivicIntelligenceData | null>(null);
  const [complaintTitle, setComplaintTitle] = useState('');
  const [complaintDescription, setComplaintDescription] = useState('');
  const [requestedAction, setRequestedAction] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const scrollToReport = () => {
    intakeSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectCategory = (catId: IssueType) => {
    setSelectedCategory(catId);
    setShowCategoryPrompt(true);
  };

  const runInstantPipeline = async (file?: File, categoryOverride?: IssueType) => {
    setShowCategoryPrompt(false);
    setError(null);
    setProcessing(true);
    setIsScanningPhase(true);
    setScanProgress(0);

    const targetCategory = categoryOverride || selectedCategory || 'pothole';

    let aiResult: AIAnalysis = FALLBACK_AI_ANALYSIS;
    let dataUrl = '/demo-pothole.jpg';

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);

      try {
        const base64Data = await new Promise<string>((resolve) => {
          const b64Reader = new FileReader();
          b64Reader.onload = (e) => resolve((e.target?.result as string).split(',')[1]);
          b64Reader.readAsDataURL(file);
        });

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
          aiResult = {
            ...FALLBACK_AI_ANALYSIS,
            issueType: targetCategory,
          };
        }
      } catch {
        aiResult = {
          ...FALLBACK_AI_ANALYSIS,
          issueType: targetCategory,
        };
      }
    } else {
      setPreview('/demo-pothole.jpg');
      aiResult = {
        ...FALLBACK_AI_ANALYSIS,
        issueType: targetCategory,
      };
    }

    const asset = findNearestAsset(DEMO_LOCATION.latitude, DEMO_LOCATION.longitude);
    const project = findProject(asset.id);
    const tender = findTender(project.id);
    const contractor = findContractor(tender.contractorId);
    const officer = findOfficer(asset.id);
    const higherOfficer = findHigherOfficer(asset.id);
    const authority = findAuthority(asset.ward);

    const intel: CivicIntelligenceData = {
      asset,
      project,
      tender,
      contractor,
      officer,
      higherOfficer,
      authority,
      maintenanceStatus: 'ACTIVE',
      maintenanceEndDate: '2029-01-15',
      remainingMonths: 36,
    };

    setAnalysisResult(aiResult);
    setIntelligenceData(intel);
    setComplaintTitle(FALLBACK_COMPLAINT.title);
    setComplaintDescription(FALLBACK_COMPLAINT.description);
    setRequestedAction(FALLBACK_COMPLAINT.requestedAction);

    setImage(dataUrl, null, file?.type || 'image/jpeg');
    setAiAnalysis(aiResult);
    setLocation(DEMO_LOCATION);
    setCivicIntelligence(intel);

    let currentScan = 0;
    const scanInterval = setInterval(() => {
      currentScan += 5;
      setScanProgress(Math.min(currentScan, 100));
      if (currentScan >= 100) {
        clearInterval(scanInterval);
        setTimeout(() => {
          setIsScanningPhase(false);
          setProcessing(false);
          intakeSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      }
    }, 250);
  };

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPEG, PNG, WEBP).');
      return;
    }
    runInstantPipeline(file);
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
    <div className="space-y-12 pb-16">
      
      {/* 1. HERO SECTION 1:1 STITCH REFERENCE */}
      <section className="relative w-full h-[600px] md:h-[680px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center w-full h-full object-cover"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDJzzlVspA47YueQUR-nKeXKJ-t8W_0B5piVoxa3jio1pk-rm8-Lk_rP6xbljZeWTiFqGw4khuh5pycIUl82sNWj86i-KRxbyzmYxF-c6dHLBL8RcWvYO-t-bCYC23vPV9O-GCww9vztQbM2cPnMqqmrSUPGPansnAg1A_wRdWcNPG_s7Ru70QPJWMROwY_V7oZyYx1387SE5-UO5Vh0jx1bMnbfbOZ5rMXF4S1LJLimPMkjLB8t18Ijw')",
          }}
        >
          {/* Overlay Gradient for Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/70 to-slate-900/30" />

          {/* GLOWING CYAN LASER BOUNDING BOX OVERLAY ON ROAD POTHOLE */}
          <div className="absolute bottom-1/4 right-1/4 w-72 h-44 border-2 border-cyan-400 bg-cyan-400/10 rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.6)] pointer-events-none hidden md:flex flex-col justify-between p-3 animate-pulse">
            <div className="flex justify-between items-center text-[10px] font-mono font-bold text-cyan-300 bg-slate-950/80 px-2 py-1 rounded border border-cyan-400/40">
              <span>DETECTED POTHOLE</span>
              <span className="text-red-400">SEVERITY: HIGH</span>
            </div>
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-scanLine" />
          </div>
        </div>

        {/* Hero Content Grid */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-8">
          <div className="flex flex-col justify-center max-w-xl space-y-6">
            
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-teal-100/90 text-teal-900 px-3.5 py-1 rounded-full w-fit shadow-md border border-teal-300">
              <ShieldCheck size={16} className="text-teal-700" />
              <span className="text-[11px] font-extrabold uppercase tracking-wider">
                Independent Civic Platform
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tight drop-shadow-md">
              See a civic problem?<br />
              <span className="text-teal-300">Show us.</span>
            </h1>

            {/* Subheading */}
            <p className="text-base md:text-lg text-gray-200 font-medium leading-relaxed max-w-lg drop-shadow-sm">
              The independent, citizen-first platform to report, track, and resolve public issues using AI-powered evidence.
            </p>

            {/* CTA Buttons 1:1 */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={scrollToReport}
                className="flex items-center justify-center gap-2.5 bg-[var(--color-civic-blue)] hover:bg-[var(--color-civic-blue-dark)] text-white font-black text-sm h-[52px] px-8 rounded-full shadow-xl active:scale-95 transition-all"
              >
                <Camera size={18} />
                Report a Problem
              </button>

              <button
                onClick={scrollToReport}
                className="flex items-center justify-center gap-2 bg-transparent text-white border-2 border-white/80 hover:bg-white/10 font-black text-sm h-[52px] px-8 rounded-full active:scale-95 transition-all"
              >
                How it Works
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 2. STATS SECTION 1:1 STITCH */}
      <section className="bg-blue-50/70 py-8 border-y border-blue-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-blue-200 text-center">
            
            <div className="flex flex-col items-center justify-center py-4 md:py-0 space-y-1">
              <span className="text-4xl md:text-5xl font-black text-[var(--color-civic-blue)]">
                1,200+
              </span>
              <span className="text-xs font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider">
                Reports Verified
              </span>
            </div>

            <div className="flex flex-col items-center justify-center py-4 md:py-0 space-y-1">
              <span className="text-4xl md:text-5xl font-black text-teal-700">
                850+
              </span>
              <span className="text-xs font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider">
                Issues Resolved
              </span>
            </div>

            <div className="flex flex-col items-center justify-center py-4 md:py-0 space-y-1">
              <span className="text-4xl md:text-5xl font-black text-[var(--color-civic-blue-dark)]">
                92%
              </span>
              <span className="text-xs font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider">
                Community Trust Score
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* 3. DIRECT INTAKE WORKSPACE ("Report a civic problem") */}
      <div ref={intakeSectionRef} className="px-4 md:px-8 max-w-7xl mx-auto space-y-6">
        
        {/* PLATFORM MODE SWITCHER TOGGLE BAR */}
        <div className="flex items-center justify-center">
          <div className="bg-slate-900 text-white p-1.5 rounded-2xl flex items-center gap-2 max-w-lg w-full text-xs font-extrabold shadow-xl">
            <button
              onClick={() => router.push('/')}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md flex items-center justify-center gap-1.5"
            >
              <span>🏛️ Public Civic Problems</span>
            </button>
            <button
              onClick={() => router.push('/personal-grievance')}
              className="flex-1 py-3 px-4 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5"
            >
              <span>👤 Personal Grievances (Sakala)</span>
            </button>
          </div>
        </div>

        {/* Header Title */}
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 text-xs font-extrabold">
            <Sparkles size={13} /> CivicLens Karnataka Web Platform
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-[var(--color-text-primary)] tracking-tight">
            Report a civic problem
          </h2>
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] font-medium">
            Upload clear photo evidence of potholes, broken streetlights, or drainage issues to match state tenders, defect warranties, and higher authority officers.
          </p>
        </div>

        {/* 3-SECOND FULL-SCREEN SCANNING ANIMATION WORKSPACE */}
        {processing && isScanningPhase && analysisResult && (
          <div className="bg-white rounded-3xl border-2 border-cyan-400 p-6 md:p-10 shadow-2xl space-y-6 animate-fadeIn max-w-5xl mx-auto">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="text-xs font-mono font-bold text-cyan-600 uppercase tracking-widest block">
                ⚡ GEMINI AI VISION SCAN ACTIVE (5.5 SECONDS)
              </span>
              <h2 className="text-2xl md:text-4xl font-black text-[var(--color-text-primary)] tracking-tight">
                Understanding your evidence
              </h2>
              <p className="text-xs md:text-sm text-[var(--color-text-secondary)] font-medium">
                Our system is analyzing your submission to help route it efficiently.
              </p>

              {/* Progress bar line */}
              <div className="w-full bg-cyan-100 h-2 rounded-full overflow-hidden max-w-md mx-auto mt-2">
                <div
                  className="bg-cyan-500 h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
            </div>

            {/* 2-Column Scanning Card */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-2">
              <div className="md:col-span-6 relative rounded-2xl overflow-hidden border border-cyan-300 shadow-lg bg-slate-900 h-72 md:h-80">
                <img
                  src={preview || '/demo-pothole.jpg'}
                  alt="Scanning visual evidence"
                  className="w-full h-full object-cover filter contrast-[1.05]"
                />
                
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#22d3ee] animate-scanLine absolute top-0" />
                
                <div className="absolute top-1/3 left-1/4 w-1/2 h-1/3 border-2 border-cyan-400 bg-cyan-400/10 rounded-2xl shadow-[0_0_20px_rgba(34,211,238,0.6)] pointer-events-none flex items-start justify-end p-2 animate-pulse">
                  <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
                </div>

                <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-cyan-300 shadow-md border border-cyan-500/30 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>ANALYZING VISUAL PATTERNS ({scanProgress}%)...</span>
                </div>
              </div>

              <div className="md:col-span-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-teal-700 uppercase tracking-tight">
                    ⚙️ {analysisResult.issueType.replace(/_/g, ' ')} DETECTED
                  </h3>
                  <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full font-extrabold text-xs border border-teal-300">
                    ✨ 96% Confidence
                  </span>
                </div>

                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-blue-900 uppercase">SEVERITY ASSESSMENT</span>
                    <span className="px-2 py-0.5 rounded-full bg-red-600 text-white font-black text-[10px]">🔴 HIGH</span>
                  </div>
                  <p className="text-xs text-blue-950 font-medium">
                    {analysisResult.description || 'Severe road surface defect detected requiring municipal inspection.'}
                  </p>
                </div>

                <div className="space-y-2 text-xs font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-teal-600" />
                    <span>Significant road surface damage detected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-teal-600" />
                    <span>Visible depth indicating structural failure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-teal-600" />
                    <span>Potential immediate traffic hazard</span>
                  </div>
                </div>

                <div className="p-3 bg-cyan-50 rounded-xl border border-cyan-200 text-xs font-extrabold text-cyan-900 flex items-center justify-between">
                  <span>Loading Tender Data & Higher Authority...</span>
                  <Loader2 size={16} className="animate-spin text-cyan-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PROMPT MODAL WHEN USER SELECTS A CATEGORY */}
        {showCategoryPrompt && selectedCategory && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full space-y-6 shadow-2xl border-2 border-red-200 animate-fadeIn relative">
              <button
                onClick={() => setShowCategoryPrompt(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
              >
                <X size={18} />
              </button>

              <div className="text-center space-y-2">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center text-3xl shadow-sm">
                  {CATEGORIES.find(c => c.id === selectedCategory)?.icon || '⚠️'}
                </div>
                <h3 className="text-xl font-black text-[var(--color-text-primary)]">
                  Provide Evidence for {CATEGORIES.find(c => c.id === selectedCategory)?.label}
                </h3>
                <p className="text-xs text-[var(--color-text-tertiary)] font-medium">
                  Capture a photo or upload an image file to analyze this defect.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowCategoryPrompt(false);
                    setShowCameraModal(true);
                  }}
                  className="w-full py-4 px-6 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-extrabold text-sm shadow-md flex items-center justify-center gap-3 transition-colors"
                >
                  <Camera size={20} /> Take Photo (Camera)
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-4 px-6 bg-white border-2 border-red-600 text-red-600 hover:bg-red-50 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-3 transition-colors"
                >
                  <Upload size={20} /> Upload Image from Device
                </button>

                <button
                  onClick={() => {
                    setShowCategoryPrompt(false);
                    setShowSampleModal(true);
                  }}
                  className="w-full py-3 px-4 text-xs font-bold text-gray-600 hover:text-[var(--color-civic-blue)] underline flex items-center justify-center gap-1.5 pt-1"
                >
                  <ImageIcon size={14} /> Use Sample {CATEGORIES.find(c => c.id === selectedCategory)?.label} Photo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STITCH DIRECT INTAKE BOX ON HOMEPAGE */}
        {!analysisResult && !processing && (
          <div className="bg-white rounded-3xl border border-[var(--color-outline-variant)] p-6 md:p-8 shadow-sm space-y-6">
            
            <div className="flex items-center justify-between max-w-2xl mx-auto pb-4 border-b border-[var(--color-outline-variant)] text-xs font-bold">
              <div className="flex items-center gap-2 text-[var(--color-civic-blue)]">
                <span className="w-6 h-6 rounded-full bg-[var(--color-civic-blue)] text-white flex items-center justify-center text-xs">1</span>
                <span>Evidence</span>
              </div>
              <div className="h-0.5 w-12 bg-gray-200" />
              <div className="flex items-center gap-2 text-gray-400">
                <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs">2</span>
                <span>Identify</span>
              </div>
              <div className="h-0.5 w-12 bg-gray-200" />
              <div className="flex items-center gap-2 text-gray-400">
                <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs">3</span>
                <span>Location</span>
              </div>
              <div className="h-0.5 w-12 bg-gray-200" />
              <div className="flex items-center gap-2 text-gray-400">
                <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs">4</span>
                <span>Submit</span>
              </div>
            </div>

            <input
              ref={cameraInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              capture="environment"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
            />

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
            />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch pt-2">
              
              <div className="md:col-span-6 bg-blue-50/60 rounded-2xl border-2 border-dashed border-[var(--color-civic-blue)] p-8 text-center flex flex-col justify-center items-center space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-[var(--color-civic-blue)] text-white flex items-center justify-center shadow-md">
                  <Camera size={32} />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-[var(--color-text-primary)]">
                    Drag & Drop Evidence
                  </h3>
                  <p className="text-xs text-[var(--color-text-tertiary)] max-w-xs mx-auto mt-1">
                    Upload clear photos of the civic issue. Gemini Vision AI will automatically detect the problem type.
                  </p>
                </div>

                <div className="w-full space-y-3 pt-2">
                  <button
                    onClick={() => setShowDemoPopupModal(true)}
                    className="w-full py-3 px-4 bg-[var(--color-civic-blue)] text-white rounded-xl font-bold text-xs shadow-md hover:bg-[var(--color-civic-blue-dark)] flex items-center justify-center gap-2"
                  >
                    <Camera size={16} /> Take Photo
                  </button>

                  <button
                    onClick={() => setShowDemoPopupModal(true)}
                    className="w-full py-3 px-4 bg-white text-[var(--color-civic-blue)] rounded-xl font-bold text-xs border border-[var(--color-civic-blue)] hover:bg-blue-50 flex items-center justify-center gap-2"
                  >
                    <Upload size={16} /> Upload from Device
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowSampleModal(true)}
                    className="text-xs font-bold text-[var(--color-civic-blue)] hover:underline pt-2 inline-block cursor-pointer"
                  >
                    ✨ Use Sample Image
                  </button>
                </div>
              </div>

              <div className="md:col-span-6 space-y-3">
                <h3 className="font-extrabold text-sm text-[var(--color-text-primary)]">
                  Or select a category manually
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleSelectCategory(cat.id)}
                      className="p-3 bg-white hover:bg-red-50 border border-[var(--color-outline-variant)] hover:border-red-400 rounded-xl text-left transition-colors flex items-center gap-3 group shadow-sm"
                    >
                      <div className="w-9 h-9 rounded-lg bg-red-100/70 text-base flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        {cat.icon}
                      </div>
                      <span className="font-bold text-xs text-[var(--color-text-primary)] truncate">
                        {cat.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
          </div>
        )}

        {/* AFTER 3 SECONDS: REPLACES SCANNING SCREEN WITH STITCH CIVIC RECORD DETAIL & SUBMIT BUTTON */}
        {!processing && !isScanningPhase && analysisResult && intelligenceData && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-[var(--color-outline-variant)] shadow-sm">
              <span className="text-xs font-bold text-red-600">
                ✨ AI Scanned Result & Asset Match: {analysisResult.issueType.replace(/_/g, ' ').toUpperCase()}
              </span>
              <button
                onClick={() => {
                  setAnalysisResult(null);
                  setIntelligenceData(null);
                  setPreview(null);
                }}
                className="px-4 py-2 bg-white border border-[var(--color-outline-variant)] text-[var(--color-text-primary)] rounded-xl text-xs font-bold hover:bg-[var(--color-surface-container)]"
              >
                Scan Different Photo
              </button>
            </div>

            <div id="civic-record-detail-section" className="pt-6">
              <StitchCivicRecordDetail
                data={intelligenceData}
                analysis={analysisResult}
                imageUrl={preview || undefined}
                onSubmitCase={handleSubmitFinal}
                submitting={submitting}
              />
            </div>
          </div>
        )}

      </div>

      {/* 4. BENTO GRID SECTION ("Technology driving accountability") 1:1 STITCH */}
      <section className="py-16 bg-white border-t border-[var(--color-outline-variant)]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl md:text-4xl font-black text-[var(--color-text-primary)] tracking-tight">
              Technology driving accountability
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] font-medium">
              We combine community reporting with advanced verification to ensure your voice is heard and action is taken.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Bento Card 1: AI-Powered Verification (Col-span 8) */}
            <div className="md:col-span-8 bg-blue-50/50 border border-blue-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all relative overflow-hidden group flex flex-col justify-between">
              <div className="relative z-10 space-y-4 max-w-lg">
                <div className="w-12 h-12 bg-[var(--color-civic-blue)] text-white rounded-2xl flex items-center justify-center text-xl shadow-md">
                  🧠
                </div>
                <h3 className="text-2xl font-black text-[var(--color-text-primary)]">
                  AI-Powered Verification
                </h3>
                <p className="text-xs md:text-sm text-[var(--color-text-secondary)] font-medium leading-relaxed">
                  Instant detection and categorization of issues using advanced computer vision models to ensure report accuracy.
                </p>
              </div>

              {/* Floating Confidence Pill */}
              <div className="pt-6 flex items-center justify-start">
                <span className="inline-flex items-center gap-2 bg-teal-100 text-teal-800 border border-teal-300 px-4 py-2 rounded-full font-extrabold text-xs shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-teal-600 animate-ping" />
                  Confidence: 98.4%
                </span>
              </div>
            </div>

            {/* Bento Card 2: Civic Intelligence (Col-span 4) */}
            <div className="md:col-span-4 bg-amber-50/50 border border-amber-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div className="w-12 h-12 bg-amber-600 text-white rounded-2xl flex items-center justify-center text-xl shadow-md">
                🏛️
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-[var(--color-text-primary)]">
                  Civic Intelligence
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] font-medium leading-relaxed">
                  Automatic matching with public records and maintenance contracts for immediate jurisdiction routing.
                </p>
              </div>
            </div>

            {/* Bento Card 3: Transparent Tracking (Col-span 5) */}
            <div className="md:col-span-5 bg-indigo-50/50 border border-indigo-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-xl shadow-md">
                📡
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-[var(--color-text-primary)]">
                  Transparent Tracking
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] font-medium leading-relaxed">
                  Follow your case from report to resolution with real-time updates and public audit trails.
                </p>
              </div>
            </div>

            {/* Bento Card 4: Citizen Recognition (Col-span 7) */}
            <div className="md:col-span-7 bg-emerald-50/50 border border-emerald-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-4 flex-1">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center text-xl shadow-md">
                  🏆
                </div>
                <h3 className="text-2xl font-black text-[var(--color-text-primary)]">
                  Citizen Recognition
                </h3>
                <p className="text-xs md:text-sm text-[var(--color-text-secondary)] font-medium leading-relaxed">
                  Earn badges, track your community impact, and build your civic profile through verified reporting.
                </p>
              </div>

              <div className="w-28 h-28 rounded-full border-4 border-emerald-300 bg-white flex flex-col items-center justify-center text-center shadow-lg flex-shrink-0">
                <Award size={24} className="text-emerald-600 mb-0.5" />
                <span className="font-black text-sm text-emerald-800">Top 5%</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. "BUILT FOR CITIZENS, DRIVEN BY TRANSPARENCY" SECTION 1:1 STITCH */}
      <section className="py-16 bg-blue-50/60 border-t border-blue-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <h2 className="text-3xl md:text-5xl font-black text-[var(--color-text-primary)] tracking-tight leading-tight">
              Built for Citizens, Driven by Transparency
            </h2>

            <p className="text-sm text-[var(--color-text-secondary)] font-medium leading-relaxed">
              CivicLens operates independently to ensure data-driven accountability. We bridge the gap between residents and city infrastructure maintenance, providing a clear, immutable record of public issues.
            </p>

            <ul className="space-y-3 text-sm font-extrabold text-[var(--color-text-primary)]">
              <li className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-[var(--color-civic-blue)]" />
                Independent oversight
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-[var(--color-civic-blue)]" />
                Open data standards
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-[var(--color-civic-blue)]" />
                Community-first approach
              </li>
            </ul>

            <button
              onClick={() => alert('CivicLens Karnataka Platform Manifesto: Empowering citizens with verified spatial AI intelligence.')}
              className="px-8 py-3.5 bg-white border-2 border-[var(--color-civic-blue)] text-[var(--color-civic-blue)] hover:bg-blue-50 font-black text-xs rounded-full shadow-sm transition-all"
            >
              Read our Manifesto
            </button>
          </div>

          {/* Right Image 1:1 Stitch Reference */}
          <div className="rounded-3xl overflow-hidden shadow-xl border border-blue-200 aspect-[4/3]">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHNgho2Q0GInkvy4tGwrGvgmIXnVYXpizsSyszQSd0vRRDeMHZ8vi_lABMnk_EfF7EYMMp-EEWvUXRSiLTLpeZM7yn9klQQcA0Pt9q8cJKGvFvMtZ0tjQlh8qKxQRBZ7vqV1N0fSvCVMKIFpUpv7bSN231drCdxvb5nz9TLHj3PveHiVwUrqx2hLgnXXdD_sB9-RJ12tMoZDAS_5Arp4kDbzx0xkLem60tGQ6DNWZv6U2vxOO5QRQWiw"
              alt="Urban infrastructure visualization"
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </section>

      {/* Render Camera Modal */}
      {showCameraModal && (
        <CameraModal
          onClose={() => setShowCameraModal(false)}
          onCapture={async (imageBase64, file) => {
            setShowCameraModal(false);
            await runInstantPipeline(file);
          }}
        />
      )}

      {/* Render Sample Image Selection Modal */}
      {showSampleModal && (
        <SampleImageModal
          onClose={() => setShowSampleModal(false)}
          onSelectSample={async (sample) => {
            setShowSampleModal(false);
            setProcessing(true);
            setIsScanningPhase(true);
            setScanProgress(30);

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

            const interval = setInterval(() => {
              setScanProgress((prev) => {
                if (prev >= 100) {
                  clearInterval(interval);
                  return 100;
                }
                return prev + 5;
              });
            }, 250);

            setTimeout(() => {
              setIsScanningPhase(false);

              const asset = findNearestAsset(DEMO_LOCATION.latitude, DEMO_LOCATION.longitude, customAnalysis.issueType);
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
              setProcessing(false);
            }, 5500);
          }}
        />
      )}

      {/* Demo Guidance Instructions Popup Window */}
      {showDemoPopupModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border-4 border-amber-400 space-y-6 text-center text-[var(--color-text-primary)] relative animate-scaleUp">
            
            {/* Close Button */}
            <button
              onClick={() => setShowDemoPopupModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X size={20} />
            </button>

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
                  scrollToReport();
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

      <DisclosureBanner />
    </div>
  );
}
