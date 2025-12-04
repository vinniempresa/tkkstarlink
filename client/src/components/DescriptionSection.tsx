import { useState } from 'react';
import { ChevronRight, Ruler } from 'lucide-react';
import type { Product } from "@shared/schema";

const SIZE_MODEL_INFO: Record<string, { height: string; size: string; chest: string; waist: string }> = {
  'XS': { height: '170', size: 'PP (XS)', chest: '82', waist: '72' },
  'S': { height: '175', size: 'P (S)', chest: '90', waist: '78' },
  'M': { height: '185', size: 'M', chest: '99', waist: '79' },
  'L': { height: '188', size: 'G (L)', chest: '105', waist: '92' },
  'XL': { height: '190', size: 'GG (XL)', chest: '114', waist: '102' },
  '2XL': { height: '192', size: 'XGG (2XL)', chest: '125', waist: '113' },
  '3XL': { height: '195', size: 'XXGG (3XL)', chest: '136', waist: '126' },
};

interface DescriptionSectionProps {
  product: Product;
}

interface TopicItemProps {
  title: string;
  content?: string;
  children?: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

function TopicItem({ title, content, children, isOpen, onToggle }: TopicItemProps) {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-3 text-left"
        data-testid={`button-topic-${title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <span className="text-sm font-bold text-black">{title}</span>
        <ChevronRight 
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} 
        />
      </button>
      {isOpen && (
        <div className="pb-3 text-sm text-gray-600 font-normal">
          {children || <span className="whitespace-pre-line">{content}</span>}
        </div>
      )}
    </div>
  );
}

export default function DescriptionSection({ product }: DescriptionSectionProps) {
  const [openTopics, setOpenTopics] = useState<Record<string, boolean>>({});
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  if (!product) {
    return null;
  }
  
  const disclaimerText = "*Produtos podem variar conforme disponibilidade. A lista exata não é divulgada previamente - o elemento surpresa faz parte da experiência!";
  const mainDescription = product.description.replace(disclaimerText, '').trim();
  const hasDisclaimer = product.description.includes(disclaimerText);

  const toggleTopic = (id: string) => {
    setOpenTopics(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const TamanhoContent = () => (
    <div>
      <div className="whitespace-pre-line"><span className="font-medium">•</span>{` `}<span className="font-medium text-black">Modelagem Slim:</span>{` Rente ao corpo para um visual elegante e liberdade de movimentos

`}<span className="font-medium">•</span>{` `}<span className="font-medium text-black">Modelagem normal:</span>{` Recomendamos pedir o tamanho normal.

`}<span className="font-medium">•</span>{` Modelo veste tamanho M e tem 185 cm de altura, com medidas de 99 cm no peitoral e 79 cm na cintura.`}</div>
      
      {/* Guia de tamanhos */}
      <div className="pt-2">
        <button
          onClick={() => setShowSizeGuide(!showSizeGuide)}
          className="text-sm text-gray-600 underline flex items-center gap-1"
          data-testid="button-size-guide-description"
        >
          <Ruler className="w-4 h-4" />
          Guia de tamanhos
        </button>
      </div>

      {showSizeGuide && (
        <div className="mt-3 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-bold text-sm text-black mb-3">Guia de Tamanhos - Camisa Masculina</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="py-2 text-left font-medium text-gray-600">Tamanho</th>
                  <th className="py-2 text-center font-medium text-gray-600">Peito (cm)</th>
                  <th className="py-2 text-center font-medium text-gray-600">Cintura (cm)</th>
                  <th className="py-2 text-center font-medium text-gray-600">Quadril (cm)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-2 font-medium">PP (XS)</td>
                  <td className="py-2 text-center">79-84</td>
                  <td className="py-2 text-center">69-74</td>
                  <td className="py-2 text-center">81-86</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 font-medium">P (S)</td>
                  <td className="py-2 text-center">86-94</td>
                  <td className="py-2 text-center">76-81</td>
                  <td className="py-2 text-center">89-94</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 font-medium">M</td>
                  <td className="py-2 text-center">94-102</td>
                  <td className="py-2 text-center">81-89</td>
                  <td className="py-2 text-center">94-102</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 font-medium">G (L)</td>
                  <td className="py-2 text-center">101-108</td>
                  <td className="py-2 text-center">89-96</td>
                  <td className="py-2 text-center">100-107</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 font-medium">GG (XL)</td>
                  <td className="py-2 text-center">109-118</td>
                  <td className="py-2 text-center">97-106</td>
                  <td className="py-2 text-center">108-116</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 font-medium">XGG (2XL)</td>
                  <td className="py-2 text-center">119-130</td>
                  <td className="py-2 text-center">107-119</td>
                  <td className="py-2 text-center">117-125</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">XXGG (3XL)</td>
                  <td className="py-2 text-center">131-142</td>
                  <td className="py-2 text-center">120-132</td>
                  <td className="py-2 text-center">126-135</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-200">
            <p className="text-xs font-medium text-black mb-2">Como medir:</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li><span className="font-medium">Peito:</span> Meça ao redor da parte mais larga do peito</li>
              <li><span className="font-medium">Cintura:</span> Meça ao redor da cintura natural</li>
              <li><span className="font-medium">Quadril:</span> Meça ao redor da parte mais larga dos quadris</li>
            </ul>
          </div>
        </div>
      )}

      {/* Imagem do produto */}
      <div className="pt-3">
        <img 
          src="https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/1373178f36144872b8e20fe0f58df233_9366/Camisa_I_Flamengo_25-26_Preto_IV6052_21_model.jpg"
          alt={`${product.name} - Modelo`}
          className="w-full rounded-lg"
        />
      </div>
    </div>
  );
  
  return (
    <div className="px-4 pb-4 w-full">
      <div className="border-b border-gray-200">
        {/* Descrição */}
        <TopicItem
          title="Descrição"
          isOpen={openTopics['descricao'] !== false}
          onToggle={() => toggleTopic('descricao')}
        >
          <div className="text-sm text-black font-normal whitespace-pre-line">
            {mainDescription}
          </div>
          {hasDisclaimer && (
            <div className="text-xs text-gray-400 mt-2 font-normal">
              {disclaimerText}
            </div>
          )}
        </TopicItem>
      </div>
      
      <div>
        {/* Tamanho e ajuste */}
        <TopicItem
          title="Tamanho e ajuste"
          isOpen={openTopics['tamanho'] || false}
          onToggle={() => toggleTopic('tamanho')}
        >
          <TamanhoContent />
        </TopicItem>

        {/* Detalhes */}
        <TopicItem
          title="Detalhes"
          isOpen={openTopics['detalhes'] || false}
          onToggle={() => toggleTopic('detalhes')}
        >
          <div className="whitespace-pre-line"><span className="font-medium">•</span>{` Modelagem justa
`}<span className="font-medium">•</span>{` Decote V canelado
`}<span className="font-medium">•</span>{` Malha dupla 100% poliéster reciclado
`}<span className="font-medium">•</span>{` AEROREADY
`}<span className="font-medium">•</span>{` Escudo do CR Flamengo bordado
`}<span className="font-medium">•</span>{` Barra traseira alongada
`}<span className="font-medium">•</span>{` Escudo bordado do CR Flamengo
`}<span className="font-medium">•</span>{` Cor do artigo: Black
`}<span className="font-medium">•</span>{` Código do artigo: IV6052`}</div>
        </TopicItem>

        {/* Cuidados */}
        <TopicItem
          title="Cuidados"
          isOpen={openTopics['cuidados'] || false}
          onToggle={() => toggleTopic('cuidados')}
        >
          <div className="whitespace-pre-line"><span className="font-medium text-black">Instruções de lavagem</span>{`
`}<span className="font-medium">•</span>{` Não alvejar
`}<span className="font-medium">•</span>{` Utilizar secadora em baixa temperatura
`}<span className="font-medium">•</span>{` Não lava a seco
`}<span className="font-medium">•</span>{` Passa em temperatura baixa
`}<span className="font-medium">•</span>{` Lava à máquina com água fria

`}<span className="font-medium text-black">Informação adicional sobre cuidados</span>{`
`}<span className="font-medium">•</span>{` Remover imediatamente
`}<span className="font-medium">•</span>{` Não utilizar amaciante
`}<span className="font-medium">•</span>{` Lavar e passar do lado avesso`}</div>
        </TopicItem>
      </div>
    </div>
  );
}
