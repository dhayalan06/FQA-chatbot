import { STOP_WORDS } from '../constants';
import { FAQ, SimilarityResult } from '../types';

/**
 * Service for Natural Language Processing tasks.
 * Implements tokenization, cleaning, and cosine similarity.
 */
class NLPService {
  
  /**
   * Cleans and tokenizes text.
   * 1. Lowercase
   * 2. Remove punctuation
   * 3. Split by whitespace
   * 4. Remove stopwords
   */
  tokenize(text: string): string[] {
    const cleanText = text
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .trim();

    const tokens = cleanText.split(/\s+/);
    
    // Filter out stopwords and empty strings
    return tokens.filter(token => token.length > 0 && !STOP_WORDS.has(token));
  }

  /**
   * Creates a term frequency vector for a given set of tokens based on a vocabulary.
   */
  createVector(tokens: string[], vocabulary: string[]): number[] {
    const vector = new Array(vocabulary.length).fill(0);
    const tokenCounts = new Map<string, number>();

    for (const token of tokens) {
      tokenCounts.set(token, (tokenCounts.get(token) || 0) + 1);
    }

    for (let i = 0; i < vocabulary.length; i++) {
      const term = vocabulary[i];
      if (tokenCounts.has(term)) {
        vector[i] = tokenCounts.get(term)!;
      }
    }

    return vector;
  }

  /**
   * Calculates the cosine similarity between two vectors.
   * Similarity = (A . B) / (||A|| * ||B||)
   */
  calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    let magA = 0;
    let magB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      magA += vecA[i] * vecA[i];
      magB += vecB[i] * vecB[i];
    }

    magA = Math.sqrt(magA);
    magB = Math.sqrt(magB);

    if (magA === 0 || magB === 0) {
      return 0;
    }

    return dotProduct / (magA * magB);
  }

  /**
   * Finds the best matching FAQ for a user query.
   */
  findBestMatch(query: string, faqs: FAQ[]): SimilarityResult {
    const queryTokens = this.tokenize(query);
    
    // If query is empty or nonsense after cleaning
    if (queryTokens.length === 0) {
      return { faq: null, score: 0 };
    }

    let bestMatch: FAQ | null = null;
    let highestScore = -1;

    // Build vocabulary for this specific comparison context (Query + Current FAQ)
    // Optimization: We could build a global vocab, but doing it pair-wise or per-query 
    // is sufficient for small datasets and ensures the vectors are comparable.
    // Better approach for accuracy: Build vocab from Query + ALL FAQs once.
    
    const allFaqTokens = faqs.map(f => this.tokenize(f.question));
    
    // Create a unique vocabulary from the query and all FAQs
    const vocabularySet = new Set<string>([...queryTokens]);
    allFaqTokens.forEach(tokens => tokens.forEach(t => vocabularySet.add(t)));
    const vocabulary = Array.from(vocabularySet);

    const queryVector = this.createVector(queryTokens, vocabulary);

    faqs.forEach((faq, index) => {
      const faqTokens = allFaqTokens[index];
      // Skip if FAQ has no tokens (edge case)
      if (faqTokens.length === 0) return;

      const faqVector = this.createVector(faqTokens, vocabulary);
      const score = this.calculateCosineSimilarity(queryVector, faqVector);

      if (score > highestScore) {
        highestScore = score;
        bestMatch = faq;
      }
    });

    return {
      faq: bestMatch,
      score: highestScore
    };
  }
}

export const nlpService = new NLPService();
