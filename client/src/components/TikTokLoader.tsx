export default function TikTokLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div 
        className="flex flex-col items-center gap-4 rounded-2xl px-8 py-6"
        style={{ backgroundColor: 'rgba(113, 111, 123, 0.95)' }}
      >
        {/* Animação das bolinhas */}
        <div className="relative w-12 h-8 flex items-center justify-center">
          {/* Bolinha Rosa/Vermelha */}
          <div 
            className="absolute w-3.5 h-3.5 rounded-full"
            style={{
              backgroundColor: '#F1355C',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              animation: 'tiktokSlide1 0.8s ease-in-out infinite, tiktokZIndex1 0.8s ease-in-out infinite'
            }}
          />
          
          {/* Bolinha Ciano/Azul */}
          <div 
            className="absolute w-3.5 h-3.5 rounded-full"
            style={{
              backgroundColor: '#44D1D7',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              animation: 'tiktokSlide2 0.8s ease-in-out infinite, tiktokZIndex2 0.8s ease-in-out infinite'
            }}
          />
        </div>
        
        {/* Texto Carregando */}
        <span className="text-gray-200 text-base font-bold tracking-wide">Carregando...</span>
      </div>

      <style>{`
        @keyframes tiktokSlide1 {
          0%, 100% {
            transform: translate(-50%, -50%) translateX(-7px);
          }
          50% {
            transform: translate(-50%, -50%) translateX(7px);
          }
        }
        
        @keyframes tiktokSlide2 {
          0%, 100% {
            transform: translate(-50%, -50%) translateX(7px);
          }
          50% {
            transform: translate(-50%, -50%) translateX(-7px);
          }
        }
        
        @keyframes tiktokZIndex1 {
          0%, 49% {
            z-index: 1;
          }
          50%, 100% {
            z-index: 2;
          }
        }
        
        @keyframes tiktokZIndex2 {
          0%, 49% {
            z-index: 2;
          }
          50%, 100% {
            z-index: 1;
          }
        }
      `}</style>
    </div>
  );
}
