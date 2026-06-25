import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  sessions,
  InsertSession,
  busBookings,
  InsertBusBooking,
  customerFeedback,
  InsertCustomerFeedback,
  busFleet,
  InsertBusFleet,
  homeBanners,
  InsertHomeBanner,
  galleryPhotos,
  InsertGalleryPhoto,
} from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============ Authentication Functions ============

export async function createUser(user: InsertUser) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(users).values(user);
  return result;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createSession(session: InsertSession) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(sessions).values(session);
  return result;
}

export async function getSessionByToken(token: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(sessions).where(eq(sessions.token, token)).limit(1);
  if (result.length === 0) return undefined;
  
  const session = result[0];
  
  // Check if session is expired
  if (new Date() > session.expiresAt) {
    await deleteSession(token);
    return undefined;
  }
  
  return session;
}

export async function deleteSession(token: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(sessions).where(eq(sessions.token, token));
}

export async function updateUserLastSignedIn(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, userId));
}

// ============ Booking Functions ============

export async function createBooking(booking: InsertBusBooking) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(busBookings).values(booking);
  return result;
}

export async function getBookings() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(busBookings);
}

// ============ Feedback Functions ============

export async function createFeedback(feedback: InsertCustomerFeedback) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(customerFeedback).values(feedback);
  return result;
}

export async function getPublishedFeedback() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(customerFeedback).where(eq(customerFeedback.isPublished, 1));
}

// ============ Fleet Functions ============

export async function getBusFleet() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(busFleet);
}

// ============ Banner Functions ============

export async function createHomeBanner(banner: InsertHomeBanner) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(homeBanners).values(banner);
  return result;
}

export async function getActiveBanners() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(homeBanners).where(eq(homeBanners.isActive, 1));
}

export async function getAllBanners() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(homeBanners);
}

export async function updateBanner(id: number, data: Partial<InsertHomeBanner>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(homeBanners).set(data).where(eq(homeBanners.id, id));
}

export async function deleteBanner(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(homeBanners).where(eq(homeBanners.id, id));
}

// ============ Gallery Functions ============

export async function createGalleryPhoto(photo: InsertGalleryPhoto) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(galleryPhotos).values(photo);
  return result;
}

export async function getGalleryPhotos() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(galleryPhotos).where(eq(galleryPhotos.isActive, 1));
}

export async function getAllGalleryPhotosForAdmin() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(galleryPhotos);
}

export async function updateGalleryPhoto(id: number, data: Partial<InsertGalleryPhoto>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(galleryPhotos).set(data).where(eq(galleryPhotos.id, id));
}

export async function deleteGalleryPhoto(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(galleryPhotos).where(eq(galleryPhotos.id, id));
}
