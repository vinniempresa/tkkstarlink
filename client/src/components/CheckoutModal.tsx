import { useState, useEffect, useRef } from 'react';
import { getDeliveryDateRange } from '@/utils/deliveryDate';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  couponApplied: boolean;
}

interface Address {
  cep: string;
  rua: string;
  numero: string;
  cidade: string;
  estado: string;
}

interface FiscalData {
  nome: string;
  telefone: string;
  cpf: string;
}

export default function CheckoutModal({ isOpen, onClose, couponApplied }: CheckoutModalProps) {
  // Cálculos de preço
  const productPrice = 149.90;
  const shippingPrice = 9.90;
  const discount = couponApplied ? productPrice * 0.10 : 0;
  const finalProductPrice = productPrice - discount;
  const total = finalProductPrice + shippingPrice;
  const oldPrice = 279.90;
  const savings = oldPrice - total;
  const deliveryRange = getDeliveryDateRange();
  const [isVisible, setIsVisible] = useState(false);
  const [address, setAddress] = useState<Address>({
    cep: '',
    rua: '',
    numero: '',
    cidade: '',
    estado: ''
  });
  const [fiscalData, setFiscalData] = useState<FiscalData>({
    nome: '',
    telefone: '',
    cpf: ''
  });
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [showFiscalData, setShowFiscalData] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // Timer de contagem regressiva
  const [timeLeft, setTimeLeft] = useState(6 * 3600 + 46 * 60 + 32); // 6:46:32 em segundos
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Reset do timer quando o modal abre
      setTimeLeft(6 * 3600 + 46 * 60 + 32);
      
      // Limpa timer anterior se existir
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Cria novo timer
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
    } else {
      // Limpa timer quando modal fecha
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 10);
      // Bloqueia scroll da página quando modal abre (mobile-friendly)
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restaura scroll da página quando modal fecha
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

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
        
        if (!data.erro) {
          setAddress({
            ...address,
            cep: formatted,
            rua: data.logradouro || '',
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
    // Remove acentos e caracteres especiais
    const cleanName = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos
      .replace(/[^a-z0-9]/g, ''); // Remove tudo que não é letra ou número
    return `${cleanName}${randomNum}@cliente.com`;
  };

  const handleFazerPedido = async () => {
    // Se ainda não preencheu dados fiscais, mostra o formulário
    if (!showFiscalData) {
      if (address.cep && address.rua && address.numero && address.cidade && address.estado) {
        setShowFiscalData(true);
      }
      return;
    }

    // Valida se todos os campos fiscais estão preenchidos
    if (!fiscalData.nome || !fiscalData.telefone || !fiscalData.cpf) {
      alert('Por favor, preencha todos os dados para continuar.');
      return;
    }

    setIsProcessingPayment(true);

    try {
      // Gera email aleatório
      const randomEmail = generateRandomEmail(fiscalData.nome);

      // Dados da transação
      const paymentData = {
        amount: total.toFixed(2), // API espera valor em REAIS como STRING (ex: "99.80")
        customer_name: fiscalData.nome,
        customer_email: randomEmail,
        customer_cpf: fiscalData.cpf.replace(/\D/g, ''),
        customer_phone: fiscalData.telefone.replace(/\D/g, ''),
        description: 'Buggy Controle remoto a Gasolina Com Bolsa Off Road 29cc'
      };

      // Cria transação via backend (evita CORS)
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
      
      // Redireciona para página de pagamento com os dados da transação
      window.location.href = `/oferta/pagamento?id=${transaction.transaction_id}`;

    } catch (error: any) {
      console.error('Erro ao processar pagamento:', error);
      console.error('Detalhes do erro:', error.message);
      alert(`Erro ao processar pagamento: ${error.message || 'Tente novamente.'}`);
      setIsProcessingPayment(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-hidden"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="fixed top-0 right-0 h-full bg-white z-50 transition-transform duration-300 ease-out overflow-y-auto overflow-x-hidden"
        style={{
          width: '100%',
          maxWidth: '428px',
          transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-3 py-2 flex items-center">
          <button onClick={onClose} className="mr-2">
            <i className="fas fa-chevron-left text-base"></i>
          </button>
          <h2 className="text-sm font-semibold flex-1">Resumo do pedido</h2>
        </div>

        {/* Produto */}
        <div className="px-3 py-2 flex items-start border-b border-gray-200">
          <img 
            src="https://ae-pic-a1.aliexpress-media.com/kf/S964945ee819e41c68c769ba1eccbc8981.jpg_640x640q75.jpg_.avif"
            alt="Buggy controle remoto a gasolina"
            className="w-20 h-20 object-contain mr-2"
          />
          <div className="flex-1">
            <h3 className="text-xs font-normal mb-0.5">
              Buggy Controle remoto a Gasolina Com Bolsa...
            </h3>
            <p className="text-[10px] text-gray-500 mb-1">VERMELHO</p>
            <div className="flex items-center text-[10px] mb-1" style={{ color: '#8B6914' }}>
              <span className="mr-1 text-xs">📦</span>
              <span>Devolução gratuita</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-baseline">
                <span className="text-sm font-semibold text-[#F52B56] mr-1.5">
                  R$ {finalProductPrice.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-[10px] text-gray-400 line-through mr-1">R$ 179,90</span>
                <span className="text-[10px] text-[#F52B56]">
                  -{Math.round((1 - finalProductPrice/oldPrice) * 100)}%
                </span>
              </div>
              <div className="flex items-center">
                <button className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center">
                  <i className="fas fa-minus text-[8px]"></i>
                </button>
                <input 
                  type="text" 
                  value="1" 
                  readOnly
                  className="w-6 text-center mx-1 text-[10px]"
                />
                <button className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center">
                  <i className="fas fa-plus text-[8px]"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Entrega */}
        <div className="px-3 py-2 border-b border-gray-200">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-xs font-medium">Receba até {deliveryRange}</span>
            <span className="text-xs font-semibold">R$ 9,90</span>
          </div>
          <span className="text-[10px] text-gray-500">Envio padrão</span>
        </div>

        {/* Desconto TikTok */}
        {couponApplied && (
          <div className="px-3 py-2 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center">
              <i className="fas fa-ticket-alt text-[#F52B56] mr-1.5 text-sm"></i>
              <span className="text-xs font-medium">Desconto do TikTok Shop (10%)</span>
            </div>
            <div className="flex items-center">
              <span className="text-xs text-[#F52B56] mr-1.5">- R$ {discount.toFixed(2).replace('.', ',')}</span>
              <i className="fas fa-chevron-right text-xs text-gray-400"></i>
            </div>
          </div>
        )}

        {/* Container com animação de slide */}
        <div className="relative overflow-hidden">
          {/* CEP e Endereço */}
          <div 
            className="px-3 py-2 transition-transform duration-500 ease-in-out"
            style={{
              transform: showFiscalData ? 'translateX(-100%)' : 'translateX(0)',
            }}
          >
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label className="block text-xs font-medium mb-1">CEP</label>
                <input 
                  type="tel"
                  inputMode="numeric"
                  value={address.cep}
                  onChange={handleCepChange}
                  placeholder="00000-000"
                  maxLength={9}
                  className="w-full border border-gray-300 rounded px-2 py-3 text-base focus:outline-none focus:border-[#F52B56] focus:ring-1 focus:ring-[#F52B56]"
                  style={{ fontSize: '16px' }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">CIDADE</label>
                <input 
                  type="text"
                  value={address.cidade}
                  onChange={(e) => setAddress({ ...address, cidade: e.target.value })}
                  placeholder=""
                  className="w-full border border-gray-300 rounded px-2 py-3 text-base focus:outline-none focus:border-[#F52B56] focus:ring-1 focus:ring-[#F52B56]"
                  style={{ fontSize: '16px' }}
                />
              </div>
            </div>
            
            <div className="mb-2">
              <label className="block text-xs font-medium mb-1">RUA</label>
              <input 
                type="text"
                value={address.rua}
                onChange={(e) => setAddress({ ...address, rua: e.target.value })}
                placeholder=""
                className="w-full border border-gray-300 rounded px-2 py-3 text-base focus:outline-none focus:border-[#F52B56] focus:ring-1 focus:ring-[#F52B56]"
                style={{ fontSize: '16px' }}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label className="block text-xs font-medium mb-1">NÚMERO</label>
                <input 
                  type="text"
                  value={address.numero}
                  onChange={(e) => setAddress({ ...address, numero: e.target.value })}
                  placeholder=""
                  className="w-full border border-gray-300 rounded px-2 py-3 text-base focus:outline-none focus:border-[#F52B56] focus:ring-1 focus:ring-[#F52B56]"
                  style={{ fontSize: '16px' }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">UF</label>
                <input 
                  type="text"
                  value={address.estado}
                  onChange={(e) => setAddress({ ...address, estado: e.target.value.toUpperCase() })}
                  placeholder=""
                  maxLength={2}
                  className="w-full border border-gray-300 rounded px-2 py-3 text-base uppercase focus:outline-none focus:border-[#F52B56] focus:ring-1 focus:ring-[#F52B56]"
                  style={{ fontSize: '16px' }}
                />
              </div>
            </div>
          </div>

          {/* Dados para Nota Fiscal */}
          <div 
            className="absolute top-0 left-0 w-full px-3 py-2 transition-transform duration-500 ease-in-out"
            style={{
              transform: showFiscalData ? 'translateX(0)' : 'translateX(100%)',
            }}
          >
            <div className="mb-2">
              <label className="block text-xs font-medium mb-1">NOME E SOBRENOME</label>
              <input 
                type="text"
                value={fiscalData.nome}
                onChange={(e) => setFiscalData({ ...fiscalData, nome: e.target.value })}
                placeholder=""
                className="w-full border border-gray-300 rounded px-2 py-3 text-base focus:outline-none focus:border-[#F52B56] focus:ring-1 focus:ring-[#F52B56]"
                style={{ fontSize: '16px' }}
              />
            </div>

            <div className="mb-2">
              <label className="block text-xs font-medium mb-1">TELEFONE</label>
              <input 
                type="tel"
                inputMode="numeric"
                value={fiscalData.telefone}
                onChange={(e) => setFiscalData({ ...fiscalData, telefone: formatTelefone(e.target.value) })}
                placeholder="(00) 00000-0000"
                maxLength={15}
                className="w-full border border-gray-300 rounded px-2 py-3 text-base focus:outline-none focus:border-[#F52B56] focus:ring-1 focus:ring-[#F52B56]"
                style={{ fontSize: '16px' }}
              />
            </div>

            <div className="mb-2">
              <label className="block text-xs font-medium mb-1">CPF</label>
              <input 
                type="tel"
                inputMode="numeric"
                value={fiscalData.cpf}
                onChange={(e) => setFiscalData({ ...fiscalData, cpf: formatCPF(e.target.value) })}
                placeholder="000.000.000-00"
                maxLength={14}
                className="w-full border border-gray-300 rounded px-2 py-3 text-base focus:outline-none focus:border-[#F52B56] focus:ring-1 focus:ring-[#F52B56]"
                style={{ fontSize: '16px' }}
              />
            </div>
          </div>
        </div>

        {/* Espaçador para fixar o footer */}
        <div style={{ paddingBottom: '320px' }}></div>

        {/* Footer fixo */}
        <div className="fixed bottom-0 bg-white border-t border-gray-200 w-full" style={{ maxWidth: '428px' }}>
          {/* Total e economia */}
          <div className="px-3 py-2">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold">Total</span>
              <span className="text-sm font-bold">R$ {total.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex items-center text-[10px] px-1.5 py-1 rounded" style={{ color: '#F52B56', backgroundColor: '#FFF0F3' }}>
              <span className="mr-1 text-xs">😊</span>
              <span>Você está economizando R$ {savings.toFixed(2).replace('.', ',')} nesse pedido.</span>
            </div>
          </div>

          {/* Total final e botão */}
          <div className="px-3 pb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium">Total (1 item)</span>
              <span className="text-base font-bold text-[#F52B56]">R$ {total.toFixed(2).replace('.', ',')}</span>
            </div>
            <button 
              onClick={handleFazerPedido}
              disabled={isProcessingPayment}
              className={`w-full ${isProcessingPayment ? 'bg-gray-400' : 'bg-[#F52B56]'} text-white font-semibold py-2.5 rounded-lg flex items-center justify-center`}
            >
              {isProcessingPayment ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-sm">Processando...</span>
                </>
              ) : (
                <div className="w-full">
                  <div className="text-sm">{showFiscalData ? 'Fazer pedido' : 'Continuar'}</div>
                  {!showFiscalData && <div className="text-[10px] mt-0.5">O cupom expira em {formatTime(timeLeft)}</div>}
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
