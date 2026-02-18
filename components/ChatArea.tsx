import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, AlertCircle } from 'lucide-react';
import { FAQ, Message } from '../types';
import { nlpService } from '../services/nlpService';
import { generateFallbackResponse } from '../services/geminiService';

interface ChatAreaProps {
  faqs: FAQ[];
}

export const ChatArea: React.FC<ChatAreaProps> = ({ faqs }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'bot',
      content: "Hello! I'm your FAQ assistant. Ask me anything about our product, billing, or technical support.",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Artificial delay for realism
    setTimeout(async () => {
      // 1. Preprocess & Match
      const { faq, score } = nlpService.findBestMatch(userMessage.content, faqs);
      
      let botResponse: Message;

      // Threshold for a "good" match. 
      // TF-IDF/Cosine on short text can be noisy, so 0.3-0.4 is often a decent cutoff for simple sentences.
      const MATCH_THRESHOLD = 0.3;

      if (faq && score > MATCH_THRESHOLD) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: faq.answer,
          timestamp: new Date(),
          matchScore: score,
          isFallback: false
        };
      } else {
        // 2. Fallback to Gemini
        const geminiContent = await generateFallbackResponse(userMessage.content);
        botResponse = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: geminiContent,
          timestamp: new Date(),
          matchScore: score, // Keep the low score to show why we fell back
          isFallback: true
        };
      }

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm z-10">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Support Assistant</h2>
          <p className="text-sm text-slate-500">Ask a question to search our FAQs</p>
        </div>
      </header>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-hide">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-blue-600 text-white'
            }`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>

            {/* Bubble */}
            <div className={`max-w-[80%] lg:max-w-[60%] space-y-1`}>
              <div
                className={`p-4 rounded-2xl shadow-sm text-sm sm:text-base leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
                }`}
              >
                {msg.content}
              </div>
              
              {/* Metadata for Bot messages */}
              {msg.role === 'bot' && msg.id !== 'welcome' && (
                <div className="flex items-center gap-2 text-[10px] text-slate-400 px-1">
                   {msg.isFallback ? (
                     <span className="flex items-center gap-1 text-purple-500 font-medium">
                       <Sparkles size={10} />
                       AI Generated (No FAQ Match)
                     </span>
                   ) : (
                     <span className="flex items-center gap-1 text-green-600 font-medium">
                       <Bot size={10} />
                       FAQ Match (Score: {(msg.matchScore! * 100).toFixed(0)}%)
                     </span>
                   )}
                   <span>•</span>
                   <span>{msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex items-end gap-3">
             <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
               <Bot size={16} />
             </div>
             <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-bl-none shadow-sm">
               <div className="flex gap-1">
                 <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                 <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                 <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
               </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form 
          onSubmit={handleSend}
          className="max-w-4xl mx-auto relative flex items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question here..."
            className="flex-1 bg-slate-100 text-slate-900 placeholder-slate-500 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors shadow-md shadow-blue-200"
          >
            <Send size={20} />
          </button>
        </form>
        <div className="max-w-4xl mx-auto mt-2 text-center">
            <p className="text-[10px] text-slate-400">
                Uses Cosine Similarity for local matching. Falls back to Gemini-3-Flash for unknown queries.
            </p>
        </div>
      </div>
    </div>
  );
};