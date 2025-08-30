import { Product } from '../types/Product';
import productsData from './products.json';

export const featuredProducts: Product[] = productsData as Product[];

export const getProductBySlug = (slug: string): Product | undefined => {
  return featuredProducts.find(product => product.slug === slug);
};