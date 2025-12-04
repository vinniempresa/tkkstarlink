import { storage } from './storage';

async function seed() {
  console.log('🌱 Iniciando seed do banco de dados...');

  try {
    // Criar loja
    const store = await storage.createStore({
      name: 'oBoticário',
      logo: '/attached_assets/logo o boticario_1762761428802.jpg',
      salesCount: '68.8K',
      reviewsCount: '12,8 mil',
      rating: '4.9',
    });
    console.log('✓ Loja criada:', store.name);

    // Criar produto
    const product = await storage.createProduct({
      storeId: store.id,
      name: 'Calendário do Advento 2025 O Boticário (12 itens)',
      description: `Calendário do Advento 2025 O Boticário: Uma Contagem Regressiva Mágica para o Natal!

Surpreenda-se todos os dias de dezembro com o Calendário do Advento 2025 de O Boticário! Este kit exclusivo traz 12 caixinhas especiais com produtos clássicos da marca em tamanhos viagem, perfeitos para você descobrir ou redescobrir as fragrâncias e cuidados favoritos.

O Que Vem Dentro:
O Calendário do Advento contém 12 produtos surpresa em tamanho viagem das linhas mais icônicas de O Boticário, incluindo perfumaria, skincare, maquiagem e cuidados pessoais. Além disso, você também recebe 1 Cartão Mais Presente para escolher um mimo extra entre ofertas exclusivas!

Categorias de Produtos Incluídos:
• Perfumaria: Miniaturas de fragrâncias das linhas Lily, Floratta, Malbec, Zaad
• Skincare: Produtos de cuidados com a pele
• Maquiagem: Itens de beleza para realçar sua beleza natural
• Cuidados Pessoais: Produtos para o dia a dia das linhas Nativa SPA, Cuide-se Bem e Botik
• Bônus: 1 Cartão Mais Presente com experiências exclusivas

Como Funciona:
Abra 1 caixinha por dia de 1º a 12 de dezembro e descubra qual será a surpresa! Cada produto é cuidadosamente selecionado entre os sucessos de vendas da marca, proporcionando uma experiência única de descoberta e autocuidado.

Design Especial de Natal:
Linda embalagem verde com guirlanda desenhada, design sofisticado e temático de Natal 2025. Perfeito para presente ou para se presentear nesta época tão especial!

Especificações:
• 12 produtos em tamanho viagem
• 1 Cartão Mais Presente
• Embalagem premium com design exclusivo de Natal
• Produtos das melhores linhas de O Boticário
• Ideal para presentear ou se presentear

Por Que Escolher:
✓ Variedade de produtos para experimentar
✓ Tamanhos perfeitos para viagem ou teste
✓ Embalagem linda e sofisticada
✓ Presente perfeito para quem ama beleza
✓ Elemento surpresa a cada dia
✓ Qualidade garantida O Boticário

*Produtos podem variar conforme disponibilidade. A lista exata não é divulgada previamente - o elemento surpresa faz parte da experiência!`,
      price: '87.90',
      originalPrice: '599.90',
      discount: 85,
      mainImage: 'https://res.cloudinary.com/beleza-na-web/image/upload/w_1500,f_auto,fl_progressive,q_auto:eco,w_800/v1/imagens/product/B89300/37a98184-de9c-4d80-8ac1-1b932e88a8d8-bot-89300-calendario-do-advento-mini-01.jpg',
      images: [
        'https://res.cloudinary.com/beleza-na-web/image/upload/w_1500,f_auto,fl_progressive,q_auto:eco,w_800/v1/imagens/product/B89300/37a98184-de9c-4d80-8ac1-1b932e88a8d8-bot-89300-calendario-do-advento-mini-01.jpg',
        'https://res.cloudinary.com/beleza-na-web/image/upload/w_1500,f_auto,fl_progressive,q_auto:eco,w_800/v1/imagens/product/B89300/4ebc1073-4a73-4a1a-ab36-5fae453a4f8a-bot-89300-calendario-do-advento-mini-03.jpg',
        'https://res.cloudinary.com/beleza-na-web/image/upload/w_1500,f_auto,fl_progressive,q_auto:eco,w_800/v1/imagens/product/B89300/8fd4d935-5668-4022-8667-3626798bd0bf-bot-89300-calendario-do-advento-mini-02.jpg',
        'https://res.cloudinary.com/beleza-na-web/image/upload/w_1500,f_auto,fl_progressive,q_auto:eco,w_800/v1/imagens/product/B89300/5a43fa1e-d212-4f92-ba48-397165679190-bot-card-mais-presente-natal.jpg',
      ],
      variant: 'PADRÃO',
      variantImage: 'https://res.cloudinary.com/beleza-na-web/image/upload/w_1500,f_auto,fl_progressive,q_auto:eco,w_800/v1/imagens/product/B89300/37a98184-de9c-4d80-8ac1-1b932e88a8d8-bot-89300-calendario-do-advento-mini-01.jpg',
      stock: 85,
      rating: '4.9',
      reviewsCount: 47,
      salesCount: 156,
      deliveryFee: '0.00',
      installments: 10,
      couponDiscount: 10,
      couponMinValue: '99.00',
      couponMaxDiscount: '50.00',
    });
    console.log('✓ Produto criado:', product.name);

    // Criar avaliações
    const reviewsData = [
      {
        customerName: 'Júlia Mendes',
        rating: 5,
        variant: 'PADRÃO',
        comment: 'Gente, que coisa mais linda!! Já abri uns 5 dias e tô apaixonada. Veio Lily, Floratta, um hidratante que cheira mto bom... a embalagem tá servindo de enfeite aqui em casa kkkk',
        image: '/attached_assets/WhatsApp Image 2025-11-10 at 05.40.13_1762764231487.jpeg',
      },
      {
        customerName: 'Fernanda Oliveira',
        rating: 5,
        variant: 'PADRÃO',
        comment: 'Melhor compra!! Os tamanhos são ótimos pra testar e levar na bolsa. Veio até Malbec 😍 o cartão presente foi um plus que eu nem esperava',
        image: '/attached_assets/WhatsApp Image 2025-11-10 at 05.40.46_1762764231493.jpeg',
      },
      {
        customerName: 'Patrícia Santos',
        rating: 5,
        variant: 'PADRÃO',
        comment: 'Dezembro ficou mil vezes mais gostoso com esse calendário! Tem produtos q eu já uso e adoro, e outros que descobri agora. Já tô querendo comprar pra minha irmã tbm',
        image: '/attached_assets/WhatsApp Image 2025-11-10 at 05.41.12_1762764231493.jpeg',
      },
      {
        customerName: 'Camila Rodrigues',
        rating: 5,
        variant: 'PADRÃO',
        comment: 'Vale a pena demais! 12 produtos + cartão presente, tudo O Boticário. Veio perfume, creme, maquiagem... a caixa chegou perfeita, super caprichada',
        image: '/attached_assets/WhatsApp Image 2025-11-10 at 05.41.27_1762764231494.jpeg',
      },
      {
        customerName: 'Renata Costa',
        rating: 5,
        variant: 'PADRÃO',
        comment: 'Dei pra minha mãe e ela tá no céu kkk todo dia de manhã ela abre uma caixinha animada igual criança. Acertei no presente!',
        image: '/attached_assets/WhatsApp Image 2025-11-10 at 05.41.46_1762764231495.jpeg',
      },
    ];

    for (const reviewData of reviewsData) {
      await storage.createReview({
        productId: product.id,
        ...reviewData,
      });
    }
    console.log(`✓ ${reviewsData.length} avaliações criadas`);

    console.log('🎉 Seed concluído com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao fazer seed:', error);
    process.exit(1);
  }
}

seed();
