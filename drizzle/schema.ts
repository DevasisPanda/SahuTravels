import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Custom Users table - for custom authentication (no Manus OAuth)
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(), // bcrypt hashed
  name: text("name"),
  phone: varchar("phone", { length: 20 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn"),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Sessions table - stores user session tokens with cookies
 */
export const sessions = mysqlTable("sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Session = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;

/**
 * Bus Fleet table - stores information about different bus types
 */
export const busFleet = mysqlTable("busFleet", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  isAC: int("isAC").notNull(),
  seats: int("seats").notNull(),
  class: varchar("class", { length: 50 }).notNull(),
  amenities: text("amenities").notNull(),
  imageUrl: text("imageUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BusFleet = typeof busFleet.$inferSelect;
export type InsertBusFleet = typeof busFleet.$inferInsert;

/**
 * Bus Bookings table - stores customer booking requests
 */
export const busBookings = mysqlTable("busBookings", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }).notNull(),
  journeyDate: varchar("journeyDate", { length: 50 }).notNull(),
  source: varchar("source", { length: 255 }).notNull(),
  destination: varchar("destination", { length: 255 }).notNull(),
  busType: varchar("busType", { length: 100 }).notNull(),
  passengers: int("passengers").notNull(),
  specialRequests: text("specialRequests"),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BusBooking = typeof busBookings.$inferSelect;
export type InsertBusBooking = typeof busBookings.$inferInsert;

/**
 * Customer Feedback/Testimonials table
 */
export const customerFeedback = mysqlTable("customerFeedback", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  rating: int("rating").notNull(),
  message: text("message").notNull(),
  isPublished: int("isPublished").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CustomerFeedback = typeof customerFeedback.$inferSelect;
export type InsertCustomerFeedback = typeof customerFeedback.$inferInsert;

/**
 * Home Page Banners table
 */
export const homeBanners = mysqlTable("homeBanners", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: text("imageUrl").notNull(),
  ctaText: varchar("ctaText", { length: 100 }),
  ctaLink: varchar("ctaLink", { length: 255 }),
  isActive: int("isActive").default(1).notNull(),
  displayOrder: int("displayOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type HomeBanner = typeof homeBanners.$inferSelect;
export type InsertHomeBanner = typeof homeBanners.$inferInsert;

/**
 * Gallery Photos table
 */
export const galleryPhotos = mysqlTable("galleryPhotos", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: text("imageUrl").notNull(),
  category: mysqlEnum("category", ["AC Interior", "AC Exterior", "Non-AC Interior", "Non-AC Exterior", "Other"]).notNull(),
  busType: varchar("busType", { length: 50 }),
  isActive: int("isActive").default(1).notNull(),
  displayOrder: int("displayOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GalleryPhoto = typeof galleryPhotos.$inferSelect;
export type InsertGalleryPhoto = typeof galleryPhotos.$inferInsert;
