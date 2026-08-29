// CivicLens — Report Flow State Management (Zustand)
import { create } from 'zustand';
import type { AIAnalysis, LocationData, CivicIntelligenceData, ComplaintDraft } from '@/lib/types';

export type ReportStep =
  | 'capture'
  | 'analyze'
  | 'location'
  | 'intelligence'
  | 'review'
  | 'submitted';

interface ReportState {
  // Current step
  step: ReportStep;

  // Image
  imageUrl: string | null;
  imageBase64: string | null;
  imageMimeType: string | null;

  // AI Analysis
  aiAnalysis: AIAnalysis | null;
  userConfirmedType: string | null;

  // Location
  location: LocationData | null;

  // Civic Intelligence
  civicIntelligence: CivicIntelligenceData | null;

  // Complaint
  complaint: ComplaintDraft | null;

  // Result
  caseId: string | null;

  // Actions
  setStep: (step: ReportStep) => void;
  setImage: (url: string, base64: string | null, mimeType: string | null) => void;
  setAiAnalysis: (analysis: AIAnalysis) => void;
  setUserConfirmedType: (type: string) => void;
  setLocation: (location: LocationData) => void;
  setCivicIntelligence: (data: CivicIntelligenceData) => void;
  setComplaint: (complaint: ComplaintDraft) => void;
  setCaseId: (id: string) => void;
  reset: () => void;
}

const initialState = {
  step: 'capture' as ReportStep,
  imageUrl: null,
  imageBase64: null,
  imageMimeType: null,
  aiAnalysis: null,
  userConfirmedType: null,
  location: null,
  civicIntelligence: null,
  complaint: null,
  caseId: null,
};

export const useReportStore = create<ReportState>((set) => ({
  ...initialState,

  setStep: (step) => set({ step }),

  setImage: (url, base64, mimeType) =>
    set({ imageUrl: url, imageBase64: base64, imageMimeType: mimeType }),

  setAiAnalysis: (analysis) => set({ aiAnalysis: analysis }),

  setUserConfirmedType: (type) => set({ userConfirmedType: type }),

  setLocation: (location) => set({ location }),

  setCivicIntelligence: (data) => set({ civicIntelligence: data }),

  setComplaint: (complaint) => set({ complaint }),

  setCaseId: (id) => set({ caseId: id }),

  reset: () => set(initialState),
}));
