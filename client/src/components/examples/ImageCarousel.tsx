import ImageCarousel from '../ImageCarousel';

export default function ImageCarouselExample() {
  const images = [
    {
      src: "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m2dab30m5z755d.webp",
      alt: "Mini máquina de lavar roupa portátil dobrável cor roxa, vista frontal, produto inteiro, fundo branco"
    },
    {
      src: "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m2d9v0et8iticf.webp",
      alt: "Mini máquina de lavar roupa portátil dobrável cor roxa, vista lateral, produto inteiro, fundo branco"
    },
    {
      src: "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m2dab30mlf7q60.webp",
      alt: "Mini máquina de lavar roupa portátil dobrável cor roxa, vista superior, produto inteiro, fundo branco"
    },
    {
      src: "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m2d9v0et9xdyf9.webp",
      alt: "Mini máquina de lavar roupa portátil dobrável cor roxa, detalhes do interior, fundo branco"
    }
  ];

  return <ImageCarousel images={images} />;
}
