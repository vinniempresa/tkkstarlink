import {
  type User,
  type InsertUser,
  type Store,
  type InsertStore,
  type Product,
  type InsertProduct,
  type ProductVariant,
  type InsertProductVariant,
  type Review,
  type InsertReview,
  type Customer,
  type InsertCustomer,
  type Domain,
  type InsertDomain,
} from '@shared/schema';

// Dados hardcoded da Adidas - Camisa Flamengo
const HARDCODED_STORE: Store = {
  id: 'store-1',
  name: 'Adidas',
  logo: '/attached_assets/adidas_1764530967814.jpg',
  salesCount: '245K',
  reviewsCount: '89,5 mil',
  rating: '4.9',
};

const HARDCODED_PRODUCT: Product = {
  id: 'product-1',
  storeId: 'store-1',
  name: 'Camisa I Flamengo 25/26',
  description: `Camisa I Flamengo 25/26 - A Nova Era Rubro-Negra!

Vista as cores da maior torcida do mundo com a nova Camisa I do Flamengo para a temporada 2025/26! Desenvolvida pela adidas com tecnologia de ponta, esta camisa une tradição, conforto e performance em uma peça única.

Design Exclusivo:
A camisa traz o clássico padrão rubro-negro que é a marca registrada do Mengão, com detalhes modernos que celebram a grandeza do clube. O escudo bordado no peito e as três listras características da adidas completam o visual icônico.

Tecnologia e Conforto:
• Tecido AEROREADY: Absorve a umidade e mantém você seco
• Corte regular: Confortável para o dia a dia
• Tecido leve e respirável: Perfeito para torcer com todo gás
• Gola careca clássica: Elegância atemporal

Especificações:
• Material: 100% Poliéster reciclado
• Cor: Preto/Vermelho
• Modelo: IV6052
• Tamanhos disponíveis: P, M, G, GG, XGG

Personalização:
Você pode adicionar nome e número do seu craque favorito! Escolha entre os jogadores do elenco atual como Arrascaeta, Pedro, Gerson, De La Cruz e muitos outros.

Por Que Escolher:
✓ Produto oficial licenciado pelo Flamengo
✓ Qualidade adidas reconhecida mundialmente
✓ Design exclusivo temporada 25/26
✓ Tecido sustentável (poliéster reciclado)
✓ Perfeita para jogos, treinos ou casual
✓ Presente ideal para todo rubro-negro

Seja no Maracanã ou em qualquer lugar do Brasil, mostre sua paixão pelo Mengão com estilo e qualidade!

Uma satisfação, Nação! 🔴⚫`,
  price: '67.90',
  originalPrice: '399.99',
  discount: 83,
  mainImage: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/1373178f36144872b8e20fe0f58df233_9366/Camisa_I_Flamengo_25-26_Preto_IV6052_21_model.jpg',
  images: [
    'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/1373178f36144872b8e20fe0f58df233_9366/Camisa_I_Flamengo_25-26_Preto_IV6052_21_model.jpg',
    'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/c68c1be12cad40ba987ae97b28333564_9366/Camisa_I_Flamengo_25-26_Preto_IV6052_23_hover_model.jpg',
    'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/bca30251e13340df8491bfbd2424983a_9366/Camisa_I_Flamengo_25-26_Preto_IV6052_25_model.jpg',
    'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/9a29004ae0414319abc5c88d19180af4_9366/Camisa_I_Flamengo_25-26_Preto_IV6052_01_laydown.jpg',
    'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/e27623c7b9144a649035744feaf3e621_9366/Camisa_I_Flamengo_25-26_Preto_IV6052_02_laydown.jpg',
    'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/49d13a2c6721494da236345916b21178_9366/Camisa_I_Flamengo_25-26_Preto_IV6052_25_outfit.jpg',
    'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/2bcaed146c2a417c958562dbc8040ae1_9366/Camisa_I_Flamengo_25-26_Preto_IV6052_41_detail.jpg',
    'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/1b025bb30854443eaf4c8c4f170a672c_9366/Camisa_I_Flamengo_25-26_Preto_IV6052_42_detail.jpg',
  ],
  variant: 'PRETO',
  variantImage: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/1373178f36144872b8e20fe0f58df233_9366/Camisa_I_Flamengo_25-26_Preto_IV6052_21_model.jpg',
  stock: 127,
  rating: '4.9',
  reviewsCount: 168,
  salesCount: 892,
  deliveryFee: '0.00',
  installments: 10,
  couponDiscount: 10,
  couponMinValue: '99.00',
  couponMaxDiscount: '50.00',
  createdAt: new Date('2025-01-01'),
};

const HARDCODED_REVIEWS: Review[] = [
  {
    id: 'review-1',
    productId: 'product-1',
    customerName: 'Rafael Souza',
    rating: 5,
    variant: 'Preto - M',
    comment: 'Ótimo presente. Atendeu as expectativas da pessoa que recebeu o presente.',
    image: '/attached_assets/WhatsApp Image 2025-11-30 at 19.31.50_1764542769561.jpeg',
    createdAt: new Date('2025-01-01'),
  },
  {
    id: 'review-2',
    productId: 'product-1',
    customerName: 'Fernanda Martins',
    rating: 5,
    variant: 'Preto - G',
    comment: 'O melhor presente para um amante de futebol. Material ótimo e muito bonita, caimento perfeito, cores vibrantes. Camisa original é outro nível!',
    image: '/attached_assets/WhatsApp Image 2025-11-30 at 19.31.51_1764542769571.jpeg',
    createdAt: new Date('2025-01-02'),
  },
  {
    id: 'review-3',
    productId: 'product-1',
    customerName: 'Bruno Carvalho',
    rating: 5,
    variant: 'Preto - GG',
    comment: 'Tecido respirável bem leve, material maravilhoso. A personalização perfeita, tecido respirável bom e leve. Adidas sempre melhorando.',
    image: '/attached_assets/WhatsApp Image 2025-11-30 at 19.31.52 (1)_1764542769572.jpeg',
    createdAt: new Date('2025-01-03'),
  },
  {
    id: 'review-4',
    productId: 'product-1',
    customerName: 'Amanda Lima',
    rating: 5,
    variant: 'Preto - M',
    comment: 'Que camisa top amigos! Eu simplesmente Ameiiiiiiiiiiiiiii Perfeita, linda. Dei de presente.',
    image: '/attached_assets/WhatsApp Image 2025-11-30 at 19.31.52 (2)_1764542769572.jpeg',
    createdAt: new Date('2025-01-04'),
  },
  {
    id: 'review-5',
    productId: 'product-1',
    customerName: 'Marcelo Pereira',
    rating: 4.5,
    variant: 'Preto - G',
    comment: 'Linda e ótima qualidade. Manto sagrado sempre vale a pena. Ótima qualidade e entrega no prazo.',
    image: '/attached_assets/WhatsApp Image 2025-11-30 at 19.31.52_1764542769572.jpeg',
    createdAt: new Date('2025-01-05'),
  },
];

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Stores
  getAllStores(): Promise<Store[]>;
  getStore(id: string): Promise<Store | undefined>;
  createStore(store: InsertStore): Promise<Store>;
  updateStore(id: string, store: Partial<InsertStore>): Promise<Store | undefined>;
  deleteStore(id: string): Promise<boolean>;

  // Products
  getAllProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductsByStore(storeId: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  // Product Variants
  getVariantsByProduct(productId: string): Promise<ProductVariant[]>;
  getVariant(id: string): Promise<ProductVariant | undefined>;
  createVariant(variant: InsertProductVariant): Promise<ProductVariant>;
  updateVariant(id: string, variant: Partial<InsertProductVariant>): Promise<ProductVariant | undefined>;
  deleteVariant(id: string): Promise<boolean>;
  deleteVariantsByProduct(productId: string): Promise<boolean>;

  // Reviews
  getReviewsByProduct(productId: string): Promise<Review[]>;
  getReview(id: string): Promise<Review | undefined>;
  createReview(review: InsertReview): Promise<Review>;
  updateReview(id: string, review: Partial<InsertReview>): Promise<Review | undefined>;
  deleteReview(id: string): Promise<boolean>;

  // Customers
  getAllCustomers(): Promise<Customer[]>;
  getCustomer(id: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: string, customer: Partial<InsertCustomer>): Promise<Customer | undefined>;
  deleteCustomer(id: string): Promise<boolean>;

  // Domains
  getAllDomains(): Promise<Domain[]>;
  getDomain(id: string): Promise<Domain | undefined>;
  createDomain(domain: InsertDomain): Promise<Domain>;
  updateDomain(id: string, domain: Partial<InsertDomain>): Promise<Domain | undefined>;
  deleteDomain(id: string): Promise<boolean>;
}

export class HardcodedStorage implements IStorage {
  // Users - não usado neste projeto
  async getUser(id: string): Promise<User | undefined> {
    return undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    throw new Error('Not implemented');
  }

  // Stores
  async getAllStores(): Promise<Store[]> {
    return [HARDCODED_STORE];
  }

  async getStore(id: string): Promise<Store | undefined> {
    return id === HARDCODED_STORE.id ? HARDCODED_STORE : undefined;
  }

  async createStore(store: InsertStore): Promise<Store> {
    return HARDCODED_STORE;
  }

  async updateStore(id: string, store: Partial<InsertStore>): Promise<Store | undefined> {
    return HARDCODED_STORE;
  }

  async deleteStore(id: string): Promise<boolean> {
    return false;
  }

  // Products
  async getAllProducts(): Promise<Product[]> {
    return [HARDCODED_PRODUCT];
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return id === HARDCODED_PRODUCT.id ? HARDCODED_PRODUCT : undefined;
  }

  async getProductsByStore(storeId: string): Promise<Product[]> {
    return storeId === HARDCODED_STORE.id ? [HARDCODED_PRODUCT] : [];
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    return HARDCODED_PRODUCT;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    return HARDCODED_PRODUCT;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return false;
  }

  // Product Variants
  async getVariantsByProduct(productId: string): Promise<ProductVariant[]> {
    return [];
  }

  async getVariant(id: string): Promise<ProductVariant | undefined> {
    return undefined;
  }

  async createVariant(variant: InsertProductVariant): Promise<ProductVariant> {
    throw new Error('Not implemented');
  }

  async updateVariant(id: string, variant: Partial<InsertProductVariant>): Promise<ProductVariant | undefined> {
    return undefined;
  }

  async deleteVariant(id: string): Promise<boolean> {
    return false;
  }

  async deleteVariantsByProduct(productId: string): Promise<boolean> {
    return false;
  }

  // Reviews
  async getReviewsByProduct(productId: string): Promise<Review[]> {
    return productId === HARDCODED_PRODUCT.id ? HARDCODED_REVIEWS : [];
  }

  async getReview(id: string): Promise<Review | undefined> {
    return HARDCODED_REVIEWS.find(r => r.id === id);
  }

  async createReview(review: InsertReview): Promise<Review> {
    const newReview: Review = {
      id: `review-${Date.now()}`,
      productId: review.productId,
      customerName: review.customerName,
      rating: review.rating,
      variant: review.variant,
      comment: review.comment,
      image: review.image ?? null,
      createdAt: new Date(),
    };
    return newReview;
  }

  async updateReview(id: string, review: Partial<InsertReview>): Promise<Review | undefined> {
    const existingReview = HARDCODED_REVIEWS.find(r => r.id === id);
    if (!existingReview) return undefined;
    return { ...existingReview, ...review };
  }

  async deleteReview(id: string): Promise<boolean> {
    return false;
  }

  // Customers
  async getAllCustomers(): Promise<Customer[]> {
    return [];
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    return undefined;
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    throw new Error('Not implemented');
  }

  async updateCustomer(id: string, customer: Partial<InsertCustomer>): Promise<Customer | undefined> {
    return undefined;
  }

  async deleteCustomer(id: string): Promise<boolean> {
    return false;
  }

  // Domains
  async getAllDomains(): Promise<Domain[]> {
    return [];
  }

  async getDomain(id: string): Promise<Domain | undefined> {
    return undefined;
  }

  async createDomain(domain: InsertDomain): Promise<Domain> {
    throw new Error('Not implemented');
  }

  async updateDomain(id: string, domain: Partial<InsertDomain>): Promise<Domain | undefined> {
    return undefined;
  }

  async deleteDomain(id: string): Promise<boolean> {
    return false;
  }
}

export const storage = new HardcodedStorage();
