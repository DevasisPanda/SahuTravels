import { eq, count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { hashPassword } from "./_core/auth-utils";
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
  siteSettings,
  InsertSiteSetting,
  services,
  InsertService,
  milestones,
  InsertMilestone,
  offers,
  InsertOffer,
} from "../drizzle/schema";

export type InsertResult = { insertId: number };

function getInsertId(result: unknown): number {
  return (result as Record<string, unknown>).insertId as number;
}

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

export async function createUser(user: InsertUser): Promise<InsertResult> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(users).values(user);
  return { insertId: getInsertId(result) };
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

export async function createBooking(booking: InsertBusBooking): Promise<InsertResult> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(busBookings).values(booking);
  return { insertId: getInsertId(result) };
}

export async function getBookings() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(busBookings);
}

export async function updateBookingStatus(bookingId: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(busBookings).set({ status }).where(eq(busBookings.id, bookingId));
}

// ============ Feedback Functions ============

export async function createFeedback(feedback: InsertCustomerFeedback): Promise<InsertResult> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(customerFeedback).values(feedback);
  return { insertId: getInsertId(result) };
}

export async function getPublishedFeedback() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(customerFeedback).where(eq(customerFeedback.isPublished, 1));
}

export async function getAllFeedbackForAdmin() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(customerFeedback);
}

export async function updateFeedback(id: number, data: Partial<InsertCustomerFeedback>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(customerFeedback).set(data).where(eq(customerFeedback.id, id));
}

export async function deleteFeedback(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(customerFeedback).where(eq(customerFeedback.id, id));
}

// ============ Fleet Functions ============

export async function getBusFleet() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(busFleet);
}

// ============ Banner Functions ============

export async function createHomeBanner(banner: InsertHomeBanner): Promise<InsertResult> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(homeBanners).values(banner);
  return { insertId: getInsertId(result) };
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

export async function createGalleryPhoto(photo: InsertGalleryPhoto): Promise<InsertResult> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(galleryPhotos).values(photo);
  return { insertId: getInsertId(result) };
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

// ============ Settings Functions ============

export async function getAllSettings() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(siteSettings);
}

export async function getSettingsByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(siteSettings).where(eq(siteSettings.category, category));
}

export async function updateSetting(key: string, value: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(siteSettings).set({ value }).where(eq(siteSettings.key, key));
}

export async function bulkUpdateSettings(updates: { key: string; value: string }[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  for (const update of updates) {
    await db.update(siteSettings).set({ value: update.value }).where(eq(siteSettings.key, update.key));
  }
}

// ============ Services Functions ============

export async function createService(service: InsertService): Promise<InsertResult> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(services).values(service);
  return { insertId: getInsertId(result) };
}

export async function getServices() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(services).where(eq(services.isActive, 1));
}

export async function getAllServicesForAdmin() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(services);
}

export async function updateService(id: number, data: Partial<InsertService>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(services).set(data).where(eq(services.id, id));
}

export async function deleteService(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(services).where(eq(services.id, id));
}

// ============ Milestones Functions ============

export async function createMilestone(milestone: InsertMilestone): Promise<InsertResult> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(milestones).values(milestone);
  return { insertId: getInsertId(result) };
}

export async function getMilestones() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(milestones).where(eq(milestones.isActive, 1));
}

export async function getAllMilestonesForAdmin() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(milestones);
}

export async function updateMilestone(id: number, data: Partial<InsertMilestone>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(milestones).set(data).where(eq(milestones.id, id));
}

export async function deleteMilestone(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(milestones).where(eq(milestones.id, id));
}

// ============ Offers Functions ============

export async function createOffer(offer: InsertOffer): Promise<InsertResult> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(offers).values(offer);
  return { insertId: getInsertId(result) };
}

export async function getOffers() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(offers).where(eq(offers.isActive, 1));
}

export async function getAllOffersForAdmin() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(offers);
}

export async function updateOffer(id: number, data: Partial<InsertOffer>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(offers).set(data).where(eq(offers.id, id));
}

export async function deleteOffer(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(offers).where(eq(offers.id, id));
}

// ============ Fleet CRUD Operations ============

export async function createBusFleet(bus: InsertBusFleet): Promise<InsertResult> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(busFleet).values(bus);
  return { insertId: getInsertId(result) };
}

export async function updateBusFleet(id: number, data: Partial<InsertBusFleet>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(busFleet).set(data).where(eq(busFleet.id, id));
}

export async function deleteBusFleet(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(busFleet).where(eq(busFleet.id, id));
}

export async function seedDatabase() {
  const db = await getDb();
  if (!db) {
    console.log("[Database] Skipping seeding: database not connected.");
    return;
  }

  try {
    // 0. Seed Admin User
    const usersCount = await db.select({ count: count() }).from(users);
    if (usersCount[0].count === 0) {
      console.log("[Database] Seeding default admin user...");
      const hashedPassword = hashPassword("admin123");
      await db.insert(users).values({
        email: "admin@sahutravel.com",
        password: hashedPassword,
        name: "Admin User",
        role: "admin",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // 1. Seed Site Settings
    const settingsCount = await db.select({ count: count() }).from(siteSettings);
    if (settingsCount[0].count === 0) {
      console.log("[Database] Seeding default site settings...");
      const defaultSettings = [
        { key: "phone_primary", value: "9636380801", category: "contact", label: "Primary Phone Number" },
        { key: "phone_secondary", value: "9694022157", category: "contact", label: "Secondary Phone Number" },
        { key: "email_primary", value: "info@sahutravels.com", category: "contact", label: "Primary Email Address" },
        { key: "email_secondary", value: "support@sahutravels.com", category: "contact", label: "Secondary Email Address" },
        { key: "address_line1", value: "Shop No. 151, Balaji Market", category: "contact", label: "Address Line 1" },
        { key: "address_line2", value: "Sector A, Shrinath Puram", category: "contact", label: "Address Line 2" },
        { key: "address_city", value: "Kota, Rajasthan 324005", category: "contact", label: "City & Zip Code" },
        { key: "business_hours", value: "24/7 Available", category: "contact", label: "Business Hours" },
        { key: "google_maps_embed", value: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3560.523456789!2d75.8245!3d25.2048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db6f5c5c5c5c5%3A0x5c5c5c5c5c5c5c5c!2sShop%20No.%20151%2C%20Balaji%20Market%2C%20Sector%20A%2C%20Shrinath%20Puram%2C%20Kota%2C%20Rajasthan%20324005!5e0!3m2!1sen!2sin!4v1234567890", category: "contact", label: "Google Maps Embed URL" },
        { key: "google_maps_link", value: "https://share.google.com/pNfl99BAweudsdMJf", category: "contact", label: "Google Maps Share Link" },
        { key: "tagline", value: "Your Fantasy - Our Mission", category: "branding", label: "Company Tagline" },
        { key: "logo_url", value: "https://via.placeholder.com/400x100/FFD700/000000?text=SAHU+TRAVELS", category: "branding", label: "Company Logo URL" },
        { key: "company_name", value: "SAHU TRAVELS", category: "branding", label: "Company Name" },
        { key: "established_year", value: "1989", category: "branding", label: "Established Year" },
        { key: "company_description", value: "Your trusted travel partner since 1989, providing comfortable and reliable bus travel services across Rajasthan and beyond.", category: "branding", label: "Company Description" },
        { key: "nav_banner_text", value: "🚌 Welcome to Sahu Travels - Your Fantasy, Our Mission 🚌", category: "branding", label: "Navigation Top Bar Banner Text" },
        { key: "mission_text", value: "To provide affordable, comfortable, and safe bus travel services that exceed customer expectations. We are committed to delivering premium travel experiences with professional service, modern buses, and exceptional customer care.", category: "about", label: "Company Mission Statement" },
        { key: "vision_text", value: "To become the most trusted and preferred bus travel company in India, known for reliability, comfort, and customer satisfaction. We aim to expand our services across all major cities while maintaining our commitment to quality and safety.", category: "about", label: "Company Vision Statement" },
        { key: "stat_buses", value: "35+", category: "stats", label: "Buses Count Stat" },
        { key: "stat_customers", value: "2000+", category: "stats", label: "Happy Customers Stat" },
        { key: "stat_years", value: "35", category: "stats", label: "Years of Service Stat" },
        { key: "stat_support", value: "24/7", category: "stats", label: "Customer Support Stat" },
        { key: "facebook_url", value: "https://facebook.com/sahutravels", category: "social", label: "Facebook Page URL" },
        { key: "instagram_url", value: "https://instagram.com/sahutravels", category: "social", label: "Instagram Profile URL" },
        { key: "whatsapp_number", value: "9636380801", category: "social", label: "WhatsApp Contact Number" },
        { key: "discount_percent", value: "20", category: "offers", label: "Main Discount Percentage" },
        { key: "discount_description", value: "Valid for both AC and Non-AC buses. Book your journey now and save!", category: "offers", label: "Main Discount Description" },
      ];
      await db.insert(siteSettings).values(defaultSettings);
    }

    // 2. Seed Services
    const servicesCount = await db.select({ count: count() }).from(services);
    if (servicesCount[0].count === 0) {
      console.log("[Database] Seeding default services...");
      const defaultServices = [
        {
          title: "Tours",
          description: "A journey that you do with everyone for pleasure, during which you visit many places, in which friends, relatives and family stay with you. We offer tours to popular pilgrimage centers in Jaipur, Udaipur, Jodhpur, Bikaner and other destinations.",
          icon: "MapPin",
          highlights: JSON.stringify([
            "Pilgrimage tours to religious sites",
            "Tourist destination packages",
            "Multi-day tour packages",
            "Flexible itineraries"
          ]),
          displayOrder: 1,
          isActive: 1,
        },
        {
          title: "Picnics",
          description: "Group outings and recreational travel for families, friends, and organizations. Enjoy comfortable travel to popular destinations and scenic locations with our well-maintained fleet.",
          icon: "Users",
          highlights: JSON.stringify([
            "Group picnic packages",
            "Scenic destination trips",
            "Family outings",
            "Corporate team building events"
          ]),
          displayOrder: 2,
          isActive: 1,
        },
        {
          title: "Marriage Parties",
          description: "When a person in the family or himself is about to get married at a far off place, then taking relatives and friends along in the bus and enjoying the joy before and after the wedding.",
          icon: "Heart",
          highlights: JSON.stringify([
            "Wedding guest transportation",
            "Pre-wedding event travel",
            "Post-wedding celebrations",
            "Comfortable seating for celebrations"
          ]),
          displayOrder: 3,
          isActive: 1,
        },
        {
          title: "Contract/Tenders",
          description: "For many persons, such as carrying and carrying officers and children, and in local movement, they serve the means with regular duties. Ideal for corporate and government organizations.",
          icon: "Briefcase",
          highlights: JSON.stringify([
            "Regular corporate transport",
            "Government organization services",
            "Employee commute solutions",
            "Customized contract packages"
          ]),
          displayOrder: 4,
          isActive: 1,
        },
      ];
      await db.insert(services).values(defaultServices);
    }

    // 3. Seed Milestones
    const milestonesCount = await db.select({ count: count() }).from(milestones);
    if (milestonesCount[0].count === 0) {
      console.log("[Database] Seeding default timeline milestones...");
      const defaultMilestones = [
        {
          year: "1989",
          title: "Founded in Kota",
          description: "Sahu Travels was established in Kota, Rajasthan with a single bus and a vision to provide comfortable travel.",
          displayOrder: 1,
          isActive: 1,
        },
        {
          year: "1995",
          title: "Expansion Begins",
          description: "Expanded fleet to 5 buses and started operating routes to major pilgrimage centers.",
          displayOrder: 2,
          isActive: 1,
        },
        {
          year: "2005",
          title: "Modern Fleet",
          description: "Invested in modern AC buses with latest amenities and safety features.",
          displayOrder: 3,
          isActive: 1,
        },
        {
          year: "2015",
          title: "Digital Era",
          description: "Launched online booking system and mobile app for customer convenience.",
          displayOrder: 4,
          isActive: 1,
        },
        {
          year: "2024",
          title: "35+ Modern Buses",
          description: "Today, we operate 35+ modern buses serving 2000+ satisfied customers annually.",
          displayOrder: 5,
          isActive: 1,
        },
      ];
      await db.insert(milestones).values(defaultMilestones);
    }

    // 4. Seed Offers
    const offersCount = await db.select({ count: count() }).from(offers);
    if (offersCount[0].count === 0) {
      console.log("[Database] Seeding default offers...");
      const defaultOffers = [
        {
          title: "20% Discount on Online Bookings",
          description: "Book your journey online and save up to 20% on your ticket fare. Valid for both AC and Non-AC buses across all routes.",
          discountPercent: 20,
          icon: "Gift",
          termsConditions: JSON.stringify([
            "The 20% discount is applicable only on online bookings through our website",
            "Discount is valid for both AC and Non-AC buses across all routes",
            "Offer cannot be combined with other promotional offers or discounts",
            "Discount is automatically applied at checkout for eligible bookings",
            "Cancellation and refund policies apply as per standard terms",
            "Sahu Travels reserves the right to modify or withdraw offers at any time"
          ]),
          isMainOffer: 1,
          isActive: 1,
          displayOrder: 1,
        },
        {
          title: "Group Discounts",
          description: "Special rates for group bookings of 20+ passengers.",
          discountPercent: 10,
          icon: "Users",
          termsConditions: JSON.stringify(["Valid for groups of 20 or more traveling together", "Requires 7 days advance booking"]),
          isMainOffer: 0,
          isActive: 1,
          displayOrder: 2,
        },
        {
          title: "Early Bird Offers",
          description: "Extra discounts for bookings made 30 days in advance.",
          discountPercent: 15,
          icon: "Zap",
          termsConditions: JSON.stringify(["Applicable for bookings made at least 30 days before journey date"]),
          isMainOffer: 0,
          isActive: 1,
          displayOrder: 3,
        },
        {
          title: "Corporate Packages",
          description: "Customized packages for corporate and institutional clients.",
          discountPercent: 0,
          icon: "Briefcase",
          termsConditions: JSON.stringify(["Requires valid corporate contract registration"]),
          isMainOffer: 0,
          isActive: 1,
          displayOrder: 4,
        },
      ];
      await db.insert(offers).values(defaultOffers);
    }

    // 5. Seed Bus Fleet
    const fleetCount = await db.select({ count: count() }).from(busFleet);
    if (fleetCount[0].count === 0) {
      console.log("[Database] Seeding default bus fleet...");
      const defaultFleet = [
        {
          name: "2x2 AC Premium",
          type: "2x2",
          isAC: 1,
          seats: 42,
          class: "Premium",
          amenities: JSON.stringify([
            "Air Conditioned",
            "Push-Back Seats",
            "LED Lights",
            "Music System",
            "Charging Points",
            "WiFi",
            "CCTV",
            "GPS Tracking"
          ]),
          imageUrl: "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=600&h=400&fit=crop",
        },
        {
          name: "3x2 AC Extra Premium",
          type: "3x2",
          isAC: 1,
          seats: 56,
          class: "Extra Premium",
          amenities: JSON.stringify([
            "Air Conditioned (Cool & Heater)",
            "Push-Back Seats With Comfort",
            "LED Lights",
            "JBL Music System",
            "Charging Points",
            "WiFi",
            "CCTV",
            "GPS Tracking"
          ]),
          imageUrl: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=400&fit=crop",
        },
        {
          name: "2x2 Non-AC Deluxe",
          type: "2x2",
          isAC: 0,
          seats: 32,
          class: "Deluxe",
          amenities: JSON.stringify([
            "Comfortable Seats",
            "Music System",
            "Charging Points",
            "Reading Lights",
            "CCTV",
            "GPS Tracking"
          ]),
          imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop",
        },
        {
          name: "3x2 AC Deluxe",
          type: "3x2",
          isAC: 1,
          seats: 56,
          class: "Deluxe",
          amenities: JSON.stringify([
            "Air Conditioned",
            "Push-Back Seats",
            "Music System",
            "Charging Points",
            "LED Lights",
            "CCTV",
            "GPS Tracking"
          ]),
          imageUrl: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=600&h=400&fit=crop",
        },
      ];
      await db.insert(busFleet).values(defaultFleet);
    }

    // 6. Seed Gallery Photos
    const galleryCount = await db.select({ count: count() }).from(galleryPhotos);
    if (galleryCount[0].count === 0) {
      console.log("[Database] Seeding default gallery photos...");
      const defaultPhotos = [
        {
          title: "Luxury AC Bus Interior",
          category: "AC Interior" as const,
          imageUrl: "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=600&h=400&fit=crop",
          isActive: 1,
          displayOrder: 1,
        },
        {
          title: "Premium AC Bus Seating",
          category: "AC Interior" as const,
          imageUrl: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=400&fit=crop",
          isActive: 1,
          displayOrder: 2,
        },
        {
          title: "AC Bus Comfort Features",
          category: "AC Interior" as const,
          imageUrl: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=600&h=400&fit=crop",
          isActive: 1,
          displayOrder: 3,
        },
        {
          title: "Modern Coach Bus Exterior",
          category: "AC Exterior" as const,
          imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop",
          isActive: 1,
          displayOrder: 4,
        },
        {
          title: "Non-AC Bus Interior",
          category: "Non-AC Interior" as const,
          imageUrl: "https://images.unsplash.com/photo-1468817814171-2e4edd3a2c01?w=600&h=400&fit=crop",
          isActive: 1,
          displayOrder: 5,
        },
        {
          title: "Non-AC Bus Seating",
          category: "Non-AC Interior" as const,
          imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop",
          isActive: 1,
          displayOrder: 6,
        },
        {
          title: "Comfortable Non-AC Interior",
          category: "Non-AC Interior" as const,
          imageUrl: "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=600&h=400&fit=crop",
          isActive: 1,
          displayOrder: 7,
        },
        {
          title: "Premium Bus Features",
          category: "Other" as const,
          imageUrl: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=400&fit=crop",
          isActive: 1,
          displayOrder: 8,
        },
      ];
      await db.insert(galleryPhotos).values(defaultPhotos);
    }

    console.log("[Database] Seeding check completed.");
  } catch (error) {
    console.error("[Database] Failed to seed database:", error);
  }
}


