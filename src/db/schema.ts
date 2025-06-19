import { relations } from "drizzle-orm";
import {
  decimal,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// ------ Tables ------
//  Products Table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  companyId: integer("company_id")
    .references(() => companies.id)
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

//  Product Images Table
export const productImages = pgTable("product_images", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
  url: text("url").notNull(),
});

// Companies Table
export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  description: text("description"),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  videoUrl: text("video_url").notNull(),
  buttonText: varchar("button_text", { length: 100 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ------ Relations ------
// -- Product Relations --
export const productsRelations = relations(products, ({ one, many }) => ({
  images: many(productImages),
  company: one(companies, {
    fields: [products.companyId],
    references: [companies.id],
  }),
}));

// -- Product Image Relations --
export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

// -- Companies Relations --
export const companiesRelations = relations(companies, ({ many }) => ({
  products: many(products),
}));
