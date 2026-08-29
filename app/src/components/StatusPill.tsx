import type { MaintenanceStatus, CaseStatus } from '@/lib/types';

interface StatusPillProps {
  status: MaintenanceStatus | CaseStatus | string;
  label?: string;
  size?: 'sm' | 'md';
}

const statusStyles: Record<string, string> = {
  ACTIVE: 'status-active',
  EXPIRED: 'status-expired',
  RECEIVED: 'status-info',
  VERIFIED: 'status-info',
  ROUTED: 'status-info',
  INSPECTION: 'status-pending',
  REPAIR: 'status-pending',
  RESOLVED: 'status-active',
  DRAFT: 'status-info',
};

const statusIcons: Record<string, string> = {
  ACTIVE: '🟢',
  EXPIRED: '🔴',
  RECEIVED: '📩',
  VERIFIED: '✓',
  ROUTED: '📤',
  INSPECTION: '🔍',
  REPAIR: '🔧',
  RESOLVED: '✅',
};

export default function StatusPill({ status, label, size = 'md' }: StatusPillProps) {
  const style = statusStyles[status] || 'status-info';
  const icon = statusIcons[status] || '●';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full ${style} ${
        size === 'sm' ? 'text-xs px-2.5 py-0.5' : 'text-sm px-3 py-1'
      }`}
      role="status"
      aria-label={`Status: ${label || status}`}
    >
      <span aria-hidden="true">{icon}</span>
      {label || status}
    </span>
  );
}
