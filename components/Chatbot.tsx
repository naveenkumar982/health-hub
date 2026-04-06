
import React, { useState, useRef, useEffect } from 'react';
import { HealthPath, Message } from '../types';
import { getChatResponse } from '../services/geminiService';

interface ChatbotProps {
  path: HealthPath;
  onBack: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ path, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [feedbackMap, setFeedbackMap] = useState<Record<number, 'up' | 'down'>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  const isAyurvedic = path === HealthPath.AYURVEDIC;
  const themeColor = isAyurvedic ? 'emerald' : 'blue';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const botResponse = await getChatResponse(path, [...messages, userMsg], input);
      setMessages(prev => [...prev, { role: 'model', content: botResponse }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: "Sorry, I'm experiencing some technical difficulties. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFeedback = (index: number, type: 'up' | 'down') => {
    setFeedbackMap(prev => ({ ...prev, [index]: type }));
    // In a real app, you would send this to an analytics endpoint
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-10rem)] flex flex-col px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-500 hover:text-slate-800 transition-colors font-medium"
        >
          <i className="fas fa-arrow-left mr-2"></i> Exit Consultation
        </button>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full bg-${themeColor}-500 animate-pulse`}></div>
          <span className="text-sm font-semibold text-slate-700">
            {isAyurvedic ? 'AyurBot AI Online' : 'Health Intelligence Online'}
          </span>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-white rounded-3xl shadow-sm border border-slate-100 p-6 space-y-6 mb-6"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-50">
            <div className={`h-20 w-20 bg-${themeColor}-100 text-${themeColor}-600 rounded-full flex items-center justify-center mb-6`}>
              <i className="fas fa-robot text-4xl"></i>
            </div>
            <p className="text-xl font-medium text-slate-900">
              Hello! I'm your {isAyurvedic ? 'Ayurvedic' : 'Health'} AI Assistant.
            </p>
            <p className="text-slate-500 max-w-sm mt-2">
              How can I help you today? Feel free to describe your symptoms or ask for health advice.
            </p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-5 py-3 shadow-sm ${
              msg.role === 'user' 
                ? `bg-${themeColor}-600 text-white rounded-tr-none` 
                : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
            }`}>
              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
            </div>
            
            {msg.role === 'model' && (
              <div className="flex items-center space-x-2 mt-2 ml-1">
                <button 
                  onClick={() => handleFeedback(idx, 'up')}
                  className={`text-xs p-1 px-2 rounded-md transition-colors ${feedbackMap[idx] === 'up' ? 'bg-emerald-100 text-emerald-600' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
                >
                  <i className={`fas fa-thumbs-up ${feedbackMap[idx] === 'up' ? 'scale-110' : ''}`}></i>
                </button>
                <button 
                  onClick={() => handleFeedback(idx, 'down')}
                  className={`text-xs p-1 px-2 rounded-md transition-colors ${feedbackMap[idx] === 'down' ? 'bg-red-100 text-red-600' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
                >
                  <i className={`fas fa-thumbs-down ${feedbackMap[idx] === 'down' ? 'scale-110' : ''}`}></i>
                </button>
                {feedbackMap[idx] && <span className="text-[10px] text-slate-400 animate-fade-in">Thanks for the feedback!</span>}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-100 text-slate-500 rounded-2xl rounded-tl-none px-5 py-3 border border-slate-200">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="relative group">
        <input 
          type="text" 
          className={`w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 pr-16 shadow-md focus:outline-none focus:ring-2 focus:ring-${themeColor}-500 transition-all text-slate-900 placeholder-slate-400`}
          placeholder="Describe your health issue..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button 
          onClick={handleSend}
          disabled={isTyping}
          className={`absolute right-2 top-2 bottom-2 w-12 bg-${themeColor}-600 text-white rounded-xl flex items-center justify-center hover:bg-${themeColor}-700 transition-colors disabled:opacity-50`}
        >
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
      <p className="mt-3 text-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">
        Powered by Google Gemini 3
      </p>
    </div>
  );
};

export default Chatbot;
