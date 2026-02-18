import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { FAQManager } from './components/FAQManager';
import { INITIAL_FAQS } from './constants';
import { FAQ, ViewState } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('chat');
  const [faqs, setFaqs] = useState<FAQ[]>(INITIAL_FAQS);

  const handleAddFaq = (newFaq: FAQ) => {
    setFaqs((prev) => [...prev, newFaq]);
  };

  const handleDeleteFaq = (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        {currentView === 'chat' ? (
          <ChatArea faqs={faqs} />
        ) : (
          <FAQManager 
            faqs={faqs} 
            onAdd={handleAddFaq} 
            onDelete={handleDeleteFaq} 
          />
        )}
      </main>
    </div>
  );
}