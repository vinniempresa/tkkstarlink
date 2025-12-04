import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from "@tanstack/react-query";
import { getDeliveryDateRange } from '@/utils/deliveryDate';
import TikTokLoader from '@/components/TikTokLoader';
import type { Product, ProductVariant } from "@shared/schema";

declare global {
  interface Window {
    ttq: any;
  }
}

interface PersonalizationData {
  size: string | null;
  personalizationType: 'none' | 'player' | 'custom';
  playerName?: string;
  playerNumber?: string;
  customName?: string;
  customNumber?: string;
}

const SIZE_LABELS: Record<string, string> = {
  'XS': 'PP',
  'S': 'P',
  'M': 'M',
  'L': 'G',
  'XL': 'GG',
  '2XL': 'XGG',
  '3XL': 'XXGG',
};

// Componente interno que contém TODOS os hooks - sempre executa na mesma ordem
function CheckoutContent({ product, selectedVariant, couponApplied, setLocation, personalizationData }: { 
  product: Product; 
  selectedVariant: ProductVariant | null;
  couponApplied: boolean;
  setLocation: (path: string) => void;
  personalizationData: PersonalizationData;
}) {
  // TODOS os hooks agora estão aqui - sempre executam na mesma ordem
  const [showLoader, setShowLoader] = useState(true);
  const [address, setAddress] = useState({
    cep: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: ''
  });
  const [fiscalData, setFiscalData] = useState({
    nome: '',
    telefone: '',
    cpf: ''
  });
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [timeLeft, setTimeLeft] = useState(6 * 3600 + 46 * 60 + 32);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Cálculos de preço
  const productPrice = parseFloat(product.price);
  const shippingPrice = product.deliveryFee ? parseFloat(product.deliveryFee) : 9.90;
  const couponDiscountPercent = product.couponDiscount ?? 10;
  const discount = couponApplied ? productPrice * (couponDiscountPercent / 100) : 0;
  const finalProductPrice = productPrice - discount;
  const total = finalProductPrice + shippingPrice;
  const oldPrice = product.originalPrice ? parseFloat(product.originalPrice) : productPrice * 2;
  const savings = oldPrice - total;
  const deliveryRange = getDeliveryDateRange();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });

    const loaderTimer = setTimeout(() => {
      setShowLoader(false);
    }, 3000);

    setTimeLeft(6 * 3600 + 46 * 60 + 32);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(loaderTimer);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // TikTok Pixel - InitiateCheckout Event
  useEffect(() => {
    const checkoutKey = `ttq_checkout_${product.id}`;
    const hasTracked = sessionStorage.getItem(checkoutKey);

    if (hasTracked) {
      console.log('✅ InitiateCheckout já rastreado nesta sessão');
      return;
    }

    const trackInitiateCheckout = () => {
      if (window.ttq && window.ttq.track) {
        try {
          window.ttq.track('InitiateCheckout', {
            content_type: 'product',
            content_id: product.id,
            content_name: product.name,
            currency: 'BRL',
            value: total
          });
          sessionStorage.setItem(checkoutKey, 'true');
          console.log('🎯 TikTok InitiateCheckout Event disparado:', product.name, 'R$', total.toFixed(2));
        } catch (error) {
          console.error('❌ Erro ao disparar InitiateCheckout:', error);
        }
      }
    };

    const timer = setTimeout(trackInitiateCheckout, 1000);
    return () => clearTimeout(timer);
  }, [product, total]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) {
      return numbers;
    }
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCep(e.target.value);
    setAddress({ ...address, cep: formatted });

    const numbers = formatted.replace(/\D/g, '');
    if (numbers.length === 8) {
      setIsLoadingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${numbers}/json/`);
        const data = await response.json();
        
        if (response.ok && !data.erro) {
          setAddress({
            ...address,
            cep: formatted,
            rua: data.logradouro || '',
            bairro: data.bairro || '',
            cidade: data.localidade || '',
            estado: data.uf || ''
          });
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      } finally {
        setIsLoadingCep(false);
      }
    }
  };

  const formatTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
  };

  const generateRandomEmail = (name: string) => {
    const randomNum = Math.floor(Math.random() * 10000);
    const cleanName = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '');
    return `${cleanName}${randomNum}@cliente.com`;
  };

  const handleFazerPedido = async () => {
    if (!fiscalData.nome || !fiscalData.telefone || !fiscalData.cpf) {
      alert('Por favor, preencha todos os dados pessoais.');
      return;
    }

    if (!address.cep || !address.rua || !address.numero || !address.cidade || !address.estado) {
      alert('Por favor, preencha todos os dados de endereço.');
      return;
    }

    setIsProcessingPayment(true);

    try {
      const randomEmail = generateRandomEmail(fiscalData.nome);

      const description = selectedVariant 
        ? `${product.name} - ${selectedVariant.name}` 
        : product.name;

      const paymentData = {
        amount: total.toFixed(2),
        customer_name: fiscalData.nome,
        customer_email: randomEmail,
        customer_cpf: fiscalData.cpf.replace(/\D/g, ''),
        customer_phone: fiscalData.telefone.replace(/\D/g, ''),
        description: description,
        address: {
          cep: address.cep.replace(/\D/g, ''),
          street: address.rua,
          number: address.numero,
          neighborhood: address.bairro || 'Centro',
          city: address.cidade,
          state: address.estado
        }
      };

      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error?.message || 'Erro ao criar pagamento');
      }

      const transaction = responseData.data || responseData;
      const transactionId = transaction.transaction_id || transaction.id;
      
      if (!transactionId) {
        throw new Error('ID da transação não encontrado na resposta');
      }
      
      // Gerar descrição da variante com tamanho e personalização
      const getVariantDescription = () => {
        const parts: string[] = [];
        
        if (personalizationData.size) {
          parts.push(`Tamanho: ${SIZE_LABELS[personalizationData.size] || personalizationData.size}`);
        }
        
        if (personalizationData.personalizationType === 'player' && personalizationData.playerName) {
          parts.push(`${personalizationData.playerName} - ${personalizationData.playerNumber}`);
        } else if (personalizationData.personalizationType === 'custom') {
          const customParts: string[] = [];
          if (personalizationData.customName) customParts.push(personalizationData.customName);
          if (personalizationData.customNumber) customParts.push(personalizationData.customNumber);
          if (customParts.length > 0) {
            parts.push(customParts.join(' - '));
          }
        }
        
        return parts.length > 0 ? parts.join(' | ') : 'PADRÃO';
      };

      const paymentStorageKey = `payment_${transactionId}`;
      localStorage.setItem(paymentStorageKey, JSON.stringify({
        ...transaction,
        amount: total.toFixed(2),
        correctAmount: total.toFixed(2),
        productId: product.id,
        productName: product.name,
        productImage: selectedVariant?.image || product.mainImage,
        variantId: selectedVariant?.id,
        variantName: getVariantDescription(),
        personalization: personalizationData
      }));
      
      localStorage.setItem('customerData', JSON.stringify({
        nome: fiscalData.nome,
        cpf: fiscalData.cpf.replace(/\D/g, ''),
        email: randomEmail,
        telefone: fiscalData.telefone.replace(/\D/g, '')
      }));
      
      localStorage.setItem('customerAddress', JSON.stringify({
        cep: address.cep,
        rua: address.rua,
        numero: address.numero,
        bairro: address.bairro,
        cidade: address.cidade,
        estado: address.estado
      }));
      
      window.location.href = `/oferta/pagamento?id=${transactionId}`;

    } catch (error: any) {
      console.error('Erro ao processar pagamento:', error);
      alert(`Erro ao processar pagamento: ${error.message || 'Tente novamente.'}`);
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="bg-white text-black min-h-screen w-full">
      {showLoader && <TikTokLoader />}
      
      <div className="bg-white px-4 pt-6 pb-4">
        <img 
          src="https://freepnglogo.com/images/all_img/1714299248tiktok-shop-logo-png-transparent.png"
          alt="TikTok Shop"
          className="h-12 mx-auto object-contain"
        />
      </div>

      <div className="bg-[#F2F2F2] px-4 py-3 flex items-center justify-center">
        <span className="text-base font-semibold text-black">
          Endereço de Entrega
        </span>
      </div>

      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-start">
          <img 
            src={selectedVariant?.image || product.mainImage}
            alt={selectedVariant?.name || product.name}
            className="w-24 h-24 object-contain mr-3"
          />
          <div className="flex-1">
            <h3 className="text-sm font-normal mb-1 uppercase">{product.name}</h3>
            <p className="text-xs text-gray-500 mb-2 font-normal">
              {(() => {
                const parts: string[] = [];
                
                // Adicionar tamanho
                if (personalizationData.size) {
                  parts.push(`Tamanho: ${SIZE_LABELS[personalizationData.size] || personalizationData.size}`);
                }
                
                // Adicionar personalização
                if (personalizationData.personalizationType === 'player' && personalizationData.playerName) {
                  parts.push(`${personalizationData.playerName} - ${personalizationData.playerNumber}`);
                } else if (personalizationData.personalizationType === 'custom') {
                  const customParts: string[] = [];
                  if (personalizationData.customName) customParts.push(personalizationData.customName);
                  if (personalizationData.customNumber) customParts.push(personalizationData.customNumber);
                  if (customParts.length > 0) {
                    parts.push(customParts.join(' - '));
                  }
                }
                
                return parts.length > 0 ? parts.join(' | ') : 'PADRÃO';
              })()}
            </p>
            <div className="flex items-baseline">
              <span className="text-lg font-semibold text-[#F52B56] mr-2">
                R$ {finalProductPrice.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-xs text-gray-400 line-through mr-1 font-normal">R$ {oldPrice.toFixed(2).replace('.', ',')}</span>
              <span className="text-xs text-[#F52B56] font-normal">
                -{Math.round((1 - finalProductPrice/oldPrice) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex flex-col">
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
            Taxa de envio: GRÁTIS
          </div>
        </div>
      </div>

      {couponApplied && (
        <div className="px-4 py-3 border-b border-gray-200 bg-[#FFF9E6]">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <i className="fas fa-ticket-alt text-[#F52B56] mr-2"></i>
              <span className="text-sm font-normal">Desconto de 10%</span>
            </div>
            <span className="text-sm text-[#F52B56] font-normal">- R$ {discount.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>
      )}

      <div className="px-4 py-4">
        <div className="mb-4">
          <h3 className="text-base font-semibold mb-3">Dados pessoais para nota fiscal</h3>
          
          <div className="mb-3">
            <label className="block text-sm font-normal mb-1">Nome</label>
            <input 
              type="text"
              value={fiscalData.nome}
              onChange={(e) => setFiscalData({ ...fiscalData, nome: e.target.value })}
              placeholder="Digite seu nome"
              className="w-full border border-gray-300 rounded px-3 py-2.5 text-base focus:outline-none focus:border-[#F52B56] focus:ring-1 focus:ring-[#F52B56]"
              style={{ fontSize: '16px' }}
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-normal mb-1">CPF</label>
            <input 
              type="tel"
              inputMode="numeric"
              value={fiscalData.cpf}
              onChange={(e) => setFiscalData({ ...fiscalData, cpf: formatCPF(e.target.value) })}
              placeholder="000.000.000-00"
              maxLength={14}
              className="w-full border border-gray-300 rounded px-3 py-2.5 text-base focus:outline-none focus:border-[#F52B56] focus:ring-1 focus:ring-[#F52B56]"
              style={{ fontSize: '16px' }}
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-normal mb-1">Telefone</label>
            <input 
              type="tel"
              inputMode="tel"
              value={fiscalData.telefone}
              onChange={(e) => setFiscalData({ ...fiscalData, telefone: formatTelefone(e.target.value) })}
              placeholder="(00) 00000-0000"
              maxLength={15}
              className="w-full border border-gray-300 rounded px-3 py-2.5 text-base focus:outline-none focus:border-[#F52B56] focus:ring-1 focus:ring-[#F52B56]"
              style={{ fontSize: '16px' }}
            />
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-base font-semibold mb-3">Endereço de entrega</h3>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm font-normal mb-1">CEP</label>
              <input 
                type="tel"
                inputMode="numeric"
                value={address.cep}
                onChange={handleCepChange}
                placeholder="00000-000"
                maxLength={9}
                className="w-full border border-gray-300 rounded px-3 py-2.5 text-base focus:outline-none focus:border-[#F52B56] focus:ring-1 focus:ring-[#F52B56]"
                style={{ fontSize: '16px' }}
              />
            </div>
            <div>
              <label className="block text-sm font-normal mb-1">Cidade</label>
              <input 
                type="text"
                value={address.cidade}
                onChange={(e) => setAddress({ ...address, cidade: e.target.value })}
                placeholder=""
                className="w-full border border-gray-300 rounded px-3 py-2.5 text-base focus:outline-none focus:border-[#F52B56] focus:ring-1 focus:ring-[#F52B56]"
                style={{ fontSize: '16px' }}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-normal mb-1">Rua</label>
            <input 
              type="text"
              value={address.rua}
              onChange={(e) => setAddress({ ...address, rua: e.target.value })}
              placeholder=""
              className="w-full border border-gray-300 rounded px-3 py-2.5 text-base focus:outline-none focus:border-[#F52B56] focus:ring-1 focus:ring-[#F52B56]"
              style={{ fontSize: '16px' }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm font-normal mb-1">Número</label>
              <input 
                type="text"
                value={address.numero}
                onChange={(e) => setAddress({ ...address, numero: e.target.value })}
                placeholder=""
                className="w-full border border-gray-300 rounded px-3 py-2.5 text-base focus:outline-none focus:border-[#F52B56] focus:ring-1 focus:ring-[#F52B56]"
                style={{ fontSize: '16px' }}
              />
            </div>
            <div>
              <label className="block text-sm font-normal mb-1">Bairro</label>
              <input 
                type="text"
                value={address.bairro}
                onChange={(e) => setAddress({ ...address, bairro: e.target.value })}
                placeholder=""
                className="w-full border border-gray-300 rounded px-3 py-2.5 text-base focus:outline-none focus:border-[#F52B56] focus:ring-1 focus:ring-[#F52B56]"
                style={{ fontSize: '16px' }}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-normal mb-1">UF</label>
            <input 
              type="text"
              value={address.estado}
              onChange={(e) => setAddress({ ...address, estado: e.target.value.toUpperCase() })}
              placeholder="SP"
              maxLength={2}
              className="w-full border border-gray-300 rounded px-3 py-2.5 text-base uppercase focus:outline-none focus:border-[#F52B56] focus:ring-1 focus:ring-[#F52B56]"
              style={{ fontSize: '16px' }}
            />
          </div>
        </div>
      </div>

      <div className="px-4 py-4 border-t-8 border-gray-100">
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Produto</span>
            <span className="text-sm font-medium">R$ {finalProductPrice.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Frete</span>
            <span className="text-sm font-medium">R$ {shippingPrice.toFixed(2).replace('.', ',')}</span>
          </div>
          {couponApplied && (
            <div className="flex justify-between mb-2">
              <span className="text-sm text-[#F52B56]">Desconto</span>
              <span className="text-sm text-[#F52B56] font-medium">- R$ {discount.toFixed(2).replace('.', ',')}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t border-gray-200">
            <span className="text-base font-semibold">Total</span>
            <span className="text-lg font-semibold text-[#F52B56]">R$ {total.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="text-right mt-1">
            <span className="text-xs text-gray-500">Você economiza R$ {savings.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>

        <button
          onClick={handleFazerPedido}
          disabled={isProcessingPayment}
          className="w-full bg-[#F52B56] text-white font-semibold text-base rounded-lg py-3.5 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessingPayment ? 'Processando...' : 'Fazer pedido'}
        </button>
      </div>

      <div className="bg-black px-4 py-6 text-white">
        <div className="flex items-center justify-center mb-3">
          <img 
            src="https://freepnglogo.com/images/all_img/1714299248tiktok-shop-logo-png-transparent.png"
            alt="TikTok Shop"
            className="h-6 object-contain brightness-0 invert"
          />
        </div>
        <div className="text-center text-gray-500 font-normal leading-tight">
          <p className="mb-0.5" style={{ fontSize: '12px' }}>© 2025 TikTok Shop. Todos os direitos reservados.</p>
          <p style={{ fontSize: '12px' }}>Compra segura e protegida</p>
        </div>
      </div>
    </div>
  );
}

// Componente wrapper - apenas useQuery e renderização condicional
export default function CheckoutPage() {
  const [, setLocation] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const couponApplied = params.get('cupom') === 'true';
  const productId = params.get('productId');
  const variantId = params.get('variantId');

  // Extrair dados de personalização da URL
  const personalizationData: PersonalizationData = {
    size: params.get('size'),
    personalizationType: (params.get('personalizationType') as 'none' | 'player' | 'custom') || 'none',
    playerName: params.get('playerName') || undefined,
    playerNumber: params.get('playerNumber') || undefined,
    customName: params.get('customName') || undefined,
    customNumber: params.get('customNumber') || undefined,
  };

  // APENAS useQuery aqui - sem outros hooks
  const { data: product, isLoading: productLoading } = useQuery<Product & { variants?: ProductVariant[] }>({
    queryKey: productId ? [`/api/products/${productId}`] : ['/api/products'],
    select: (data: any) => {
      return productId ? data : (Array.isArray(data) ? data[0] : data);
    }
  });

  // Encontrar a variante selecionada, se houver
  const selectedVariant = (product?.variants && variantId) 
    ? product.variants.find(v => v.id === variantId) || null
    : null;

  // Loading state
  if (productLoading) {
    return (
      <div className="bg-white min-h-screen">
        <TikTokLoader />
      </div>
    );
  }

  // Error state
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

  // Render CheckoutContent apenas quando produto está carregado
  return <CheckoutContent product={product} selectedVariant={selectedVariant} couponApplied={couponApplied} setLocation={setLocation} personalizationData={personalizationData} />;
}
