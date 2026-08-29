'use client';

import { useRouter } from 'next/navigation';
import {
  Camera, Sparkles, MapPin, ShieldCheck, ArrowRight, CheckCircle2, FileText, Wrench, Building2, Eye, UserCheck, Layers, HelpCircle
} from 'lucide-react';
import DisclosureBanner from '@/components/DisclosureBanner';

const WORKFLOW_STEPS = [
  {
    step: '01',
    icon: <Camera size={24} className="text-white" />,
    color: 'bg-[var(--color-civic-blue)]',
    title: 'Visual Evidence Capture',
    desc: 'Citizen captures or uploads clear photo evidence of an infrastructure defect on their phone or desktop.',
    details: [
      'Automatic GPS geotagging & timestamping',
      'Supports potholes, streetlights, garbage, water leaks, and drainage',
      'No registration required for initial intake scan',
    ],
  },
  {
    step: '02',
    icon: <Sparkles size={24} className="text-white" />,
    color: 'bg-teal-600',
    title: 'Gemini Vision AI Analysis',
    desc: 'Advanced computer vision models analyze pixel patterns to identify defect category, confidence score, and severity level.',
    details: [
      'Instant AI classification with 96%+ confidence',
      'Automated severity assessment (Low, Medium, High, Critical)',
      'Neutral, factual evidence summary without bias',
    ],
  },
  {
    step: '03',
    icon: <Layers size={24} className="text-white" />,
    color: 'bg-amber-600',
    title: 'Asset & Tender Record Matching',
    desc: 'Geospatial coordinates are cross-referenced against Karnataka public works databases, active tenders, and contractor warranties.',
    details: [
      'Matches road segment ID (e.g. ROAD-KAR-1042)',
      'Identifies contractor warranty & Defect Liability Period',
      'Verifies public procurement tender numbers (KPP Portal)',
    ],
  },
  {
    step: '04',
    icon: <Building2 size={24} className="text-white" />,
    color: 'bg-indigo-600',
    title: 'Dual Officer & Authority Routing',
    desc: 'The system formulates an official escalation draft routed directly to both Higher Administrative Authorities and Executing Engineers.',
    details: [
      'Higher Authority: Sri Dr. M. G. Parameshwara, IAS (Commissioner)',
      'Executing Engineer: Er. Rajesh V. Gowda, M.Tech (Ward 42)',
      'Interactive Complaint Builder modal for user customization',
    ],
  },
  {
    step: '05',
    icon: <Eye size={24} className="text-white" />,
    color: 'bg-emerald-600',
    title: 'Transparent 8-Stage Public Audit',
    desc: 'Case enters a transparent, 8-stage public tracking timeline accessible by citizens and department officials.',
    details: [
      '8 distinct resolution stages from intake to final sign-off',
      'OpenStreetMap visual location marker with RED pin',
      'Earn Verified Civic Contributor badges upon case resolution',
    ],
  },
];

export default function HowItWorksPage() {
  const router = useRouter();

  return (
    <div className="px-4 md:px-8 pt-8 pb-16 max-w-6xl mx-auto space-y-12 animate-fadeIn text-[var(--color-text-primary)]">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[var(--color-civic-blue)] border border-blue-200 text-xs font-extrabold">
          <HelpCircle size={14} /> System Architecture & Workflow Guide
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-[var(--color-text-primary)] tracking-tight">
          How CivicLens Karnataka Works
        </h1>
        <p className="text-sm md:text-base text-[var(--color-text-secondary)] font-medium leading-relaxed">
          Bridging citizen photo evidence, Gemini AI vision analysis, state tender records, and municipal authority escalation into an immutable, transparent pipeline.
        </p>

        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={() => router.push('/report')}
            className="px-6 py-3.5 bg-[var(--color-civic-blue)] hover:bg-[var(--color-civic-blue-dark)] text-white rounded-full font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Camera size={16} />
            Try Live System Demo →
          </button>

          <button
            onClick={() => router.push('/nearby')}
            className="px-6 py-3.5 bg-white border border-[var(--color-outline-variant)] hover:bg-gray-50 text-[var(--color-text-primary)] rounded-full font-extrabold text-xs transition-all"
          >
            Explore Nearby Map
          </button>
        </div>
      </div>

      {/* Visual Pipeline Step-by-Step List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-[var(--color-text-primary)] text-center">
          5-Step End-to-End Resolution Pipeline
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          {WORKFLOW_STEPS.map((item) => (
            <div
              key={item.step}
              className="bg-white rounded-3xl border border-[var(--color-outline-variant)] p-6 md:p-8 shadow-sm hover:shadow-md transition-all grid md:grid-cols-12 gap-6 items-center"
            >
              {/* Left Step Badge & Icon */}
              <div className="md:col-span-4 flex items-center gap-4 border-b md:border-b-0 md:border-r border-[var(--color-outline-variant)] pb-4 md:pb-0 md:pr-6">
                <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center shadow-md flex-shrink-0`}>
                  {item.icon}
                </div>
                <div>
                  <span className="text-xs font-mono font-black text-gray-400 block uppercase">
                    STEP {item.step}
                  </span>
                  <h3 className="font-extrabold text-lg text-[var(--color-text-primary)] leading-tight">
                    {item.title}
                  </h3>
                </div>
              </div>

              {/* Right Description & Details */}
              <div className="md:col-span-8 space-y-3">
                <p className="text-xs md:text-sm text-[var(--color-text-secondary)] font-medium leading-relaxed">
                  {item.desc}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  {item.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-[11px] font-bold text-[var(--color-text-primary)] bg-blue-50/60 p-2.5 rounded-xl border border-blue-100">
                      <CheckCircle2 size={13} className="text-teal-600 flex-shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Features Bento Grid */}
      <div className="bg-white rounded-3xl border border-[var(--color-outline-variant)] p-8 md:p-10 space-y-8 shadow-sm">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-black text-[var(--color-text-primary)]">
            Built for Transparency & Public Oversight
          </h2>
          <p className="text-xs text-[var(--color-text-tertiary)] font-medium">
            CivicLens Karnataka operates independently to ensure data integrity and civic accountability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold mx-auto shadow-md">
              🛡️
            </div>
            <h3 className="font-extrabold text-base text-[var(--color-text-primary)]">
              Factual Non-Blame Intake
            </h3>
            <p className="text-xs text-[var(--color-text-tertiary)] font-medium leading-relaxed">
              Reports focus strictly on physical defect specifications, geospatial coordinates, and contractor liability periods without personal blame.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-teal-50/70 border border-teal-100 space-y-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center text-xl font-bold mx-auto shadow-md">
              🗺️
            </div>
            <h3 className="font-extrabold text-base text-[var(--color-text-primary)]">
              OpenStreetMap Integration
            </h3>
            <p className="text-xs text-[var(--color-text-tertiary)] font-medium leading-relaxed">
              All reported defects are rendered with live RED markers on OpenStreetMap, mapped directly to Ward 42 boundaries and corridor segments.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-100 space-y-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center text-xl font-bold mx-auto shadow-md">
              🏆
            </div>
            <h3 className="font-extrabold text-base text-[var(--color-text-primary)]">
              Verified Citizen Badges
            </h3>
            <p className="text-xs text-[var(--color-text-tertiary)] font-medium leading-relaxed">
              Citizens earn shareable Verified Civic Contributor cards (such as Road Watcher and Public Safety Contributor) when reported cases achieve resolution.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA Card */}
      <div className="bg-gradient-to-r from-[var(--color-civic-blue)] via-[var(--color-civic-blue-dark)] to-[#001946] text-white rounded-3xl p-8 md:p-10 text-center space-y-4 shadow-xl">
        <h2 className="text-2xl md:text-3xl font-black">Ready to report a civic issue in Karnataka?</h2>
        <p className="text-xs md:text-sm text-white/80 max-w-xl mx-auto font-medium leading-relaxed">
          Upload clear photo evidence of potholes, broken streetlights, or drainage issues to match state tenders and initiate official escalation.
        </p>

        <button
          onClick={() => router.push('/report')}
          className="px-8 py-4 bg-white text-[var(--color-civic-blue)] rounded-full font-black text-xs md:text-sm shadow-xl hover:bg-gray-100 transition-all inline-flex items-center gap-2"
        >
          <span>Start System Intake Now</span>
          <ArrowRight size={16} />
        </button>
      </div>

      <DisclosureBanner />
    </div>
  );
}
