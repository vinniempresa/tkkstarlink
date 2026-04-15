import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import TikTokLoader from '@/components/TikTokLoader';

declare global {
  interface Window {
    ttq: any;
  }
}

export default function PaymentPage() {
  const [, setLocation] = useLocation();
  const [transaction, setTransaction] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutos em segundos
  const [copied, setCopied] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const statusCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const delayTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Scroll to top quando a página carregar
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Esconde o loader após 3 segundos
    const loaderTimer = setTimeout(() => {
      setShowLoader(false);
    }, 3000);

    // Pega ID da transação da URL e modo de teste
    const params = new URLSearchParams(window.location.search);
    const transactionId = params.get('id');
    const isTestMode = params.get('test') === 'true';

    if (!transactionId) {
      setLocation('/oferta');
      clearTimeout(loaderTimer);
      return;
    }

    // Carrega dados do localStorage (persiste mesmo após sair do app)
    const storageKey = `payment_${transactionId}`;
    const savedPaymentData = localStorage.getItem(storageKey);
    
    console.log('🔍 PaymentPage montada, transactionId:', transactionId);
    console.log('📦 Dados salvos encontrados:', !!savedPaymentData);

    if (savedPaymentData) {
      try {
        const paymentData = JSON.parse(savedPaymentData);
        setTransaction(paymentData);
        console.log('✅ Dados da transação carregados do localStorage');
      } catch (error) {
        console.error('❌ Erro ao parsear payment data:', error);
      }
    }

    // Busca dados da transação da API
    const fetchTransaction = async () => {
      try {
        console.log('🔄 Buscando transação da API...');
        const response = await fetch(`/api/payments/${transactionId}`);
        if (response.ok) {
          const data = await response.json();
          const apiTransaction = data.data || data;
          
          console.log('📥 Dados recebidos da API:', JSON.stringify(apiTransaction).substring(0, 200));
          console.log('📥 PIX Code da API:', apiTransaction.pixCopiaECola?.substring(0, 50) || 'NÃO ENCONTRADO');
          
          // Se já temos dados salvos corretos, preserva dados do produto e atualiza PIX/status
          if (savedPaymentData) {
            const savedData = JSON.parse(savedPaymentData);
            const updatedTransaction = {
              ...savedData,
              // Atualiza status
              status: apiTransaction.status,
              expires_at: apiTransaction.expires_at,
              // Atualiza código PIX (pode ter mudado ou não estava salvo)
              pixCopiaECola: apiTransaction.pixCopiaECola || savedData.pixCopiaECola,
              pixQrCode: apiTransaction.pixQrCode || savedData.pixQrCode,
              pix_code: apiTransaction.pix_code || savedData.pix_code
            };
            setTransaction(updatedTransaction);
            // Atualiza localStorage com dados mais recentes
            localStorage.setItem(storageKey, JSON.stringify(updatedTransaction));
            console.log('✅ Dados da transação atualizados (merge com salvos)');
            console.log('📦 PIX Code final:', updatedTransaction.pixCopiaECola?.substring(0, 50) || 'NÃO ENCONTRADO');
          } else {
            // Se não temos dados salvos, usa da API e salva
            setTransaction(apiTransaction);
            localStorage.setItem(storageKey, JSON.stringify(apiTransaction));
            console.log('✅ Dados da transação carregados da API');
          }
        }
      } catch (error) {
        console.error('❌ Erro ao buscar transação:', error);
      }
    };

    fetchTransaction();

    // Função para verificar status do pagamento
    const checkPaymentStatus = async () => {
      try {
        // NÃO usa mock em produção - apenas se estiver explicitamente na URL
        const mockParam = isTestMode ? '?mock=paid' : '';
        const statusResponse = await fetch(`/api/transactions/${transactionId}${mockParam}`);
        
        if (statusResponse.ok) {
          const responseData = await statusResponse.json();
          const statusData = responseData.data || responseData;
          
          console.log('🔍 Verificação de status do pagamento:');
          console.log('   - Transaction ID:', transactionId);
          console.log('   - Status retornado:', statusData.status);
          console.log('   - Resposta completa:', JSON.stringify(statusData).substring(0, 200));
          
          // Verifica se o pagamento foi confirmado
          // IMPORTANTE: Só aceita status EXATAMENTE 'paid' ou 'PAID'
          const isPaid = statusData.status === 'paid' || statusData.status === 'PAID';
          
          if (isPaid) {
            console.log('✅✅✅ PAGAMENTO CONFIRMADO! Redirecionando para /oferta/taxa...');
            if (statusCheckIntervalRef.current) {
              clearInterval(statusCheckIntervalRef.current);
            }
            // Limpa dados do localStorage antes de redirecionar
            localStorage.removeItem(storageKey);
            setLocation('/oferta/taxa');
          } else {
            console.log('⏳ Pagamento ainda pendente. Status:', statusData.status);
          }
        } else {
          console.error('❌ Erro na resposta da API:', statusResponse.status);
        }
      } catch (error) {
        console.error('❌ Erro ao verificar status:', error);
      }
    };

    // Limpa timers existentes antes de iniciar novos
    const clearAllTimers = () => {
      if (statusCheckIntervalRef.current) {
        console.log('🧹 Limpando interval de polling existente');
        clearInterval(statusCheckIntervalRef.current);
        statusCheckIntervalRef.current = null;
      }
      if (delayTimerRef.current) {
        console.log('🧹 Limpando timer de delay existente');
        clearTimeout(delayTimerRef.current);
        delayTimerRef.current = null;
      }
    };

    // Inicia verificação de status
    const startStatusCheck = () => {
      console.log('🚀 Iniciando verificação de status do pagamento...');
      console.log('⚠️ IMPORTANTE: Aguardando pagamento ser confirmado na 4mpagamentos');
      console.log('⚠️ O sistema só redireciona para /taxa quando status = "paid" ou "PAID"');
      
      // Garante que não há timers antigos rodando
      clearAllTimers();
      
      // NÃO verifica imediatamente - aguarda 5 segundos para dar tempo do QR Code ser exibido
      // Isso evita redirecionar antes do usuário ver a página
      delayTimerRef.current = setTimeout(() => {
        console.log('🔄 Iniciando polling de status a cada 3 segundos...');
        checkPaymentStatus();
        // Depois verifica a cada 3 segundos
        statusCheckIntervalRef.current = setInterval(checkPaymentStatus, 3000);
      }, 5000); // Espera 5 segundos antes de começar a verificar
    };

    startStatusCheck();

    // Page Visibility API - detecta quando o usuário volta para o app
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('👁️ Usuário voltou para o app! Recarregando dados...');
        // IMPORTANTE: NÃO reinicia o polling - ele continua rodando em background
        // Apenas recarrega os dados para atualizar a UI
        fetchTransaction();
      } else {
        console.log('🙈 Usuário saiu do app - verificações continuam em background');
        // IMPORTANTE: NÃO pausa as verificações - elas continuam rodando mesmo quando o app está em background
        // Isso permite que o redirecionamento para /taxa aconteça automaticamente quando o pagamento for confirmado
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Limpa tudo quando o componente for desmontado
    return () => {
      console.log('🧹 PaymentPage desmontada - limpando todos os timers');
      clearAllTimers();
      clearTimeout(loaderTimer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [setLocation]);

  // TikTok Pixel - AddPaymentInfo Event
  useEffect(() => {
    if (!transaction) return;

    const paymentInfoKey = `ttq_payment_${transaction.id || transaction.transaction_id}`;
    const hasTracked = sessionStorage.getItem(paymentInfoKey);

    if (hasTracked) {
      console.log('✅ AddPaymentInfo já rastreado nesta sessão');
      return;
    }

    const trackAddPaymentInfo = () => {
      if (window.ttq && window.ttq.track) {
        try {
          window.ttq.track('AddPaymentInfo', {
            content_type: 'product',
            content_id: transaction.productId || 'product-1',
            content_name: transaction.productName || transaction.description,
            currency: 'BRL',
            value: parseFloat(transaction.amount || transaction.correctAmount || '0')
          });
          sessionStorage.setItem(paymentInfoKey, 'true');
          console.log('🎯 TikTok AddPaymentInfo Event disparado: R$', transaction.amount);
        } catch (error) {
          console.error('❌ Erro ao disparar AddPaymentInfo:', error);
        }
      }
    };

    const timer = setTimeout(trackAddPaymentInfo, 1000);
    return () => clearTimeout(timer);
  }, [transaction]);

  // Timer de expiração
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
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const formatExpiryDate = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 15);
    const day = now.getDate();
    const month = now.toLocaleString('pt-BR', { month: 'short' });
    const year = now.getFullYear();
    return `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}, ${day} de ${month} ${year}`;
  };

  const handleCopyPixCode = () => {
    const pixCode = transaction?.pixCopiaECola || transaction?.pix_code || transaction?.pixCode;
    if (pixCode) {
      navigator.clipboard.writeText(pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      console.error('Código PIX não encontrado:', transaction);
    }
  };

  if (!transaction) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F52B56] mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] w-full">
      {/* Loader TikTok */}
      {showLoader && <TikTokLoader />}
      
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center border-b border-gray-200">
        <button onClick={() => setLocation('/oferta')} className="mr-3">
          <i className="fas fa-chevron-left text-lg"></i>
        </button>
        <h1 className="text-lg font-semibold">Código do pagamento</h1>
      </div>

      {/* Conteúdo */}
      <div className="px-4 py-4">
        {/* Status */}
        <div className="bg-white rounded-lg p-4 mb-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-1">Aguardando o pagamento</h2>
              <p className="text-2xl font-semibold text-black">
                R$ {parseFloat(transaction.amount || '0').toFixed(2).replace('.', ',')}
              </p>
            </div>
            <div className="bg-orange-400 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
              <i className="fas fa-clock text-white text-xl"></i>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center text-sm mb-1">
              <span className="text-gray-600 font-normal">Vence em</span>
              <span className="ml-2 bg-[#F52B56] text-white px-2 py-0.5 rounded font-semibold">
                {formatTime(timeLeft)}
              </span>
            </div>
            <p className="text-sm text-gray-600 font-normal">
              Prazo <span className="font-normal text-black">{formatExpiryDate()}</span>
            </p>
          </div>
        </div>

        {/* QR Code e Código PIX */}
        <div className="bg-white rounded-lg p-4">
          {/* Logo PIX centralizado */}
          <div className="flex justify-center mb-4">
            <img 
              src="/pix-logo.png"
              alt="PIX - Banco Central"
              className="h-8 object-contain"
            />
          </div>

          {/* QR Code */}
          {(transaction.pixCopiaECola || transaction.pix_code || transaction.pixQrCode || transaction.pixQrCodeBase64) && (
            <div className="flex justify-center mb-4">
              {transaction.pixQrCodeBase64 ? (
                <img
                  src={`data:image/png;base64,${transaction.pixQrCodeBase64}`}
                  alt="QR Code PIX"
                  className="w-48 h-48 object-contain"
                />
              ) : (
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(transaction.pixCopiaECola || transaction.pix_code || transaction.pixQrCode)}`}
                  alt="QR Code PIX"
                  className="w-48 h-48 object-contain"
                />
              )}
            </div>
          )}

          {/* Código PIX */}
          <div className="mb-4">
            <p className="text-xs text-gray-600 mb-2 break-all font-mono max-h-12 overflow-hidden">
              {transaction.pixCopiaECola || transaction.pix_code || transaction.pixCode || '00020101021226870014br.gov...'}
            </p>
          </div>

          {/* Botão Copiar */}
          <button
            onClick={handleCopyPixCode}
            className={`w-full ${copied ? 'bg-green-500' : 'bg-[#F52B56]'} text-white font-semibold py-3 rounded-lg flex items-center justify-center transition-colors`}
            data-testid="button-copy-pix"
          >
            <i className={`fas ${copied ? 'fa-check' : 'fa-copy'} mr-2`}></i>
            {copied ? 'Copiado!' : 'Copiar'}
          </button>

          {/* Passo a passo */}
          <div className="mt-4 bg-gray-50 rounded-lg p-3">
            <h4 className="text-sm font-semibold mb-2 text-gray-900">Como pagar com PIX Copia e Cola:</h4>
            <ol className="space-y-2">
              <li className="flex items-start text-xs text-gray-700 font-normal">
                <span className="bg-[#F52B56] text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0 text-xs font-semibold">1</span>
                <span>Clique no botão "Copiar" acima para copiar o código PIX</span>
              </li>
              <li className="flex items-start text-xs text-gray-700 font-normal">
                <span className="bg-[#F52B56] text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0 text-xs font-semibold">2</span>
                <span>Abra o app do seu banco e vá em PIX</span>
              </li>
              <li className="flex items-start text-xs text-gray-700 font-normal">
                <span className="bg-[#F52B56] text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0 text-xs font-semibold">3</span>
                <span>Escolha a opção "Pix Copia e Cola" ou "Pagar com código"</span>
              </li>
              <li className="flex items-start text-xs text-gray-700 font-normal">
                <span className="bg-[#F52B56] text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0 text-xs font-semibold">4</span>
                <span>Cole o código copiado e confirme o pagamento</span>
              </li>
            </ol>
          </div>
        </div>

        {/* Resumo do Pedido */}
        <div className="mt-4 bg-white rounded-lg p-4">
          <h3 className="font-semibold mb-3">Resumo do pedido</h3>
          <div className="flex items-center mb-4">
            <img 
              src={transaction.productImage || "https://via.placeholder.com/100"}
              alt={transaction.productName || "Produto"}
              className="w-20 h-20 object-contain rounded mr-3"
            />
            <div className="flex-1">
              <p className="text-sm font-normal mb-1 uppercase">
                {transaction.productName || transaction.description || "Produto"}
              </p>
              {transaction.variantName && (
                <p className="text-xs text-gray-500 mb-1">
                  {transaction.variantName}
                </p>
              )}
              <p className="text-lg font-semibold text-[#F52B56]">
                R$ {parseFloat(transaction.amount || '0').toFixed(2).replace('.', ',')}
              </p>
            </div>
          </div>

          {/* Informações de Entrega */}
          <div className="border-t border-gray-200 pt-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <i className="fas fa-truck text-gray-600 mr-2"></i>
                <span className="text-sm text-gray-700 font-normal">Estimativa de entrega</span>
              </div>
              <span className="text-sm font-normal text-gray-900">3 a 4 dias</span>
            </div>
            <div className="flex items-center mt-2">
              <span className="text-xs text-gray-500 mr-2 font-normal">Enviado via</span>
              <img 
                src="https://cdn.cookielaw.org/logos/ca573dc2-6848-4d5d-811b-a73af38af8db/351dcc81-561f-44be-ad95-966e6f1bb905/f0416ebe-67db-4d95-aee0-56e49a2678f4/logo_jadlog.png"
                alt="Jadlog"
                className="h-5 object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Rodapé TikTok Shop */}
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
