export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  imageUrl: string;
  imageAlt: string;
};

export type ProductDetail = ProductCardData & {
  category: string;
  variants: { id: string; name: string; color?: string }[];
  images: { url: string; alt: string }[];
};
