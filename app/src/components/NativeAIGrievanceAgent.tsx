'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Sparkles, Volume2, Globe, CheckCircle2, User, Bot, AlertCircle } from 'lucide-react';
import { PERSONAL_CATEGORIES, PersonalCategoryOption } from '@/lib/personal-data';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  language: 'kn' | 'en' | 'hi';
}

interface NativeAIGrievanceAgentProps {
  onCompleteGrievance: (categoryId: string, description: string, daysDelayed: number) => void;
  selectedCategoryId?: string;
}

export default function NativeAIGrievanceAgent({ onCompleteGrievance, selectedCategoryId }: NativeAIGrievanceAgentProps) {
  const [language, setLanguage] = useState<'kn' | 'en' | 'hi'>('kn');
  const [isListening, setIsListening] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'ನಮಸ್ಕಾರ! ನಾನು ಕರ್ನಾಟಕ ಸರಕಾರದ ಸಕಾಲ ನಾಗರಿಕ ಹಕ್ಕುಗಳ AI ಸಹಾಯಕ. ನಿಮಗೆ ಯಾವ ಯೋಜನೆಯಲ್ಲಿ (ಉದಾಹರಣೆಗೆ ಗೃಹಲಕ್ಷ್ಮಿ, ಪಿಂಚಣಿ, ಪಡಿತರ ಚೀಟಿ, ಜಮೀನು ಸರ್ವೇ) ತೊಂದರೆಯಾಗಿದೆ ತಿಳಿಸಿ?',
      language: 'kn',
    },
  ]);

  const [detectedCategory, setDetectedCategory] = useState<PersonalCategoryOption | null>(null);
  const [extractedDays, setExtractedDays] = useState<number>(30);
  const [step, setStep] = useState<'category' | 'details' | 'confirm'>('category');

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll chat window
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial language greeting switch
  const handleLanguageChange = (lang: 'kn' | 'en' | 'hi') => {
    setLanguage(lang);
    let initialGreeting = '';
    if (lang === 'kn') {
      initialGreeting = 'ನಮಸ್ಕಾರ! ನಾನು ಸಕಾಲ ನಾಗರಿಕ ಹಕ್ಕುಗಳ AI ಸಹಾಯಕ. ನಿಮಗೆ ಯಾವ ಸರಕಾರಿ ಸೇವೆಯಲ್ಲಿ (ಗೃಹಲಕ್ಷ್ಮಿ, ಪಿಂಚಣಿ, ರೇಷನ್ ಕಾರ್ಡ್, ಆಸ್ಪತ್ರೆ) ಸಮಸ್ಯೆ ಇದೆ ತಿಳಿಸಿ?';
    } else if (lang === 'en') {
      initialGreeting = 'Hello! I am your Sakala Citizen Rights AI Agent. Which government service or scheme (Gruha Lakshmi, Pension, Ration Card, Land Survey, Govt Hospital) is causing delays?';
    } else {
      initialGreeting = 'नमस्ते! मैं आपका सकाला नागरिक अधिकार AI सहायक हूँ। आपको किस सरकारी योजना (गृहलक्ष्मी, पेंशन, राशन कार्ड, ज़मीन सर्वे) में समस्या आ रही है?';
    }

    setMessages((prev) => [...prev, { sender: 'ai', text: initialGreeting, language: lang }]);
    speakText(initialGreeting, lang);
  };

  // Speech Synthesis (Text to Speech)
  const speakText = (text: string, lang: 'kn' | 'en' | 'hi') => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (lang === 'kn') utterance.lang = 'kn-IN';
    else if (lang === 'hi') utterance.lang = 'hi-IN';
    else utterance.lang = 'en-IN';

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Web Speech API Initialization
  const startSpeechRecognition = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser. Please type your grievance in the text box.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language === 'kn' ? 'kn-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      handleSendMessage(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const newMessages: Message[] = [...messages, { sender: 'user', text, language }];
    setMessages(newMessages);
    setInputText('');

    // AI Intent Classifier & Response Logic
    setTimeout(() => {
      processAIResponse(text, newMessages);
    }, 600);
  };

  const processAIResponse = (userText: string, currentHistory: Message[]) => {
    const textLower = userText.toLowerCase();

    // Check for category keywords
    let matchedCat = PERSONAL_CATEGORIES.find((c) =>
      textLower.includes(c.id) ||
      textLower.includes(c.name.toLowerCase()) ||
      textLower.includes(c.kannadaName) ||
      (c.id === 'gruha_lakshmi' && (textLower.includes('2000') || textLower.includes('ಲಕ್ಷ್ಮಿ') || textLower.includes('gruha') || textLower.includes('dbt'))) ||
      (c.id === 'pension' && (textLower.includes('pension') || textLower.includes('ಪಿಂಚಣಿ') || textLower.includes('ವೃದ್ಧಾಪ್ಯ'))) ||
      (c.id === 'ration' && (textLower.includes('ration') || textLower.includes('ಪಡಿತರ') || textLower.includes('ರೇಷನ್'))) ||
      (c.id === 'land_survey' && (textLower.includes('land') || textLower.includes('survey') || textLower.includes('bhoomi') || textLower.includes('ಪಹಣಿ') || textLower.includes('ಸರ್ವೇ'))) ||
      (c.id === 'govt_hospital' && (textLower.includes('hospital') || textLower.includes('doctor') || textLower.includes('ಆಸ್ಪತ್ರೆ') || textLower.includes('ವೈದ್ಯ'))) ||
      (c.id === 'vital_certificates' && (textLower.includes('death') || textLower.includes('birth') || textLower.includes('ಮರಣ') || textLower.includes('ಜನನ') || textLower.includes('ಜಾತಿ')))
    );

    if (!matchedCat) {
      matchedCat = PERSONAL_CATEGORIES[0]; // Default to Gruha Lakshmi
    }

    setDetectedCategory(matchedCat);

    // Extract numbers for delay days
    const daysMatch = userText.match(/(\d+)\s*(days|day|ಮಹಿನಾ|ದಿನ|ತಿಂಗಳು|months|month)/i);
    let days = 30;
    if (daysMatch) {
      const num = parseInt(daysMatch[1]);
      if (daysMatch[2].includes('ತಿಂಗಳು') || daysMatch[2].includes('month') || daysMatch[2].includes('ಮಹಿನಾ')) {
        days = num * 30;
      } else {
        days = num;
      }
    }
    setExtractedDays(days);

    let reply = '';
    if (language === 'kn') {
      reply = `ಧನ್ಯವಾದಗಳು. ನಾನು ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದೇನೆ: "${matchedCat.name}". ಸಕಾಲ ನಿಯಮಗಳನ್ವಯ ಈ ಸೇವೆಗೆ ${matchedCat.sakalaLimitDays} ದಿನಗಳ ಕಾಲಮಿತಿ ಇತ್ತು. ನಿಮ್ಮ ಸೇವೆಗೆ ${days} ದಿನಗಳು ವಿಳಂಬವಾಗಿದ್ದು ಸಕಾಲ ಉಲ್ಲಂಘನೆಯಾಗಿದೆ. ತಕ್ಷಣವೇ ಅಧಿಕೃತ ಸಕಾಲ ದೂರು ಮತ್ತು ದಂಡದ ಅರ್ಜಿಯನ್ನು ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ.`;
    } else if (language === 'en') {
      reply = `Thank you. I have mapped your issue to: "${matchedCat.name}". Under Sakala rules, mandatory SLA is ${matchedCat.sakalaLimitDays} days. Since ${days} days have passed, this is a clear Sakala SLA Violation. Generating your official complaint dossier with officer penalty notice.`;
    } else {
      reply = `धन्यवाद। मैंने आपकी समस्या को "${matchedCat.name}" से जोड़ा है। सकाला नियमों के तहत इसकी समय सीमा ${matchedCat.sakalaLimitDays} दिन थी। आपके मामले में ${days} दिन बीत चुके हैं, जो नियम उल्लंघन है। आपका आधिकारिक शिकायत दस्तावेज़ तैयार किया जा रहा है।`;
    }

    setMessages([...currentHistory, { sender: 'ai', text: reply, language }]);
    speakText(reply, language);

    // Finalize
    setTimeout(() => {
      onCompleteGrievance(matchedCat!.id, userText, days);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-[var(--color-civic-blue)] shadow-2xl overflow-hidden flex flex-col h-[520px]">
      {/* Header Bar */}
      <div className="bg-[var(--color-civic-blue)] text-white px-5 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold shadow-inner border border-white/30 animate-pulse">
            <Bot size={22} />
          </div>
          <div>
            <h3 className="font-extrabold text-base tracking-tight flex items-center gap-2">
              <span>Sakala Multilingual AI Agent</span>
              <Sparkles size={14} className="text-yellow-300 fill-yellow-300" />
            </h3>
            <p className="text-xs text-blue-100 font-medium">Talk or Type naturally in your native language</p>
          </div>
        </div>

        {/* Language Switcher Buttons */}
        <div className="flex items-center bg-blue-900/60 p-1 rounded-xl border border-blue-400/30 text-xs font-extrabold">
          <button
            onClick={() => handleLanguageChange('kn')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              language === 'kn' ? 'bg-white text-[var(--color-civic-blue)] shadow-sm' : 'text-blue-200 hover:text-white'
            }`}
          >
            🇮🇳 ಕನ್ನಡ
          </button>
          <button
            onClick={() => handleLanguageChange('en')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              language === 'en' ? 'bg-white text-[var(--color-civic-blue)] shadow-sm' : 'text-blue-200 hover:text-white'
            }`}
          >
            🇬🇧 EN
          </button>
          <button
            onClick={() => handleLanguageChange('hi')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              language === 'hi' ? 'bg-white text-[var(--color-civic-blue)] shadow-sm' : 'text-blue-200 hover:text-white'
            }`}
          >
            🇮🇳 हिंदी
          </button>
        </div>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-slate-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm flex-shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-[var(--color-civic-blue)] text-white'
              }`}
            >
              {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>

            <div
              className={`max-w-[80%] p-4 rounded-2xl text-xs md:text-sm font-medium leading-relaxed shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-white text-[var(--color-text-primary)] border border-slate-200 rounded-tl-none'
              }`}
            >
              <p>{msg.text}</p>
            </div>
          </div>
        ))}

        {isSpeaking && (
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-civic-blue)] bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 w-max">
            <Volume2 size={14} className="animate-bounce" />
            <span>AI Speaking in {language === 'kn' ? 'Kannada' : language === 'hi' ? 'Hindi' : 'English'}...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <button
          onClick={startSpeechRecognition}
          className={`p-3 rounded-2xl flex items-center justify-center transition-all ${
            isListening
              ? 'bg-red-600 text-white animate-pulse shadow-lg scale-105'
              : 'bg-blue-50 text-[var(--color-civic-blue)] hover:bg-blue-100 border border-blue-200'
          }`}
          title="Microphone (Speech to Text)"
        >
          {isListening ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={
            language === 'kn'
              ? 'ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ ಅಥವಾ ಮೈಕ್ ಬಟನ್ ಒತ್ತಿ ಮಾತನಾಡಿ...'
              : language === 'hi'
              ? 'अपनी समस्या यहाँ लिखें या माइक दबाकर बोलें...'
              : 'Type or speak your grievance here...'
          }
          className="flex-1 px-4 py-3 bg-slate-100 rounded-2xl text-xs md:text-sm border border-transparent focus:border-[var(--color-civic-blue)] focus:bg-white focus:outline-none transition-all"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim()}
          className="p-3 bg-[var(--color-civic-blue)] hover:bg-blue-800 disabled:opacity-50 text-white rounded-2xl font-bold shadow-md transition-all active:scale-95 flex items-center justify-center"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
