'use client';

import { useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Upload, Sparkles, Send, ShieldCheck, ArrowLeft, Bot, FileText, CheckCircle2, AlertCircle, Loader2
} from 'lucide-react';
import { PERSONAL_CATEGORIES, PersonalCategoryOption, generatePersonalGrievanceDossier, PersonalGrievanceDossier } from '@/lib/personal-data';
import VoiceModulationAgent from '@/components/VoiceModulationAgent';
import PhoneCallSimulator from '@/components/PhoneCallSimulator';
import StitchPersonalGrievanceDetail from '@/components/StitchPersonalGrievanceDetail';
import DisclosureBanner from '@/components/DisclosureBanner';
import { useAuthStore } from '@/store/auth-store';
import { User } from 'lucide-react';

function PersonalGrievanceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoggedIn } = useAuthStore();
  const initialCatId = searchParams.get('category') || 'gruha_lakshmi';

  if (!isLoggedIn) {
    return (
      <div className="px-4 py-20 max-w-md mx-auto text-center space-y-6 animate-fadeIn">
        <div className="w-20 h-20 bg-blue-50 text-[var(--color-civic-blue)] rounded-3xl flex items-center justify-center mx-auto shadow-inner border border-blue-100">
          <User size={36} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-[var(--color-text-primary)]">Login Required</h2>
          <p className="text-sm text-[var(--color-text-secondary)] font-medium leading-relaxed">
            Please log in or create a citizen account to access Sakala Personal Grievance Filing and AI Phone Calls.
          </p>
        </div>
        <button
          onClick={() => router.push('/login')}
          className="w-full py-4 bg-[var(--color-civic-blue)] hover:bg-[var(--color-civic-blue-dark)] text-white rounded-full font-black text-sm shadow-md active:scale-95 transition-all"
        >
          Login / Sign Up
        </button>
      </div>
    );
  }

  const [platformMode, setPlatformMode] = useState<'civic' | 'personal'>('personal');
  const [activeTab, setActiveTab] = useState<'call' | 'agent' | 'form'>('call');

  const [selectedCatId, setSelectedCatId] = useState<string>(initialCatId);
  const [grievanceTitle, setGrievanceTitle] = useState('');
  const [grievanceDescription, setGrievanceDescription] = useState('');
  const [daysDelayed, setDaysDelayed] = useState<number>(30);
  const [applicantName, setApplicantName] = useState('Sujal Kumar');
  const [evidencePreview, setEvidencePreview] = useState<string | null>(null);

  const [generatedDossier, setGeneratedDossier] = useState<PersonalGrievanceDossier | null>(null);
  const [processing, setProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleModeSwitch = (mode: 'civic' | 'personal') => {
    setPlatformMode(mode);
    if (mode === 'civic') {
      router.push('/report');
    }
  };

  const handleSelectCategory = (catId: string) => {
    setSelectedCatId(catId);
    const cat = PERSONAL_CATEGORIES.find((c) => c.id === catId);
    if (cat) {
      setGrievanceTitle(cat.sampleGrievanceTitle);
      setGrievanceDescription(cat.sampleGrievanceDescription);
      setDaysDelayed(Math.floor(cat.sakalaLimitDays * 2.2));
    }
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setEvidencePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleGenerateFormDossier = () => {
    setProcessing(true);
    setTimeout(() => {
      const dossier = generatePersonalGrievanceDossier(
        selectedCatId,
        grievanceDescription,
        grievanceTitle,
        daysDelayed,
        applicantName
      );
      setGeneratedDossier(dossier);
      setProcessing(false);
    }, 1200);
  };

  const handleAgentComplete = (catId: string, description: string, delay: number) => {
    setSelectedCatId(catId);
    setProcessing(true);
    setTimeout(() => {
      const dossier = generatePersonalGrievanceDossier(
        catId,
        description,
        undefined,
        delay,
        applicantName
      );
      setGeneratedDossier(dossier);
      setProcessing(false);
    }, 1000);
  };

  return (
    <div className="px-4 md:px-8 pt-6 pb-16 max-w-7xl mx-auto space-y-8 animate-fadeIn text-[var(--color-text-primary)]">
      
      {/* Top Header Navigation Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 text-white p-4 md:p-6 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-600 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg">
            👤
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight">
              Personal Public Service & Sakala Rights Workspace
            </h1>
            <p className="text-xs text-slate-300 font-medium">
              Karnataka Sakala Services Act 2011 • Direct Benefit Transfers • Citizen Welfare Rights
            </p>
          </div>
        </div>

        {/* Sliding Mode Switcher */}
        <div className="flex items-center bg-slate-800 p-1.5 rounded-2xl border border-slate-700 text-xs font-extrabold w-full sm:w-auto">
          <button
            onClick={() => handleModeSwitch('civic')}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl transition-all text-slate-400 hover:text-white flex items-center justify-center gap-1.5"
          >
            <span>🏛️ Public Civic Problems</span>
          </button>
          <button
            onClick={() => handleModeSwitch('personal')}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg flex items-center justify-center gap-1.5"
          >
            <span>👤 Personal Grievances</span>
          </button>
        </div>
      </div>

      {/* 8 Core Service Categories Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-black text-[var(--color-text-primary)]">
            Select Affected Personal Public Service / Welfare Scheme
          </h2>
          <span className="text-xs font-bold text-[var(--color-text-tertiary)]">8 Sakala Domains Covered</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
          {PERSONAL_CATEGORIES.map((cat) => {
            const isSelected = selectedCatId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className={`p-4 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between h-36 ${
                  isSelected
                    ? 'border-red-600 bg-red-50/70 shadow-lg scale-[1.02]'
                    : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {cat.sakalaLimitDays}D SLA
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-xs md:text-sm text-[var(--color-text-primary)] line-clamp-1">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-medium line-clamp-1 mt-0.5">
                    {cat.kannadaName}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dual Intake Workspace: Mode A (Form/Upload) vs Mode B (Native Multilingual AI Agent) */}
      {!generatedDossier ? (
        <div className="space-y-6">
          {/* Intake Method Toggle Bar (3 Modes: AI Phone Call, Voice Orb Agent, Form) */}
          <div className="flex items-center justify-center">
            <div className="bg-slate-200 p-1.5 rounded-2xl flex items-center gap-1.5 max-w-xl w-full text-xs font-extrabold">
              <button
                onClick={() => setActiveTab('call')}
                className={`flex-1 py-3 px-3.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'call'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <span>📞 AI Phone Call</span>
              </button>
              <button
                onClick={() => setActiveTab('agent')}
                className={`flex-1 py-3 px-3.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'agent'
                    ? 'bg-[var(--color-civic-blue)] text-white shadow-md'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <Bot size={15} />
                <span>🗣️ Voice Agent</span>
              </button>
              <button
                onClick={() => setActiveTab('form')}
                className={`flex-1 py-3 px-3.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'form'
                    ? 'bg-[var(--color-civic-blue)] text-white shadow-md'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <FileText size={15} />
                <span>📄 Document Form</span>
              </button>
            </div>
          </div>

          {/* Mode 1: AI Cellular Outbound Phone Call Simulator */}
          {activeTab === 'call' && (
            <div className="max-w-4xl mx-auto">
              <PhoneCallSimulator
                initialCategoryId={selectedCatId}
                onCallCompleted={(dossier) => {
                  setGeneratedDossier(dossier);
                }}
              />
            </div>
          )}

          {/* Mode 2: Futuristic AI Voice Modulation Orb Agent */}
          {activeTab === 'agent' && (
            <div className="max-w-4xl mx-auto">
              <VoiceModulationAgent
                initialCategoryId={selectedCatId}
                onCompleteGrievance={(catId, desc, delay, name) => {
                  setSelectedCatId(catId);
                  setProcessing(true);
                  setTimeout(() => {
                    const dossier = generatePersonalGrievanceDossier(
                      catId,
                      desc,
                      undefined,
                      delay,
                      name
                    );
                    setGeneratedDossier(dossier);
                    setProcessing(false);
                  }, 1000);
                }}
              />
            </div>
          )}

          {/* Mode A: Structured Form & Document Evidence Upload */}
          {activeTab === 'form' && (
            <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 md:p-10 shadow-xl space-y-6 max-w-4xl mx-auto">
              <div className="border-b border-slate-200 pb-4">
                <h3 className="text-lg font-extrabold text-[var(--color-text-primary)]">
                  Upload Passbook / Application Receipt & Describe Issue
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Attach official Sakala receipt, Aadhaar slip, or bank passbook photo for automatic detail extraction.
                </p>
              </div>

              {/* Upload Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-red-500 p-6 rounded-2xl bg-slate-50 hover:bg-red-50/40 text-center cursor-pointer transition-all space-y-2"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  accept="image/*,.pdf"
                  className="hidden"
                />
                {evidencePreview ? (
                  <div className="space-y-2">
                    <img src={evidencePreview} alt="Evidence" className="h-32 mx-auto object-cover rounded-xl shadow-md border" />
                    <span className="text-xs font-bold text-emerald-600 block">✓ Document Attached</span>
                  </div>
                ) : (
                  <>
                    <Upload size={28} className="text-slate-400 mx-auto" />
                    <span className="text-xs font-bold text-slate-700 block">
                      Click to upload Bank Passbook, Sakala Slip, or Document Photo
                    </span>
                    <span className="text-[10px] text-slate-400">PNG, JPG, WEBP or PDF (Max 10MB)</span>
                  </>
                )}
              </div>

              {/* Form Input Fields */}
              <div className="space-y-4 text-xs md:text-sm">
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Grievance Title</label>
                  <input
                    type="text"
                    value={grievanceTitle}
                    onChange={(e) => setGrievanceTitle(e.target.value)}
                    placeholder="e.g. Gruha Lakshmi Monthly ₹2,000 DBT Not Credited"
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-300 font-medium focus:bg-white focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Detailed Description & Reference Numbers</label>
                  <textarea
                    rows={4}
                    value={grievanceDescription}
                    onChange={(e) => setGrievanceDescription(e.target.value)}
                    placeholder="Provide Sakala GSC number, Application number, or explain what happened..."
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-300 font-medium focus:bg-white focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-extrabold text-slate-700 block mb-1">Total Days Delayed</label>
                    <input
                      type="number"
                      value={daysDelayed}
                      onChange={(e) => setDaysDelayed(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-300 font-medium focus:bg-white focus:border-red-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-extrabold text-slate-700 block mb-1">Applicant Name</label>
                    <input
                      type="text"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-300 font-medium focus:bg-white focus:border-red-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleGenerateFormDossier}
                disabled={processing}
                className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-2xl font-extrabold text-sm md:text-base shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Mapping Sakala Officer & Calculating Penalty Rights...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Generate Official Sakala Dossier & Penalty Notice</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Generated Sakala Dossier View */
        <div className="space-y-6">
          <button
            onClick={() => setGeneratedDossier(null)}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-4 py-2 rounded-xl border border-slate-300 shadow-sm"
          >
            <ArrowLeft size={16} /> Edit Grievance Inputs
          </button>

          <StitchPersonalGrievanceDetail dossier={generatedDossier} />
        </div>
      )}

      <DisclosureBanner />
    </div>
  );
}

export default function PersonalGrievancePage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-sm font-bold text-slate-500 flex items-center justify-center gap-2">
          <Loader2 size={24} className="animate-spin text-[var(--color-civic-blue)]" />
          <span>Loading Personal Sakala Rights Workspace...</span>
        </div>
      }
    >
      <PersonalGrievanceContent />
    </Suspense>
  );
}
