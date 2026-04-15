import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertStoreSchema,
  insertProductSchema,
  insertProductVariantSchema,
  insertReviewSchema,
  insertCustomerSchema,
  insertDomainSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Stores
  app.get('/api/stores', async (req, res) => {
    try {
      const stores = await storage.getAllStores();
      res.json(stores);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/stores/:id', async (req, res) => {
    try {
      const store = await storage.getStore(req.params.id);
      if (!store) {
        return res.status(404).json({ error: 'Loja não encontrada' });
      }
      res.json(store);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/stores', async (req, res) => {
    try {
      const data = insertStoreSchema.parse(req.body);
      const store = await storage.createStore(data);
      res.json(store);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch('/api/stores/:id', async (req, res) => {
    try {
      const store = await storage.updateStore(req.params.id, req.body);
      if (!store) {
        return res.status(404).json({ error: 'Loja não encontrada' });
      }
      res.json(store);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete('/api/stores/:id', async (req, res) => {
    try {
      const deleted = await storage.deleteStore(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Loja não encontrada' });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Products
  app.get('/api/products', async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
      
      const variants = await storage.getVariantsByProduct(req.params.id);
      
      res.json({
        ...product,
        variants
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/products', async (req, res) => {
    try {
      const { variants, ...productData } = req.body;
      
      const productPayload = insertProductSchema.parse(productData);
      
      const product = await storage.createProduct(productPayload);
      
      const createdVariants = [];
      if (variants && Array.isArray(variants)) {
        for (const variant of variants) {
          const variantPayload = insertProductVariantSchema.parse(variant);
          const createdVariant = await storage.createVariant(variantPayload);
          createdVariants.push(createdVariant);
        }
      }
      
      res.json({
        ...product,
        variants: createdVariants
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch('/api/products/:id', async (req, res) => {
    try {
      console.log('PATCH /api/products/:id');
      console.log('Product ID:', req.params.id);
      console.log('Request body:', JSON.stringify(req.body, null, 2));
      
      const { variants, ...productData } = req.body;
      
      const product = await storage.updateProduct(req.params.id, productData);
      
      if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
      
      let updatedVariants = [];
      if (variants !== undefined && Array.isArray(variants)) {
        await storage.deleteVariantsByProduct(req.params.id);
        
        for (const variant of variants) {
          const variantPayload = insertProductVariantSchema.parse(variant);
          const createdVariant = await storage.createVariant(variantPayload);
          updatedVariants.push(createdVariant);
        }
      } else {
        updatedVariants = await storage.getVariantsByProduct(req.params.id);
      }
      
      console.log('Updated product with variants');
      
      res.json({
        ...product,
        variants: updatedVariants
      });
    } catch (error: any) {
      console.error('Error updating product:', error);
      res.status(400).json({ error: error.message });
    }
  });

  app.delete('/api/products/:id', async (req, res) => {
    try {
      const deleted = await storage.deleteProduct(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Product Variants
  app.get('/api/products/:productId/variants', async (req, res) => {
    try {
      const variants = await storage.getVariantsByProduct(req.params.productId);
      res.json(variants);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/variants/:id', async (req, res) => {
    try {
      const variant = await storage.getVariant(req.params.id);
      if (!variant) {
        return res.status(404).json({ error: 'Variante não encontrada' });
      }
      res.json(variant);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/variants', async (req, res) => {
    try {
      const data = insertProductVariantSchema.parse(req.body);
      const variant = await storage.createVariant(data);
      res.json(variant);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch('/api/variants/:id', async (req, res) => {
    try {
      const variant = await storage.updateVariant(req.params.id, req.body);
      if (!variant) {
        return res.status(404).json({ error: 'Variante não encontrada' });
      }
      res.json(variant);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete('/api/variants/:id', async (req, res) => {
    try {
      const deleted = await storage.deleteVariant(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Variante não encontrada' });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Reviews
  app.get('/api/products/:productId/reviews', async (req, res) => {
    try {
      const reviews = await storage.getReviewsByProduct(req.params.productId);
      res.json(reviews);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/reviews', async (req, res) => {
    try {
      console.log('Review request body:', req.body);
      const data = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(data);
      res.json(review);
    } catch (error: any) {
      console.error('Review validation error:', error);
      res.status(400).json({ error: error.message });
    }
  });

  app.patch('/api/reviews/:id', async (req, res) => {
    try {
      const review = await storage.updateReview(req.params.id, req.body);
      if (!review) {
        return res.status(404).json({ error: 'Avaliação não encontrada' });
      }
      res.json(review);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete('/api/reviews/:id', async (req, res) => {
    try {
      const deleted = await storage.deleteReview(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Avaliação não encontrada' });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Customers
  app.get('/api/customers', async (req, res) => {
    try {
      const customers = await storage.getAllCustomers();
      res.json(customers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/customers', async (req, res) => {
    try {
      const data = insertCustomerSchema.parse(req.body);
      const customer = await storage.createCustomer(data);
      res.json(customer);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch('/api/customers/:id', async (req, res) => {
    try {
      const customer = await storage.updateCustomer(req.params.id, req.body);
      if (!customer) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }
      res.json(customer);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete('/api/customers/:id', async (req, res) => {
    try {
      const deleted = await storage.deleteCustomer(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Domains
  app.get('/api/domains', async (req, res) => {
    try {
      const domains = await storage.getAllDomains();
      res.json(domains);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/domains', async (req, res) => {
    try {
      const data = insertDomainSchema.parse(req.body);
      const domain = await storage.createDomain(data);
      res.json(domain);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch('/api/domains/:id', async (req, res) => {
    try {
      const domain = await storage.updateDomain(req.params.id, req.body);
      if (!domain) {
        return res.status(404).json({ error: 'Domínio não encontrado' });
      }
      res.json(domain);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete('/api/domains/:id', async (req, res) => {
    try {
      const deleted = await storage.deleteDomain(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Domínio não encontrado' });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Payment Routes - BuckPay API
  const BUCKPAY_BASE_URL = 'https://api.realtechdev.com.br';
  const BUCKPAY_USER_AGENT = 'Buckpay API';

  const buckpayHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.PICATIC_API_KEY}`,
    'User-Agent': BUCKPAY_USER_AGENT
  });

  app.post('/api/payments', async (req, res) => {
    try {
      const { amount, customer_name, customer_email, customer_cpf, customer_phone, description, product_id, address } = req.body;

      const amountInCents = Math.round(parseFloat(amount) * 100);

      // Formatar telefone: BuckPay espera 55 + DDD + número (12-13 dígitos)
      const cleanPhone = customer_phone.replace(/\D/g, '');
      const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : '55' + cleanPhone;

      // Gerar external_id único para esta transação
      const externalId = `pedido-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

      const paymentData: any = {
        external_id: externalId,
        payment_method: 'pix',
        amount: amountInCents,
        buyer: {
          name: customer_name,
          email: customer_email.toLowerCase(),
          document: customer_cpf.replace(/\D/g, ''),
          phone: formattedPhone
        },
        product: {
          id: product_id || 'starlink-mini',
          name: description || 'Kit De Internet Via Satelite Starlink Mini'
        },
        offer: {
          id: 'oferta-starlink-mini',
          name: description || 'Kit De Internet Via Satelite Starlink Mini',
          quantity: 1
        }
      };

      console.log('🚀 Criando transação PIX com BuckPay...');
      console.log('📦 Payload:', JSON.stringify(paymentData).substring(0, 300));

      const response = await fetch(`${BUCKPAY_BASE_URL}/v1/transactions`, {
        method: 'POST',
        headers: buckpayHeaders(),
        body: JSON.stringify(paymentData)
      });

      const apiResponse = await response.json();

      if (!response.ok) {
        console.error('❌ Erro na API BuckPay:', JSON.stringify(apiResponse, null, 2));
        return res.status(response.status).json({ error: apiResponse });
      }

      const data = apiResponse.data || apiResponse;
      console.log('✅ Transação BuckPay criada. ID:', data.id, '| external_id:', externalId);
      console.log('📋 PIX Code:', data.pix?.code?.substring(0, 50));

      const transaction = {
        id: externalId,
        transaction_id: externalId,
        internal_id: data.id,
        status: data.status,
        amount: (amountInCents / 100).toFixed(2),
        pixCopiaECola: data.pix?.code,
        pixQrCode: data.pix?.code,
        pix_code: data.pix?.code,
        pixQrCodeBase64: data.pix?.qrcode_base64
      };

      res.json({ data: transaction });
    } catch (error: any) {
      console.error('❌ Payment error:', error);
      res.status(500).json({ error: { message: error.message } });
    }
  });

  app.get('/api/payments/:id', async (req, res) => {
    try {
      const { id } = req.params;

      console.log('🔍 GET /api/payments/:id - Buscando transação BuckPay. external_id:', id);

      const response = await fetch(`${BUCKPAY_BASE_URL}/v1/transactions/external_id/${id}`, {
        headers: buckpayHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return res.status(response.status).json({ error: errorData });
      }

      const apiResponse = await response.json();
      const data = apiResponse.data || apiResponse;

      const transaction = {
        id: id,
        transaction_id: id,
        internal_id: data.id,
        status: data.status,
        amount: data.total_amount ? (data.total_amount / 100).toFixed(2) : '0.00',
        pixCopiaECola: data.pix?.code,
        pixQrCode: data.pix?.code,
        pix_code: data.pix?.code
      };

      console.log('📥 GET /api/payments/:id - Status:', data.status);

      res.json({ data: transaction });
    } catch (error: any) {
      console.error('❌ Payment fetch error:', error);
      res.status(500).json({ error: { message: error.message } });
    }
  });

  app.get('/api/transactions/:id', async (req, res) => {
    try {
      const { id } = req.params;

      // MOCK: Se tiver ?mock=paid na query, simula pagamento confirmado
      if (req.query.mock === 'paid') {
        console.log('🔧 [MOCK] Simulando pagamento confirmado para:', id);
        return res.json({
          data: {
            id: id,
            transaction_id: id,
            status: 'paid',
            amount: '149.80'
          }
        });
      }

      console.log('🔍 Verificando status do pagamento na BuckPay. external_id:', id);

      const response = await fetch(`${BUCKPAY_BASE_URL}/v1/transactions/external_id/${id}`, {
        headers: buckpayHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Erro ao verificar status BuckPay:', response.status, errorData);
        return res.status(response.status).json({ error: errorData });
      }

      const apiResponse = await response.json();
      const data = apiResponse.data || apiResponse;

      console.log('📊 Status atual do pagamento BuckPay:', data.status || 'pending');

      const transaction = {
        id: id,
        transaction_id: id,
        internal_id: data.id,
        status: data.status,
        amount: data.total_amount ? (data.total_amount / 100).toFixed(2) : '0.00'
      };

      res.json({ data: transaction });
    } catch (error: any) {
      console.error('❌ Transaction status error:', error);
      res.status(500).json({ error: { message: error.message } });
    }
  });

  app.get('/api/desktop-redirect-url', async (req, res) => {
    try {
      const { qr_code_url } = req.query;
      
      if (!qr_code_url || typeof qr_code_url !== 'string') {
        return res.status(400).json({ error: 'QR code URL is required' });
      }

      // Retorna a URL de redirect para desktop
      res.json({ 
        redirect_url: qr_code_url.replace('qr_code', 'desktop_redirect') 
      });
    } catch (error: any) {
      console.error('Desktop redirect error:', error);
      res.status(500).json({ error: { message: error.message } });
    }
  });

  // Rota para obter TikTok Pixel ID
  app.get('/api/tiktok-pixel-id', async (req, res) => {
    try {
      const pixelId = process.env.TIKTOK_PIXEL_ID;
      
      if (pixelId) {
        res.json({ pixelId });
      } else {
        res.json({ pixelId: null });
      }
    } catch (error: any) {
      console.error('Erro ao buscar TikTok Pixel ID:', error);
      res.status(500).json({ error: 'Erro ao buscar TikTok Pixel ID' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
