import { useState, useRef } from 'react';

interface ImageCarouselProps {
  images: Array<{ src: string; alt: string }>;
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = images.length;
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const showImage = (idx: number) => {
    setCurrentIndex(idx);
  };

  const handlePrev = () => {
    setCurrentIndex((current) => (current - 1 + total) % total);
  };

  const handleNext = () => {
    setCurrentIndex((current) => (current + 1) % total);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <div className="pt-12 relative w-full">
      <div 
        className="relative w-full h-[320px] flex items-center justify-center overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((image, idx) => (
          <img
            key={idx}
            src={image.src}
            alt={image.alt}
            className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300"
            style={{
              opacity: idx === currentIndex ? 1 : 0,
              zIndex: idx === currentIndex ? 2 : 1
            }}
          />
        ))}
        
        <div
          className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer"
          style={{
            background: 'rgba(0,0,0,0.35)',
            color: '#fff',
            borderRadius: '9999px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}
          onClick={handlePrev}
          onMouseDown={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
          onMouseUp={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.35)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.35)'}
        >
          <i className="fas fa-chevron-left"></i>
        </div>
        
        <div
          className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
          style={{
            background: 'rgba(0,0,0,0.35)',
            color: '#fff',
            borderRadius: '9999px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}
          onClick={handleNext}
          onMouseDown={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
          onMouseUp={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.35)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.35)'}
        >
          <i className="fas fa-chevron-right"></i>
        </div>
        
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1 z-20">
          {images.map((_, idx) => (
            <span
              key={idx}
              className={`w-2 h-2 rounded-full cursor-pointer opacity-80 ${
                idx === currentIndex
                  ? 'bg-[#F52B56]'
                  : 'bg-white border border-[#F52B56]'
              }`}
              onClick={() => showImage(idx)}
            ></span>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-2 right-3 bg-black bg-opacity-60 text-white text-xs rounded-full px-2 py-0.5 z-30">
        {currentIndex + 1}/{total}
      </div>
    </div>
  );
}
