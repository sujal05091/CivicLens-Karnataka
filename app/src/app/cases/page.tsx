'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Sparkles, Droplets, Wrench, Lightbulb, CheckCircle2, ArrowRight, ShieldAlert } from 'lucide-react';
import DisclosureBanner from '@/components/DisclosureBanner';
import { getSavedPersonalCases, StoredCaseItem } from '@/lib/personal-data';
import { useAuthStore } from '@/store/auth-store';
import { User } from 'lucide-react';

interface MyCaseCardItem {
  id: string;
  displayId: string;
  title: string;
  location: string;
  status: 'In Progress' | 'Assigned' | 'Resolved';
  reportedDate: string;
  estimatedOrResolvedDate: string;
  progressPercent: number;
  aiVerified?: boolean;
  confidencePercent?: number;
  type: string;
  isPersonalSakala?: boolean;
  officerName?: string;
  penaltyFine?: number;
}

const MY_CASES_LIST: MyCaseCardItem[] = [
  {
    id: 'CIV-KAR-10392',
    displayId: '#BGL-24-892',
    title: 'Major Water Leak',
    location: 'Koramangala 4th Block, 12th Main',
    status: 'In Progress',
    reportedDate: 'Oct 12',
    estimatedOrResolvedDate: 'Estimated: Oct 15',
    progressPercent: 60,
    type: 'water',
  },
  {
    id: 'CIV-KAR-10345',
    displayId: '#BGL-24-885',
    title: 'Pothole on Main Road',
    location: 'Indiranagar 100ft Road',
    status: 'Assigned',
    reportedDate: 'Oct 10',
    estimatedOrResolvedDate: 'Pending update',
    progressPercent: 35,
    aiVerified: true,
    confidencePercent: 98,
    type: 'pothole',
  },
  {
    id: 'CIV-KAR-10301',
    displayId: '#BGL-24-750',
    title: 'Streetlight Outage',
    location: 'HSR Layout Sector 2',
    status: 'Resolved',
    reportedDate: 'Sep 28',
    estimatedOrResolvedDate: 'Resolved: Oct 02',
    progressPercent: 100,
    type: 'streetlight',
  },
];

export default function CasesPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'resolved'>('all');
  const [casesList, setCasesList] = useState<MyCaseCardItem[]>(MY_CASES_LIST);

  useEffect(() => {
    const savedPersonal = getSavedPersonalCases();
    if (savedPersonal && savedPersonal.length > 0) {
      setCasesList([...(savedPersonal as MyCaseCardItem[]), ...MY_CASES_LIST]);
    }
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="px-4 py-20 max-w-md mx-auto text-center space-y-6 animate-fadeIn">
        <div className="w-20 h-20 bg-blue-50 text-[var(--color-civic-blue)] rounded-3xl flex items-center justify-center mx-auto shadow-inner border border-blue-100">
          <User size={36} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-[var(--color-text-primary)]">Login Required</h2>
          <p className="text-sm text-[var(--color-text-secondary)] font-medium leading-relaxed">
            Please log in or create a citizen account to view your submitted cases and track Sakala petitions.
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

  const filteredCases = casesList.filter((item) => {
    if (activeTab === 'active') return item.status !== 'Resolved';
    if (activeTab === 'resolved') return item.status === 'Resolved';
    return true;
  });

  const activeCount = casesList.filter((i) => i.status !== 'Resolved').length;
  const resolvedCount = casesList.filter((i) => i.status === 'Resolved').length;

  return (
    <div className="px-4 md:px-8 pt-8 pb-16 max-w-7xl mx-auto space-y-8 animate-fadeIn text-[var(--color-text-primary)]">
      
      {/* Header Section with Title & Filter Pills 1:1 Stitch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-[var(--color-text-primary)] tracking-tight">
            My Cases
          </h1>
          <p className="text-xs md:text-sm text-[var(--color-text-secondary)] font-medium">
            Track and manage your submitted civic reports.
          </p>
        </div>

        {/* Filter Pills Container 1:1 */}
        <div className="bg-[var(--color-surface-container-low)] p-1 rounded-2xl border border-[var(--color-outline-variant)] shadow-sm inline-flex items-center gap-1 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'all'
                ? 'bg-white text-[var(--color-civic-blue)] shadow-sm'
                : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            All Cases ({casesList.length})
          </button>

          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'active'
                ? 'bg-white text-[var(--color-civic-blue)] shadow-sm'
                : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            Active ({activeCount})
          </button>

          <button
            onClick={() => setActiveTab('resolved')}
            className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'resolved'
                ? 'bg-white text-[var(--color-civic-blue)] shadow-sm'
                : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            Resolved ({resolvedCount})
          </button>
        </div>
      </div>

      {/* 3-Column Grid of Case Cards 1:1 Stitch */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredCases.map((item) => (
          <div
            key={item.id}
            onClick={() => router.push(`/track/${item.id}`)}
            className="bg-white rounded-3xl border border-[var(--color-outline-variant)] p-6 space-y-5 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Top Row: Icon + ID + Title + Status Pill */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Icon Circle Container */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 font-bold ${
                      item.type === 'water'
                        ? 'bg-teal-100 text-teal-700'
                        : item.type === 'pothole'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {item.type === 'water' && <Droplets size={20} />}
                    {item.type === 'pothole' && <Wrench size={20} />}
                    {item.type === 'streetlight' && <Lightbulb size={20} />}
                  </div>

                  <div>
                    <span className="text-[10px] font-mono font-bold text-[var(--color-text-tertiary)] block">
                      ID: {item.displayId}
                    </span>
                    <h3 className="font-extrabold text-sm text-[var(--color-text-primary)] group-hover:text-[var(--color-civic-blue)] transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* Status Badge Pill 1:1 */}
                <span
                  className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase ${
                    item.status === 'In Progress'
                      ? 'bg-teal-100 text-teal-800 border border-teal-300'
                      : item.status === 'Assigned'
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              {/* Location Row */}
              <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-tertiary)] font-medium">
                <MapPin size={14} className="text-red-600 flex-shrink-0" />
                <span className="truncate">{item.location}</span>
              </div>

              {/* Optional AI Verified Badge 1:1 */}
              {item.aiVerified && (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-extrabold">
                  <Sparkles size={11} className="text-teal-600" />
                  <span>AI Verified: {item.confidencePercent}% Confidence</span>
                </div>
              )}
            </div>

            {/* Bottom Timeline Progress Bar Section 1:1 */}
            <div className="space-y-2 pt-4 border-t border-[var(--color-outline-variant)]">
              <div className="flex items-center justify-between text-[10px] font-extrabold text-[var(--color-text-tertiary)]">
                <span>Reported: {item.reportedDate}</span>
                <span>{item.estimatedOrResolvedDate}</span>
              </div>

              {/* Progress Line */}
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.status === 'Resolved' ? 'bg-emerald-600' : 'bg-[var(--color-civic-blue)]'
                  }`}
                  style={{ width: `${item.progressPercent}%` }}
                />
              </div>
            </div>

          </div>
        ))}
      </div>

      <DisclosureBanner />
    </div>
  );
}
