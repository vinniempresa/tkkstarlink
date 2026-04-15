import { useState } from 'react';
import { BadgeCheck } from 'lucide-react';
import type { Review, Product, Store } from "@shared/schema";

interface ReviewsSectionProps {
  reviews: Review[];
  product: Product;
  store?: Store;
  isLoading?: boolean;
}

export default function ReviewsSection({ reviews, product, store, isLoading }: ReviewsSectionProps) {
  const [isFollowing, setIsFollowing] = useState(false);

  if (!product) {
    return null;
  }

  const rating = parseFloat(product.rating || '0');
  const reviewsCount = product.reviewsCount || 0;

  if (isLoading) {
    return (
      <div className="px-4 py-3 w-full">
        <div className="text-base font-bold mb-2 text-black">
          Carregando avaliações...
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 w-full">
      <div className="text-base font-bold mb-2 text-black">
        Avaliações dos clientes ({reviewsCount})
      </div>
      
      <div className="flex items-center mb-3">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-[#ffb400] text-base">
            <i className={`fas fa-star${i < Math.floor(rating) ? '' : i === Math.floor(rating) && rating % 1 >= 0.5 ? '-half-alt' : ''}`} style={{ opacity: i < Math.floor(rating) || (i === Math.floor(rating) && rating % 1 >= 0.5) ? 1 : 0.3 }}></i>
          </span>
        ))}
        <span className="ml-2 text-black text-sm font-normal">
          {rating.toFixed(1)}
        </span>
        <span className="ml-2 text-[#757575] text-sm font-normal">
          /5
        </span>
      </div>
      
      {reviews.map((review, index) => (
        <div key={review.id || index} className="mb-4">
          <div className="flex items-center text-sm text-black mb-2 font-bold">
            <span className="mr-2">
              {review.customerName}
            </span>
          </div>
          
          <div className="flex items-center mb-1">
            {[...Array(5)].map((_, i) => {
              const fullStars = Math.floor(review.rating);
              const hasHalfStar = review.rating % 1 >= 0.5;
              let iconClass = 'far fa-star';
              if (i < fullStars) {
                iconClass = 'fas fa-star';
              } else if (i === fullStars && hasHalfStar) {
                iconClass = 'fas fa-star-half-alt';
              }
              return (
                <span key={i} className="text-[#ffb400] text-sm">
                  <i className={iconClass}></i>
                </span>
              );
            })}
          </div>
          
          <div className="text-sm text-[#757575] mb-1 font-normal">
            Item: Starlink Mini
          </div>
          
          <div className="text-sm text-black mb-2 font-normal">
            {review.comment}
          </div>
          
          {review.image && (
            <div className="flex space-x-2 mb-2">
              <img 
                alt={`Avaliação de ${review.customerName}`}
                className="w-20 h-20 rounded object-cover border border-[#e0e0e0]" 
                height="80" 
                src={review.image}
                width="80"
              />
            </div>
          )}
        </div>
      ))}

      {reviews.length === 0 && (
        <div className="text-sm text-[#757575] mb-4">
          Nenhuma avaliação ainda.
        </div>
      )}

      {/* Separador */}
      <div className="border-t-8 border-gray-100 my-4"></div>

      {/* Avaliações da Loja */}
      {store && (
        <>
          <div className="mb-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-black">
                Avaliações da loja ({store.reviewsCount})
              </h3>
              <i className="fas fa-chevron-right text-gray-400 text-sm"></i>
            </div>

            <div className="flex gap-2 mb-4">
              <span className="bg-gray-100 text-black text-xs font-normal px-2.5 py-1 rounded">
                Embalagem de qualidade (1)
              </span>
              <span className="bg-gray-100 text-black text-xs font-normal px-2.5 py-1 rounded">
                Ótimo valor (1)
              </span>
            </div>
          </div>

          {/* Separador */}
          <div className="border-t-8 border-gray-100 mb-4"></div>

          {/* Info da Loja */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {store.logo && (
                <img 
                  src={store.logo}
                  alt={`Logo ${store.name}`}
                  className="w-12 h-12 rounded-full object-cover mr-3"
                />
              )}
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  <h4 className="text-sm font-bold text-black">
                    {store.name}
                  </h4>
                  <BadgeCheck className="w-4 h-4 text-white fill-[#3B82F6]" />
                </div>
                <p className="text-xs text-gray-500">
                  {store.salesCount} vendido(s)
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsFollowing(!isFollowing)}
              className={`
                ${isFollowing ? 'bg-gray-200' : 'bg-[#F52B56]'} 
                ${isFollowing ? 'text-gray-600' : 'text-white'} 
                font-semibold text-xs px-5 py-1.5 rounded-md
                transition-all duration-300 ease-out
                ${isFollowing ? '' : 'hover:bg-[#E01E46]'}
              `}
              data-testid="button-follow-store"
            >
              {isFollowing ? 'Seguindo' : 'Seguir'}
            </button>
          </div>

          {/* Separador */}
          <div className="border-t-8 border-gray-100 mt-4"></div>
        </>
      )}
    </div>
  );
}
