import { useState } from 'react';
import { ChevronDown, X, Ruler } from 'lucide-react';

interface PersonalizationSectionProps {
  onSelectionChange?: (selection: PersonalizationSelection) => void;
}

export interface PersonalizationSelection {
  size: string | null;
  personalization: 'none' | 'player' | 'custom';
  playerName?: string;
  playerNumber?: string;
  customName?: string;
  customNumber?: string;
}

const PLAYERS = [
  { name: 'ALEX SANDRO', number: '26' },
  { name: 'ALLAN', number: '29' },
  { name: 'AYRTON LUCAS', number: '6' },
  { name: 'B. HENRIQUE', number: '27' },
  { name: 'CAIO GARCIA', number: '55' },
  { name: 'CARLINHOS', number: '28' },
  { name: 'CARRASCAL', number: '15' },
  { name: 'CLEITON', number: '33' },
  { name: 'DANIEL SALES', number: '51' },
  { name: 'DANILO', number: '13' },
  { name: 'DE ARRASCAETA', number: '10' },
  { name: 'DE LA CRUZ', number: '18' },
  { name: 'DYOGO ALVES', number: '49' },
  { name: 'E.ROYAL', number: '22' },
  { name: 'EVERTON', number: '11' },
  { name: 'EVERTTON ARAUJO', number: '52' },
  { name: 'G. PLATA', number: '50' },
  { name: 'JORGINHO', number: '21' },
  { name: 'JUNINHO', number: '23' },
  { name: 'L. ARAÚJO', number: '7' },
  { name: 'L. ORTIZ', number: '3' },
  { name: 'LÉO PEREIRA', number: '4' },
  { name: 'LORRAN', number: '19' },
  { name: 'MATHEUS CUNHA', number: '25' },
  { name: 'MATHEUS G.', number: '20' },
  { name: 'MICHAEL', number: '30' },
  { name: 'PEDRO', number: '9' },
  { name: 'PULGAR', number: '5' },
  { name: 'ROSSI', number: '1' },
  { name: 'S.LINO', number: '16' },
  { name: 'SAÚL', number: '8' },
  { name: 'THIAGUINHO', number: '32' },
  { name: 'VARELA', number: '2' },
  { name: 'VIÑA', number: '17' },
  { name: 'WESLEY', number: '43' },
];

const SIZES = [
  { label: 'PP', value: 'XS' },
  { label: 'P', value: 'S' },
  { label: 'M', value: 'M' },
  { label: 'G', value: 'L' },
  { label: 'GG', value: 'XL' },
  { label: 'XGG', value: '2XL' },
  { label: 'XXGG', value: '3XL' },
];

const SIZE_MODEL_INFO: Record<string, { height: string; size: string; chest: string; waist: string }> = {
  'XS': { height: '170', size: 'PP (XS)', chest: '82', waist: '72' },
  'S': { height: '175', size: 'P (S)', chest: '90', waist: '78' },
  'M': { height: '185', size: 'M', chest: '99', waist: '79' },
  'L': { height: '188', size: 'G (L)', chest: '105', waist: '92' },
  'XL': { height: '190', size: 'GG (XL)', chest: '114', waist: '102' },
  '2XL': { height: '192', size: 'XGG (2XL)', chest: '125', waist: '113' },
  '3XL': { height: '195', size: 'XXGG (3XL)', chest: '136', waist: '126' },
};

export default function PersonalizationSection({ onSelectionChange }: PersonalizationSectionProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [personalizationType, setPersonalizationType] = useState<'none' | 'player' | 'custom'>('none');
  const [selectedPlayer, setSelectedPlayer] = useState<typeof PLAYERS[0] | null>(null);
  const [customName, setCustomName] = useState('');
  const [customNumber, setCustomNumber] = useState('');
  const [showPlayerDropdown, setShowPlayerDropdown] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const updateSelection = (updates: Partial<PersonalizationSelection>) => {
    const selection: PersonalizationSelection = {
      size: selectedSize,
      personalization: personalizationType,
      playerName: selectedPlayer?.name,
      playerNumber: selectedPlayer?.number,
      customName,
      customNumber,
      ...updates,
    };
    onSelectionChange?.(selection);
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    updateSelection({ size });
  };

  const handlePlayerSelect = (player: typeof PLAYERS[0]) => {
    setSelectedPlayer(player);
    setShowPlayerDropdown(false);
    updateSelection({ playerName: player.name, playerNumber: player.number });
  };

  const handleClearAll = () => {
    setPersonalizationType('none');
    setSelectedPlayer(null);
    setCustomName('');
    setCustomNumber('');
    updateSelection({ personalization: 'none', playerName: undefined, playerNumber: undefined, customName: '', customNumber: '' });
  };

  return (
    <div className="px-4 py-4 w-full">
      {/* Personalização */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-base font-bold text-black">Personalizar</span>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Adicione nome ou número para personalizar seu produto adidas e crie o presente perfeito.
        </p>

        {/* Opções de personalização */}
        <div className="space-y-3">
          {/* Opção: Sem personalização */}
          <button
            onClick={() => {
              setPersonalizationType('none');
              setSelectedPlayer(null);
              setCustomName('');
              setCustomNumber('');
              updateSelection({ personalization: 'none' });
            }}
            className={`w-full p-3 border rounded-lg text-left flex items-center justify-between transition-all ${
              personalizationType === 'none' 
                ? 'border-black bg-gray-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            data-testid="button-no-personalization"
          >
            <span className="text-sm font-medium text-black">Sem personalização</span>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              personalizationType === 'none' ? 'border-black' : 'border-gray-300'
            }`}>
              {personalizationType === 'none' && <div className="w-3 h-3 rounded-full bg-black" />}
            </div>
          </button>

          {/* Opção: Escolha um craque */}
          <div>
            <button
              onClick={() => {
                setPersonalizationType('player');
                setCustomName('');
                setCustomNumber('');
                updateSelection({ personalization: 'player' });
              }}
              className={`w-full p-3 border rounded-lg text-left flex items-center justify-between transition-all ${
                personalizationType === 'player' 
                  ? 'border-black bg-gray-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              data-testid="button-player-personalization"
            >
              <span className="text-sm font-medium text-black">Escolha um craque</span>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                personalizationType === 'player' ? 'border-black' : 'border-gray-300'
              }`}>
                {personalizationType === 'player' && <div className="w-3 h-3 rounded-full bg-black" />}
              </div>
            </button>

            {/* Dropdown de jogadores */}
            {personalizationType === 'player' && (
              <div className="mt-2 relative">
                <button
                  onClick={() => setShowPlayerDropdown(!showPlayerDropdown)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-left flex items-center justify-between bg-white"
                  data-testid="button-select-player"
                >
                  <span className={`text-sm ${selectedPlayer ? 'text-black font-medium' : 'text-gray-500'}`}>
                    {selectedPlayer ? `${selectedPlayer.name} - ${selectedPlayer.number}` : 'Selecione um craque'}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showPlayerDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showPlayerDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {PLAYERS.map((player) => (
                      <button
                        key={player.number}
                        onClick={() => handlePlayerSelect(player)}
                        className={`w-full p-3 text-left hover:bg-gray-100 text-sm ${
                          selectedPlayer?.number === player.number ? 'bg-gray-100 font-medium' : ''
                        }`}
                        data-testid={`button-player-${player.number}`}
                      >
                        {player.name} - {player.number}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Opção: Adicione o seu */}
          <div>
            <button
              onClick={() => {
                setPersonalizationType('custom');
                setSelectedPlayer(null);
                updateSelection({ personalization: 'custom' });
              }}
              className={`w-full p-3 border rounded-lg text-left flex items-center justify-between transition-all ${
                personalizationType === 'custom' 
                  ? 'border-black bg-gray-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              data-testid="button-custom-personalization"
            >
              <span className="text-sm font-medium text-black">Adicione o seu</span>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                personalizationType === 'custom' ? 'border-black' : 'border-gray-300'
              }`}>
                {personalizationType === 'custom' && <div className="w-3 h-3 rounded-full bg-black" />}
              </div>
            </button>

            {/* Campos de nome e número personalizados */}
            {personalizationType === 'custom' && (
              <div className="mt-3 space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Nome (máx. 12 caracteres)</label>
                  <input
                    type="text"
                    maxLength={12}
                    value={customName}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase();
                      setCustomName(value);
                      updateSelection({ customName: value });
                    }}
                    placeholder="Seu nome"
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black"
                    data-testid="input-custom-name"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Número (1-99)</label>
                  <input
                    type="text"
                    maxLength={2}
                    value={customNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 2);
                      setCustomNumber(value);
                      updateSelection({ customNumber: value });
                    }}
                    placeholder="00"
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black"
                    data-testid="input-custom-number"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Botão Limpar tudo */}
        {personalizationType !== 'none' && (
          <button
            onClick={handleClearAll}
            className="mt-3 text-sm text-gray-600 underline flex items-center gap-1"
            data-testid="button-clear-personalization"
          >
            <X className="w-4 h-4" />
            Limpar tudo
          </button>
        )}
      </div>

      {/* Separador */}
      <div className="border-t border-gray-200 my-4"></div>

      {/* Tamanhos */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-base font-bold text-black">Tamanhos</span>
          <button
            onClick={() => setShowSizeGuide(!showSizeGuide)}
            className="text-sm text-gray-600 underline flex items-center gap-1"
            data-testid="button-size-guide"
          >
            <Ruler className="w-4 h-4" />
            Guia de tamanhos
          </button>
        </div>

        {/* Grid de tamanhos */}
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size.value}
              onClick={() => handleSizeSelect(size.value)}
              className={`min-w-[48px] h-12 px-3 border rounded-lg text-sm font-medium transition-all ${
                selectedSize === size.value
                  ? 'border-black bg-black text-white'
                  : 'border-gray-300 bg-white text-black hover:border-gray-500'
              }`}
              data-testid={`button-size-${size.value}`}
            >
              {size.label}
            </button>
          ))}
        </div>

        {/* Mensagem de tamanho */}
        <p className="mt-3 text-sm text-gray-600">
          <span className="font-medium">Fiel ao tamanho.</span> Recomendamos pedir o tamanho normal.
        </p>

        {/* Guia de tamanhos expandido */}
        {showSizeGuide && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
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

            <div className="mt-3 p-3 bg-gray-100 rounded">
              <p className="text-xs text-gray-600">
                {selectedSize && SIZE_MODEL_INFO[selectedSize] ? (
                  <>
                    <span className="font-medium">Tamanho do modelo:</span> Este modelo mede {SIZE_MODEL_INFO[selectedSize].height} cm e veste tamanho {SIZE_MODEL_INFO[selectedSize].size}. O peitoral mede {SIZE_MODEL_INFO[selectedSize].chest} cm e a cintura {SIZE_MODEL_INFO[selectedSize].waist} cm.
                  </>
                ) : (
                  <>
                    <span className="font-medium">Tamanho do modelo:</span> Selecione um tamanho acima para ver as medidas do modelo correspondente.
                  </>
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
