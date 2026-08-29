'use client';

import { useState } from 'react';
import { ArrowLeft, Sparkles, RotateCw, Send, X, AlertTriangle, MapPin, Camera, CheckCircle2, ShieldCheck, History } from 'lucide-react';
import type { CivicIntelligenceData, AIAnalysis } from '@/lib/types';

interface ComplaintBuilderModalProps {
  data: CivicIntelligenceData;
  analysis: AIAnalysis;
  imageUrl?: string;
  onClose: () => void;
  onSubmit: (title: string, description: string, requestedAction: string) => void;
  submitting?: boolean;
}

export default function ComplaintBuilderModal({
  data,
  analysis,
  imageUrl,
  onClose,
  onSubmit,
  submitting = false,
}: ComplaintBuilderModalProps) {
  const higherOfficer = data.higherOfficer;
  const execOfficer = data.officer;

  const defaultTitle = `Urgent Escalation: ${analysis.issueType.replace(/_/g, ' ').toUpperCase()} Repair Required at ${data.asset.assetName}`;

  const defaultLetter = `To the Concerned Higher Authorities (${higherOfficer.name}, ${higherOfficer.designation} & Assigned Executive Engineer ${execOfficer.name}),

I am writing to formally report a severe infrastructure hazard located on ${data.asset.assetName}, ${data.asset.ward}, ${data.asset.district}.

Based on the attached photographic evidence captured today, a critical ${analysis.issueType.replace(/_/g, ' ')} defect has developed on this primary corridor. This defect poses a significant and immediate risk to both vehicular traffic and pedestrian safety.

The related public works project (${data.project.projectName}) maintains an active defect liability maintenance period until ${data.maintenanceEndDate} under Tender ID ${data.tender.tenderNumber}.

Given the high volume of traffic on this road, this issue requires urgent site inspection and enforcement of emergency repairs under contractor warranty.`;

  const [title, setTitle] = useState(defaultTitle);
  const [letterText, setLetterText] = useState(defaultLetter);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setLetterText(
        `To the Office of the Commissioner (${higherOfficer.name}) & Executive Engineer (${execOfficer.name}),\n\nOFFICIAL CIVIC ESCALATION NOTICE:\nVisual AI analysis confirms a ${analysis.severity.toUpperCase()} severity ${analysis.issueType.replace(/_/g, ' ')} hazard on ${data.asset.assetName}.\n\nPublic Works Asset Reference: ${data.asset.id}\nTender Procurement Package: ${data.tender.tenderNumber}\nExecuting Contractor: ${data.contractor.name}\n\nRequesting immediate site verification and warranty enforcement.`
      );
      setIsRegenerating(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[var(--color-surface)] rounded-3xl border-2 border-red-200 max-w-5xl w-full shadow-2xl overflow-hidden animate-fadeIn my-6">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[var(--color-outline-variant)]">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <h2 className="text-xl font-extrabold text-[var(--color-text-primary)]">
              Complaint Builder
            </h2>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-[var(--color-text-tertiary)]">
            <span className="text-emerald-600 flex items-center gap-1">
              <CheckCircle2 size={14} /> Draft saved
            </span>
            <button
              onClick={onClose}
              className="hover:underline text-[var(--color-text-primary)]"
            >
              Save & Exit
            </button>
          </div>
        </div>

        {/* Modal Body 2-Column Grid */}
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Sidebar: Report Context */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-[var(--color-text-tertiary)]">
              Report Context
            </h3>

            {/* Box 1: Issue Category */}
            <div className="bg-white p-4 rounded-2xl border border-[var(--color-outline-variant)] space-y-1 shadow-sm">
              <div className="flex items-center gap-2 text-red-600 text-xs font-bold uppercase">
                <AlertTriangle size={15} />
                <span>Issue Category</span>
              </div>
              <p className="font-extrabold text-sm capitalize text-[var(--color-text-primary)]">
                Severe {analysis.issueType.replace(/_/g, ' ')}
              </p>
            </div>

            {/* Box 2: Location */}
            <div className="bg-white p-4 rounded-2xl border border-[var(--color-outline-variant)] space-y-1 shadow-sm">
              <div className="flex items-center gap-2 text-[var(--color-civic-blue)] text-xs font-bold uppercase">
                <MapPin size={15} />
                <span>Location</span>
              </div>
              <p className="font-extrabold text-sm text-[var(--color-text-primary)]">
                {data.asset.assetName}
              </p>
              <p className="text-xs text-[var(--color-text-tertiary)]">
                {data.asset.ward}, {data.asset.district}
              </p>
            </div>

            {/* Box 3: Evidence Snapshot */}
            <div className="bg-white p-4 rounded-2xl border border-[var(--color-outline-variant)] space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-[var(--color-text-tertiary)]">
                  <Camera size={14} />
                  <span>Evidence Photo</span>
                </div>
                <span className="text-[10px] font-bold text-[var(--color-civic-blue)]">Verified</span>
              </div>
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Evidence preview"
                  className="w-full h-32 object-cover rounded-xl border border-[var(--color-outline-variant)]"
                />
              )}
            </div>

            {/* Box 4: Civic Context Match */}
            <div className="bg-blue-50/80 p-4 rounded-2xl border border-blue-200 space-y-2">
              <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-blue-900 uppercase">
                <ShieldCheck size={14} /> Civic Context Match
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-blue-800">Asset ID:</span>
                  <span className="font-mono font-bold text-blue-950">{data.asset.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-800">Jurisdiction:</span>
                  <span className="font-bold text-blue-950">{data.asset.ward}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-800">Defect Warranty:</span>
                  <span className="font-bold text-emerald-700">ACTIVE ({data.remainingMonths} Mos)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: AI Draft Generation & Form */}
          <div className="md:col-span-8 space-y-6">
            
            {/* Top Pill Header */}
            <div className="bg-white p-4 rounded-2xl border border-[var(--color-outline-variant)] flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[var(--color-text-primary)]">AI Draft Generation</h4>
                  <p className="text-[10px] text-teal-700 font-bold">Generated with Gemini AI assistance</p>
                </div>
              </div>

              <button
                onClick={() => alert('Version 1.0 Active')}
                className="flex items-center gap-1 text-xs font-bold text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
              >
                <History size={14} /> Version History
              </button>
            </div>

            {/* Editable Title */}
            <div className="space-y-1">
              <label className="block text-[10px] font-extrabold text-[var(--color-text-tertiary)] uppercase tracking-wider">
                Escalation Subject
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[var(--color-outline-variant)] font-black text-base md:text-lg text-[var(--color-text-primary)] focus:outline-none focus:border-red-400 shadow-sm"
              />
            </div>

            {/* Editable Formal Letter Body */}
            <div className="space-y-1">
              <label className="block text-[10px] font-extrabold text-[var(--color-text-tertiary)] uppercase tracking-wider">
                Official Letter Body (Addressed to Commissioner & Engineer)
              </label>
              <textarea
                value={letterText}
                onChange={(e) => setLetterText(e.target.value)}
                rows={9}
                className="w-full p-4 rounded-2xl bg-white border border-[var(--color-outline-variant)] text-xs md:text-sm text-[var(--color-text-primary)] font-medium leading-relaxed focus:outline-none focus:border-red-400 resize-none shadow-sm"
              />
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between gap-4 pt-2">
              <button
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="flex items-center gap-2 px-4 py-3 bg-white border border-[var(--color-outline-variant)] hover:bg-[var(--color-surface-container)] rounded-xl font-extrabold text-xs text-[var(--color-text-primary)] shadow-sm transition-colors"
              >
                <RotateCw size={15} className={isRegenerating ? 'animate-spin' : ''} />
                Regenerate Draft
              </button>

              <button
                onClick={() => onSubmit(title, letterText, 'Urgent site inspection and contractor warranty repair')}
                disabled={submitting}
                className="flex-1 py-3.5 px-6 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-xl font-black text-xs md:text-sm shadow-xl transition-all flex items-center justify-center gap-2 min-h-[48px]"
              >
                <Send size={18} />
                Submit Final Complaint to Higher Authority →
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
