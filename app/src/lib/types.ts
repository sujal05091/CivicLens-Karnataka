// CivicLens Karnataka — TypeScript Data Models

export type IssueType =
  | 'pothole'
  | 'road_damage'
  | 'broken_streetlight'
  | 'garbage_dumping'
  | 'water_leakage'
  | 'drainage_overflow'
  | 'damaged_footpath'
  | 'fallen_tree'
  | 'poster_advertisement'
  | 'public_littering'
  | 'damaged_public_property'
  | 'debris_obstruction';

export type IssueSeverity = 'low' | 'medium' | 'high' | 'critical';

export type CaseStatus =
  | 'DRAFT'
  | 'RECEIVED'
  | 'VERIFIED'
  | 'ROUTED'
  | 'INSPECTION'
  | 'REPAIR'
  | 'RESOLVED';

export type MaintenanceStatus = 'ACTIVE' | 'EXPIRED';

export interface User {
  id: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface CivicIssue {
  id: string;
  issueType: IssueType;
  severity: IssueSeverity;
  confidence: number;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  ward: string;
  district: string;
  status: CaseStatus;
  createdBy: string;
  createdAt: string;
  dataSource: string;
}

export interface IssueEvidence {
  id: string;
  issueId: string;
  mediaUrl: string;
  mediaType: string;
  aiAnalysis: AIAnalysis;
  createdAt: string;
}

export interface AIAnalysis {
  issueType: IssueType;
  confidence: number;
  severity: IssueSeverity;
  description: string;
  evidenceNotes: string[];
  needsHumanReview: boolean;
}

export interface CivicAsset {
  id: string;
  assetType: string;
  assetName: string;
  latitude: number;
  longitude: number;
  ward: string;
  district: string;
  projectId: string;
  authorityId: string;
  dataSource: string;
}

export interface Project {
  id: string;
  projectName: string;
  projectType: string;
  tenderId: string;
  contractorId: string;
  authorityId: string;
  officerId: string;
  higherAuthorityId: string;
  startDate: string;
  completionDate: string;
  maintenanceMonths: number;
  sanctionedBudget: number;
  dataSource: string;
}

export interface Tender {
  id: string;
  tenderNumber: string;
  title: string;
  contractorId: string;
  contractValue: number;
  sanctionedAmount: number;
  awardDate: string;
  dataSource: string;
}

export interface Contractor {
  id: string;
  name: string;
  reference: string;
  contactPerson?: string;
  dataSource: string;
}

export interface Officer {
  id: string;
  name: string;
  designation: string;
  department: string;
  division: string;
  photoUrl: string;
  officeLocation: string;
  jurisdiction: string;
  isHigherAuthority?: boolean;
  dataSource: string;
}

export interface Authority {
  id: string;
  name: string;
  department: string;
  division: string;
  jurisdiction: string;
  higherAuthorityName: string;
  chiefOfficer?: Officer;
  higherOfficer?: Officer;
  dataSource: string;
}

export interface Complaint {
  id: string;
  issueId: string;
  authorityId: string;
  projectId: string;
  referenceNumber: string;
  status: CaseStatus;
  submittedAt: string;
  resolvedAt?: string;
  isMock: boolean;
  title: string;
  description: string;
  location: string;
  evidenceSummary: string;
  projectReference: string;
  requestedAction: string;
}

export interface ComplaintEvent {
  id: string;
  complaintId: string;
  eventType: CaseStatus;
  title: string;
  description: string;
  createdAt: string;
  isSimulated: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: string;
}

export interface ContributorProfile {
  id: string;
  userId: string;
  displayName: string;
  verifiedReports: number;
  resolvedIssues: number;
  evidenceContributions: number;
  badges: string[];
  shareSlug: string;
  joinedDate: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  ward: string;
  district: string;
}

export interface CivicIntelligenceData {
  asset: CivicAsset;
  project: Project;
  tender: Tender;
  contractor: Contractor;
  officer: Officer;
  higherOfficer: Officer;
  authority: Authority;
  maintenanceStatus: MaintenanceStatus;
  maintenanceEndDate: string;
  remainingMonths: number;
}

export interface ComplaintDraft {
  title: string;
  category: string;
  description: string;
  location: string;
  evidenceSummary: string;
  projectReference: string;
  requestedAction: string;
}

export interface MockGovernmentResponse {
  caseId: string;
  status: CaseStatus;
  destination: string;
  simulated: boolean;
  submittedAt: string;
}

// Issue type display configuration for all 12 categories
export const ISSUE_TYPE_CONFIG: Record<IssueType, { label: string; icon: string; color: string }> = {
  pothole: { label: 'Pothole Defect', icon: '🕳️', color: '#EF4444' },
  road_damage: { label: 'Road Surface Damage', icon: '🛣️', color: '#F97316' },
  broken_streetlight: { label: 'Non-Functional Streetlight', icon: '💡', color: '#EAB308' },
  garbage_dumping: { label: 'Illegal Garbage Dumping', icon: '🗑️', color: '#84CC16' },
  water_leakage: { label: 'Pipeline Water Leakage', icon: '💧', color: '#06B6D4' },
  drainage_overflow: { label: 'Storm Drain Overflow', icon: '🌊', color: '#3B82F6' },
  damaged_footpath: { label: 'Damaged Pedestrian Footpath', icon: '🚶', color: '#8B5CF6' },
  fallen_tree: { label: 'Fallen Tree / Branch Hazard', icon: '🌳', color: '#22C55E' },
  poster_advertisement: { label: 'Unauthorized Public Poster', icon: '📄', color: '#EC4899' },
  public_littering: { label: 'Public Littering Accumulation', icon: '🚯', color: '#F59E0B' },
  damaged_public_property: { label: 'Damaged Public Infrastructure', icon: '🏗️', color: '#6366F1' },
  debris_obstruction: { label: 'Construction Debris Obstruction', icon: '⚠️', color: '#DC2626' },
};

// Case status configuration with explanations
export const CASE_STATUS_CONFIG: Record<CaseStatus, {
  label: string;
  icon: string;
  whatItMeans: string;
  whatToDo: string;
}> = {
  DRAFT: {
    label: 'Drafting',
    icon: '📝',
    whatItMeans: 'Your case details and civic asset mapping are compiled.',
    whatToDo: 'Review and confirm submission.',
  },
  RECEIVED: {
    label: 'Evidence Received',
    icon: '✓',
    whatItMeans: 'Your evidence and complaint have been received and logged by the Higher Authority Directorate.',
    whatToDo: 'No action needed. Your case is dispatched for administrative review.',
  },
  VERIFIED: {
    label: 'Verified & Matched',
    icon: '✓',
    whatItMeans: 'Location and civic asset record matched to active municipal project.',
    whatToDo: 'No action needed.',
  },
  ROUTED: {
    label: 'Escalated to Higher Authority',
    icon: '✓',
    whatItMeans: 'Case has been dispatched to the Office of the Chief Engineer & Commissioner.',
    whatToDo: 'No action needed.',
  },
  INSPECTION: {
    label: 'Site Inspection Scheduled',
    icon: '🟡',
    whatItMeans: 'Superintending Engineer has assigned inspection team to verify site condition.',
    whatToDo: 'No action needed. You can track progress live.',
  },
  REPAIR: {
    label: 'Repair Work Order Issued',
    icon: '🔧',
    whatItMeans: 'Repair work order issued to maintenance contractor under defect liability period.',
    whatToDo: 'No action needed.',
  },
  RESOLVED: {
    label: 'Resolved & Verified',
    icon: '✅',
    whatItMeans: 'Repair work completed and verified by Higher Authority inspection team.',
    whatToDo: 'Your contribution is recognized with a CivicLens badge!',
  },
};
