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

// Dados hardcoded - Starlink Mini
const HARDCODED_STORE: Store = {
  id: 'store-1',
  name: 'Starlink',
  logo: '/starlink-logo.jpeg',
  salesCount: '12,5K',
  reviewsCount: '2,1 mil',
  rating: '4.9',
};

const HARDCODED_PRODUCT: Product = {
  id: 'product-1',
  storeId: 'store-1',
  name: 'Kit De Internet Via Satelite Starlink Mini',
  description: `Kit De Internet Via Satelite Starlink Mini: Conectividade de Alta Velocidade em Qualquer Lugar!

Leve internet de alta velocidade para qualquer lugar do Brasil com o Kit Starlink Mini! Com tecnologia de ponta da SpaceX, o Starlink Mini entrega conexão via satélite confiável mesmo em regiões remotas, onde o sinal de internet convencional não chega.

O Que Está Incluso:
O kit completo acompanha antena Starlink Mini compacta e portátil, cabo de alimentação integrado, suporte de fixação e guia de instalação. Pronto para usar assim que chegar!

Especificações Técnicas:
• Velocidade de download: 50 a 100 Mbps
• Velocidade de upload: 5 a 20 Mbps
• Latência: 20 a 100 ms
• Peso: 370g — o mais compacto da linha Starlink
• Alimentação: via cabo USB-C (incluído)
• Cobertura: todo o território nacional

Para Quem É Ideal:
• Viajantes e nômades digitais
• Moradores de áreas rurais sem fibra óptica
• Proprietários de chácaras, sítios e fazendas
• Campers, trilheiros e aventureiros
• Profissionais que precisam de internet em campo

Por Que Escolher o Starlink Mini:
✓ Funciona em qualquer lugar do Brasil
✓ Instalação simples — sem técnico necessário
✓ Antena compacta e portátil
✓ Tecnologia SpaceX de última geração
✓ Sem fidelidade ou taxa de cancelamento
✓ Cobertura onde nenhuma operadora chega

Conecte-se ao futuro com o Starlink Mini!`,
  price: '138.45',
  originalPrice: '206.64',
  discount: 33,
  mainImage: 'https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/afe064a8030c4180b9efd79a451da579~tplv-o3syd03w52-crop-webp:1200:1200.webp?dr=15592&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=e1be8f53&idc=my&from=2378011839',
  images: [
    'https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/afe064a8030c4180b9efd79a451da579~tplv-o3syd03w52-crop-webp:1200:1200.webp?dr=15592&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=e1be8f53&idc=my&from=2378011839',
    'https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/d420ae8b865448b895126a058ba1fc97~tplv-o3syd03w52-crop-webp:1200:1200.webp?dr=15592&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=e1be8f53&idc=my&from=2378011839',
    'https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/9658316ce0234681ba5ed7a4ce0787e8~tplv-o3syd03w52-crop-webp:1200:1200.webp?dr=15592&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=e1be8f53&idc=my&from=2378011839',
    'https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/b69b654c1dad400bbc29e0969579ac57~tplv-o3syd03w52-crop-webp:1200:1200.webp?dr=15592&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=e1be8f53&idc=my&from=2378011839',
    'https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/c061138be6a34e1c943d9bb5e9d5ef19~tplv-o3syd03w52-crop-webp:1200:1200.webp?dr=15592&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=e1be8f53&idc=my&from=2378011839',
  ],
  variant: 'PADRÃO',
  variantImage: 'https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/afe064a8030c4180b9efd79a451da579~tplv-o3syd03w52-crop-webp:1200:1200.webp?dr=15592&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=e1be8f53&idc=my&from=2378011839',
  stock: 43,
  rating: '4.9',
  reviewsCount: 11,
  salesCount: 115,
  deliveryFee: '0.00',
  installments: 12,
  couponDiscount: 10,
  couponMinValue: '999.00',
  couponMaxDiscount: '150.00',
  createdAt: new Date('2025-01-01'),
};

const HARDCODED_REVIEWS: Review[] = [
  {
    id: 'review-1',
    productId: 'product-1',
    customerName: 'Carlos Eduardo',
    rating: 5,
    variant: 'PADRÃO',
    comment: 'Moro no interior de Goiás e nunca tive uma internet decente. Com o Starlink Mini chegou tudo mudou! 80 Mbps de download aqui no sítio. Valeu cada centavo!',
    image: null,
    createdAt: new Date('2025-01-01'),
  },
  {
    id: 'review-2',
    productId: 'product-1',
    customerName: 'Marcelo Teixeira',
    rating: 5,
    variant: 'PADRÃO',
    comment: 'Instalação super simples, em menos de 30 minutos já tava funcionando. Uso na chácara todo fim de semana e a conexão é excelente. Recomendo demais!',
    image: null,
    createdAt: new Date('2025-01-02'),
  },
  {
    id: 'review-3',
    productId: 'product-1',
    customerName: 'Amanda Ferreira',
    rating: 5,
    variant: 'PADRÃO',
    comment: 'Trabalho home office e morava refém de internet ruim. O Starlink Mini resolveu minha vida! Faço videochamadas sem travar, upload rápido. Produto incrível.',
    image: null,
    createdAt: new Date('2025-01-03'),
  },
  {
    id: 'review-4',
    productId: 'product-1',
    customerName: 'Roberto Alves',
    rating: 5,
    variant: 'PADRÃO',
    comment: 'Levei numa viagem de camping e funcionou perfeitamente no meio da serra. Nunca imaginei ter internet boa num lugar tão remoto. Tecnologia impressionante!',
    image: null,
    createdAt: new Date('2025-01-04'),
  },
  {
    id: 'review-5',
    productId: 'product-1',
    customerName: 'Juliana Moraes',
    rating: 5,
    variant: 'PADRÃO',
    comment: 'Entrega rápida e produto original. Instalei na fazenda do meu pai que fica numa região sem sinal nenhum. Agora ele consegue assistir TV e fazer videochamada. Muito feliz!',
    image: null,
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
