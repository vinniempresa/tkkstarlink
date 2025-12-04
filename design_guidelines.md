# Design Guidelines: E-commerce Product Page - Exact Replication

## Design Approach
**Reference-Based Approach**: Exact replication of provided Shopee/marketplace-style product page. No modifications or creative interpretation - implement precisely as specified in the source code.

## Critical Constraint
This project requires **pixel-perfect replication** of the provided code. Every element, spacing, color, and interaction must match the source exactly.

## Core Design Elements

### A. Color Palette
**Primary Brand Color**: #F52B56 (vibrant pink/red)
- Use for: discount badges, prices, call-to-action buttons, selected state borders
- Background variant: #FDE5EA (light pink for coupon badge backgrounds)

**Supporting Colors**:
- Black: #000000 (text, icons)
- Gray text: #757575 (secondary information)
- Border gray: #e0e0e0 (dividers, borders)
- Star rating: #ffb400 (gold)
- Light background: #f5e6d6 (section dividers)

### B. Typography
**Font Family**: 'Inter' (via Google Fonts)
**Font Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

**Type Scale**:
- Hero price: 24px (text-2xl), bold
- Section titles: 12px (text-xs), semibold
- Body text: 11px-12px (text-[11px] to text-xs)
- Micro text: 10px (text-[10px])

### C. Layout System
**Container**: Maximum width 428px (mobile-first design)
**Spacing Units**: Tailwind default scale
- Section padding: px-4, py-3
- Element spacing: space-x-2, mt-1, mt-2, mt-3
- Header padding: px-3, pt-3, pb-2

### D. Component Library

**Fixed Header**:
- Close icon (left), action icons image (right)
- White background, fixed positioning
- Height: auto with padding

**Image Carousel**:
- 4 product images, 320px height
- Navigation arrows (circular, translucent black background)
- Dot indicators (pink active, white outlined inactive)
- Image counter badge (bottom right, black translucent)

**Price Section**:
- Discount badge (-73%, pink background)
- Main price (large, pink, bold with "A partir de" prefix)
- Original price (strikethrough, gray)
- Installment info (small, with pink "sem juros")
- Coupon badge (light pink background, pink text with icon)

**Product Info**:
- Title (bold, truncated with ellipsis)
- Star rating (4.6/5, gold stars)
- Sales count (233 vendidos)
- Delivery info with truck icon
- Shipping fee (indented under delivery date)

**Color Selector**:
- Circular thumbnail with 4px pink border when selected
- Color label beside selected option

**Reviews Section**:
- Customer name, star rating, variant info
- Review text
- 3 product photos in horizontal row

**Description**:
- Simple text layout with bold headings
- Bottom padding for fixed footer clearance (pb-24)

### E. Interactive Elements

**Carousel Navigation**:
- Vanilla JavaScript implementation
- Arrow click handlers
- Dot indicators update on navigation
- Opacity transitions between images
- Counter updates (1/4, 2/4, etc.)

**No hover effects**: Maintain mobile-first approach with tap/click interactions only

## Images
Product photos are critical throughout:
- **Main carousel**: 4 product images (different angles)
- **Color selector**: Small circular thumbnail
- **Promotional banner**: Full-width institutional image
- **Review section**: 3 customer photos

## Technical Notes
- Custom CSS classes for primary color (.text-primary, .bg-primary, .border-primary)
- Hidden scrollbar styling
- Font Awesome 5.15.3 for icons
- Responsive only to 428px width constraint
- All spacing and sizing values must match exactly

## Visual Hierarchy
1. Price and discount (largest, pink)
2. Product images (prominent carousel)
3. Title and ratings
4. Delivery and color options
5. Offers and reviews
6. Description (standard text)

**Mandate**: Implement exactly as provided - no design interpretation, no modern improvements, no accessibility updates beyond what exists in the source code.