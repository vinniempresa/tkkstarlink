import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import type { Product } from "@shared/schema";

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

  if (!product) {
    return null;
  }

  const toggleTopic = (id: string) => {
    setOpenTopics(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="px-4 pb-4 w-full">
      <div className="border-b border-gray-200">
        {/* Descrição */}
        <TopicItem
          title="Descrição"
          isOpen={openTopics['descricao'] !== false}
          onToggle={() => toggleTopic('descricao')}
        >
          <div className="mb-3">
            <video
              src="https://down-zl-br.vod.susercontent.com/api/v4/11110105/mms/br-11110105-6v6x4-mmkz7lgh8g07f6.16000081775171470.mp4"
              controls
              playsInline
              className="w-full rounded-lg"
            />
          </div>
          <div className="text-sm text-black font-normal whitespace-pre-line">
            {product.description}
          </div>
        </TopicItem>
      </div>

      <div>
        {/* Dimensões e peso */}
        <TopicItem
          title="Dimensões e peso"
          isOpen={openTopics['dimensoes'] || false}
          onToggle={() => toggleTopic('dimensoes')}
        >
          <div className="whitespace-pre-line">
            <span className="font-medium text-black">Antena Starlink Mini</span>{`
`}<span className="font-medium">•</span>{` Largura: 29,8 cm
`}<span className="font-medium">•</span>{` Comprimento: 25,9 cm
`}<span className="font-medium">•</span>{` Espessura: 3,8 cm (dobrada com suporte)
`}<span className="font-medium">•</span>{` Peso: 370 g

`}<span className="font-medium text-black">Cabo e fonte</span>{`
`}<span className="font-medium">•</span>{` Cabo de alimentação integrado: 1 m
`}<span className="font-medium">•</span>{` Entrada: USB-C (incluso no kit)
`}<span className="font-medium">•</span>{` Consumo médio: 25W`}
          </div>
        </TopicItem>

        {/* Especificações técnicas */}
        <TopicItem
          title="Especificações técnicas"
          isOpen={openTopics['detalhes'] || false}
          onToggle={() => toggleTopic('detalhes')}
        >
          <div className="whitespace-pre-line">
            <span className="font-medium text-black">Conectividade</span>{`
`}<span className="font-medium">•</span>{` Tecnologia: Satélite LEO (Low Earth Orbit) — SpaceX
`}<span className="font-medium">•</span>{` Velocidade de download: 50 a 100 Mbps
`}<span className="font-medium">•</span>{` Velocidade de upload: 5 a 20 Mbps
`}<span className="font-medium">•</span>{` Latência: 20 a 100 ms
`}<span className="font-medium">•</span>{` Cobertura: todo o território nacional

`}<span className="font-medium text-black">Compatibilidade</span>{`
`}<span className="font-medium">•</span>{` Funciona com o aplicativo Starlink (iOS e Android)
`}<span className="font-medium">•</span>{` Suporta conexão via roteador externo
`}<span className="font-medium">•</span>{` Plug and play — sem necessidade de técnico`}
          </div>
        </TopicItem>

        {/* Cuidados e manutenção */}
        <TopicItem
          title="Cuidados e manutenção"
          isOpen={openTopics['cuidados'] || false}
          onToggle={() => toggleTopic('cuidados')}
        >
          <div className="whitespace-pre-line">
            <span className="font-medium text-black">Instalação e uso</span>{`
`}<span className="font-medium">•</span>{` Posicionar com visão desobstruída do céu
`}<span className="font-medium">•</span>{` Evitar obstruções como árvores, telhados ou prédios
`}<span className="font-medium">•</span>{` Não perfurar ou dobrar o cabo de alimentação
`}<span className="font-medium">•</span>{` Não expor o conector USB-C a umidade

`}<span className="font-medium text-black">Limpeza e armazenamento</span>{`
`}<span className="font-medium">•</span>{` Limpar a antena com pano seco ou levemente úmido
`}<span className="font-medium">•</span>{` Não usar produtos químicos abrasivos
`}<span className="font-medium">•</span>{` A antena possui aquecimento automático para remover gelo e neve
`}<span className="font-medium">•</span>{` Guardar em local seco quando não estiver em uso`}
          </div>
        </TopicItem>
      </div>
    </div>
  );
}
