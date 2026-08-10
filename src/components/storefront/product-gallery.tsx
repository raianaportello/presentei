import Image from "next/image";
import type { ProductDetail } from "@/modules/catalog/types";
export function ProductGallery({ product }: { product: ProductDetail }) { return <div className="overflow-hidden rounded-[2rem] bg-white"><Image src={product.images[0]?.url ?? product.imageUrl} alt={product.images[0]?.alt ?? product.imageAlt} width={720} height={720} className="aspect-square w-full" priority /></div>; }
