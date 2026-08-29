export interface PersonalCategoryOption {
  id: string;
  code: string;
  name: string;
  kannadaName: string;
  icon: string;
  department: string;
  sakalaLimitDays: number;
  description: string;
  sampleGrievanceTitle: string;
  sampleGrievanceDescription: string;
}

export interface DesignatedSakalaOfficer {
  name: string;
  designation: string;
  kannadaDesignation: string;
  department: string;
  officeAddress: string;
  contactNumber: string;
  email: string;
  sakalaCode: string;
}

export interface AppellateAuthority {
  name: string;
  designation: string;
  office: string;
  statutoryPowers: string;
}

export interface PersonalGrievanceDossier {
  category: PersonalCategoryOption;
  issueTitle: string;
  issueDescription: string;
  daysDelayed: number;
  isSlaViolated: boolean;
  overdueDays: number;
  designatedOfficer: DesignatedSakalaOfficer;
  firstAppellateAuthority: AppellateAuthority;
  penaltyLiabilityEstimate: number; // ₹20 to ₹250 per day
  petitionKannada: string;
  petitionEnglish: string;
  documentRefNumber?: string;
  applicantName: string;
}

export const PERSONAL_CATEGORIES: PersonalCategoryOption[] = [
  {
    id: 'gruha_lakshmi',
    code: 'WCD-GL-01',
    name: 'Gruha Lakshmi ₹2,000 DBT',
    kannadaName: 'ಗೃಹಲಕ್ಷ್ಮಿ ಯೋಜನೆ (₹೨೦೦೦ ನೇರ ಹಣ ವರ್ಗಾವಣೆ)',
    icon: '👩',
    department: 'Women & Child Development Department',
    sakalaLimitDays: 15,
    description: 'Monthly ₹2,000 financial assistance not credited due to NPCI bank mapping, CDPO delay, or application error.',
    sampleGrievanceTitle: 'Gruha Lakshmi Monthly ₹2,000 DBT Not Credited for 3 Consecutive Months',
    sampleGrievanceDescription: 'Application #GL-8839201 approved under Sakala. Aadhaar NPCI seeding confirmed at Canara Bank, but monthly DBT of ₹2,000 has failed to credit for June, July, and August.',
  },
  {
    id: 'pension',
    code: 'REV-PEN-04',
    name: 'Old Age & Social Pension',
    kannadaName: 'ಸಂಧ್ಯಾ ಸುರಕ್ಷಾ ಹಾಗೂ ವೃದ್ಧಾಪ್ಯ ಪಿಂಚಣಿ',
    icon: '👴',
    department: 'Revenue & Social Welfare Treasury',
    sakalaLimitDays: 21,
    description: 'Sandhya Suraksha, Widow, or Disability pension stopped or delayed by Treasury or Tahsildar office.',
    sampleGrievanceTitle: 'Sandhya Suraksha Old Age Pension Discontinued Without Notice',
    sampleGrievanceDescription: 'Monthly pension of ₹1,200 under Beneficiary PPO #OAP-55291 stopped since April 2026. Annual bio-verification completed at Bengaluru One in March 2026.',
  },
  {
    id: 'ration',
    code: 'FCS-RAT-02',
    name: 'Ration Card & FPS Fraud',
    kannadaName: 'ಅನ್ನಭಾಗ್ಯ ಪಡಿತರ ಚೀಟಿ ಹಾಗೂ ರೇಷನ್ ಅಂಗಡಿ ತೊಂದರೆ',
    icon: '🌾',
    department: 'Food, Civil Supplies & Consumer Affairs',
    sakalaLimitDays: 7,
    description: 'Anna Bhagya foodgrains not issued, FPS biometric thumbprint rejection, short weighing, or card modification pending.',
    sampleGrievanceTitle: 'Fair Price Shop Dealer Refusing Foodgrains & Short-Weighing Rice Allocation',
    sampleGrievanceDescription: 'FPS Shop #291 at Koramangala refused to allocate Anna Bhagya rice for August, claiming server offline despite successful biometric authentication.',
  },
  {
    id: 'land_survey',
    code: 'SSL-LND-09',
    name: 'Land Survey & Bhoomi RTC',
    kannadaName: 'ಭೂಮಿ ಪಹಣಿ/ಆರ್.ಟಿ.ಸಿ ಹಾಗೂ ಜಮೀನು ಸರ್ವೇ ವಿಳಂಬ',
    icon: '🗺️',
    department: 'Survey Settlement & Land Records (Bhoomi)',
    sakalaLimitDays: 30,
    description: 'Tatkal land boundary survey pending, Bhoomi RTC/Pahani name correction, or mutation endorsement delay.',
    sampleGrievanceTitle: 'Tatkal Boundary Land Survey Pending Past 45 Days (Chakbandi Delay)',
    sampleGrievanceDescription: 'Application #BHOOMI-SUR-99201 submitted with fee receipt on 12-07-2026. Taluk Surveyor has failed to issue notice or visit survey number 42/1.',
  },
  {
    id: 'govt_hospital',
    code: 'HFW-HSP-01',
    name: 'Govt Hospital Services',
    kannadaName: 'ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆ ವೈದ್ಯರ ನಿರ್ಲಕ್ಷ್ಯ ಹಾಗೂ ಉಚಿತ ಔಷಧ ಸಿಗದ ಕೊರತೆ',
    icon: '🏥',
    department: 'Health & Family Welfare Department',
    sakalaLimitDays: 1, // 24 hours
    description: 'Doctor absent/unresponsive, emergency admission refusal, essential medicines out of stock, or bribe demand.',
    sampleGrievanceTitle: 'Government District Hospital Duty Doctor Absent & Emergency Ward Denial',
    sampleGrievanceDescription: 'Duty doctor unavailable at Jayanagar General Hospital Emergency Ward on 28th August night. Patient denied preliminary triage and forced to seek private care.',
  },
  {
    id: 'vital_certificates',
    code: 'REV-CRT-03',
    name: 'Death & Birth Certificates',
    kannadaName: 'ಜನನ, ಮರಣ, ಜಾತಿ ಹಾಗೂ ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ ವಿಳಂಬ',
    icon: '📜',
    department: 'Revenue & Municipal Administration (e-Janma)',
    sakalaLimitDays: 7,
    description: 'Death certificate issuance delay, Birth record correction, or Nadakacheri Caste/Income certificate stuck beyond SLA.',
    sampleGrievanceTitle: 'Death Certificate Not Issued Beyond 30 Days of Hospital Registry',
    sampleGrievanceDescription: 'Application #EJANMA-DC-44921 registered at BBMP Health Office. All hospital discharge and cremation documents attached, yet certificate status shows pending.',
  },
  {
    id: 'aadhaar_sakala',
    code: 'EGOV-ADH-05',
    name: 'Aadhaar & Sakala Delays',
    kannadaName: 'ಆಧಾರ್ ಕಾರ್ಡ್ ತಿದ್ದುಪಡಿ ಹಾಗೂ ಸಕಾಲ ಸೇವಾ ನಿಯಮ ಉಲ್ಲಂಘನೆ',
    icon: '🆔',
    department: 'Centre for e-Governance & UIDAI',
    sakalaLimitDays: 15,
    description: 'Aadhaar demographic update rejected repeatedly, Voter ID correction, or Sakala GSC application overdue.',
    sampleGrievanceTitle: 'Aadhaar Address Update Rejected 3 Times Despite Valid Gazette Notification',
    sampleGrievanceDescription: 'Enrolment #2019/88201/00912 rejected without specific reason. Gazette notification and Bank passbook provided as per UIDAI valid document list.',
  },
  {
    id: 'lpg_gas',
    code: 'FCS-LPG-08',
    name: 'LPG Gas & Essential Supplies',
    kannadaName: 'ಎಲ್.ಪಿ.ಜಿ ಅನಿಲ ಸಿಲಿಂಡರ್ ವಿತರಣೆ ವಿಳಂಬ ಹಾಗೂ ಹೆಚ್ಚಿನ ದರ ವಸೂಲಿ',
    icon: '⛽',
    department: 'Oil Marketing Companies & Civil Supplies',
    sakalaLimitDays: 2,
    description: 'LPG refill booked but not delivered within 48 hours, delivery agent demanding illegal extra delivery charges.',
    sampleGrievanceTitle: 'LPG Cylinder Undelivered for 8 Days & Agency Demanding Extra ₹50 Delivery Fee',
    sampleGrievanceDescription: 'Indane Gas refill booking #7739211 confirmed on 20th August. Agency dealer demanding ₹50 additional tip for ground floor delivery.',
  },
];

export const DEMO_SAKALA_OFFICERS: Record<string, DesignatedSakalaOfficer> = {
  gruha_lakshmi: {
    name: 'Smt. Lakshmi R. Devi, KAS',
    designation: 'Child Development Project Officer (CDPO)',
    kannadaDesignation: 'ಶಿಶು ಅಭಿವೃದ್ಧಿ ಯೋಜನಾಧಿಕಾರಿಗಳು (CDPO)',
    department: 'Women & Child Development, Bengaluru South',
    officeAddress: 'Mini Vidhana Soudha, 2nd Floor, Jayanagar 4th Block, Bengaluru - 560011',
    contactNumber: '+91 80 2297 8820',
    email: 'cdpo.bengalurusouth@karnataka.gov.in',
    sakalaCode: 'WCD-GL-01',
  },
  pension: {
    name: 'Sri H. M. Venkatesh, KAS',
    designation: 'Special Tahsildar (Social Welfare & Pensions)',
    kannadaDesignation: 'ವಿಶೇಷ ತಹಸೀಲ್ದಾರ್ (ಸಾಮಾಜಿಕ ಭದ್ರತಾ ಯೋಜನೆಗಳು)',
    department: 'Revenue Department, Taluk Office Bengaluru North',
    officeAddress: 'Kandaya Bhavan, KG Road, District Administration Complex, Bengaluru - 560009',
    contactNumber: '+91 80 2221 4410',
    email: 'tahsildar.north.pension@karnataka.gov.in',
    sakalaCode: 'REV-PEN-04',
  },
  ration: {
    name: 'Sri Shivakumar Swamy, KAS',
    designation: 'Deputy Director (Food & Civil Supplies)',
    kannadaDesignation: 'ಉಪ ನಿರ್ದೇಶಕರು (ಆಹಾರ ಮತ್ತು ನಾಗರಿಕ ಸರಬರಾಜು)',
    department: 'Department of Food & Civil Supplies, Bengaluru Urban',
    officeAddress: 'No. 8, Cunningham Road, Vasanth Nagar, Bengaluru - 560052',
    contactNumber: '+91 80 2286 1902',
    email: 'ddfood.bengaluru@karnataka.gov.in',
    sakalaCode: 'FCS-RAT-02',
  },
  land_survey: {
    name: 'Er. B. R. Manjunath, B.E.',
    designation: 'Assistant Director of Land Records (ADLR)',
    kannadaDesignation: 'ಸಹಾಯಕರ ಭೂ ದಾಖಲೆಗಳ ನಿರ್ದೇಶಕರು (ADLR)',
    department: 'Survey Settlement & Land Records (Bhoomi)',
    officeAddress: 'Taluk Office Building, Yelahanka Main Road, Bengaluru - 560064',
    contactNumber: '+91 80 2856 2201',
    email: 'adlr.yelahanka@karnataka.gov.in',
    sakalaCode: 'SSL-LND-09',
  },
  govt_hospital: {
    name: 'Dr. K. S. Somasekhar, M.D.',
    designation: 'District Health Officer (DHO)',
    kannadaDesignation: 'ಜಿಲ್ಲಾ ಆರೋಗ್ಯ ಮತ್ತು ಕುಟುಂಬ ಕಲ್ಯಾಣಾಧಿಕಾರಿಗಳು',
    department: 'Health & Family Welfare Services',
    officeAddress: 'District Health Complex, Ananda Rao Circle, Bengaluru - 560009',
    contactNumber: '+91 80 2235 7710',
    email: 'dho.bengaluruurban@karnataka.gov.in',
    sakalaCode: 'HFW-HSP-01',
  },
  vital_certificates: {
    name: 'Sri N. Chandrappa',
    designation: 'Chief Registrar & Tahsildar (e-Janma)',
    kannadaDesignation: 'ಮುಖ್ಯ ನೋಂದಣಾಧಿಕಾರಿಗಳು ಹಾಗೂ ತಹಸೀಲ್ದಾರ್',
    department: 'Revenue & Municipal Administration',
    officeAddress: 'Nadakacheri Complex, Subhash Nagar, Bengaluru - 560009',
    contactNumber: '+91 80 2237 0012',
    email: 'ejanma.support@karnataka.gov.in',
    sakalaCode: 'REV-CRT-03',
  },
  aadhaar_sakala: {
    name: 'Sri Rajesh Gowda, IAS',
    designation: 'Mission Director, Karnataka Sakala Mission',
    kannadaDesignation: 'ಮಿಷನ್ ನಿರ್ದೇಶಕರು, ಸಕಾಲ ಮಿಷನ್ ಕರ್ನಾಟಕ',
    department: 'Centre for e-Governance, Govt of Karnataka',
    officeAddress: '3rd Floor, M.S. Building, Dr. B.R. Ambedkar Veedhi, Bengaluru - 560001',
    contactNumber: '+91 80 2203 2555',
    email: 'director.sakala@karnataka.gov.in',
    sakalaCode: 'EGOV-ADH-05',
  },
  lpg_gas: {
    name: 'Sri M. K. Prasanna',
    designation: 'District LPG Nodal Controller',
    kannadaDesignation: 'ಜಿಲ್ಲಾ ಎಲ್.ಪಿ.ಜಿ ಅನಿಲ ನಿಯಂತ್ರಣಾಧಿಕಾರಿಗಳು',
    department: 'Food, Civil Supplies & Consumer Protection',
    officeAddress: 'Podium Block, V.V. Tower, Dr. B.R. Ambedkar Veedhi, Bengaluru - 560001',
    contactNumber: '+91 80 2286 7711',
    email: 'lpg.nodal.bengaluru@karnataka.gov.in',
    sakalaCode: 'FCS-LPG-08',
  },
};

export const DEMO_APPELLATE_AUTHORITIES: Record<string, AppellateAuthority> = {
  gruha_lakshmi: {
    name: 'Sri Tushar Giri Nath, IAS',
    designation: 'First Appellate Authority & Deputy Commissioner (DC)',
    office: 'Deputy Commissioner Complex, K.G. Road, Bengaluru Urban',
    statutoryPowers: 'Empowered under Sakala Act 2011 Section 8 to impose penalty of ₹20 to ₹250 per day of default directly on CDPO salary.',
  },
  pension: {
    name: 'Smt. Priyanka Mary Francis, IAS',
    designation: 'Assistant Commissioner (Revenue Sub-Division)',
    office: 'Assistant Commissioner Office, Podia Block, Bengaluru',
    statutoryPowers: 'Statutory authority to order immediate Treasury disbursement and issue departmental warning letter under Sakala Act.',
  },
  ration: {
    name: 'Sri J. Manjunath, IAS',
    designation: 'Commissioner of Food & Civil Supplies',
    office: 'Food & Civil Supplies Bhavan, Vasanth Nagar, Bengaluru',
    statutoryPowers: 'Power to cancel Fair Price Shop license #291 and initiate IPC Section 409 criminal breach of trust proceedings.',
  },
  land_survey: {
    name: 'Sri Munish Moudgil, IAS',
    designation: 'Commissioner of Survey Settlement & Land Records',
    office: 'K.R. Circle, SSLR Headquarters, Bengaluru',
    statutoryPowers: 'Authority to suspend defaulting Taluk Surveyor and order emergency 48-hour survey team deployment.',
  },
  govt_hospital: {
    name: 'Dr. D. Ranganath, IAS',
    designation: 'Commissioner of Health & Family Welfare',
    office: 'Arogya Soudha, Magadi Road, Bengaluru',
    statutoryPowers: 'Direct power to initiate departmental inquiry against Duty Doctor and direct Suvarna Arogya Trust compensation.',
  },
  vital_certificates: {
    name: 'Sri K. A. Dayananda, IAS',
    designation: 'Director of Municipal Administration',
    office: 'V.V. Tower, Ambedkar Veedhi, Bengaluru',
    statutoryPowers: 'Order immediate automated certificate generation and issue Sakala default notice to Chief Registrar.',
  },
  aadhaar_sakala: {
    name: 'Sri Shalini Rajneesh, IAS',
    designation: 'Additional Chief Secretary & Sakala Appellate Head',
    office: 'Vidhana Soudha, Bengaluru',
    statutoryPowers: 'Highest statutory appellate body under Sakala Act 2011 with direct disciplinary oversight over all state nodal officers.',
  },
  lpg_gas: {
    name: 'Sri V. Ponnuraj, IAS',
    designation: 'Secretary, Food & Civil Supplies Department',
    office: 'MS Building, Bengaluru',
    statutoryPowers: 'Authority to confiscate gas agency security deposit and order direct dealer license suspension.',
  },
};

export function generatePersonalGrievanceDossier(
  categoryId: string,
  userDescription?: string,
  userTitle?: string,
  daysDelayedOverride?: number,
  applicantName: string = 'Sujal Kumar'
): PersonalGrievanceDossier {
  const category = PERSONAL_CATEGORIES.find((c) => c.id === categoryId) || PERSONAL_CATEGORIES[0];
  const designatedOfficer = DEMO_SAKALA_OFFICERS[categoryId] || DEMO_SAKALA_OFFICERS.gruha_lakshmi;
  const firstAppellateAuthority = DEMO_APPELLATE_AUTHORITIES[categoryId] || DEMO_APPELLATE_AUTHORITIES.gruha_lakshmi;

  const daysDelayed = daysDelayedOverride || Math.floor(category.sakalaLimitDays * 2.2);
  const overdueDays = Math.max(0, daysDelayed - category.sakalaLimitDays);
  const isSlaViolated = overdueDays > 0;
  
  // Sakala fine is ₹20 per day up to max ₹2500 per default
  const penaltyLiabilityEstimate = Math.min(2500, Math.max(250, overdueDays * 20));

  const issueTitle = userTitle || category.sampleGrievanceTitle;
  const issueDescription = userDescription || category.sampleGrievanceDescription;

  const petitionEnglish = `FORMAL PETITION UNDER KARNATAKA SAKALA SERVICES ACT, 2011
To:
${designatedOfficer.designation} (${designatedOfficer.name})
${designatedOfficer.department}
${designatedOfficer.officeAddress}

Copy To: First Appellate Authority - ${firstAppellateAuthority.designation} (${firstAppellateAuthority.name})

Subject: Formal Grievance & SLA Default Penalty Notice regarding ${category.name} [Service Code: ${category.code}]

Respected Authority,

I, ${applicantName}, hereby lodge a formal petition regarding deliberate administrative delay and non-resolution of my public service request for "${issueTitle}".

1. SERVICE DETAILS:
   - Category: ${category.name}
   - Sakala Mandatory SLA Limit: ${category.sakalaLimitDays} Working Days
   - Actual Days Elapsed: ${daysDelayed} Days
   - Statutory Overdue Days: ${overdueDays} Days (STRICT SAKALA S.L.A. VIOLATION)

2. STATEMENT OF FACT:
   ${issueDescription}

3. STATUTORY PRAYER UNDER SAKALA ACT 2011 (SECTION 8):
   I request the Designated Officer (${designatedOfficer.name}) to immediately resolve and disburse the service within 48 hours. In the event of continued default, I request the First Appellate Authority (${firstAppellateAuthority.name}) to invoke Section 8 of the Sakala Act to levy the statutory default penalty of ₹20 per day (Estimated Liability: ₹${penaltyLiabilityEstimate}) directly against the defaulting officer's official salary and order immediate compensation.

Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
Applicant: ${applicantName}
Location: Bengaluru, Karnataka`;

  const petitionKannada = `ಕರ್ನಾಟಕ ಸಕಾಲ ಸೇವೆಗಳ ಕಾಯ್ದೆ ೨೦೧೧ ರ ಅಡಿಯಲ್ಲಿ ಅಧಿಕೃತ ಮೇಲ್ಮನವಿ ಅರ್ಜಿ
ಇವರಿಗೆ:
${designatedOfficer.kannadaDesignation} (${designatedOfficer.name})
${designatedOfficer.department}
${designatedOfficer.officeAddress}

ಪ್ರತಿ: ಮೊದಲ ಮೇಲ್ಮನವಿ ಪ್ರಾಧಿಕಾರ - ${firstAppellateAuthority.designation} (${firstAppellateAuthority.name})

ವಿಷಯ: ${category.kannadaName} ಸೇವೆ ಸಿಗದಿರುವ ಹಾಗೂ ಸಕಾಲ ನಿಯಮ ಉಲ್ಲಂಘನೆ ಕುರಿತು ದೂರು ಅರ್ಜಿ [ಸೇವಾ ಕೋಡ್: ${category.code}]

ಮಾನ್ಯ ಅಧಿಕಾರಿಯವರೇ,

ಅರ್ಜಿದಾರರಾದ ${applicantName} ಆದ ನಾನು ತಮ್ಮಲ್ಲಿ ಸಲ್ಲಿಸುವ ಮನವಿ ಏನೆಂದರೆ, ನನ್ನ "${issueTitle}" ಕುರಿತು ಸಲ್ಲಿಸಿದ ಅರ್ಜಿಯು ನಿಗದಿತ ಕಾಲಮಿತಿಯೊಳಗೆ ವಿಲೇವಾರಿಯಾಗದೆ ವಿಳಂಬವಾಗಿದೆ.

೧. ಸಕಾಲ ಸೇವಾ ವಿವರಗಳು:
   - ಸೇವಾ ವರ್ಗ: ${category.kannadaName}
   - ಸಕಾಲ ಕಡ್ಡಾಯ ಕಾಲಮಿತಿ: ${category.sakalaLimitDays} ದಿನಗಳು
   - ಪ್ರಸ್ತುತ ವಿಳಂಬವಾದ ದಿನಗಳು: ${daysDelayed} ದಿನಗಳು
   - ಕಾಯ್ದೆ ಉಲ್ಲಂಘನೆ ದಿನಗಳು: ${overdueDays} ದಿನಗಳು (ಸಕಾಲ ನಿಯಮ ಉಲ್ಲಂಘನೆ)

೨. ಸಮಸ್ಯೆಯ ವಿವರ:
   ${issueDescription}

೩. ಕಾನೂನಾತ್ಮಕ ಕೋರಿಕೆ (ಸಕಾಲ ಕಾಯ್ದೆ ಸೆಕ್ಷನ್ ೮):
   ಅಧಿಕೃತ ಸಕಾಲ ಅಧಿಕಾರಿಯಾದ ತಾವು ತಕ್ಷಣವೇ ಮುಂದಿನ ೪೮ ಗಂಟೆಗಳಲ್ಲಿ ಈ ಸೇವೆಯನ್ನು ಒದಗಿಸಬೇಕಾಗಿ ಕೋರುತ್ತೇನೆ. ತಪ್ಪಿದಲ್ಲಿ ಮೊದಲ ಮೇಲ್ಮನವಿ ಪ್ರಾಧಿಕಾರವು ಸಕಾಲ ಕಾಯ್ದೆಯನ್ವಯ ತಪ್ಪಿತಸ್ಥ ಅಧಿಕಾರಿಗೆ ದಿನಕ್ಕೆ ₹೨೦ ರಂತೆ (ಒಟ್ಟು ಅಂದಾಜು ದಂಡ: ₹${penaltyLiabilityEstimate}) ದಂಡ ವಿಧಿಸಿ ನನಗೆ ನ್ಯಾಯ ಒದಗಿಸಬೇಕಾಗಿ ವಿನಂತಿಸುತ್ತೇನೆ.

ದಿನಾಂಕ: ${new Date().toLocaleDateString('kn-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
ಅರ್ಜಿದಾರರು: ${applicantName}
ಸ್ಥಳ: ಬೆಂಗಳೂರು, ಕರ್ನಾಟಕ`;

  return {
    category,
    issueTitle,
    issueDescription,
    daysDelayed,
    isSlaViolated,
    overdueDays,
    designatedOfficer,
    firstAppellateAuthority,
    penaltyLiabilityEstimate,
    petitionKannada,
    petitionEnglish,
    applicantName,
  };
}

export interface StoredCaseItem {
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

export function savePersonalCaseToStorage(dossier: PersonalGrievanceDossier): StoredCaseItem {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const caseId = `KAR-SAK-2026-${randomNum}`;

  const newCase: StoredCaseItem = {
    id: caseId,
    displayId: `#SAK-2026-${randomNum}`,
    title: dossier.issueTitle,
    location: 'Bengaluru South Ward 174',
    status: 'In Progress',
    reportedDate: 'Today',
    estimatedOrResolvedDate: `Sakala Fine: ₹${dossier.penaltyLiabilityEstimate}`,
    progressPercent: 50,
    aiVerified: true,
    confidencePercent: 99,
    type: dossier.category.id,
    isPersonalSakala: true,
    officerName: dossier.designatedOfficer.name,
    penaltyFine: dossier.penaltyLiabilityEstimate,
  };

  if (typeof window !== 'undefined') {
    try {
      const existingRaw = localStorage.getItem('civiclens_personal_cases');
      const existingCases: StoredCaseItem[] = existingRaw ? JSON.parse(existingRaw) : [];
      const updated = [newCase, ...existingCases];
      localStorage.setItem('civiclens_personal_cases', JSON.stringify(updated));
    } catch {
      // Fallback
    }
  }

  return newCase;
}

export function getSavedPersonalCases(): StoredCaseItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const existingRaw = localStorage.getItem('civiclens_personal_cases');
    return existingRaw ? JSON.parse(existingRaw) : [];
  } catch {
    return [];
  }
}
