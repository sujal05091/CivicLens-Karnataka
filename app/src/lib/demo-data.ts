// CivicLens Karnataka — Official Civic Data Layer
// All records tagged with dataSource: "SYNTHETIC_DEMO"

import type {
  CivicAsset, Project, Tender, Contractor, Officer, Authority,
  CivicIssue, Badge, ContributorProfile, ComplaintEvent
} from './types';

// ==================== PRIMARY LOCATION ====================
export const DEMO_LOCATION = {
  latitude: 12.9716,
  longitude: 77.5946,
  address: 'Shanthinagar Main Road, Ward 42, Bengaluru',
  ward: 'Ward 42 (Shanthinagar)',
  district: 'Bengaluru Urban',
};

// ==================== OFFICERS (INDIAN HIGHER AUTHORITIES & FIELD EXECUTING OFFICERS) ====================
export const DEMO_OFFICERS: Officer[] = [
  {
    id: 'officer-higher-001',
    name: 'Sri Dr. M. G. Parameshwara, IAS',
    designation: 'Commissioner & Chief Higher Authority',
    department: 'Urban Development & Infrastructure Administration',
    division: 'Headquarters Directorate, Bengaluru',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    officeLocation: 'State Urban Administrative Complex, Vidhana Soudha Area, Bengaluru',
    jurisdiction: 'Karnataka Urban Infrastructure',
    isHigherAuthority: true,
    dataSource: 'SYNTHETIC_DEMO',
  },
  {
    id: 'officer-exec-001',
    name: 'Er. Rajesh V. Gowda, M.Tech',
    designation: 'Executive Engineer (Ward Road Maintenance)',
    department: 'Road Infrastructure Wing',
    division: 'Central Zone Sub-Division',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    officeLocation: 'Zonal Sub-Division Office, Shanthinagar, Bengaluru',
    jurisdiction: 'Ward 42 & Ward 43',
    isHigherAuthority: false,
    dataSource: 'SYNTHETIC_DEMO',
  },
  {
    id: 'officer-higher-002',
    name: 'Smt. Vidya Shivakumar, KAS',
    designation: 'Special Commissioner (Projects & Quality Control)',
    department: 'Municipal Administration Directorate',
    division: 'Karnataka Infrastructure Oversight Cell',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    officeLocation: 'BBMP Head Office, Corporation Building, Bengaluru',
    jurisdiction: 'Bengaluru Metropolitan Area',
    isHigherAuthority: true,
    dataSource: 'SYNTHETIC_DEMO',
  },
  {
    id: 'officer-chief-001',
    name: 'Er. H. S. Shivakumar, ME',
    designation: 'Chief Engineer (Major Roads & Civil Works)',
    department: 'Public Works Directorate',
    division: 'Bengaluru Central Zone',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    officeLocation: 'Chief Engineer Office, Nrupathunga Road, Bengaluru',
    jurisdiction: 'Bengaluru Urban Zone',
    isHigherAuthority: true,
    dataSource: 'SYNTHETIC_DEMO',
  },
];

// ==================== CONTRACTORS ====================
export const DEMO_CONTRACTORS: Contractor[] = [
  {
    id: 'contractor-kar-001',
    name: 'Kaveri Infrastructure & Construction Pvt. Ltd.',
    reference: 'CLASS-1-REG-KAR-1042',
    contactPerson: 'Sri M. Venkatesh (Project Director)',
    dataSource: 'SYNTHETIC_DEMO',
  },
  {
    id: 'contractor-kar-002',
    name: 'Sahyadri BuildTech Urban Solutions',
    reference: 'CLASS-1-REG-KAR-2055',
    contactPerson: 'Sri S. Nagaraj (Managing Director)',
    dataSource: 'SYNTHETIC_DEMO',
  },
  {
    id: 'contractor-kar-003',
    name: 'Deccan CityWorks Engineering Corp',
    reference: 'CLASS-1-REG-KAR-3088',
    contactPerson: 'Sri B. Chandrashekar (Chief Contractor)',
    dataSource: 'SYNTHETIC_DEMO',
  },
];

// ==================== AUTHORITIES ====================
export const DEMO_AUTHORITIES: Authority[] = [
  {
    id: 'authority-kar-001',
    name: 'Office of the Chief Engineer & Commissioner (Roads & Infrastructure)',
    department: 'Karnataka Public Works Department (KPWD)',
    division: 'Bengaluru Central Directorate',
    jurisdiction: 'Bengaluru Urban District',
    higherAuthorityName: 'Office of the Commissioner, Urban Infrastructure Directorate',
    higherOfficer: DEMO_OFFICERS[0],
    chiefOfficer: DEMO_OFFICERS[1],
    dataSource: 'SYNTHETIC_DEMO',
  },
  {
    id: 'authority-kar-002',
    name: 'Office of the Special Commissioner (Electrical & Energy Infrastructure)',
    department: 'BESCOM / Urban Energy Wing',
    division: 'Karnataka Electrical Grid Cell',
    jurisdiction: 'Bengaluru Urban District',
    higherAuthorityName: 'Office of the Principal Secretary, Energy Department',
    higherOfficer: DEMO_OFFICERS[2],
    chiefOfficer: DEMO_OFFICERS[1],
    dataSource: 'SYNTHETIC_DEMO',
  },
  {
    id: 'authority-kar-003',
    name: 'Office of the Commissioner (Solid Waste & Public Health)',
    department: 'Karnataka Sanitation Directorate',
    division: 'Urban Environment Administration',
    jurisdiction: 'Bengaluru Urban District',
    higherAuthorityName: 'Office of the Principal Secretary, Health & Environment',
    higherOfficer: DEMO_OFFICERS[2],
    chiefOfficer: DEMO_OFFICERS[1],
    dataSource: 'SYNTHETIC_DEMO',
  },
  {
    id: 'authority-kar-004',
    name: 'Office of the Chief Engineer (Water Supply & Drainage Directorate)',
    department: 'BWSSB Higher Directorate',
    division: 'Drainage & Cauvery Water Project Wing',
    jurisdiction: 'Bengaluru Urban District',
    higherAuthorityName: 'Office of the Chairman & Chief Engineer, BWSSB Board',
    higherOfficer: DEMO_OFFICERS[0],
    chiefOfficer: DEMO_OFFICERS[1],
    dataSource: 'SYNTHETIC_DEMO',
  },
];

// ==================== TENDERS ====================
export const DEMO_TENDERS: Tender[] = [
  {
    id: 'tender-kar-001',
    tenderNumber: 'KPP-TND-2025-104',
    title: 'Arterial Road Resurfacing, Heavy Asphalt & Footpath Upgrade Package',
    contractorId: 'contractor-kar-001',
    contractValue: 145000000,
    sanctionedAmount: 145000000,
    awardDate: '2024-01-15',
    dataSource: 'SYNTHETIC_DEMO',
  },
  {
    id: 'tender-kar-002',
    tenderNumber: 'KPP-TND-2025-205',
    title: 'Ward 42 Smart LED Streetlight Installation & Underground Wiring',
    contractorId: 'contractor-kar-002',
    contractValue: 12000000,
    sanctionedAmount: 12000000,
    awardDate: '2024-09-01',
    dataSource: 'SYNTHETIC_DEMO',
  },
  {
    id: 'tender-kar-003',
    tenderNumber: 'KPP-TND-2025-306',
    title: 'Stormwater Drain Reconstruction & Culvert Augmentation Phase II',
    contractorId: 'contractor-kar-003',
    contractValue: 28000000,
    sanctionedAmount: 28000000,
    awardDate: '2024-11-20',
    dataSource: 'SYNTHETIC_DEMO',
  },
];

// ==================== PROJECTS ====================
export const DEMO_PROJECTS: Project[] = [
  {
    id: 'project-kar-001',
    projectName: 'Arterial Road Infrastructure Improvement Package',
    projectType: 'Road Resurfacing & Footpath Upgrade',
    tenderId: 'tender-kar-001',
    contractorId: 'contractor-kar-001',
    authorityId: 'authority-kar-001',
    officerId: 'officer-exec-001',
    higherAuthorityId: 'officer-higher-001',
    startDate: '2024-01-15',
    completionDate: '2026-01-14',
    maintenanceMonths: 36,
    sanctionedBudget: 145000000,
    dataSource: 'SYNTHETIC_DEMO',
  },
  {
    id: 'project-kar-002',
    projectName: 'Streetlight Modernization & Grid Modernization Scheme',
    projectType: 'Electrical Infrastructure',
    tenderId: 'tender-kar-002',
    contractorId: 'contractor-kar-002',
    authorityId: 'authority-kar-002',
    officerId: 'officer-exec-001',
    higherAuthorityId: 'officer-higher-002',
    startDate: '2024-11-01',
    completionDate: '2025-04-30',
    maintenanceMonths: 12,
    sanctionedBudget: 12000000,
    dataSource: 'SYNTHETIC_DEMO',
  },
  {
    id: 'project-kar-003',
    projectName: 'Stormwater Drain Infrastructure Network Improvement',
    projectType: 'Drainage & Sanitation',
    tenderId: 'tender-kar-003',
    contractorId: 'contractor-kar-003',
    authorityId: 'authority-kar-004',
    officerId: 'officer-exec-001',
    higherAuthorityId: 'officer-chief-001',
    startDate: '2025-01-15',
    completionDate: '2025-07-30',
    maintenanceMonths: 18,
    sanctionedBudget: 28000000,
    dataSource: 'SYNTHETIC_DEMO',
  },
];

// ==================== CIVIC ASSETS ====================
export const DEMO_CIVIC_ASSETS: CivicAsset[] = [
  {
    id: 'ROAD-KAR-1042',
    assetType: 'road',
    assetName: 'Shanthinagar Main Road Corridor',
    latitude: 12.9716,
    longitude: 77.5946,
    ward: 'Ward 42 (Shanthinagar)',
    district: 'Bengaluru Urban',
    projectId: 'project-kar-001',
    authorityId: 'authority-kar-001',
    dataSource: 'SYNTHETIC_DEMO',
  },
  {
    id: 'LIGHT-KAR-2001',
    assetType: 'streetlight',
    assetName: 'Shanthinagar Main Road Pole #14',
    latitude: 12.9720,
    longitude: 77.5950,
    ward: 'Ward 42 (Shanthinagar)',
    district: 'Bengaluru Urban',
    projectId: 'project-kar-002',
    authorityId: 'authority-kar-002',
    dataSource: 'SYNTHETIC_DEMO',
  },
  {
    id: 'DRAIN-KAR-3001',
    assetType: 'drainage',
    assetName: 'Shanthinagar Main Road Primary Storm Drain',
    latitude: 12.9714,
    longitude: 77.5944,
    ward: 'Ward 42 (Shanthinagar)',
    district: 'Bengaluru Urban',
    projectId: 'project-kar-003',
    authorityId: 'authority-kar-004',
    dataSource: 'SYNTHETIC_DEMO',
  },
  {
    id: 'SAN-KAR-4001',
    assetType: 'sanitation',
    assetName: 'Ward 42 Public Sanitation Hub',
    latitude: 12.9712,
    longitude: 77.5940,
    ward: 'Ward 42 (Shanthinagar)',
    district: 'Bengaluru Urban',
    projectId: 'project-kar-001',
    authorityId: 'authority-kar-003',
    dataSource: 'SYNTHETIC_DEMO',
  },
];

// ==================== EXISTING ISSUES ====================
export const DEMO_EXISTING_ISSUES: CivicIssue[] = [
  {
    id: 'CIV-KAR-10392',
    issueType: 'pothole',
    severity: 'high',
    confidence: 0.96,
    description: 'Deep road surface depression posing severe hazard to two-wheelers',
    latitude: 12.9716,
    longitude: 77.5946,
    address: 'Shanthinagar Main Road, Ward 42, Bengaluru',
    ward: 'Ward 42 (Shanthinagar)',
    district: 'Bengaluru Urban',
    status: 'INSPECTION',
    createdBy: 'citizen-sujal',
    createdAt: '2026-08-22T10:30:00Z',
    dataSource: 'SYNTHETIC_DEMO',
  },
  {
    id: 'CIV-KAR-10345',
    issueType: 'garbage_dumping',
    severity: 'medium',
    confidence: 0.92,
    description: 'Commercial waste accumulation obstructing public walkway',
    latitude: 12.9712,
    longitude: 77.5940,
    address: 'Residency Cross Road, near drain opening',
    ward: 'Ward 42 (Shanthinagar)',
    district: 'Bengaluru Urban',
    status: 'ROUTED',
    createdBy: 'citizen-kar-2',
    createdAt: '2026-08-20T14:15:00Z',
    dataSource: 'SYNTHETIC_DEMO',
  },
  {
    id: 'CIV-KAR-10301',
    issueType: 'broken_streetlight',
    severity: 'low',
    confidence: 0.95,
    description: 'Streetlight luminaire damaged on pole 14',
    latitude: 12.9725,
    longitude: 77.5955,
    address: 'Richmond Service Road, pole 14',
    ward: 'Ward 42 (Shanthinagar)',
    district: 'Bengaluru Urban',
    status: 'RESOLVED',
    createdBy: 'citizen-kar-3',
    createdAt: '2026-08-15T08:45:00Z',
    dataSource: 'SYNTHETIC_DEMO',
  },
];

// ==================== BADGES ====================
export const DEMO_BADGES: Badge[] = [
  {
    id: 'badge-verified',
    name: 'Verified Civic Contributor',
    description: 'Made a verified civic contribution to Karnataka infrastructure tracking',
    icon: '✅',
    criteria: 'Submit at least one verified report',
  },
  {
    id: 'badge-road',
    name: 'Road Watcher',
    description: 'Reported road infrastructure and pothole hazards',
    icon: '🛣️',
    criteria: 'Report 3+ road-related issues',
  },
  {
    id: 'badge-safety',
    name: 'Public Safety Contributor',
    description: 'Contributed to public safety improvements in urban areas',
    icon: '🛡️',
    criteria: 'Have 2+ issues reach resolution',
  },
  {
    id: 'badge-clean',
    name: 'Clean City Contributor',
    description: 'Helped maintain city cleanliness & sanitation',
    icon: '🌿',
    criteria: 'Report sanitation/garbage issues',
  },
  {
    id: 'badge-evidence',
    name: 'Evidence Contributor',
    description: 'Provided photographic evidence for civic cases',
    icon: '📸',
    criteria: 'Contribute evidence to 5+ cases',
  },
];

export const DEMO_CONTRIBUTOR_PROFILE: ContributorProfile = {
  id: 'profile-kar-001',
  userId: 'user-sujal',
  displayName: 'Sujal',
  verifiedReports: 34,
  resolvedIssues: 21,
  evidenceContributions: 48,
  badges: ['badge-verified', 'badge-road', 'badge-evidence'],
  shareSlug: 'sujal-civic',
  joinedDate: '2026-01-15',
};

// ==================== FALLBACK AI RESPONSE ====================
export const FALLBACK_AI_ANALYSIS = {
  issueType: 'pothole' as const,
  confidence: 0.94,
  severity: 'high' as const,
  description: 'Severe road surface defect detected. Large asphalt cavity present on heavy vehicle transit corridor posing immediate traffic safety risk.',
  evidenceNotes: [
    'Asphalt surface cavity measuring ~45cm depth',
    'Located on primary urban thoroughfare',
    'Potential vehicle rim & axle damage hazard',
    'Underlying sub-base moisture deterioration observed'
  ],
  needsHumanReview: false,
};

export const FALLBACK_COMPLAINT = {
  title: 'Urgent Escalation: Road Surface Cavity & Asphalt Hazard Inspection',
  description: 'Visual evidence identifies severe asphalt surface cavity defect on Shanthinagar Main Road, Ward 42. The related public works project (Arterial Road Infrastructure Improvement Package) maintains an active 36-month defect liability period under the supervision of Sri Dr. M. G. Parameshwara, IAS (Commissioner) and assigned Executive Engineer Er. Rajesh V. Gowda. Escalating directly for inspection and work completion enforcement.',
  requestedAction: 'Direct Assigned Executive Engineer Er. Rajesh V. Gowda to perform immediate site review and enforce emergency contractor repair under active defect liability warranty.',
};

// ==================== HELPERS ====================

export function findNearestAsset(lat: number, lng: number, issueType?: string): CivicAsset {
  const assetTypeMap: Record<string, string> = {
    pothole: 'road',
    road_damage: 'road',
    damaged_footpath: 'road',
    broken_streetlight: 'streetlight',
    drainage_overflow: 'drainage',
    water_leakage: 'drainage',
    garbage_dumping: 'sanitation',
    public_littering: 'sanitation',
  };

  const targetType = issueType ? assetTypeMap[issueType] || 'road' : 'road';

  let nearest: CivicAsset | null = null;
  let minDist = Infinity;

  for (const asset of DEMO_CIVIC_ASSETS) {
    if (targetType && asset.assetType !== targetType) continue;
    const dist = Math.sqrt(
      Math.pow(asset.latitude - lat, 2) + Math.pow(asset.longitude - lng, 2)
    );
    if (dist < minDist) {
      minDist = dist;
      nearest = asset;
    }
  }

  return nearest || DEMO_CIVIC_ASSETS[0];
}

export function findProject(projectId: string): Project {
  return DEMO_PROJECTS.find(p => p.id === projectId) || DEMO_PROJECTS[0];
}

export function findTender(tenderId: string): Tender {
  return DEMO_TENDERS.find(t => t.id === tenderId) || DEMO_TENDERS[0];
}

export function findContractor(contractorId: string): Contractor {
  return DEMO_CONTRACTORS.find(c => c.id === contractorId) || DEMO_CONTRACTORS[0];
}

export function findOfficer(officerId: string): Officer {
  return DEMO_OFFICERS.find(o => o.id === officerId) || DEMO_OFFICERS[1];
}

export function findHigherOfficer(higherOfficerId: string): Officer {
  return DEMO_OFFICERS.find(o => o.id === higherOfficerId && o.isHigherAuthority) || DEMO_OFFICERS[0];
}

export function findAuthority(authorityId: string): Authority {
  return DEMO_AUTHORITIES.find(a => a.id === authorityId) || DEMO_AUTHORITIES[0];
}

export function findNearbyDuplicates(
  lat: number,
  lng: number,
  issueType: string,
  radiusKm: number = 0.2
): (CivicIssue & { distance: number })[] {
  return DEMO_EXISTING_ISSUES
    .filter(issue => {
      if (issue.issueType !== issueType) return false;
      if (issue.status === 'RESOLVED') return false;
      const dist = haversineDistance(lat, lng, issue.latitude, issue.longitude);
      return dist <= radiusKm;
    })
    .map(issue => ({
      ...issue,
      distance: Math.round(haversineDistance(lat, lng, issue.latitude, issue.longitude) * 1000),
    }))
    .sort((a, b) => a.distance - b.distance);
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function generateCaseId(): string {
  const num = 10000 + Math.floor(Math.random() * 90000);
  return `CIV-KAR-${num}`;
}
