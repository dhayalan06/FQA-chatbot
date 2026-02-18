export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
  matchScore?: number; // 0 to 1
  isFallback?: boolean; // True if Gemini generated it
}

export type ViewState = 'chat' | 'faqs';

export interface SimilarityResult {
  faq: FAQ | null;
  score: number;
}