export interface ProductCard {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  imageUrl: string;
  matchScore?: number;
  aiExplanation?: string;
  specs: Record<string, string | number>;
}

export interface RecommendationResult {
  runId: string;
  products: ProductCard[];
  parsedQuery?: {
    category: string;
    budgetMin: number;
    budgetMax: number;
    usage: string[];
    preferences: string[];
  };
}
