import { getDeliveryDateRange } from '@/utils/deliveryDate';
import type { Product } from "@shared/schema";

interface PriceSectionProps {
  product: Product;
  timeLeft?: string;
  couponApplied?: boolean;
}

export default function PriceSection({ product, timeLeft = "1 dia", couponApplied = false }: PriceSectionProps) {
  const deliveryRange = getDeliveryDateRange();
  
  if (!product) {
    return null;
  }
  
  // Preços do produto
  const price = parseFloat(product.price);
  const originalPrice = product.originalPrice ? parseFloat(product.originalPrice) : price;
  const discountedPrice = couponApplied ? (price * 0.9).toFixed(2) : price.toFixed(2);
  const discount = product.discount || 0;

  return (
    <div className="pb-2 w-full">
      {/* Seção de preço com fundo rosa TikTok e divisão em formato de raio (3 linhas) */}
      <div className="w-full relative overflow-hidden" style={{ backgroundColor: '#FE2C55' }}>
        {/* SVG com raio de apenas 3 linhas - ziguezague invertido */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none" 
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <path 
            d="M 62 0 L 55 40 L 61 50 L 55 100 L 100 100 L 100 0 Z" 
            fill="rgba(255,255,255,0.08)"
          />
        </svg>
        
        <div className="relative px-4 py-3 flex items-start justify-between">
          {/* Lado esquerdo - Preços */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {discount > 0 && (
                <span className="bg-white text-[#FE2C55] text-sm font-bold px-2 py-0.5 rounded" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                  -{discount}%
                </span>
              )}
              <span className="text-white font-bold leading-none" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
                <span className="text-[10px]">A partir de </span>
                <span className="text-xl">R$ {discountedPrice.replace('.', ',')}</span>
              </span>
            </div>
            {product.originalPrice && (
              <div className="text-white/90 text-sm line-through mt-1 font-bold" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
                R$ {originalPrice.toFixed(2).replace('.', ',')}
              </div>
            )}
          </div>
          
          {/* Lado direito - Oferta Relâmpago */}
          <div className="flex flex-col items-end text-right">
            <div className="flex items-center gap-1 text-white font-bold text-sm mb-1" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
              <i className="fas fa-bolt"></i>
              <span>Oferta Relâmpago</span>
            </div>
            <div className="text-white/95 text-xs font-bold" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
              Termina em {timeLeft}
            </div>
          </div>
        </div>
      </div>
      
      {/* Seção de parcelamento com fundo branco */}
      <div className="px-4 py-2 flex items-center gap-1 text-sm">
        <i className="fas fa-credit-card text-gray-700"></i>
        <span className="text-gray-900">{product.installments}x R$ {(price / (product.installments || 1)).toFixed(2).replace('.', ',')}</span>
        <i className="fas fa-chevron-right text-gray-400 text-xs ml-auto"></i>
      </div>
      
      {/* Badge de cupom de desconto */}
      <div className="px-4 mt-1">
        <div className="font-normal inline-block rounded px-2 py-1" style={{ background: '#FDE5EA' }}>
          <span className="text-[#F52B56] text-sm flex items-center">
            <i className="fas fa-ticket-alt mr-1"></i>
            Desconto de {product.couponDiscount}%, máximo de R$ {parseFloat(product.couponMaxDiscount || '0').toFixed(0)}
          </span>
        </div>
      </div>
      
      <div className="px-4 mt-2 font-bold text-base leading-5 text-black uppercase">
        {product.name}
      </div>
      
      <div className="px-4 flex items-center mt-1">
        {[...Array(5)].map((_, i) => {
          const rating = parseFloat(product.rating || '0');
          const fullStars = Math.floor(rating);
          const hasHalfStar = rating % 1 >= 0.5;
          
          return (
            <span key={i} className="text-[#ffb400] text-sm">
              <i className={`fas fa-star${i < fullStars ? '' : i === fullStars && hasHalfStar ? '-half-alt' : ''}`} style={{ opacity: i < fullStars || (i === fullStars && hasHalfStar) ? 1 : 0.3 }}></i>
            </span>
          );
        })}
        <span className="ml-1 text-black text-sm" style={{ fontWeight: 400 }}>
          {product.rating}
        </span>
        <span className="ml-1 text-[#757575] text-sm" style={{ fontWeight: 400 }}>
          ({product.reviewsCount})
        </span>
        <span className="ml-2 text-[#757575] text-sm" style={{ fontWeight: 400 }}>
          {product.salesCount} vendidos
        </span>
      </div>
      
      <div className="px-4 flex flex-col mt-2">
        <div className="flex items-center text-sm">
          <img 
            src="https://i.ibb.co/prWkcTnx/Captura-de-Tela-2025-10-11-a-s-15-32-27-removebg-preview.png" 
            alt="Ícone de caminhão de entrega com fundo transparente" 
            className="w-5 h-5 mr-2 object-contain"
          />
          <span className="text-black font-normal">
            Receba até {deliveryRange}
          </span>
        </div>
        <div className="pl-7 text-sm text-[#757575] mt-0.5 font-normal">
          Taxa de envio: {parseFloat(product.deliveryFee || '0') === 0 ? 'GRÁTIS' : `R$ ${parseFloat(product.deliveryFee || '0').toFixed(2).replace('.', ',')}`}
        </div>
      </div>
      
    </div>
  );
}
