import React, { useState } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  X, 
  Sparkles, 
  Send, 
  MessageSquare, 
  HelpCircle,
  Radio,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Language } from '../types';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('எங்க வித்தா நல்லா இருக்கும்? (Where is it best to sell?)');
  const [responseAdvice, setResponseAdvice] = useState<string>(
    'பரிந்துரை: தக்காளி அழுகும் பயிர் என்பதால் இன்றே ஒட்டன்சத்திரம் மத்திய சந்தைக்கு அனுப்புவது சிறந்தது. பகிர்வு வாகனத்தில் சென்றால் ₹1,000 வரை போக்குவரத்து செலவு மிச்சமாகும்!'
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  if (!isOpen) return null;

  const quickPromptsTamil = [
    { text: 'எங்க வித்தா நல்லா இருக்கும்?', label: 'Where to sell today?' },
    { text: 'தக்காளிக்கு ஷேர்டு வண்டி இருக்கா?', label: 'Is there a shared truck for tomatoes?' },
    { text: 'இன்னைக்கு விக்கலாமா, வைக்கலாமா?', label: 'Sell today or hold in storage?' },
    { text: 'ஒட்டன்சத்திரம் வரத்து நிலவரம் என்ன?', label: 'What is Oddanchatram arrival status?' },
  ];

  const handleAsk = async (queryText: string) => {
    setTranscript(queryText);
    setIsLoading(true);
    try {
      const res = await fetch('/api/agri-advisory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop: 'Tomato',
          quantity: 500,
          location: 'Dindigul',
          language: language === 'en' ? 'en' : language === 'hi' ? 'hi' : 'ta',
          question: queryText,
        }),
      });
      const data = await res.json();
      setResponseAdvice(data.advice || 'Sell immediately at the regional central market to avoid decay.');
      speakText(data.advice || 'Sell immediately at the regional central market.');
    } catch (err) {
      console.error(err);
      setResponseAdvice(
        'பரிந்துரை: தக்காளி விலை இன்று ஒட்டன்சத்திரம் சந்தையில் உச்சத்தில் உள்ளது. தாமதிக்காமல் இன்றே பகிர்வு வாகனத்தில் அனுப்பவும்.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      if (language === 'ta') {
        utterance.lang = 'ta-IN';
      } else if (language === 'hi') {
        utterance.lang = 'hi-IN';
      } else {
        utterance.lang = 'en-IN';
      }
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleMicListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser engine. Please tap any preset query below.');
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.continuous = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setIsListening(false);
        handleAsk(text);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-stone-900">
                {language === 'ta' ? 'தமிழ் குரல் உதவியாளர்' : 'Tamil & Multi Voice Assistant'}
              </h3>
              <p className="text-xs text-stone-500">
                Conversational Voice-First Interface for Smallholder Farmers
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mic Activation Button */}
        <div className="text-center py-3">
          <button
            id="btn-voice-mic-trigger"
            onClick={toggleMicListening}
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all shadow-md ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse ring-8 ring-rose-200'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white active:scale-95'
            }`}
          >
            {isListening ? <Radio className="w-8 h-8 animate-spin" /> : <Mic className="w-8 h-8" />}
          </button>
          <div className="text-xs font-semibold text-stone-600 mt-2">
            {isListening ? 'Listening in Tamil / English...' : 'Tap Mic or Select a Query Below'}
          </div>
        </div>

        {/* Quick Tamil Query Chips */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            Popular Farmer Voice Queries (ஒரு தட்டலில் கேட்க):
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {quickPromptsTamil.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleAsk(item.text)}
                className="text-left p-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-emerald-50 hover:border-emerald-300 transition-colors text-xs space-y-0.5"
              >
                <div className="font-bold text-stone-900">{item.text}</div>
                <div className="text-[10px] text-stone-500">{item.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Active Query & AI Answer Box */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-950 flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-700" />
              AI Market Advisory Output:
            </span>
            {isSpeaking ? (
              <button
                onClick={stopSpeaking}
                className="inline-flex items-center text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md"
              >
                <VolumeX className="w-3 h-3 mr-1" /> Stop Voice
              </button>
            ) : (
              <button
                onClick={() => speakText(responseAdvice)}
                className="inline-flex items-center text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md"
              >
                <Volume2 className="w-3 h-3 mr-1" /> Listen Again
              </button>
            )}
          </div>

          <div className="text-xs sm:text-sm text-stone-800 leading-relaxed font-medium">
            {isLoading ? (
              <div className="py-2 text-stone-500 italic animate-pulse">
                Analyzing mandi rates, transit freight, and shelf-life...
              </div>
            ) : (
              responseAdvice
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
