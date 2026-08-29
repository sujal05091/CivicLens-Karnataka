'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck, FileText, CheckCircle2, Camera, Lock, Award, ArrowRight, Share2, User, History
} from 'lucide-react';
import DisclosureBanner from '@/components/DisclosureBanner';

import { useAuthStore } from '@/store/auth-store';

export default function ProfilePage() {
  const router = useRouter();
  const { profile } = useAuthStore();

  const userDisplayName = profile?.displayName || 'Aarav Patel';
  const userDistrict = profile?.district || 'Bengaluru South District';
  const userAvatar = profile?.photoURL || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80';
  const verifiedReportsCount = profile?.verifiedReports ?? 34;
  const resolvedIssuesCount = profile?.resolvedIssues ?? 21;
  const evidenceCount = profile?.evidenceContributions ?? 48;

  return (
    <div className="px-4 md:px-8 pt-8 pb-16 max-w-5xl mx-auto space-y-8 animate-fadeIn text-[var(--color-text-primary)]">
      
      {/* Hero Contributor Banner Card 1:1 Stitch */}
      <div className="bg-white rounded-3xl border border-[var(--color-outline-variant)] p-8 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
        
        {/* User Portrait Photo */}
        <div className="relative flex-shrink-0">
          <img
            src={userAvatar}
            alt={`${userDisplayName} Profile`}
            className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
          />
          <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[10px]">
            ✓
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="space-y-3 text-center md:text-left flex-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 font-extrabold text-[10px] border border-teal-200">
            <ShieldCheck size={13} className="text-teal-700" />
            Verified Civic Contributor
          </span>

          <h1 className="text-3xl font-black text-[var(--color-text-primary)] tracking-tight">
            {userDisplayName}
          </h1>

          <p className="text-xs text-[var(--color-text-tertiary)] font-bold">
            {userDistrict} • Member since 2023
          </p>

          <div className="pt-2 flex items-center justify-center md:justify-start gap-3">
            <button
              onClick={() => alert('Profile editing opens user settings.')}
              className="px-5 py-2.5 bg-white border border-[var(--color-outline-variant)] hover:bg-gray-50 text-[var(--color-text-primary)] font-extrabold text-xs rounded-full shadow-sm transition-all"
            >
              Edit Profile
            </button>

            <button
              onClick={() => router.push('/badge/aarav-patel')}
              className="px-5 py-2.5 bg-[var(--color-civic-blue)] hover:bg-[var(--color-civic-blue-dark)] text-white font-extrabold text-xs rounded-full shadow-md transition-all flex items-center gap-1.5"
            >
              <span>View Public Card</span>
              <Share2 size={13} />
            </button>
          </div>
        </div>

      </div>

      {/* Stat Cards (3-Column Metric Grid) 1:1 Stitch */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Verified Reports */}
        <div className="bg-white rounded-3xl border border-[var(--color-outline-variant)] p-6 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-full bg-blue-50 text-[var(--color-civic-blue)] flex items-center justify-center font-bold">
              <FileText size={18} />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-[var(--color-text-primary)]">{verifiedReportsCount}</p>
            <p className="text-[10px] font-extrabold text-[var(--color-text-tertiary)] uppercase tracking-wider mt-1">
              VERIFIED REPORTS
            </p>
          </div>
        </div>

        {/* Card 2: Resolved Issues */}
        <div className="bg-white rounded-3xl border border-[var(--color-outline-variant)] p-6 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-[var(--color-text-primary)]">{resolvedIssuesCount}</p>
            <p className="text-[10px] font-extrabold text-[var(--color-text-tertiary)] uppercase tracking-wider mt-1">
              RESOLVED ISSUES
            </p>
          </div>
        </div>

        {/* Card 3: Evidence Contributions */}
        <div className="bg-white rounded-3xl border border-[var(--color-outline-variant)] p-6 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <Camera size={18} />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-[var(--color-text-primary)]">{evidenceCount}</p>
            <p className="text-[10px] font-extrabold text-[var(--color-text-tertiary)] uppercase tracking-wider mt-1">
              EVIDENCE CONTRIBUTIONS
            </p>
          </div>
        </div>

      </div>

      {/* Section 2: Your Badges 1:1 Stitch */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-[var(--color-text-primary)]">
          Your Badges
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Badge 1: Road Watcher */}
          <div className="bg-white rounded-3xl border border-[var(--color-outline-variant)] p-6 text-center space-y-3 shadow-sm hover:shadow-md transition-all">
            <div className="w-16 h-16 rounded-full bg-blue-100/70 text-[var(--color-civic-blue)] flex items-center justify-center font-bold text-2xl mx-auto shadow-inner border border-blue-200">
              🛣️
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[var(--color-text-primary)]">
                Road Watcher
              </h3>
              <p className="text-[10px] text-[var(--color-text-tertiary)] font-medium max-w-xs mx-auto mt-1 leading-relaxed">
                Awarded for submitting 10+ verified reports on road infrastructure.
              </p>
            </div>
          </div>

          {/* Badge 2: Public Safety Contributor */}
          <div className="bg-white rounded-3xl border border-[var(--color-outline-variant)] p-6 text-center space-y-3 shadow-sm hover:shadow-md transition-all">
            <div className="w-16 h-16 rounded-full bg-teal-100/70 text-teal-700 flex items-center justify-center font-bold text-2xl mx-auto shadow-inner border border-teal-200">
              🛡️
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[var(--color-text-primary)]">
                Public Safety Contributor
              </h3>
              <p className="text-[10px] text-[var(--color-text-tertiary)] font-medium max-w-xs mx-auto mt-1 leading-relaxed">
                Recognized for consistently providing high-quality evidence for safety hazards.
              </p>
            </div>
          </div>

          {/* Badge 3: Civic Champion (Locked) */}
          <div className="bg-gray-50/70 rounded-3xl border border-dashed border-gray-300 p-6 text-center space-y-3 shadow-none opacity-70">
            <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center font-bold text-xl mx-auto border border-gray-200">
              <Lock size={22} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-500">
                Civic Champion
              </h3>
              <p className="text-[10px] text-gray-400 font-medium max-w-xs mx-auto mt-1 leading-relaxed">
                Submit 50 verified reports to unlock.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Section 3: Your Civic Activity 1:1 Stitch */}
      <div className="bg-white rounded-3xl border border-[var(--color-outline-variant)] p-6 md:p-8 space-y-6 shadow-sm">
        <h2 className="text-lg font-black text-[var(--color-text-primary)]">
          Your Civic Activity
        </h2>

        <div className="space-y-6 relative pl-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-100">
          
          {/* Activity 1 */}
          <div className="relative space-y-1">
            <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-white" />
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  RESOLVED
                </span>
                <h3 className="font-extrabold text-sm text-[var(--color-text-primary)]">
                  Pothole Repair - 4th Block, Koramangala
                </h3>
              </div>
              <span className="text-[10px] font-bold text-[var(--color-text-tertiary)]">
                2 days ago
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-tertiary)] font-medium pl-0.5">
              Your report ID #BGL-8923 has been marked as resolved by the municipal authority. Thank you for your contribution.
            </p>
          </div>

          {/* Activity 2 */}
          <div className="relative space-y-1">
            <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-[var(--color-civic-blue)] ring-4 ring-white" />
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  IN PROGRESS
                </span>
                <h3 className="font-extrabold text-sm text-[var(--color-text-primary)]">
                  Streetlight Outage - Indiranagar 100ft Road
                </h3>
              </div>
              <span className="text-[10px] font-bold text-[var(--color-text-tertiary)]">
                5 days ago
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-tertiary)] font-medium pl-0.5">
              A work order has been assigned to the electrical department based on your report.
            </p>
          </div>

          {/* Activity 3 */}
          <div className="relative space-y-1">
            <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-gray-400 ring-4 ring-white" />
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                  SUBMITTED
                </span>
                <h3 className="font-extrabold text-sm text-[var(--color-text-primary)]">
                  Illegal Dumping - Electronic City Phase 1
                </h3>
              </div>
              <span className="text-[10px] font-bold text-[var(--color-text-tertiary)]">
                1 week ago
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-tertiary)] font-medium pl-0.5">
              Report successfully submitted and is awaiting preliminary verification.
            </p>
          </div>

        </div>

        {/* View All Activity Button */}
        <div className="pt-4 border-t border-[var(--color-outline-variant)] text-center">
          <button
            onClick={() => router.push('/cases')}
            className="text-xs font-extrabold text-[var(--color-civic-blue)] hover:underline inline-flex items-center gap-1"
          >
            <span>View All Activity</span>
            <ArrowRight size={13} />
          </button>
        </div>

      </div>

      <DisclosureBanner />
    </div>
  );
}
