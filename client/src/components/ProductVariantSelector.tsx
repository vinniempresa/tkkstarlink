import { useState, useEffect } from 'react';
import type { ProductVariant } from '@shared/schema';

interface ProductVariantSelectorProps {
  variants: ProductVariant[];
  onVariantSelect: (variant: ProductVariant) => void;
  defaultVariantId?: string;
}

export default function ProductVariantSelector({ 
  variants, 
  onVariantSelect,
  defaultVariantId 
}: ProductVariantSelectorProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  useEffect(() => {
    if (variants.length > 0) {
      const defaultId = defaultVariantId || variants[0].id;
      setSelectedVariantId(defaultId);
      const defaultVariant = variants.find(v => v.id === defaultId);
      if (defaultVariant) {
        onVariantSelect(defaultVariant);
      }
    }
  }, [variants, defaultVariantId, onVariantSelect]);

  if (variants.length <= 1) {
    return null;
  }

  const handleVariantClick = (variant: ProductVariant) => {
    setSelectedVariantId(variant.id);
    onVariantSelect(variant);
  };

  return (
    <div className="px-4 py-3 bg-white">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Selecione uma opção</h3>
      
      <div className="grid grid-cols-2 gap-2">
        {variants.map((variant) => (
          <button
            key={variant.id}
            type="button"
            onClick={() => handleVariantClick(variant)}
            className={`
              flex flex-col items-center p-2.5 
              rounded-[2px] border-2 transition-all
              ${selectedVariantId === variant.id 
                ? 'border-[#F52B56]' 
                : 'border-gray-300'
              }
              hover:border-[#F52B56]/50
              active:scale-[0.98]
            `}
            data-testid={`variant-option-${variant.id}`}
          >
            <div className="w-full aspect-square mb-2 overflow-hidden rounded-sm">
              <img
                src={variant.image}
                alt={variant.name}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xs font-medium text-gray-800 text-center line-clamp-2">
              {variant.name}
            </span>
            {variant.quantity !== undefined && variant.quantity > 0 && (
              <span className="text-xs text-gray-500 mt-1">
                Qtd: {variant.quantity}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
