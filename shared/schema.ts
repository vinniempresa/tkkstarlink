import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const stores = pgTable("stores", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  logo: text("logo"),
  salesCount: text("sales_count").default("0"),
  reviewsCount: text("reviews_count").default("0"),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("5.0"),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  storeId: varchar("store_id").notNull().references(() => stores.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  discount: integer("discount").default(0),
  mainImage: text("main_image").notNull(),
  images: text("images").array().notNull().default(sql`ARRAY[]::text[]`),
  variant: text("variant").notNull(),
  variantImage: text("variant_image").notNull(),
  stock: integer("stock").notNull().default(100),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("5.0"),
  reviewsCount: integer("reviews_count").default(0),
  salesCount: integer("sales_count").default(0),
  deliveryFee: decimal("delivery_fee", { precision: 10, scale: 2 }).default("9.90"),
  installments: integer("installments").default(2),
  couponDiscount: integer("coupon_discount").default(10),
  couponMinValue: decimal("coupon_min_value", { precision: 10, scale: 2 }).default("39.00"),
  couponMaxDiscount: decimal("coupon_max_discount", { precision: 10, scale: 2 }).default("25.00"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const productVariants = pgTable("product_variants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull().references(() => products.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  image: text("image").notNull(),
  quantity: integer("quantity").notNull().default(100),
  sku: text("sku"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull().references(() => products.id, { onDelete: 'cascade' }),
  customerName: text("customer_name").notNull(),
  rating: integer("rating").notNull(),
  variant: text("variant").notNull(),
  comment: text("comment").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const customers = pgTable("customers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  totalPurchases: decimal("total_purchases", { precision: 10, scale: 2 }).default("0.00"),
  ordersCount: integer("orders_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const domains = pgTable("domains", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  domain: text("domain").notNull().unique(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertStoreSchema = createInsertSchema(stores).omit({ id: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true, createdAt: true });
export const insertProductVariantSchema = createInsertSchema(productVariants).omit({ id: true, createdAt: true, productId: true });
export const insertReviewSchema = createInsertSchema(reviews).omit({ id: true, createdAt: true });
export const insertCustomerSchema = createInsertSchema(customers).omit({ id: true, createdAt: true });
export const insertDomainSchema = createInsertSchema(domains).omit({ id: true, createdAt: true });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertStore = z.infer<typeof insertStoreSchema>;
export type Store = typeof stores.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertProductVariant = z.infer<typeof insertProductVariantSchema>;
export type ProductVariant = typeof productVariants.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customers.$inferSelect;
export type InsertDomain = z.infer<typeof insertDomainSchema>;
export type Domain = typeof domains.$inferSelect;
