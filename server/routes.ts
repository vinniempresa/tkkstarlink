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

  // Payment Routes - SpeedPag API
  app.post('/api/payments', async (req, res) => {
    try {
      const { amount, customer_name, customer_email, customer_cpf, customer_phone, description, product_id, address } = req.body;

      // SpeedPag usa Basic Auth com publicKey:secretKey
      const publicKey = process.env.SPEEDPAG_PUBLIC_KEY;
      const secretKey = process.env.SPEEDPAG_SECRET_KEY;
      const auth = 'Basic ' + Buffer.from(publicKey + ':' + secretKey).toString('base64');

      // SpeedPag requer amount em centavos
      const amountInCents = Math.round(parseFloat(amount) * 100);

      // Usar endereço real do cliente ou valores padrão
      const customerAddress = address || {};
      const zipcode = (customerAddress.cep || '01000000').replace(/\D/g, '');
      const state = (customerAddress.state || 'SP').toUpperCase();
      const city = customerAddress.city || 'São Paulo';
      const neighborhood = customerAddress.neighborhood || 'Centro';
      const street = customerAddress.street || 'Rua Principal';
      const streetNumber = customerAddress.number || '100';

      // Formatar telefone corretamente (apenas números, sem +55)
      const cleanPhone = customer_phone.replace(/\D/g, '');
      // Remover 55 do início se presente
      const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone.substring(2) : cleanPhone;

      const paymentData = {
        amount: amountInCents,
        paymentMethod: 'pix',
        items: [
          {
            tangible: true,
            title: 'curso_do_futuro_25',
            unitPrice: amountInCents,
            quantity: 1,
            externalRef: 'camisa-flamengo-2526'
          }
        ],
        customer: {
          name: customer_name.toUpperCase(),
          email: customer_email.toLowerCase(),
          phone: formattedPhone,
          document: {
            type: 'cpf',
            number: customer_cpf.replace(/\D/g, '')
          },
          address: {
            street: street,
            streetNumber: streetNumber,
            complement: '',
            zipCode: zipcode,
            neighborhood: neighborhood,
            city: city,
            state: state,
            country: 'BR'
          }
        }
      };

      console.log('Criando transação PIX com SpeedPag...');
      console.log('Payload:', JSON.stringify(paymentData).substring(0, 300));

      const response = await fetch('https://api.speedpag.com/v1/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': auth
        },
        body: JSON.stringify(paymentData)
      });

      const apiResponse = await response.json();

      if (!response.ok) {
        console.error('Erro na API SpeedPag:', JSON.stringify(apiResponse, null, 2));
        console.error('Payload enviado:', JSON.stringify(paymentData, null, 2));
        return res.status(response.status).json({ error: apiResponse });
      }
      
      console.log('Transação criada com sucesso. ID:', apiResponse.id);
      console.log('Dados da transação:', JSON.stringify(apiResponse).substring(0, 500));
      console.log('PIX QRCode:', apiResponse.pix?.qrcode);

      // Mapear resposta do SpeedPag para o formato esperado pelo frontend
      // SpeedPag retorna o código PIX em pix.qrcode (minúsculo)
      const transaction = {
        id: apiResponse.id,
        transaction_id: apiResponse.id,
        status: apiResponse.status,
        amount: (amountInCents / 100).toFixed(2),
        pixCopiaECola: apiResponse.pix?.qrcode,
        pixQrCode: apiResponse.pix?.qrcode,
        pix_code: apiResponse.pix?.qrcode,
        expirationDate: apiResponse.pix?.expirationDate
      };

      res.json({ data: transaction });
    } catch (error: any) {
      console.error('Payment error:', error);
      res.status(500).json({ error: { message: error.message } });
    }
  });

  app.get('/api/payments/:id', async (req, res) => {
    try {
      const { id } = req.params;

      const publicKey = process.env.SPEEDPAG_PUBLIC_KEY;
      const secretKey = process.env.SPEEDPAG_SECRET_KEY;
      const auth = 'Basic ' + Buffer.from(publicKey + ':' + secretKey).toString('base64');

      const response = await fetch(`https://api.speedpag.com/v1/transactions/${id}`, {
        headers: {
          'Authorization': auth
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return res.status(response.status).json({ error: errorData });
      }

      const apiResponse = await response.json();
      
      // Mapear para formato esperado
      // SpeedPag retorna o código PIX em pix.qrcode (minúsculo)
      const transaction = {
        id: apiResponse.id,
        transaction_id: apiResponse.id,
        status: apiResponse.status,
        amount: apiResponse.amount ? (apiResponse.amount / 100).toFixed(2) : '0.00',
        pixCopiaECola: apiResponse.pix?.qrcode,
        pixQrCode: apiResponse.pix?.qrcode,
        pix_code: apiResponse.pix?.qrcode,
        expirationDate: apiResponse.pix?.expirationDate
      };
      
      console.log('GET /api/payments/:id - PIX Code:', apiResponse.pix?.qrcode?.substring(0, 50));
      
      res.json({ data: transaction });
    } catch (error: any) {
      console.error('Payment fetch error:', error);
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

      console.log('🔍 Verificando status do pagamento na SpeedPag. Transaction ID:', id);

      const publicKey = process.env.SPEEDPAG_PUBLIC_KEY;
      const secretKey = process.env.SPEEDPAG_SECRET_KEY;
      const auth = 'Basic ' + Buffer.from(publicKey + ':' + secretKey).toString('base64');

      const response = await fetch(`https://api.speedpag.com/v1/transactions/${id}`, {
        headers: {
          'Authorization': auth
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Erro ao verificar status:', response.status, errorData);
        return res.status(response.status).json({ error: errorData });
      }

      const apiResponse = await response.json();
      
      console.log('📊 Status atual do pagamento:', apiResponse.status || 'pending');
      
      // Mapear status do SpeedPag para o formato esperado
      // SpeedPag usa: waiting_payment, paid, refused, refunded, etc.
      const transaction = {
        id: apiResponse.id,
        transaction_id: apiResponse.id,
        status: apiResponse.status,
        amount: apiResponse.amount ? (apiResponse.amount / 100).toFixed(2) : '0.00'
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
