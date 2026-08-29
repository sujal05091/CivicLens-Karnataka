'use client';

import { CASE_STATUS_CONFIG, type CaseStatus } from '@/lib/types';

interface TimelineProps {
  currentStatus: CaseStatus;
  onSimulateNext?: () => void;
  showSimulateButton?: boolean;
}

const TIMELINE_STEPS: CaseStatus[] = [
  'RECEIVED',
  'VERIFIED',
  'ROUTED',
  'INSPECTION',
  'REPAIR',
  'RESOLVED',
];

const STEP_LABELS = [
  'Evidence Received',
  'Location Confirmed',
  'Asset Matched',
  'Case Prepared',
  'Routed',
  'Inspection',
  'Repair',
  'Resolved',
];

export default function Timeline({ currentStatus, onSimulateNext, showSimulateButton }: TimelineProps) {
  const currentIndex = TIMELINE_STEPS.indexOf(currentStatus);

  const steps = STEP_LABELS.map((label, i) => {
    let state: 'completed' | 'current' | 'pending';
    // Map 8 display labels to 6 actual statuses
    // Steps 0-3 map to RECEIVED/VERIFIED, 4 to ROUTED, 5 to INSPECTION, 6 to REPAIR, 7 to RESOLVED
    const mappedIndex = i <= 3 ? Math.min(i, 1) : i - 2;

    if (mappedIndex < currentIndex) {
      state = 'completed';
    } else if (mappedIndex === currentIndex) {
      // If we're past step 3 in display, or at the current status
      state = i <= (currentIndex <= 1 ? currentIndex + 2 : currentIndex + 2) ? 'completed' : 'current';
      if (mappedIndex === currentIndex && i === Math.min(currentIndex + 2, 7)) {
        state = 'current';
      }
    } else {
      state = 'pending';
    }

    // Simpler logic: first N steps completed based on status
    const completedCount = (() => {
      switch (currentStatus) {
        case 'RECEIVED': return 1;
        case 'VERIFIED': return 4;
        case 'ROUTED': return 5;
        case 'INSPECTION': return 5;
        case 'REPAIR': return 6;
        case 'RESOLVED': return 8;
        default: return 0;
      }
    })();

    const currentStep = completedCount;

    if (i < completedCount) {
      state = 'completed';
    } else if (i === completedCount) {
      state = 'current';
    } else {
      state = 'pending';
    }

    return { label, state, index: i };
  });

  const currentConfig = CASE_STATUS_CONFIG[currentStatus];

  return (
    <div className="space-y-4">
      <div className="relative">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-4 relative">
            {/* Connector line */}
            {i < steps.length - 1 && (
              <div
                className={`absolute left-[15px] top-[32px] w-0.5 h-8 ${
                  step.state === 'completed'
                    ? 'bg-[var(--color-trust-emerald)]'
                    : step.state === 'current'
                    ? 'bg-[var(--color-civic-blue)]'
                    : 'bg-[var(--color-outline-variant)]'
                }`}
              />
            )}

            {/* Node */}
            <div className="flex-shrink-0 mt-1">
              <div
                className={`w-[30px] h-[30px] rounded-full flex items-center justify-center text-sm font-semibold ${
                  step.state === 'completed'
                    ? 'bg-[var(--color-trust-emerald)] text-white'
                    : step.state === 'current'
                    ? 'bg-[var(--color-civic-blue)] text-white civic-pulse'
                    : 'bg-[var(--color-surface-container)] text-[var(--color-text-tertiary)] border-2 border-[var(--color-outline-variant)]'
                }`}
              >
                {step.state === 'completed' ? '✓' : step.state === 'current' ? '●' : '○'}
              </div>
            </div>

            {/* Content */}
            <div className="pb-6 flex-1">
              <p
                className={`font-medium text-sm ${
                  step.state === 'pending'
                    ? 'text-[var(--color-text-tertiary)]'
                    : 'text-[var(--color-text-primary)]'
                }`}
              >
                {step.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Status explanation */}
      {currentConfig && (
        <div className="bg-[var(--color-surface-container-low)] rounded-xl p-4 space-y-3">
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">
              What does this mean?
            </h4>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              {currentConfig.whatItMeans}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">
              Do I need to do anything?
            </h4>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              {currentConfig.whatToDo}
            </p>
          </div>
        </div>
      )}

      {/* Simulate next step button (for demo) */}
      {showSimulateButton && currentStatus !== 'RESOLVED' && (
        <button
          onClick={onSimulateNext}
          className="w-full py-3 px-4 rounded-xl bg-[var(--color-surface-container)] text-[var(--color-civic-blue)] font-semibold text-sm border border-[var(--color-outline-variant)] hover:bg-[var(--color-surface-container-high)] transition-colors"
        >
          ⏩ Simulate Next Step (Demo)
        </button>
      )}
    </div>
  );
}
