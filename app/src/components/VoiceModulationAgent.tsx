'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, Send, RefreshCw, CheckCircle2, AlertCircle, Bot, User, Languages } from 'lucide-react';
import { PERSONAL_CATEGORIES, PersonalCategoryOption } from '@/lib/personal-data';

interface VoiceModulationAgentProps {
  onCompleteGrievance: (categoryId: string, description: string, daysDelayed: number, applicantName: string) => void;
  initialCategoryId?: string;
}

type StepType = 'NAME' | 'SCHEME' | 'DELAY' | 'DETAILS' | 'COMPLETE';

export default function VoiceModulationAgent({ onCompleteGrievance, initialCategoryId }: VoiceModulationAgentProps) {
  const [language, setLanguage] = useState<'kn' | 'en' | 'hi'>('kn');
  const [step, setStep] = useState<StepType>('NAME');

  // Collected Data State
  const [applicantName, setApplicantName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PersonalCategoryOption>(
    PERSONAL_CATEGORIES.find((c) => c.id === initialCategoryId) || PERSONAL_CATEGORIES[0]
  );
  const [daysDelayed, setDaysDelayed] = useState<number>(30);
  const [grievanceDetails, setGrievanceDetails] = useState('');

  // Voice & Audio States
  const [isListening, setIsListening] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [subtitleText, setSubtitleText] = useState('');
  const [userTranscript, setUserTranscript] = useState('');
  const [manualInput, setManualInput] = useState('');

  // Audio Visualizer Levels (7 bars)
  const [audioLevels, setAudioLevels] = useState<number[]>([15, 25, 45, 60, 45, 25, 15]);

  const recognitionRef = useRef<any>(null);

  // Animate audio waveform bars when speaking/listening
  useEffect(() => {
    let interval: any;
    if (isAISpeaking || isListening) {
      interval = setInterval(() => {
        setAudioLevels([
          Math.floor(Math.random() * 65) + 20,
          Math.floor(Math.random() * 85) + 15,
          Math.floor(Math.random() * 95) + 30,
          Math.floor(Math.random() * 100) + 40,
          Math.floor(Math.random() * 95) + 30,
          Math.floor(Math.random() * 85) + 15,
          Math.floor(Math.random() * 65) + 20,
        ]);
      }, 100);
    } else {
      setAudioLevels([15, 20, 25, 30, 25, 20, 15]);
    }
    return () => clearInterval(interval);
  }, [isAISpeaking, isListening]);

  // Set initial text prompt subtitle without auto-playing speech or auto-opening mic
  useEffect(() => {
    updateSubtitleForStep('NAME', language);
  }, []);

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

  const updateSubtitleForStep = (currentStep: StepType, lang: 'kn' | 'en' | 'hi') => {
    const kannadaCategorySpoken = KANNADA_SPOKEN_NAMES[selectedCategory.id] || 'ಸಕಾಲ';

    let promptText = '';
    if (currentStep === 'NAME') {
      if (lang === 'kn') promptText = 'ನಮಸ್ಕಾರ. ಸಕಾಲ ನಾಗರಿಕ ಹಕ್ಕುಗಳ ಸಹಾಯಕ್ಕೆ ಸುಸ್ವಾಗತ. ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು ತಿಳಿಸಿ.';
      else if (lang === 'hi') promptText = 'नमस्ते! सकाला नागरिक अधिकार AI में आपका स्वागत है। कृपया अपना नाम बताएं?';
      else promptText = 'Hello! Welcome to Sakala Citizen Rights AI. Please tell me your full name?';
    } else if (currentStep === 'SCHEME') {
      if (lang === 'kn') promptText = `ಧನ್ಯವಾದಗಳು ${applicantName || 'ನಾಗರಿಕರೇ'}. ನಿಮಗೆ ಯಾವ ಸರ್ಕಾರಿ ಯೋಜನೆಯಲ್ಲಿ ತೊಂದರೆಯಾಗಿದೆ. ಗೃಹಲಕ್ಷ್ಮಿ, ಪಿಂಚಣಿ, ರೇಷನ್ ಕಾರ್ಡ್ ಅಥವಾ ಖಾತೆ.`;
      else if (lang === 'hi') promptText = `धन्यवाद ${applicantName || 'नागरिक'}। आपको किस योजना में समस्या आ रही है? (गृहलक्ष्मी, पेंशन, राशन कार्ड, ज़मीन सर्वे या अस्पताल?)`;
      else promptText = `Thank you ${applicantName || 'Citizen'}. Which government service or scheme is causing you trouble? (Gruha Lakshmi, Pension, Ration Card, Land Survey, or Govt Hospital?)`;
    } else if (currentStep === 'DELAY') {
      if (lang === 'kn') promptText = `ಈ ${kannadaCategorySpoken} ಯೋಜನೆಗೆ ಎಷ್ಟು ದಿನಗಳಿಂದ ಹಣ ಅಥವಾ ಸೇವೆ ವಿಳಂಬವಾಗಿದೆ ತಿಳಿಸಿ.`;
      else if (lang === 'hi') promptText = `इस ${selectedCategory.name} सेवा में कितने दिन या महीने की देरी हुई है?`;
      else promptText = `How many days or months has this ${selectedCategory.name} service been delayed?`;
    } else if (currentStep === 'DETAILS') {
      if (lang === 'kn') promptText = 'ನಿಮ್ಮ ಅರ್ಜಿ ಸಂಖ್ಯೆ, ಬ್ಯಾಂಕ್ ಮಾಹಿತಿ ಅಥವಾ ಸಮಸ್ಯೆಯ ವಿವರಗಳನ್ನು ತಿಳಿಸಿ.';
      else if (lang === 'hi') promptText = 'कृपया अपना आवेदन नंबर या समस्या का विवरण बताएं?';
      else promptText = 'Please state your application reference number or grievance details.';
    } else if (currentStep === 'COMPLETE') {
      if (lang === 'kn') promptText = 'ಧನ್ಯವಾದಗಳು. ನಿಮ್ಮ ಸಕಾಲ ಅಧಿಕೃತ ಅರ್ಜಿ ಮತ್ತು ದಂಡದ ವರದಿಯನ್ನು ತಕ್ಷಣ ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ.';
      else if (lang === 'hi') promptText = 'धन्यवाद! आपका सकाला आधिकारिक शिकायत दस्तावेज़ तैयार किया जा रहा है...';
      else promptText = 'Thank you! Generating your Sakala official dossier and penalty notice now...';
    }

    setSubtitleText(promptText);
  };

  // Pre-load speech synthesis voices asynchronously
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const updateVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v && v.length > 0) setAvailableVoices(v);
    };
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }, []);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // High-Quality Female Voice Synthesis (Neural Kannada Audio Stream + Web Speech Fallback)
  const speakAIPrompt = (text: string, lang: 'kn' | 'en' | 'hi', onEndCallback?: () => void) => {
    if (typeof window === 'undefined') {
      if (onEndCallback) onEndCallback();
      return;
    }

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
      .replace(/AI/g, 'ಏ ಐ')
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
      if (onEndCallback) onEndCallback();
    };

    audio.onerror = () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.resume();
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = lang === 'kn' ? 'kn-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';

        const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
        const knVoice = voices.find((v) => v.lang.includes('kn') || v.lang.includes('IN'));
        if (knVoice) utterance.voice = knVoice;
        utterance.pitch = 1.0;
        utterance.rate = 0.85;

        utterance.onstart = () => setIsAISpeaking(true);
        utterance.onend = () => {
          setIsAISpeaking(false);
          if (onEndCallback) onEndCallback();
        };
        utterance.onerror = () => {
          setIsAISpeaking(false);
          if (onEndCallback) onEndCallback();
        };

        window.speechSynthesis.speak(utterance);
      } else {
        setIsAISpeaking(false);
        if (onEndCallback) onEndCallback();
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

  // Toggle Mic ON/OFF strictly when user clicks the Mic Button
  const toggleMicListening = () => {
    if (isListening) {
      // Turn OFF mic stream & cancel speech
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      window.speechSynthesis?.cancel();
      setIsAISpeaking(false);
      return;
    }

    // Speak AI prompt first, then open mic for user input
    speakAIPrompt(subtitleText, language, () => {
      startSpeechRecognition();
    });
  };

  // Web Speech Recognition
  const startSpeechRecognition = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use the text input below.');
      return;
    }

    try {
      if (recognitionRef.current) recognitionRef.current.abort();

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === 'kn' ? 'kn-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setUserTranscript('Listening to your voice...');
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setUserTranscript(transcript);

        if (event.results[0].isFinal) {
          handleUserInputProcessing(transcript);
        }
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Process User Speech Input & Advance State Machine
  const handleUserInputProcessing = (input: string) => {
    setIsListening(false);
    if (!input.trim()) return;

    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);

      if (step === 'NAME') {
        const nameClean = input.replace(/my name is|i am|ನನ್ನ ಹೆಸರು|ಖುಷಿ|ಹೆಸರು|ಶುರು/gi, '').trim();
        const finalName = nameClean.length > 2 ? nameClean : input;
        setApplicantName(finalName);
        setStep('SCHEME');
        updateSubtitleForStep('SCHEME', language);
        speakAIPrompt(
          language === 'kn'
            ? `ಧನ್ಯವಾದಗಳು ${finalName}. ನಿಮಗೆ ಯಾವ ಸರ್ಕಾರಿ ಯೋಜನೆಯಲ್ಲಿ ತೊಂದರೆಯಾಗಿದೆ? (ಗೃಹಲಕ್ಷ್ಮಿ, ಪಿಂಚಣಿ, ರೇಷನ್ ಕಾರ್ಡ್, ಜಮೀನು ಸರ್ವೇ ಅಥವಾ ಆಸ್ಪತ್ರೆ?)`
            : `Thank you ${finalName}. Which government service or scheme is causing you trouble?`
          , language
        );
      } else if (step === 'SCHEME') {
        const lower = input.toLowerCase();
        const matchedCat = PERSONAL_CATEGORIES.find((c) =>
          lower.includes(c.id) ||
          lower.includes(c.name.toLowerCase()) ||
          lower.includes(c.kannadaName) ||
          (c.id === 'gruha_lakshmi' && (lower.includes('2000') || lower.includes('ಲಕ್ಷ್ಮಿ') || lower.includes('gruha'))) ||
          (c.id === 'pension' && (lower.includes('pension') || lower.includes('ಪಿಂಚಣಿ'))) ||
          (c.id === 'ration' && (lower.includes('ration') || lower.includes('ಪಡಿತರ') || lower.includes('ರೇಷನ್'))) ||
          (c.id === 'land_survey' && (lower.includes('land') || lower.includes('bhoomi') || lower.includes('ಪಹಣಿ'))) ||
          (c.id === 'govt_hospital' && (lower.includes('hospital') || lower.includes('ಆಸ್ಪತ್ರೆ')))
        ) || selectedCategory;

        setSelectedCategory(matchedCat);
        setStep('DELAY');
        updateSubtitleForStep('DELAY', language);
        speakAIPrompt(
          language === 'kn'
            ? `ಈ ${matchedCat.name} ಸೇವೆಗೆ ಎಷ್ಟು ದಿನಗಳು ಅಥವಾ ತಿಂಗಳುಗಳು ವಿಳಂಬವಾಗಿದೆ ತಿಳಿಸಿ?`
            : `How many days or months has this ${matchedCat.name} service been delayed?`
          , language
        );
      } else if (step === 'DELAY') {
        const daysMatch = input.match(/(\d+)/);
        let days = 30;
        if (daysMatch) {
          const num = parseInt(daysMatch[1]);
          if (input.includes('ತಿಂಗಳು') || input.includes('month') || input.includes('ಮಹಿನಾ')) {
            days = num * 30;
          } else {
            days = num;
          }
        }
        setDaysDelayed(days);
        setStep('DETAILS');
        updateSubtitleForStep('DETAILS', language);
        speakAIPrompt(
          language === 'kn'
            ? 'ನಿಮ್ಮ ಅರ್ಜಿ ಸಂಖ್ಯೆ, ಬ್ಯಾಂಕ್ ಮಾಹಿತಿ ಅಥವಾ ಸಮಸ್ಯೆಯ ವಿವರಗಳನ್ನು ತಿಳಿಸಿ?'
            : 'Please state your application reference number or grievance details.'
          , language
        );
      } else if (step === 'DETAILS') {
        setGrievanceDetails(input);
        setStep('COMPLETE');
        updateSubtitleForStep('COMPLETE', language);
        speakAIPrompt(
          language === 'kn'
            ? 'ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ಸಕಾಲ ಅಧಿಕೃತ ಅರ್ಜಿ ಮತ್ತು ದಂಡದ ವರದಿಯನ್ನು ತಕ್ಷಣ ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ...'
            : 'Thank you! Generating your Sakala official dossier and penalty notice now...'
          , language
        );

        setTimeout(() => {
          onCompleteGrievance(selectedCategory.id, input, daysDelayed, applicantName || 'Ramesh Kumar');
        }, 2800);
      }
    }, 800);
  };

  const handleLanguageSwitch = (lang: 'kn' | 'en' | 'hi') => {
    setLanguage(lang);
    window.speechSynthesis?.cancel();
    setIsAISpeaking(false);
    setIsListening(false);
    updateSubtitleForStep(step, lang);
  };

  return (
    <div className="bg-slate-950 text-white rounded-3xl border-2 border-cyan-500/40 shadow-2xl p-6 md:p-10 space-y-8 max-w-3xl mx-auto relative overflow-hidden animate-fadeIn">
      
      {/* Top Header & Language Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-5 z-10 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold shadow-inner border border-cyan-500/40">
            <Sparkles size={22} className="animate-spin" />
          </div>
          <div>
            <h3 className="font-black text-lg text-white tracking-tight flex items-center gap-2">
              <span>Sakala Voice Modulation AI Agent</span>
            </h3>
            <p className="text-xs text-cyan-400/80 font-mono font-semibold">
              Step {step === 'NAME' ? '1/4: Name' : step === 'SCHEME' ? '2/4: Scheme' : step === 'DELAY' ? '3/4: Delay' : '4/4: Details'} • Tap Mic Button to Speak
            </p>
          </div>
        </div>

        {/* Language Switch Buttons */}
        <div className="flex items-center bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs font-extrabold">
          <button
            onClick={() => handleLanguageSwitch('kn')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              language === 'kn' ? 'bg-cyan-500 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            🇮🇳 ಕನ್ನಡ
          </button>
          <button
            onClick={() => handleLanguageSwitch('en')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              language === 'en' ? 'bg-cyan-500 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            🇬🇧 EN
          </button>
          <button
            onClick={() => handleLanguageSwitch('hi')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              language === 'hi' ? 'bg-cyan-500 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            🇮🇳 हिंदी
          </button>
        </div>
      </div>

      {/* CENTER GLOWING AI VOICE ORB & WAVEFORM MODULATION UI */}
      <div className="flex flex-col items-center justify-center py-6 space-y-8 relative">
        
        {/* Ambient Radial Background Glow */}
        <div className="absolute w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* 3D GLOWING VOICE ORB (Clicking strictly toggles Mic ON/OFF) */}
        <div className="relative flex items-center justify-center">
          {/* Pulse Rings when AI is speaking or listening */}
          {(isAISpeaking || isListening) && (
            <>
              <div className={`absolute w-44 h-44 rounded-full border-2 ${isListening ? 'border-red-500/50 bg-red-500/10' : 'border-cyan-400/50 bg-cyan-500/10'} animate-ping`} />
              <div className={`absolute w-56 h-56 rounded-full border ${isListening ? 'border-red-500/30' : 'border-cyan-400/30'} animate-pulse`} />
            </>
          )}

          {/* Central Orb Button */}
          <button
            onClick={toggleMicListening}
            className={`w-36 h-36 rounded-full flex items-center justify-center cursor-pointer shadow-2xl transition-all duration-500 transform active:scale-95 border-4 ${
              isListening
                ? 'bg-gradient-to-tr from-red-600 to-rose-500 border-red-300 ring-8 ring-red-500/40 scale-105'
                : isAISpeaking
                ? 'bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 border-cyan-300 ring-8 ring-cyan-500/40 scale-105'
                : 'bg-gradient-to-tr from-slate-800 to-slate-900 border-slate-700 hover:border-cyan-400'
            }`}
          >
            <div className="flex flex-col items-center text-center space-y-1">
              {isListening ? (
                <MicOff size={40} className="text-white animate-bounce" />
              ) : isAISpeaking ? (
                <Volume2 size={40} className="text-white animate-pulse" />
              ) : (
                <Mic size={40} className="text-cyan-400" />
              )}
              <span className="text-[10px] font-mono font-black tracking-widest text-white/90 uppercase">
                {isListening ? 'TAP TO STOP MIC' : isAISpeaking ? 'AI SPEAKING' : 'TAP TO OPEN MIC'}
              </span>
            </div>
          </button>
        </div>

        {/* 7-BAR REAL-TIME AUDIO WAVEFORM VISUALIZER */}
        <div className="flex items-center justify-center gap-2 h-16 px-6 py-2 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 shadow-inner">
          {audioLevels.map((height, idx) => (
            <div
              key={idx}
              className={`w-2.5 rounded-full transition-all duration-150 ${
                isListening
                  ? 'bg-gradient-to-t from-red-600 to-rose-400'
                  : isAISpeaking
                  ? 'bg-gradient-to-t from-cyan-500 to-blue-400'
                  : 'bg-slate-700'
              }`}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>

        {/* TELEPROMPTER SUBTITLE CAPTION BANNER */}
        <div className="w-full max-w-xl text-center space-y-2 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl backdrop-blur-md">
          <span className="text-[10px] font-mono font-extrabold text-cyan-400 tracking-widest uppercase block">
            {isAISpeaking ? '🔊 FEMALE AI VOICE PROMPT' : isListening ? '🎙️ CITIZEN SPEECH TRANSCRIPT' : '⚡ TAP MIC ORB TO START'}
          </span>
          <p className="text-sm md:text-base font-extrabold text-white leading-relaxed">
            "{isListening ? userTranscript : subtitleText}"
          </p>
        </div>
      </div>

      {/* Manual Text Response Fallback */}
      <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
        <input
          type="text"
          value={manualInput}
          onChange={(e) => setManualInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && manualInput.trim()) {
              handleUserInputProcessing(manualInput);
              setManualInput('');
            }
          }}
          placeholder="Or type your response here..."
          className="flex-1 px-4 py-3 bg-slate-900 text-white rounded-2xl text-xs md:text-sm border border-slate-800 focus:border-cyan-500 focus:outline-none transition-all font-medium"
        />

        <button
          onClick={() => {
            if (manualInput.trim()) {
              handleUserInputProcessing(manualInput);
              setManualInput('');
            } else {
              toggleMicListening();
            }
          }}
          className="px-5 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold rounded-2xl text-xs md:text-sm shadow-lg active:scale-95 transition-all flex items-center gap-2"
        >
          <Send size={16} />
          <span>Send Response</span>
        </button>
      </div>
    </div>
  );
}
