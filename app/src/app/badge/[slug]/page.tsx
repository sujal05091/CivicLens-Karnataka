'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Copy, Share2, Check, ShieldCheck } from 'lucide-react';
import { DEMO_CONTRIBUTOR_PROFILE, DEMO_BADGES } from '@/lib/demo-data';
import { useState } from 'react';
import DisclosureBanner from '@/components/DisclosureBanner';

export default function BadgePage() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const profile = DEMO_CONTRIBUTOR_PROFILE;
  const earnedBadges = DEMO_BADGES.filter(b => profile.badges.includes(b.id));

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.displayName} — CivicLens Contributor`,
          text: `${profile.displayName} has made ${profile.verifiedReports} verified civic contributions through CivicLens.`,
          url,
        });
      } catch {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="px-4 md:px-8 pt-6 space-y-6 max-w-2xl mx-auto pb-10">
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
          <h1 className="text-2xl font-extrabold text-[var(--color-text-primary)]">Shareable Contributor Badge</h1>
          <p className="text-xs text-[var(--color-text-tertiary)]">Verified Citizen Recognition</p>
        </div>
      </div>

      {/* Social Card */}
      <div className="bg-gradient-to-br from-[var(--color-civic-blue)] via-[var(--color-civic-blue-dark)] to-[#001946] text-white rounded-3xl p-8 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold text-sm">
              CL
            </div>
            <span className="font-extrabold tracking-wider text-sm">CIVICLENS KARNATAKA</span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full bg-[var(--color-ai-teal-surface)] text-[var(--color-ai-teal-dark)]">
            Verified Proof
          </span>
        </div>

        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-white/50 font-bold">Public Contributor</p>
          <h2 className="text-2xl font-black">{profile.displayName}</h2>
        </div>

        <div className="grid grid-cols-2 gap-3 bg-white/10 p-4 rounded-2xl border border-white/15">
          <div>
            <p className="text-3xl font-extrabold">{profile.verifiedReports}</p>
            <p className="text-xs text-white/70 font-medium">Verified Reports</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-[var(--color-trust-emerald-light)]">{profile.resolvedIssues}</p>
            <p className="text-xs text-white/70 font-medium">Resolved Cases</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold text-white/50 uppercase tracking-wider">Unlocked Recognition Badges</p>
          <div className="flex gap-2 flex-wrap">
            {earnedBadges.map(badge => (
              <span key={badge.id} className="bg-white/15 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-white/20">
                <span>{badge.icon}</span>
                <span>{badge.name}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-white/40">
          <span>CivicLens Independent Citizen Technology</span>
          <ShieldCheck size={16} />
        </div>
      </div>

      {/* Share Actions */}
      <div className="space-y-3">
        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 w-full py-4 px-6 bg-[var(--color-civic-blue)] text-white rounded-2xl font-bold text-base shadow-lg hover:bg-[var(--color-civic-blue-dark)] active:scale-95 transition-all min-h-[56px]"
        >
          {copied ? <Check size={20} /> : <Share2 size={20} />}
          {copied ? 'Link Copied to Clipboard!' : 'Share Contributor Card'}
        </button>

        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-white border border-[var(--color-outline-variant)] rounded-2xl font-semibold text-sm hover:bg-[var(--color-surface-container)] transition-all"
        >
          <Copy size={16} />
          Copy Public Profile Link
        </button>
      </div>

      <DisclosureBanner />
    </div>
  );
}
