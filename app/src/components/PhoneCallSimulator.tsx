'use client';

import { useState, useEffect, useRef } from 'react';
import { PhoneCall, PhoneOff, PhoneIncoming, Mic, MicOff, Volume2, Sparkles, Send, Clock, CheckCircle2, MessageSquare, ShieldAlert, AlertCircle, Play, Pause } from 'lucide-react';
import { PERSONAL_CATEGORIES, PersonalCategoryOption, generatePersonalGrievanceDossier, PersonalGrievanceDossier, savePersonalCaseToStorage } from '@/lib/personal-data';

interface PhoneCallSimulatorProps {
  onCallCompleted: (dossier: PersonalGrievanceDossier, phoneNumber: string) => void;
  initialCategoryId?: string;
}

type CallPhase = 'IDLE' | 'RINGING' | 'ACTIVE' | 'ENDED';

const KANNADA_SPOKEN_NAMES: Record<string, string> = {
  gruha_lakshmi: 'ಗೃಹಲಕ್ಷ್ಮಿ',
  anna_bhagya: 'ಅನ್ನಭಾಗ್ಯ',
  gruha_jyothi: 'ಗೃಹಜ್ಯೋತಿ',
  yuva_nidhi: 'ಯುವನಿಧಿ',
  shakti_scheme: 'ಶಕ್ತಿ ಯೋಜನೆ',
  ration_card: 'ರೇಷನ್ ಕಾರ್ಡ್ ತಿದ್ದುಪಡಿ',
  revenue_khata: 'ಖಾತೆ ಬದಲಾವಣೆ',
  pension_dbt: 'ಸಾಮಾಜಿಕ ಭದ್ರತಾ ಪಿಂಚಣಿ',
};

export default function PhoneCallSimulator({ onCallCompleted, initialCategoryId }: PhoneCallSimulatorProps) {
  // Booking Form State
  const [applicantName, setApplicantName] = useState('ಸುಜಲ್');
  const [phoneNumber, setPhoneNumber] = useState('9845012345');
  const [language, setLanguage] = useState<'kn' | 'en' | 'hi'>('kn');
  const [selectedCategory, setSelectedCategory] = useState<PersonalCategoryOption>(
    PERSONAL_CATEGORIES.find((c) => c.id === initialCategoryId) || PERSONAL_CATEGORIES[0]
  );
  const [daysDelayed, setDaysDelayed] = useState<number>(45);

  // Phone Call Lifecycle State
  const [callPhase, setCallPhase] = useState<CallPhase>('IDLE');
  const [callTimer, setCallTimer] = useState<number>(0);
  const [isAISpeaking, setIsAISpeaking] = useState(false);

  // In-Call AI Conversation Step
  const [callStep, setCallStep] = useState<number>(1);
  const [currentPromptText, setCurrentPromptText] = useState('');
  const [userResponseText, setUserResponseText] = useState('');
  const [smsSent, setSmsSent] = useState<boolean>(false);

  const timerRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Manage Call Timer
  useEffect(() => {
    if (callPhase === 'ACTIVE') {
      timerRef.current = setInterval(() => {
        setCallTimer((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [callPhase]);

  // Format Call Timer mm:ss
  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Play short mobile call pickup beep using Web Audio API to unlock audio focus
  const playCallPickupBeep = () => {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // Fallback
    }
  };

  // Start Outbound Phone Call Sequence (Ringing screen)
  const handleRequestCall = () => {
    if (!phoneNumber.trim()) {
      alert('Please enter a valid 10-digit mobile phone number.');
      return;
    }

    setCallPhase('RINGING');
    setCallTimer(0);
    setCallStep(1);
  };

  // Accept Incoming Phone Call directly on user click
  const acceptIncomingCall = () => {
    playCallPickupBeep();
    setCallPhase('ACTIVE');
    setTimeout(() => {
      triggerPhoneAISpeech(1);
    }, 200);
  };

  // Trigger Phone AI Voice Prompt
  const triggerPhoneAISpeech = (stepNumber: number) => {
    const kannadaCategorySpoken = KANNADA_SPOKEN_NAMES[selectedCategory.id] || 'ಸಕಾಲ';
    let prompt = '';
    
    if (stepNumber === 1) {
      prompt = language === 'kn'
        ? `ನಮಸ್ಕಾರ ${applicantName}. ನಾನು ಸಕಾಲ ನಾಗರಿಕ ಹಕ್ಕುಗಳ ಸಹಾಯಕರಾಗಿದ್ದೇನೆ. ನಿಮ್ಮ ${kannadaCategorySpoken} ಯೋಜನೆಯ ಕುರಿತು ಮಾತನಾಡಲು ಕರೆ ಮಾಡಿದ್ದೇನೆ.`
        : `Hello ${applicantName}! I am calling from Sakala Citizen Rights regarding your ${selectedCategory.name} issue.`;
    } else if (stepNumber === 2) {
      prompt = language === 'kn'
        ? `ಈ ${kannadaCategorySpoken} ಯೋಜನೆಗೆ ಎಷ್ಟು ದಿನಗಳಿಂದ ಹಣ ಅಥವಾ ಸೇವೆ ವಿಳಂಬವಾಗಿದೆ ತಿಳಿಸಿ.`
        : `How many days or months has this ${selectedCategory.name} service been delayed?`;
    } else if (stepNumber === 3) {
      prompt = language === 'kn'
        ? 'ಧನ್ಯವಾದಗಳು. ನಿಮ್ಮ ಅರ್ಜಿ ಸಂಖ್ಯೆ ಅಥವಾ ಸಮಸ್ಯೆಯ ವಿವರಗಳನ್ನು ತಿಳಿಸಿ.'
        : 'Thank you! Please state your application reference number or grievance details.';
    } else if (stepNumber === 4) {
      prompt = language === 'kn'
        ? 'ಧನ್ಯವಾದಗಳು. ನಿಮ್ಮ ಫೋನ್ ಸಂಭಾಷಣೆಯನ್ನು ದಾಖಲಿಸಲಾಗಿದೆ. ಸಕಾಲ ಅಧಿಕೃತ ದೂರು ಮತ್ತು ದಂಡದ ವರದಿಯನ್ನು ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ.'
        : 'Thank you! Your call has been processed. Generating your Sakala official dossier and penalty notice now.';
    }

    setCurrentPromptText(prompt);
    playNeuralSpeechAudio(prompt, language);
  };

  // High-Quality Neural Text-to-Speech Engine (Google Neural TTS Stream + Web Speech Fallback)
  const playNeuralSpeechAudio = (text: string, lang: 'kn' | 'en' | 'hi', onEnd?: () => void) => {
    if (typeof window === 'undefined') return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    const cleanText = text
      .replace(/!/g, '.')
      .replace(/\?/g, '.')
      .replace(/AI ಫೋನ್/g, 'ಸಹಾಯ')
      .replace(/[₹#/\\_-]/g, ' ')
      .trim();

    const targetLang = lang === 'kn' ? 'kn' : lang === 'hi' ? 'hi' : 'en';
    const ttsUrl = `/api/tts?text=${encodeURIComponent(cleanText)}&lang=${targetLang}`;

    const audio = new Audio(ttsUrl);
    audio.playbackRate = 1.15;
    audioRef.current = audio;

    audio.onplay = () => setIsAISpeaking(true);
    audio.onended = () => {
      setIsAISpeaking(false);
      if (onEnd) onEnd();
    };

    audio.onerror = () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.resume();
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = lang === 'kn' ? 'kn-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
        
        const voices = window.speechSynthesis.getVoices();
        const knVoice = voices.find((v) => v.lang.includes('kn') || v.lang.includes('IN'));
        if (knVoice) utterance.voice = knVoice;
        utterance.pitch = 1.0;
        utterance.rate = 0.85;

        utterance.onstart = () => setIsAISpeaking(true);
        utterance.onend = () => {
          setIsAISpeaking(false);
          if (onEnd) onEnd();
        };
        utterance.onerror = () => {
          setIsAISpeaking(false);
          if (onEnd) onEnd();
        };

        window.speechSynthesis.speak(utterance);
      } else {
        setIsAISpeaking(false);
        if (onEnd) onEnd();
      }
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(cleanText);
          utterance.lang = lang === 'kn' ? 'kn-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
          window.speechSynthesis.speak(utterance);
        }
      });
    }
  };

  // Handle User Answer during phone call
  const handleUserPhoneResponse = (answerText: string) => {
    setUserResponseText(answerText);

    if (callStep === 1) {
      setCallStep(2);
      setTimeout(() => triggerPhoneAISpeech(2), 1000);
    } else if (callStep === 2) {
      const match = answerText.match(/(\d+)/);
      if (match) setDaysDelayed(parseInt(match[1]));
      setCallStep(3);
      setTimeout(() => triggerPhoneAISpeech(3), 1000);
    } else if (callStep === 3) {
      setCallStep(4);
      triggerPhoneAISpeech(4);

      setTimeout(() => {
        handleEndCall();
      }, 3500);
    }
  };

  // End Phone Call & Generate Sakala Report + Send SMS
  const handleEndCall = () => {
    window.speechSynthesis?.cancel();
    setCallPhase('ENDED');
    setSmsSent(true);

    const dossier = generatePersonalGrievanceDossier(
      selectedCategory.id,
      `Outbound AI Cellular Phone Interview conducted with ${applicantName} on ${phoneNumber}.`,
      `${selectedCategory.name} Delayed by ${daysDelayed} Days`,
      daysDelayed,
      applicantName
    );

    savePersonalCaseToStorage(dossier);

    setTimeout(() => {
      onCallCompleted(dossier, phoneNumber);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-2xl p-6 md:p-10 space-y-8 max-w-3xl mx-auto relative overflow-hidden animate-fadeIn text-[var(--color-text-primary)]">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-lg">
            <PhoneCall size={24} />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-[var(--color-text-primary)]">
              AI Automated Outbound Phone Call System
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Receive a direct phone call on your mobile number to lodge Sakala grievance
            </p>
          </div>
        </div>

        {/* Language Pill */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-extrabold">
          <button
            onClick={() => setLanguage('kn')}
            className={`px-3 py-1 rounded-lg transition-all ${
              language === 'kn' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600'
            }`}
          >
            🇮🇳 ಕನ್ನಡ
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 rounded-lg transition-all ${
              language === 'en' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600'
            }`}
          >
            🇬🇧 EN
          </button>
        </div>
      </div>

      {/* PHASE 1: IDLE / BOOKING FORM */}
      {callPhase === 'IDLE' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs md:text-sm">
            <div>
              <label className="font-extrabold text-slate-700 block mb-1">Your Full Name</label>
              <input
                type="text"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-300 font-medium focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-extrabold text-slate-700 block mb-1">Mobile Phone Number (+91)</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-300 font-mono font-bold focus:bg-white focus:border-emerald-600 focus:outline-none text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="font-extrabold text-slate-700 block mb-1">Select Affected Scheme / Service</label>
            <select
              value={selectedCategory.id}
              onChange={(e) => {
                const cat = PERSONAL_CATEGORIES.find((c) => c.id === e.target.value);
                if (cat) setSelectedCategory(cat);
              }}
              className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-300 font-bold focus:bg-white focus:border-emerald-600 focus:outline-none text-xs md:text-sm"
            >
              {PERSONAL_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name} ({cat.kannadaName})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleRequestCall}
            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-2xl font-extrabold text-sm md:text-base shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <PhoneCall size={20} />
            <span>Request Immediate AI Phone Call on {phoneNumber}</span>
          </button>
        </div>
      )}

      {/* PHASE 2: INCOMING PHONE CALL RINGING SIMULATOR */}
      {callPhase === 'RINGING' && (
        <div className="bg-slate-950 text-white rounded-3xl p-8 text-center space-y-6 animate-pulse border-4 border-emerald-500 shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-emerald-600/30 text-emerald-400 flex items-center justify-center mx-auto animate-bounce border-2 border-emerald-400">
            <PhoneIncoming size={40} />
          </div>

          <div>
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block">
              INCOMING AI PHONE CALL...
            </span>
            <h3 className="text-2xl font-black text-white mt-1">Karnataka Sakala Mission AI</h3>
            <p className="text-sm font-mono text-slate-400 mt-0.5">+91 80 2203 2555</p>
          </div>

          <div className="flex items-center justify-center gap-6 pt-4">
            <button
              onClick={() => setCallPhase('IDLE')}
              className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg active:scale-95 transition-all"
              title="Decline Call"
            >
              <PhoneOff size={28} />
            </button>
            <button
              onClick={acceptIncomingCall}
              className="w-20 h-20 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-2xl active:scale-95 transition-all animate-bounce"
              title="Accept Call"
            >
              <PhoneCall size={36} />
            </button>
          </div>
        </div>
      )}

      {/* PHASE 3: ACTIVE CELLULAR PHONE CONVERSATION */}
      {callPhase === 'ACTIVE' && (
        <div className="bg-slate-950 text-white rounded-3xl p-6 md:p-8 space-y-6 border-2 border-emerald-500/50 shadow-2xl">
          {/* Top In-Call Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <div>
                <h4 className="font-extrabold text-sm text-white">Karnataka Sakala AI Officer</h4>
                <p className="text-xs font-mono text-slate-400">Connected to {phoneNumber}</p>
              </div>
            </div>

            <div className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono font-bold text-emerald-400">
              ⏱️ {formatTimer(callTimer)}
            </div>
          </div>

          {/* AI Phone Prompt Banner */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl text-center space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-extrabold text-emerald-400 tracking-widest uppercase block">
                🔊 PHONE AI VOICE PROMPT (STEP {callStep}/4)
              </span>
              <button
                onClick={() => playNeuralSpeechAudio(currentPromptText, language)}
                className="px-3 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 rounded-lg text-xs font-bold border border-emerald-500/40 flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <Volume2 size={13} />
                <span>Replay AI Voice</span>
              </button>
            </div>
            <p className="text-base md:text-lg font-extrabold text-white leading-relaxed">
              "{currentPromptText}"
            </p>
          </div>

          {/* User Phone Response Buttons */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-extrabold text-slate-400 block text-center">
              🗣️ Speak into your microphone or tap a quick phone answer below:
            </span>

            {callStep === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => handleUserPhoneResponse(`Yes, I am ${applicantName}`)}
                  className="p-3 bg-slate-900 hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-200 border border-slate-800 text-left transition-all"
                >
                  "Yes, I am {applicantName}"
                </button>
                <button
                  onClick={() => handleUserPhoneResponse(`Speaking, regarding ${selectedCategory.name}`)}
                  className="p-3 bg-slate-900 hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-200 border border-slate-800 text-left transition-all"
                >
                  "Yes, calling about {selectedCategory.name}"
                </button>
              </div>
            )}

            {callStep === 2 && (
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleUserPhoneResponse('Delayed by 30 Days (1 Month)')}
                  className="p-3 bg-slate-900 hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-200 border border-slate-800 transition-all"
                >
                  30 Days (1 Month)
                </button>
                <button
                  onClick={() => handleUserPhoneResponse('Delayed by 60 Days (2 Months)')}
                  className="p-3 bg-slate-900 hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-200 border border-slate-800 transition-all"
                >
                  60 Days (2 Months)
                </button>
                <button
                  onClick={() => handleUserPhoneResponse('Delayed by 90 Days (3 Months)')}
                  className="p-3 bg-slate-900 hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-200 border border-slate-800 transition-all"
                >
                  90 Days (3 Months)
                </button>
              </div>
            )}

            {callStep === 3 && (
              <div className="space-y-2">
                <button
                  onClick={() => handleUserPhoneResponse(`Application Ref #GL-8839201 approved under Sakala, but monthly ₹2,000 DBT not credited to Canara Bank.`)}
                  className="w-full p-3 bg-slate-900 hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-200 border border-slate-800 text-left transition-all"
                >
                  "Application Ref #GL-8839201 approved, but money not credited."
                </button>
              </div>
            )}
          </div>

          {/* End Call Button */}
          <div className="pt-4 flex items-center justify-center">
            <button
              onClick={handleEndCall}
              className="px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-full font-extrabold text-sm shadow-xl active:scale-95 transition-all flex items-center gap-2"
            >
              <PhoneOff size={20} />
              <span>End Call & Generate Sakala Dossier</span>
            </button>
          </div>
        </div>
      )}

      {/* PHASE 4: POST-CALL SMS CONFIRMATION & DOSSIER GENERATION */}
      {callPhase === 'ENDED' && (
        <div className="bg-emerald-50 border-2 border-emerald-300 p-6 rounded-2xl text-center space-y-4 animate-fadeIn">
          <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-xl shadow-lg">
            <CheckCircle2 size={28} />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-black text-emerald-950">
              Phone Call Completed & SMS Dispatched!
            </h3>
            <p className="text-xs text-emerald-800 font-medium">
              Call recorded for <span className="font-bold">{applicantName}</span> on <span className="font-mono font-bold">{phoneNumber}</span>.
            </p>
          </div>

          {/* SMS Notification Mock Card */}
          <div className="bg-white p-4 rounded-xl border border-emerald-200 text-left space-y-1 shadow-sm max-w-lg mx-auto">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <MessageSquare size={14} />
              <span>SMS SENT TO {phoneNumber}</span>
            </div>
            <p className="text-xs text-slate-800 font-mono leading-relaxed">
              "KAR-SAKALA: Complaint registered for {selectedCategory.name}. Sakala GSC #KAR-SAK-2026-99201 issued. Officer notified with 48h SLA. Track at sakala.kar.nic.in"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
