export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  image: string;
  gallery?: string[];
  category: 'scooter' | 'motorcycle';
  description: string;
  longDescription?: string;
  specs?: Record<string, string>;
}