# E-commerce Product Page

## Overview

This is a mobile-first e-commerce product page application that replicates a Shopee/marketplace-style shopping interface. The application features a product showcase page with image carousel, pricing information, offers, reviews, and an integrated checkout flow with PIX payment processing through the 4mpagamentos payment gateway.

The application is built as a full-stack TypeScript project with React frontend and Express backend, designed for a mobile viewport (max-width: 428px) with a focus on pixel-perfect replication of marketplace design patterns.

**Recent Updates (Nov 7, 2025):** 
- **MAJOR:** Multi-variant product system fully implemented
  - Database: `product_variants` table with fields: id, productId, name, image, quantity, price, sku
  - API: GET /api/products/:id returns product with nested variants array; POST/PUT accept variants with atomic transactions
  - Admin: ProductForm allows adding/removing multiple variants with name, image URL (with preview), and quantity
  - Frontend: ProductVariantSelector component with 2-column grid, 2px rounded borders, red (#F52B56) selection indicator
  - UX: First variant pre-selected, section hidden if ≤1 variant, equal-width boxes
  - Checkout: Receives variantId via query params, displays variant image/name, includes in PIX description
  - Payment: Shows variant name below product name in summary
  - Bug fix: Used useCallback to prevent variant selection reset on parent re-renders
- **MAJOR:** System is now fully dynamic - supports multiple products with dedicated pages
- Each product has its own page at `/product/{id}` with dynamic data from database
- CheckoutPage accepts `productId` query parameter and fetches product data dynamically
- All prices (product, shipping, discounts) are pulled from database - no hardcoded values
- PaymentPage uses localStorage to persist product info (id, name, image) across payment flow
- ProductView and CheckoutPage now query `/api/products/{id}` for specific product data
- Added robust error handling for missing products with user-friendly fallback messages
- Coupon discount defaults to 10% if not defined in product to prevent NaN errors

**Previous Fix (Oct 25, 2025):** Resolved bug where image editing wasn't persisting - timestamp fields (`createdAt`, `updatedAt`) are now properly excluded from update payloads to prevent database type errors.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for component-based UI development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management

**UI Component Library**
- Radix UI primitives for accessible, unstyled components
- Shadcn/ui design system with "new-york" style variant
- Tailwind CSS for utility-first styling with custom design tokens
- Class Variance Authority (CVA) for component variant management

**Styling System**
- Custom CSS variables defined in `index.css` for theming
- TikTok font family as the primary typeface
- Mobile-first responsive design constrained to 428px viewport
- Color palette centered around brand color #F52B56 (vibrant pink/red)
- Custom Tailwind configuration with extended border radius and color schemes

**Page Structure**
- `/` - Product page with carousel, pricing, offers, reviews, and description
- `/checkout` - Checkout page with all forms (personal data and address) and TikTok Shop branding
- `/pagamento` - Payment page displaying PIX QR code and payment status for product purchase
- `/taxa` - Import tax payment page with PIX integration (R$ 74,60) - includes modal with animated loader and payment processing
- `/404` - Not found page

**Key Frontend Components**
- `ImageCarousel`: Custom image carousel with navigation arrows and dot indicators (6 images)
- `PriceSection`: Displays pricing, discounts, installment options, and dynamic delivery dates
- `ProductVariantSelector`: Multi-variant selection component with:
  - 2-column grid layout on mobile
  - 2px rounded borders with red (#F52B56) 2px border for selected variant
  - First variant pre-selected automatically
  - Hidden when product has ≤1 variant
  - Equal-width boxes with variant image (object-contain), name, and quantity
  - Stable state management using useCallback to prevent selection reset
- `OffersSection`: Coupon redemption interface (10% discount) - clicking "Resgatar" redirects to /checkout with coupon applied
- `ReviewsSection`: Customer reviews and ratings (5 reviews with images)
- `DescriptionSection`: Product description and specifications
- `CheckoutPage`: Standalone checkout page with:
  - TikTok Shop logo at the top
  - Product summary with price and variant info (image, name)
  - Personal data form (name, CPF, phone)
  - Delivery address form (CEP with auto-fill, street, number, city, state)
  - Order summary with total
  - "Fazer pedido" button at the bottom
  - TikTok Shop footer
  - Variant data passed to payment via localStorage
- `CheckoutModal`: (DEPRECATED - replaced by CheckoutPage)

**Utility Functions**
- `getDeliveryDateRange()` in `utils/deliveryDate.ts`: Automatically calculates delivery dates as +3 to +4 days from current date

### Backend Architecture

**Server Framework**
- Express.js with TypeScript for HTTP server
- Vite middleware integration for development hot module replacement
- Custom logging middleware for API request tracking

**Storage Layer**
- In-memory storage implementation (`MemStorage`) for user data
- Storage interface designed to support CRUD operations
- Prepared for database integration (Drizzle ORM configuration present)

**API Design**
- RESTful API structure with `/api` prefix
- Centralized error handling middleware
- Session-based architecture prepared (though not fully implemented)

### Data Storage Solutions

**Database Configuration**
- Drizzle ORM configured for PostgreSQL (Neon serverless driver)
- Schema defined in `shared/schema.ts`:
  - `users` table: id, username, password
  - `products` table: id, name, price, originalPrice, mainImage, images[], variant, variantImage, deliveryFee, couponDiscount, description
  - `product_variants` table: id, productId (FK with cascade delete), name, image, quantity, price, sku
- Zod integration for schema validation
- Migrations: Use `npm run db:push` (or `--force` if needed) to sync schema changes

**Current Storage**
- PostgreSQL database for products and variants
- In-memory storage (MemStorage) for user data
- UUID generation for all entity IDs
- Atomic transactions for product+variants operations

### Environment Variables

**Required Secrets (Production & Development)**
- `FOUR_M_API_KEY`: API key for 4mpagamentos payment gateway (Bearer token)
- `TIKTOK_PIXEL_ID`: TikTok Pixel ID for conversion tracking (e.g., "D3A8DARC77UFKOQ7M5PG")
- `SESSION_SECRET`: Secret key for session management
- `DESKTOP_REDIRECT_URL`: URL to redirect desktop users (optional)

**How to Configure:**
1. **Replit:** Add secrets in the "Secrets" tab (Environment variables)
2. **Heroku:** Use `heroku config:set VARIABLE_NAME=value` or dashboard Settings → Config Vars
3. **Local Development:** Create `.env` file in project root

**Example .env file:**
```bash
FOUR_M_API_KEY=your_4mpagamentos_api_key_here
TIKTOK_PIXEL_ID=D3A8DARC77UFKOQ7M5PG
SESSION_SECRET=your_session_secret_here
DESKTOP_REDIRECT_URL=https://example.com
```

### External Dependencies

**Payment Gateway Integration**
- 4mpagamentos PIX payment API
- Base URL: `https://app.4mpagamentos.com/api/v1`
- API Key: Stored in FOUR_M_API_KEY environment variable (Bearer token authentication)
- Payment creation endpoint: `POST /payments`
- Payment status checking: `GET /payments/{transaction_id}`
- **Important:** API expects `amount` as STRING in REAIS (e.g., "139.90" or "125.91" with coupon), not centavos
- **Email validation:** Generated emails have accents removed for API compatibility
- Payment page does NOT auto-redirect - user stays on payment screen with QR code
- Manual navigation to `/taxa` success page after payment confirmation

**Checkout Flow**
1. User browses product page at `/`
2. User can apply 10% coupon by clicking "Resgatar desconto" button
3. User clicks "Adicionar ao carrinho" or "Comprar com cupom" → redirects to `/checkout`
4. If coupon was applied, `/checkout?cupom=true` shows discounted price
5. User fills personal data (name, CPF, phone) and address (CEP, street, number, city, state)
6. User clicks "Fazer pedido" → creates PIX payment via API
7. Redirects to `/pagamento?id={transaction_id}` with QR code
8. After payment, user can navigate to `/taxa` for import tax payment

**Import Tax Payment Flow (/taxa)**
1. User lands on `/taxa` page showing:
   - Black header with TikTok Shop white logo
   - Alert icon with "Produto Importado" warning
   - Receita Federal logo
   - Tax information (R$ 74,60 based on 60% import tax rate)
   - Warning that product won't be shipped without tax payment
2. User clicks "Regularizar Pedido" button
3. Modal opens with animated loader showing "Gerando pagamento..."
4. Backend creates PIX payment with hardcoded customer data:
   - Name: PAULO ALVES DA SILVA
   - CPF: 06953135417
   - Email: poulsi14@gmail.com (accents removed)
   - Phone: 11959107965
   - Amount: "74.60" (string in reais)
   - Description: Taxa de Importação - Buggy 29cc
5. Modal displays:
   - Header with animated loader: "Aguardando pagamento..."
   - Tax amount: R$ 74,60
   - PIX QR Code image
   - PIX copy-paste code
   - "Copiar Código PIX" button (turns green when clicked)
6. Frontend polls payment status every 3 seconds
7. On payment confirmation:
   - Modal shows "Pagamento Confirmado!" with success icon
   - Auto-redirects to homepage after 2 seconds

**Analytics**
- Microsoft Clarity installed (ID: tp05en9ebn)
- Session recording and heatmap tracking enabled
- Script injected in `client/index.html`

**TikTok Pixel Integration**
- TikTok Pixel ID: Stored in TIKTOK_PIXEL_ID environment variable
- Loaded dynamically from backend endpoint: `GET /api/tiktok-pixel-id`
- Purchase tracking event fired on `/taxa` page
- Event details:
  - Event type: `CompletePayment`
  - Product: Buggy Controle Remoto a Gasolina 29cc
  - Value: R$ 139,90 (BRL)
  - Deduplication: Uses localStorage flag `tiktok_purchase_tracked` to prevent duplicates
- Graceful degradation: If pixel ID not configured, tracking is silently disabled

**Third-Party Services**
- OpenCEP API for Brazilian postal code lookup (`https://opencep.com/v1/{cep}.json`)
  - Used in checkout page for automatic address filling
  - Returns: logradouro (street), localidade (city), uf (state), bairro (neighborhood)
- Font Awesome 5.15.3 for icons
- Google Fonts for Inter font family (referenced in design guidelines)

**Development Tools**
- Replit-specific plugins for runtime error overlay and dev tools
- ESBuild for production builds
- PostCSS with Autoprefixer for CSS processing

**UI Component Libraries**
- 30+ Radix UI primitives (accordion, dialog, dropdown, select, etc.)
- Embla Carousel React for carousel functionality
- CMDK for command palette components
- React Hook Form with Zod resolvers for form validation
- date-fns for date manipulation
- Lucide React for additional icons

### Authentication & Authorization

**Current State**
- Basic user schema defined with username/password
- No active authentication implementation
- Session infrastructure prepared (connect-pg-simple imported)
- Storage interface includes user creation and retrieval methods

### Design System

**Brand Colors**
- Primary: `#F52B56` (vibrant pink/red)
- Secondary backgrounds: `#FDE5EA` (light pink)
- Neutral: Black (#000000), gray (#757575), border gray (#e0e0e0)
- Accents: Gold star rating (#ffb400), light background (#f5e6d6)

**Typography**
- Primary font: TikTok (custom font loaded via woff2)
- Fallback: Inter from Google Fonts
- Font weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- Precise sizing using Tailwind's arbitrary values

**Layout Constraints**
- Maximum container width: 428px
- Mobile-first, single-viewport design
- Fixed header with sticky positioning
- Scroll area optimizations (hidden scrollbars)