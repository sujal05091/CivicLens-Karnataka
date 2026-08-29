import StatusPill from './StatusPill';
import type { CivicIntelligenceData } from '@/lib/types';
import { Building2, FileCheck, HardHat, ShieldCheck, Calendar, IndianRupee, ShieldAlert, Sparkles, UserCheck } from 'lucide-react';

interface CivicIntelligenceChainProps {
  data: CivicIntelligenceData;
  issueType: string;
  imageUrl?: string;
}

export default function CivicIntelligenceChain({ data, issueType, imageUrl }: CivicIntelligenceChainProps) {
  const higherOfficer = data.higherOfficer || data.officer;

  const nodes = [
    {
      icon: '📸',
      label: 'Evidence Intake',
      title: 'Visual Evidence Processed',
      value: issueType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      badge: 'AI Vision Verified',
      color: 'var(--color-ai-teal)',
    },
    {
      icon: '🛣️',
      label: 'Civic Asset Record',
      title: data.asset.assetName,
      value: `Asset ID: ${data.asset.id}`,
      subtitle: `${data.asset.ward}, ${data.asset.district}`,
      color: 'var(--color-civic-blue)',
    },
    {
      icon: '📋',
      label: 'Public Project Record',
      title: data.project.projectName,
      value: `Scheme: ${data.project.projectType}`,
      subtitle: `Sanctioned Budget: ₹${(data.project.sanctionedBudget / 10000000).toFixed(2)} Crore`,
      color: 'var(--color-civic-blue-light)',
    },
    {
      icon: '📄',
      label: 'Tender & Procurement',
      title: data.tender.title,
      value: `Tender Number: ${data.tender.tenderNumber}`,
      subtitle: `Award Date: ${new Date(data.tender.awardDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`,
      color: 'var(--color-civic-blue-light)',
    },
    {
      icon: '🔧',
      label: 'Maintenance Liability Lifespan',
      title: `${data.project.maintenanceMonths} Months Defect Liability Period`,
      status: data.maintenanceStatus,
      value: data.maintenanceStatus === 'ACTIVE' 
        ? `Active Warranty Period (${data.remainingMonths} Months Remaining)`
        : 'Expired Defect Liability Period',
      subtitle: `Completion Date: ${new Date(data.project.completionDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`,
      color: data.maintenanceStatus === 'ACTIVE' ? 'var(--color-trust-emerald)' : 'var(--color-error)',
    },
    {
      icon: '🏛️',
      label: 'Higher Authority Recipient',
      title: data.authority.name,
      value: `${data.authority.department} • ${data.authority.division}`,
      subtitle: `Higher Directorate: ${data.authority.higherAuthorityName}`,
      color: 'var(--color-civic-blue-dark)',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Visual Intelligence Graph Container */}
      <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)] p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--color-outline-variant)]">
          <div className="flex items-center gap-2 text-[var(--color-civic-blue)] font-extrabold text-base">
            <Building2 size={20} />
            <span>Civic Asset & Higher Authority Mapping</span>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-[var(--color-ai-teal-surface)] text-[var(--color-ai-teal-dark)] border border-[var(--color-ai-teal)]">
            <Sparkles size={12} /> Matched
          </span>
        </div>

        {/* Vertical Chain Nodes */}
        <div className="space-y-4 relative">
          {nodes.map((node, i) => (
            <div key={i} className="relative">
              {i < nodes.length - 1 && (
                <div className="absolute left-6 top-12 bottom-[-16px] w-[2px] bg-gradient-to-b from-[var(--color-civic-blue)] to-[var(--color-ai-teal)] z-0" />
              )}

              <div className="relative z-10 flex items-start gap-4 bg-[var(--color-surface-container-low)] p-4 md:p-5 rounded-xl border border-[var(--color-outline-variant)] hover:border-[var(--color-civic-blue)] transition-all">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: `${node.color}15`, border: `1.5px solid ${node.color}` }}
                >
                  {node.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[11px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider">
                      {node.label}
                    </span>
                    {node.status && <StatusPill status={node.status} size="sm" />}
                    {node.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--color-ai-teal-surface)] text-[var(--color-ai-teal-dark)] border border-[var(--color-ai-teal)]">
                        {node.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-[var(--color-text-primary)] mt-1">
                    {node.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mt-0.5 font-semibold">
                    {node.value}
                  </p>
                  {node.subtitle && (
                    <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5 font-medium">
                      {node.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* HIGHER AUTHORITY RECIPIENT CARD */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[var(--color-civic-blue-container)] to-blue-50 border-2 border-[var(--color-civic-blue)] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[var(--color-civic-blue)] uppercase tracking-wider">
              <ShieldCheck size={18} />
              <span>Designated Higher Administrative Authority</span>
            </div>
            <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-[var(--color-civic-blue)] text-white">
              Primary Recipient
            </span>
          </div>

          <div className="flex items-center gap-5">
            <img
              src={higherOfficer.photoUrl}
              alt={higherOfficer.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-[var(--color-civic-blue)] flex-shrink-0 shadow-md"
            />
            <div className="space-y-1 min-w-0">
              <h4 className="font-extrabold text-lg text-[var(--color-text-primary)]">{higherOfficer.name}</h4>
              <p className="text-xs font-extrabold text-[var(--color-civic-blue)]">{higherOfficer.designation}</p>
              <p className="text-xs text-[var(--color-text-secondary)] font-medium">{higherOfficer.department}</p>
              <p className="text-[11px] text-[var(--color-text-tertiary)] mt-1">📍 {higherOfficer.officeLocation}</p>
            </div>
          </div>
        </div>

        {/* Contractor & Sanctioned Budget Summary Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 rounded-xl bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)]">
          <div className="space-y-1">
            <span className="text-xs text-[var(--color-text-tertiary)] font-bold flex items-center gap-1.5 uppercase">
              <HardHat size={14} /> Assigned Contractor
            </span>
            <p className="font-bold text-sm text-[var(--color-text-primary)]">{data.contractor.name}</p>
            <p className="text-xs text-[var(--color-text-tertiary)]">Registration: {data.contractor.reference}</p>
          </div>

          <div className="space-y-1 md:border-l md:border-[var(--color-outline-variant)] md:pl-4">
            <span className="text-xs text-[var(--color-text-tertiary)] font-bold flex items-center gap-1.5 uppercase">
              <IndianRupee size={14} /> Sanctioned Budget Amount
            </span>
            <p className="font-extrabold text-base text-[var(--color-civic-blue)]">
              ₹{(data.project.sanctionedBudget / 10000000).toFixed(2)} Crore
            </p>
            <p className="text-xs text-[var(--color-text-tertiary)] flex items-center gap-1">
              <Calendar size={12} /> Maintenance until {new Date(data.maintenanceEndDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Neutral Accountability Statement */}
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3 text-xs text-blue-950 font-medium">
          <ShieldAlert size={18} className="text-[var(--color-civic-blue)] flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Higher Authority Routing Notice:</strong> Case is compiled objectively and escalated to the Office of the Higher Authority & Chief Engineer for executive oversight, site inspection direction, and contractor warranty enforcement.
          </p>
        </div>
      </div>
    </div>
  );
}
