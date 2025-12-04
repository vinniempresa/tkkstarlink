import { useState, useEffect, useCallback } from 'react';
import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import ImageCarousel from '../components/ImageCarousel';
import PriceSection from '../components/PriceSection';
import PersonalizationSection from '../components/PersonalizationSection';
import OffersSection from '../components/OffersSection';
import ReviewsSection from '../components/ReviewsSection';
import DescriptionSection from '../components/DescriptionSection';
import TikTokLoader from '../components/TikTokLoader';
import ProductVariantSelector from '../components/ProductVariantSelector';
import type { Product, ProductVariant } from "@shared/schema";

export default function ProductView() {
  const [, params] = useRoute("/product/:id");
  const [, setLocation] = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [showCouponMessage, setShowCouponMessage] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(12 * 60 + 22); // 12:22 em segundos
  const [showLoader, setShowLoader] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  const { data: product, isLoading } = useQuery<Product & { variants?: ProductVariant[] }>({
    queryKey: ["/api/products", params?.id],
    enabled: !!params?.id,
    queryFn: async () => {
      const response = await fetch(`/api/products/${params?.id}`);
      if (!response.ok) {
        throw new Error('Produto não encontrado');
      }
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
    // Passar productId, cupom e variantId para o checkout
    const variantParam = selectedVariant ? `&variantId=${selectedVariant.id}` : '';
    const queryParams = couponApplied 
      ? `?cupom=true&productId=${params?.id}${variantParam}` 
      : `?productId=${params?.id}${variantParam}`;
    setLocation(`/checkout${queryParams}`);
  };

  const handleVariantSelect = useCallback((variant: ProductVariant) => {
    setSelectedVariant(variant);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Mostrar loader se produto ainda está carregando
  if (isLoading) {
    return (
      <div className="bg-white min-h-screen">
        <TikTokLoader />
      </div>
    );
  }

  // Se produto não foi encontrado após carregar, mostrar mensagem de erro
  if (!product) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Produto não encontrado</h2>
          <p className="text-gray-600 mb-4">O produto que você está procurando não existe.</p>
          <button
            onClick={() => setLocation('/')}
            className="bg-[#F52B56] text-white px-6 py-2 rounded-lg"
          >
            Voltar para a página inicial
          </button>
        </div>
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
        <PriceSection product={product} timeLeft={formatTime(timeLeft)} couponApplied={couponApplied} />

        {/* Variantes - exibe apenas se houver mais de 1 */}
        {product.variants && product.variants.length > 1 && (
          <ProductVariantSelector 
            variants={product.variants}
            onVariantSelect={handleVariantSelect}
          />
        )}

        {/* Separador */}
        <div className="border-t-8 border-gray-100"></div>

        {/* Personalização e Tamanhos */}
        <PersonalizationSection />

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
        <ReviewsSection reviews={[]} product={product} />

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
