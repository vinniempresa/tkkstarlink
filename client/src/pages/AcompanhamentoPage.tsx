import { useState, useEffect } from 'react';
import { Package, MessageSquare, MapPin } from 'lucide-react';

export default function AcompanhamentoPage() {
  const [customerAddress, setCustomerAddress] = useState({
    cep: '',
    rua: '',
    numero: '',
    cidade: '',
    estado: ''
  });

  useEffect(() => {
    // Carrega endereço do localStorage
    try {
      const savedAddress = localStorage.getItem('customerAddress');
      if (savedAddress) {
        setCustomerAddress(JSON.parse(savedAddress));
      }
    } catch (error) {
      console.error('Erro ao carregar endereço:', error);
    }
  }, []);

  const formatAddress = () => {
    if (!customerAddress.rua) return 'Endereço não disponível';
    return `${customerAddress.rua}, ${customerAddress.numero} - ${customerAddress.cidade}/${customerAddress.estado} - CEP: ${customerAddress.cep}`;
  };

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      {/* Header Jadlog */}
      <div className="bg-white px-4 py-6 border-b border-gray-200">
        <img 
          src="https://5m5.com.br/wp-content/uploads/2024/11/jadlog-logo.png.webp"
          alt="Jadlog"
          className="h-10 mx-auto object-contain"
        />
      </div>

      {/* Conteúdo Principal */}
      <div className="px-4 py-6">
        {/* Card do Produto */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex items-start space-x-3">
            <img 
              src="https://http2.mlstatic.com/D_NQ_NP_2X_913908-MLB88641214390_072025-F-escavadeira-infantil-eletrica-12v-mini-trator-remoto.webp"
              alt="Escavadeira infantil elétrica 12V amarela"
              className="w-20 h-20 object-contain rounded-md border border-gray-200"
            />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                Escavadeira Infantil Elétrica 12V Mini Trator com Controle Remoto
              </h3>
              <p className="text-xs text-gray-500 mb-1">AMARELO</p>
              <div className="flex items-baseline">
                <span className="text-base font-semibold text-[#F52B56]">
                  R$ 149,90
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Status de Entrega */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mb-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex-shrink-0 bg-orange-100 rounded-full p-2">
              <Package className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-base font-semibold text-gray-900">
                Pedido em Preparação
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Seu pedido está sendo preparado para envio
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="ml-8 border-l-2 border-gray-200 pl-4 space-y-4 mt-4">
            <div className="relative">
              <div className="absolute -left-[21px] top-0 w-3 h-3 bg-orange-600 rounded-full border-2 border-white"></div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Preparação</p>
                <p className="text-xs text-gray-500">Em andamento</p>
              </div>
            </div>

            <div className="relative opacity-50">
              <div className="absolute -left-[21px] top-0 w-3 h-3 bg-gray-300 rounded-full border-2 border-white"></div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Enviado</p>
                <p className="text-xs text-gray-500">Aguardando</p>
              </div>
            </div>

            <div className="relative opacity-50">
              <div className="absolute -left-[21px] top-0 w-3 h-3 bg-gray-300 rounded-full border-2 border-white"></div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Em Trânsito</p>
                <p className="text-xs text-gray-500">Aguardando</p>
              </div>
            </div>

            <div className="relative opacity-50">
              <div className="absolute -left-[21px] top-0 w-3 h-3 bg-gray-300 rounded-full border-2 border-white"></div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Entregue</p>
                <p className="text-xs text-gray-500">Aguardando</p>
              </div>
            </div>
          </div>

          {/* Endereço de Entrega */}
          <div className="mt-5 pt-5 border-t border-gray-200">
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-700 mb-1">
                  Endereço de entrega:
                </p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {formatAddress()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Notificação SMS */}
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-900 mb-1">
                Acompanhe por SMS
              </h3>
              <p className="text-xs text-blue-700 leading-relaxed">
                Assim que seu pedido for enviado, você receberá um SMS com o código de rastreio da Jadlog para acompanhar a entrega em tempo real.
              </p>
            </div>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Prazo de entrega: 7-15 dias úteis após o envio
          </p>
        </div>
      </div>
    </div>
  );
}
