import { useState } from 'react';
import { BadgeCheck, X } from 'lucide-react';
import type { Review, Product, Store } from "@shared/schema";

interface ReviewsSectionProps {
  reviews: Review[];
  product: Product;
  store?: Store;
  isLoading?: boolean;
}

interface LightboxReview {
  image: string;
  customerName: string;
  rating: number;
  comment: string;
}

function StarRow({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'base' }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => {
        let cls = 'far fa-star';
        if (i < fullStars) cls = 'fas fa-star';
        else if (i === fullStars && hasHalf) cls = 'fas fa-star-half-alt';
        return (
          <span key={i} className={`text-[#ffb400] text-${size}`}>
            <i className={cls}></i>
          </span>
        );
      })}
    </div>
  );
}

export default function ReviewsSection({ reviews, product, store, isLoading }: ReviewsSectionProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [lightbox, setLightbox] = useState<LightboxReview | null>(null);

  if (!product) return null;

  const rating = parseFloat(product.rating || '0');
  const reviewsCount = product.reviewsCount || 0;

  if (isLoading) {
    return (
      <div className="px-4 py-3 w-full">
        <div className="text-base font-bold mb-2 text-black">Carregando avaliações...</div>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 w-full">
      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black"
          onClick={() => setLightbox(null)}
        >
          {/* Botão fechar */}
          <button
            className="absolute top-4 right-4 z-60 w-9 h-9 flex items-center justify-center bg-black/60 rounded-full"
            onClick={() => setLightbox(null)}
            data-testid="button-close-lightbox"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Imagem */}
          <div
            className="flex-1 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox.image}
              alt={`Avaliação de ${lightbox.customerName}`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>

          {/* Informações da review */}
          <div
            className="bg-white rounded-t-2xl px-5 py-4 safe-area-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-bold text-black">{lightbox.customerName}</span>
            </div>
            <div className="mb-2">
              <StarRow rating={lightbox.rating} size="sm" />
            </div>
            <p className="text-xs text-[#757575] mb-1">Item: Starlink Mini</p>
            <p className="text-sm text-black font-normal">{lightbox.comment}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-base font-bold mb-2 text-black">
        Avaliações dos clientes ({reviewsCount})
      </div>

      {/* Nota geral */}
      <div className="flex items-center mb-3">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-[#ffb400] text-base">
            <i
              className={`fas fa-star${i < Math.floor(rating) ? '' : i === Math.floor(rating) && rating % 1 >= 0.5 ? '-half-alt' : ''}`}
              style={{ opacity: i < Math.floor(rating) || (i === Math.floor(rating) && rating % 1 >= 0.5) ? 1 : 0.3 }}
            ></i>
          </span>
        ))}
        <span className="ml-2 text-black text-sm font-normal">{rating.toFixed(1)}</span>
        <span className="ml-2 text-[#757575] text-sm font-normal">/5</span>
      </div>

      {/* Lista de reviews */}
      {reviews.map((review, index) => (
        <div key={review.id || index} className="mb-4">
          <div className="flex items-center text-sm text-black mb-2 font-bold">
            <span className="mr-2">{review.customerName}</span>
          </div>

          <div className="flex items-center mb-1">
            <StarRow rating={review.rating} size="sm" />
          </div>

          <div className="text-sm text-[#757575] mb-1 font-normal">Item: Starlink Mini</div>

          <div className="text-sm text-black mb-2 font-normal">{review.comment}</div>

          {review.image && (
            <div className="flex space-x-2 mb-2">
              <button
                onClick={() => setLightbox({
                  image: review.image!,
                  customerName: review.customerName,
                  rating: review.rating,
                  comment: review.comment,
                })}
                className="focus:outline-none"
                data-testid={`button-review-image-${review.id || index}`}
              >
                <img
                  alt={`Avaliação de ${review.customerName}`}
                  className="w-20 h-20 rounded object-cover border border-[#e0e0e0] active:opacity-80 transition-opacity"
                  src={review.image}
                />
              </button>
            </div>
          )}
        </div>
      ))}

      {reviews.length === 0 && (
        <div className="text-sm text-[#757575] mb-4">Nenhuma avaliação ainda.</div>
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

          <div className="border-t-8 border-gray-100 mb-4"></div>

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
                  <h4 className="text-sm font-bold text-black">{store.name}</h4>
                  <BadgeCheck className="w-4 h-4 text-white fill-[#3B82F6]" />
                </div>
                <p className="text-xs text-gray-500">{store.salesCount} vendido(s)</p>
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

          <div className="border-t-8 border-gray-100 mt-4"></div>
        </>
      )}
    </div>
  );
}
