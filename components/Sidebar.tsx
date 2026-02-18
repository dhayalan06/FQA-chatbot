import React from 'react';
import { MessageSquare, Database, Bot } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  return (
    <aside className="w-20 lg:w-64 bg-slate-900 text-white flex flex-col h-full shrink-0 transition-all duration-300">
      <div className="p-6 flex items-center justify-center lg:justify-start gap-3 border-b border-slate-700">
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
          <Bot size={24} />
        </div>
        <span className="font-bold text-xl hidden lg:block">FAQ Bot</span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => onViewChange('chat')}
          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
            currentView === 'chat'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <MessageSquare size={20} />
          <span className="hidden lg:block font-medium">Chat</span>
        </button>

        <button
          onClick={() => onViewChange('faqs')}
          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
            currentView === 'faqs'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Database size={20} />
          <span className="hidden lg:block font-medium">Manage FAQs</span>
        </button>
      </nav>

      <div className="p-4 border-t border-slate-700 hidden lg:block">
        <div className="text-xs text-slate-500 text-center">
          Powered by NLP & Gemini
        </div>
      </div>
    </aside>
  );
};