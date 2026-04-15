import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from "@tanstack/react-query";
import ImageCarousel from '@/components/ImageCarousel';
import PriceSection from '@/components/PriceSection';
import OffersSection from '@/components/OffersSection';
import ReviewsSection from '@/components/ReviewsSection';
import DescriptionSection from '@/components/DescriptionSection';
import TikTokLoader from '@/components/TikTokLoader';
import type { Product, Review, Store } from "@shared/schema";

declare global {
  interface Window {
    ttq: any;
  }
}

export default function ProductPage() {
  const [, setLocation] = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [showCouponMessage, setShowCouponMessage] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(12 * 60 + 22); // 12:22 em segundos
  const [showLoader, setShowLoader] = useState(true);
  // Buscar o primeiro produto do banco
  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const product = products?.[0];

  // Buscar reviews do produto
  const { data: reviews = [], isLoading: reviewsLoading } = useQuery<Review[]>({
    queryKey: ["/api/products", product?.id, "reviews"],
    enabled: !!product?.id,
    queryFn: async () => {
      const response = await fetch(`/api/products/${product?.id}/reviews`);
      if (!response.ok) throw new Error('Falha ao carregar reviews');
      return response.json();
    }
  });

  // Buscar store
  const { data: store } = useQuery<Store>({
    queryKey: ["/api/stores", product?.storeId],
    enabled: !!product?.storeId,
    queryFn: async () => {
      const response = await fetch(`/api/stores/${product?.storeId}`);
      if (!response.ok) throw new Error('Falha ao carregar loja');
      return response.json();
    }
  });

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
    
    // Esconde o loader após 3 segundos
    const loaderTimer = setTimeout(() => {
      setShowLoader(false);
    }, 3000);
    
    return () => clearTimeout(loaderTimer);
  }, []);

  // TikTok Pixel - ViewContent Event
  useEffect(() => {
    if (!product) return;

    const viewContentKey = `ttq_view_${product.id}`;
    const hasTracked = sessionStorage.getItem(viewContentKey);

    if (hasTracked) {
      console.log('✅ ViewContent já rastreado nesta sessão');
      return;
    }

    const trackViewContent = () => {
      if (window.ttq && window.ttq.track) {
        try {
          window.ttq.track('ViewContent', {
            content_type: 'product',
            content_id: product.id,
            content_name: product.name,
            currency: 'BRL',
            value: parseFloat(product.price)
          });
          sessionStorage.setItem(viewContentKey, 'true');
          console.log('🎯 TikTok ViewContent Event disparado:', product.name, 'R$', product.price);
        } catch (error) {
          console.error('❌ Erro ao disparar ViewContent:', error);
        }
      }
    };

    // Aguarda 1 segundo para garantir que o pixel foi carregado
    const timer = setTimeout(trackViewContent, 1000);
    return () => clearTimeout(timer);
  }, [product]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleApplyCoupon = () => {
    setCouponApplied(true);
    setShowCouponMessage(true);
    setTimeout(() => {
      setShowCouponMessage(false);
    }, 2000);
  };

  const handleGoToCheckout = () => {
    window.scrollTo(0, 0);
    const params = new URLSearchParams();
    params.set('productId', product?.id || '');
    if (couponApplied) params.set('cupom', 'true');
    setLocation(`/oferta/checkout?${params.toString()}`);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!product) {
    return (
      <div className="bg-white min-h-screen">
        <TikTokLoader />
      </div>
    );
  }

  const images = product.images.map((img, idx) => ({
    src: img,
    alt: `${product.name} - Imagem ${idx + 1}`
  }));

  return (
    <div className="bg-white text-black min-h-screen overflow-hidden relative">
      {/* Loader TikTok */}
      {showLoader && <TikTokLoader />}
      
      {/* Header - fixo */}
      <div className="fixed top-0 left-0 w-full z-30 bg-white flex items-center justify-between px-3 pt-3 pb-2">
        <div className="flex items-center space-x-3">
        </div>
        <div className="flex items-center space-x-5">
          <img 
            src="https://i.ibb.co/wNscKnC6/Captura-de-Tela-2025-10-11-a-s-15-49-56.png" 
            alt="Barra de ícones de ação: compartilhar, carrinho e menu, estilizados em fundo branco" 
            className="w-24 h-7 object-contain"
          />
        </div>
      </div>

      {/* Floating Action Bar - fixo */}
      <div className="fixed left-0 bottom-0 w-full bg-white flex items-center justify-between px-4 py-2 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
        <img 
          src="https://i.ibb.co/Vcm4Fzxk/IMG-7588.jpg"
          alt="Botão de ação lateral"
          className="h-12 object-contain cursor-pointer"
          onClick={handleGoToCheckout}
          data-testid="button-side-action"
        />
        <button 
          onClick={handleGoToCheckout}
          className="bg-[#F52B56] text-white font-semibold shadow-sm h-12 flex-1 ml-3 flex flex-col items-center justify-center"
          style={{ borderRadius: '6px', maxWidth: '280px' }}
          data-testid="button-buy-coupon"
        >
          <span className="text-base leading-tight">Comprar com cupom</span>
          <span className="text-[10px] font-normal leading-tight" style={{ color: '#FAC4CD' }}>
            Oferta acaba em: {formatTime(timeLeft)}
          </span>
        </button>
      </div>

      <div 
        className="transition-all duration-700 ease-out pb-20"
        style={{
          transform: isVisible ? 'translateY(0)' : 'translateY(100vh)',
          opacity: isVisible ? 1 : 0
        }}
      >
        {/* Main Image Carousel */}
        <ImageCarousel images={images} />

        {/* Price and Title */}
        <PriceSection product={product} store={store} timeLeft={formatTime(timeLeft)} couponApplied={couponApplied} />

        {/* Separador */}
        <div className="border-t-8 border-gray-100"></div>

        {/* Banner institucional */}
        <div className="w-full">
          <img 
            src="https://i.ibb.co/KjxGK14n/IMG-7372-1.jpg" 
            alt="Banner promocional ou institucional da loja" 
            className="w-full object-cover"
          />
        </div>

        {/* Ofertas */}
        <OffersSection onApplyCoupon={handleApplyCoupon} couponApplied={couponApplied} />

        {/* Avaliações */}
        <ReviewsSection reviews={reviews} product={product} store={store} isLoading={reviewsLoading} />

        {/* Descrição */}
        <DescriptionSection product={product} />
      </div>

      {/* Mensagem de cupom aplicado - Melhorada */}
      {showCouponMessage && (
        <div 
          className="fixed top-20 left-0 right-0 mx-auto bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 text-center animate-in fade-in slide-in-from-top-5 duration-300"
          style={{ 
            maxWidth: '380px', 
            width: 'calc(100% - 32px)',
            animation: 'slideInBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
          }}
        >
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
              <i className="fas fa-check text-lg"></i>
            </div>
            <div className="flex flex-col items-start">
              <span className="font-bold text-base">Cupom Aplicado!</span>
              <span className="text-xs text-white/90">10% de desconto em seu pedido</span>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes slideInBounce {
          0% {
            transform: translateY(-100px);
            opacity: 0;
          }
          60% {
            transform: translateY(10px);
            opacity: 1;
          }
          80% {
            transform: translateY(-5px);
          }
          100% {
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Floating Up Button */}
      <button 
        onClick={scrollToTop}
        className="fixed bottom-24 right-4 bg-white border border-[#e0e0e0] shadow-lg rounded-full w-10 h-10 flex items-center justify-center z-50"
      >
        <i className="fas fa-arrow-up text-xl text-[#757575]"></i>
      </button>
    </div>
  );
}
