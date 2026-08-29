// CivicLens — Firebase & User Auth Store (Zustand)
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auth } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  district: string;
  joinedDate: string;
  verifiedReports: number;
  resolvedIssues: number;
  evidenceContributions: number;
  badges: string[];
}

export interface RegisteredAccount {
  name: string;
  email: string;
  passwordHash: string; // Plain/hash for client validation
  profile: UserProfile;
}

const DEFAULT_DEMO_PROFILE: UserProfile = {
  uid: 'civic-user-aarav-101',
  displayName: 'Aarav Patel',
  email: 'aarav.patel@civiclens.gov.in',
  photoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
  district: 'Bengaluru South District',
  joinedDate: '2023-01-15',
  verifiedReports: 34,
  resolvedIssues: 21,
  evidenceContributions: 48,
  badges: ['road_watcher', 'public_safety_contributor'],
};

// Initial Seed Accounts
const SEED_ACCOUNTS: RegisteredAccount[] = [
  {
    name: 'Aarav Patel',
    email: 'aarav.patel@civiclens.gov.in',
    passwordHash: 'password123',
    profile: DEFAULT_DEMO_PROFILE,
  },
  {
    name: 'Sujal V.',
    email: 'sujal@civiclens.gov.in',
    passwordHash: 'password123',
    profile: {
      ...DEFAULT_DEMO_PROFILE,
      uid: 'civic-user-sujal-102',
      displayName: 'Sujal V.',
      email: 'sujal@civiclens.gov.in',
      photoURL: 'https://ui-avatars.com/api/?name=Sujal+V&background=00327d&color=fff&bold=true',
    },
  },
  {
    name: 'Citizen Demo',
    email: 'demo@civiclens.gov.in',
    passwordHash: 'password123',
    profile: DEFAULT_DEMO_PROFILE,
  },
];

interface AuthState {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  registeredAccounts: RegisteredAccount[];
  isLoggedIn: boolean;
  loading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (name: string, email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  setProfile: (profile: UserProfile) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      registeredAccounts: SEED_ACCOUNTS,
      isLoggedIn: false,
      loading: false,

      loginWithEmail: async (email: string, pass: string) => {
        set({ loading: true });
        const trimmedEmail = email.trim().toLowerCase();
        const trimmedPass = pass.trim();

        // 1. Try Firebase Auth if API key is configured
        if (auth.app.options.apiKey && !auth.app.options.apiKey.startsWith('AQ.')) {
          try {
            const res = await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPass);
            const userDisplayName = res.user.displayName || trimmedEmail.split('@')[0];
            set({
              user: res.user,
              isLoggedIn: true,
              profile: {
                ...DEFAULT_DEMO_PROFILE,
                uid: res.user.uid,
                email: res.user.email || trimmedEmail,
                displayName: userDisplayName,
                photoURL: res.user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userDisplayName)}&background=00327d&color=fff&bold=true`,
              },
              loading: false,
            });
            return;
          } catch (err: any) {
            set({ loading: false });
            throw new Error('Invalid Firebase credentials. Please check your email and password.');
          }
        }

        // 2. Local Database Validation
        const accounts = get().registeredAccounts || SEED_ACCOUNTS;
        const matched = accounts.find((a) => a.email.toLowerCase() === trimmedEmail);

        if (!matched) {
          set({ loading: false });
          throw new Error('Account not found. Please check your email or Create an Account.');
        }

        if (matched.passwordHash !== trimmedPass) {
          set({ loading: false });
          throw new Error('Incorrect password. Please verify your credentials and try again.');
        }

        // Success Login
        set({
          isLoggedIn: true,
          profile: matched.profile,
          loading: false,
        });
      },

      signupWithEmail: async (name: string, email: string, pass: string) => {
        set({ loading: true });
        const trimmedEmail = email.trim().toLowerCase();
        const trimmedPass = pass.trim();
        const finalName = name.trim() || (trimmedEmail.includes('@') ? trimmedEmail.split('@')[0] : trimmedEmail);
        const formattedName = finalName.charAt(0).toUpperCase() + finalName.slice(1);
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(formattedName)}&background=00327d&color=fff&bold=true`;

        const newProfile: UserProfile = {
          uid: `civic-user-${Date.now()}`,
          displayName: formattedName,
          email: trimmedEmail,
          photoURL: avatarUrl,
          district: 'Bengaluru South District',
          joinedDate: new Date().toISOString().split('T')[0],
          verifiedReports: 1,
          resolvedIssues: 0,
          evidenceContributions: 1,
          badges: ['road_watcher'],
        };

        const newAccount: RegisteredAccount = {
          name: formattedName,
          email: trimmedEmail,
          passwordHash: trimmedPass,
          profile: newProfile,
        };

        // Save into registered accounts
        const existing = get().registeredAccounts || SEED_ACCOUNTS;
        const updatedAccounts = [...existing.filter((a) => a.email.toLowerCase() !== trimmedEmail), newAccount];

        // 1. Try Firebase Auth
        if (auth.app.options.apiKey && !auth.app.options.apiKey.startsWith('AQ.')) {
          try {
            const res = await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPass);
            set({
              user: res.user,
              isLoggedIn: true,
              profile: { ...newProfile, uid: res.user.uid },
              registeredAccounts: updatedAccounts,
              loading: false,
            });
            return;
          } catch (err: any) {
            // If Firebase fails, save to local account store
            set({
              isLoggedIn: true,
              profile: newProfile,
              registeredAccounts: updatedAccounts,
              loading: false,
            });
            return;
          }
        }

        // Local registration success
        set({
          isLoggedIn: true,
          profile: newProfile,
          registeredAccounts: updatedAccounts,
          loading: false,
        });
      },

      loginWithGoogle: async () => {
        set({ loading: true });
        try {
          if (auth.app.options.apiKey && !auth.app.options.apiKey.startsWith('AQ.')) {
            const provider = new GoogleAuthProvider();
            const res = await signInWithPopup(auth, provider);
            set({
              user: res.user,
              isLoggedIn: true,
              profile: {
                ...DEFAULT_DEMO_PROFILE,
                uid: res.user.uid,
                email: res.user.email || 'aarav.patel@civiclens.gov.in',
                displayName: res.user.displayName || 'Aarav Patel',
                photoURL: res.user.photoURL || DEFAULT_DEMO_PROFILE.photoURL,
              },
              loading: false,
            });
          } else {
            set({
              isLoggedIn: true,
              profile: DEFAULT_DEMO_PROFILE,
              loading: false,
            });
          }
        } catch {
          set({
            isLoggedIn: true,
            profile: DEFAULT_DEMO_PROFILE,
            loading: false,
          });
        }
      },

      logout: async () => {
        try {
          await signOut(auth);
        } catch {
          // ignore
        }
        set({
          user: null,
          profile: null,
          isLoggedIn: false,
          loading: false,
        });
      },

      setProfile: (profile: UserProfile) => set({ profile }),
    }),
    {
      name: 'civiclens-auth-storage',
    }
  )
);
