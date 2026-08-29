'use client';

import { useState } from 'react';
import {
  ShieldAlert, UserCheck, AlertTriangle, FileText, CheckCircle2,
  Clock, Download, Send, ArrowRight, Building, Phone, Mail, Award, Sparkles, Languages, Check
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PersonalGrievanceDossier, savePersonalCaseToStorage } from '@/lib/personal-data';
import { useReportStore } from '@/store/report-store';

interface StitchPersonalGrievanceDetailProps {
  dossier: PersonalGrievanceDossier;
  onSubmitPetition?: () => void;
}

export default function StitchPersonalGrievanceDetail({ dossier, onSubmitPetition }: StitchPersonalGrievanceDetailProps) {
  const router = useRouter();
  const setCaseId = useReportStore((s) => s.setCaseId);
  const [langTab, setLangTab] = useState<'kn' | 'en'>('kn');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      const savedCase = savePersonalCaseToStorage(dossier);
      setCaseId(savedCase.id);
      setSubmitting(false);
      setSubmitted(true);
      if (onSubmitPetition) onSubmitPetition();
      router.push(`/submitted?caseId=${savedCase.id}`);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-[var(--color-outline-variant)] shadow-2xl p-6 md:p-10 space-y-8 animate-fadeIn text-[var(--color-text-primary)]">
      
      {/* Top Banner: Sakala SLA Violation & Overdue Warning */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-mono font-extrabold tracking-wider border border-white/30">
            <ShieldAlert size={14} className="text-yellow-300 fill-yellow-300" />
            <span>KARNATAKA SAKALA ACT 2011 S.L.A. VIOLATION DETECTED</span>
          </div>
          <h2 className="text-xl md:text-3xl font-black tracking-tight">
            {dossier.category.name}
          </h2>
          <p className="text-xs md:text-sm text-red-100 font-medium">
            Service Code: <span className="font-mono font-bold">{dossier.category.code}</span> • Department: {dossier.category.department}
          </p>
        </div>

        <div className="bg-white text-red-700 px-5 py-3 rounded-2xl shadow-md text-center border-2 border-red-200">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-500 block">SLA OVERDUE</span>
          <span className="text-2xl font-black tracking-tight block">{dossier.overdueDays} Days Late</span>
          <span className="text-[10px] font-bold text-slate-500">Max Limit: {dossier.category.sakalaLimitDays} Days</span>
        </div>
      </div>

      {/* Main Grid: Officer Mapping & Statutory Penalty Rights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Designated Sakala Officer */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100/50 rounded-bl-full pointer-events-none" />
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-civic-blue)] text-white flex items-center justify-center font-bold text-xl shadow-md">
              <UserCheck size={24} />
            </div>
            <div>
              <span className="text-[10px] font-mono font-extrabold text-blue-700 uppercase tracking-widest block">
                DESIGNATED RESPONSIBLE OFFICER
              </span>
              <h3 className="text-base font-extrabold text-[var(--color-text-primary)]">
                {dossier.designatedOfficer.name}
              </h3>
              <p className="text-xs text-[var(--color-civic-blue)] font-bold">
                {dossier.designatedOfficer.designation}
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-200 text-xs text-slate-600 font-medium">
            <div className="flex items-start gap-2">
              <Building size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
              <span>{dossier.designatedOfficer.officeAddress}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-slate-400 flex-shrink-0" />
              <span className="font-mono font-bold text-slate-800">{dossier.designatedOfficer.contactNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-slate-400 flex-shrink-0" />
              <span className="font-mono text-slate-700">{dossier.designatedOfficer.email}</span>
            </div>
          </div>
        </div>

        {/* Card 2: First Appellate Authority & Statutory Penalty */}
        <div className="bg-amber-50/60 rounded-2xl border-2 border-amber-200 p-6 space-y-4 shadow-sm relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
              <Award size={24} />
            </div>
            <div>
              <span className="text-[10px] font-mono font-extrabold text-amber-800 uppercase tracking-widest block">
                FIRST APPELLATE AUTHORITY (IAS)
              </span>
              <h3 className="text-base font-extrabold text-slate-900">
                {dossier.firstAppellateAuthority.name}
              </h3>
              <p className="text-xs text-amber-900 font-bold">
                {dossier.firstAppellateAuthority.designation}
              </p>
            </div>
          </div>

          <p className="text-xs text-amber-950 font-medium leading-relaxed bg-white/80 p-3 rounded-xl border border-amber-200">
            ⚖️ <strong>Sakala Section 8 Fine Notice:</strong> {dossier.firstAppellateAuthority.statutoryPowers}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-amber-200 text-xs font-bold text-amber-900">
            <span>Estimated Default Penalty Notice:</span>
            <span className="text-base font-black text-red-600 bg-red-100 px-3 py-0.5 rounded-lg border border-red-200">
              ₹{dossier.penaltyLiabilityEstimate} Fine
            </span>
          </div>
        </div>
      </div>

      {/* Auto-Drafted Legal Petition Preview Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <FileText size={20} className="text-[var(--color-civic-blue)]" />
            <div>
              <h3 className="font-extrabold text-base text-[var(--color-text-primary)]">
                Auto-Formulated Official Legal Petition
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Drafted as per Karnataka Sakala Services Act 2011 statutory guidelines
              </p>
            </div>
          </div>

          {/* Language Switch Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-extrabold">
            <button
              onClick={() => setLangTab('kn')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                langTab === 'kn' ? 'bg-[var(--color-civic-blue)] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🇮🇳 Kannada (ಕನ್ನಡ)
            </button>
            <button
              onClick={() => setLangTab('en')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                langTab === 'en' ? 'bg-[var(--color-civic-blue)] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🇬🇧 English
            </button>
          </div>
        </div>

        {/* Petition Document Box */}
        <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl font-mono text-xs leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto border border-slate-800 shadow-inner">
          {langTab === 'kn' ? dossier.petitionKannada : dossier.petitionEnglish}
        </div>
      </div>

      {/* Action Footer */}
      {!submitted ? (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Sparkles size={16} className="text-[var(--color-civic-blue)]" />
            <span>Ready for official transmission to Karnataka Sakala Portal</span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-2xl font-extrabold text-sm md:text-base shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 min-h-[52px]"
          >
            {submitting ? (
              <span>Transmitting Petition...</span>
            ) : (
              <>
                <Send size={18} />
                <span>Submit Official Sakala Petition & Penalty Notice</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="bg-emerald-50 border-2 border-emerald-300 p-6 rounded-2xl text-center space-y-3 animate-fadeIn">
          <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-xl shadow-lg">
            <Check size={28} />
          </div>
          <h3 className="text-xl font-black text-emerald-900">
            Petition Successfully Transmitted to Sakala Mission Portal!
          </h3>
          <p className="text-xs md:text-sm text-emerald-800 font-medium max-w-xl mx-auto">
            Official Acknowledgment GSC Number <span className="font-mono font-bold text-emerald-950">KAR-SAK-2026-99201</span> issued. 
            Designated Officer ({dossier.designatedOfficer.name}) notified with a statutory 48-hour deadline.
          </p>
        </div>
      )}
    </div>
  );
}
