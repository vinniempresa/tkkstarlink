interface OffersSectionProps {
  onApplyCoupon: () => void;
  couponApplied: boolean;
}

export default function OffersSection({ onApplyCoupon, couponApplied }: OffersSectionProps) {
  return (
    <div className="px-4 py-3 border-b border-[#f5e6d6] bg-white w-full">
      <div className="flex items-center justify-between border-2 border-dashed border-[#F52B56]/30 rounded-lg p-3">
        <div>
          <div className="text-xs font-bold text-black">
            10% OFF
          </div>
          <div className="text-[10px] text-[#757575] font-normal">
            nos pedidos acima de R$ 39
          </div>
        </div>
        <button 
          onClick={onApplyCoupon}
          disabled={couponApplied}
          className={`
            ${couponApplied ? 'bg-gray-400' : 'bg-[#F52B56]'} 
            text-white text-xs font-bold px-5 py-2 rounded
            transition-all duration-500 ease-out
            ${couponApplied ? 'scale-95' : 'scale-100 hover:scale-105'}
          `}
          style={{
            animation: couponApplied ? 'successPulse 0.6s ease-out' : 'none'
          }}
          data-testid="button-apply-coupon"
        >
          {couponApplied ? (
            <span className="flex items-center gap-1">
              <i className="fas fa-check text-xs"></i>
              Resgatado
            </span>
          ) : (
            'Resgatar'
          )}
        </button>
      </div>
      <style>{`
        @keyframes successPulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(0.95);
          }
        }
      `}</style>
    </div>
  );
}
