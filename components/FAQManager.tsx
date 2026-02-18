import React, { useState } from 'react';
import { Plus, Trash2, Search, Save, X } from 'lucide-react';
import { FAQ } from '../types';

interface FAQManagerProps {
  faqs: FAQ[];
  onAdd: (faq: FAQ) => void;
  onDelete: (id: string) => void;
}

export const FAQManager: React.FC<FAQManagerProps> = ({ faqs, onAdd, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  
  // New FAQ Form State
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newCategory, setNewCategory] = useState('');

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion || !newAnswer || !newCategory) return;

    onAdd({
      id: Date.now().toString(),
      question: newQuestion,
      answer: newAnswer,
      category: newCategory
    });

    setNewQuestion('');
    setNewAnswer('');
    setNewCategory('');
    setIsAdding(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 p-6 sm:p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Knowledge Base</h2>
            <p className="text-slate-500">Manage the FAQs used by the chatbot matching engine.</p>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm font-medium"
          >
            {isAdding ? <X size={18} /> : <Plus size={18} />}
            {isAdding ? 'Cancel' : 'Add New FAQ'}
          </button>
        </div>

        {/* Add New Form */}
        {isAdding && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Add New Question</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Question</label>
                  <input
                    type="text"
                    value={newQuestion}
                    onChange={e => setNewQuestion(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. How do I reset my password?"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. Account"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Answer</label>
                <textarea
                  value={newAnswer}
                  onChange={e => setNewAnswer(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                  placeholder="e.g. Go to settings..."
                />
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  <Save size={18} />
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search questions or answers..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
          />
        </div>

        {/* List */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <div className="mb-3">
                 <Search size={48} className="mx-auto opacity-20" />
              </div>
              No FAQs found matching your search.
            </div>
          ) : (
            filteredFaqs.map((faq) => (
              <div 
                key={faq.id} 
                className="group bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow relative"
              >
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onDelete(faq.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete FAQ"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="mb-2">
                  <span className="inline-block px-2 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-md uppercase tracking-wide">
                    {faq.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2 pr-12">{faq.question}</h3>
                <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};