export interface PricePoint {
  id: string;
  name: string;
  price: string;
  features: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  value_proposition: string;
  target_market: string[];
  problems_solved: string[];
  key_features: string[];
  benefits: string[];
  price_points: PricePoint[];
  audience_ids: string[];
}
