import { z } from "zod";
import crypto from "node:crypto";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, adminProcedure } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import * as authUtils from "./_core/auth-utils";
import { storagePut } from "./storage";
import {
  createBooking,
  getBookings,
  updateBookingStatus,
  createFeedback,
  getPublishedFeedback,
  getAllFeedbackForAdmin,
  updateFeedback,
  deleteFeedback,
  getBusFleet,
  createBusFleet,
  updateBusFleet,
  deleteBusFleet,
  createHomeBanner,
  getActiveBanners,
  getAllBanners,
  updateBanner,
  deleteBanner,
  createGalleryPhoto,
  getGalleryPhotos,
  getGalleryPhotosByCategory,
  updateGalleryPhoto,
  deleteGalleryPhoto,
  getAllGalleryPhotosForAdmin,
  getUserByEmail,
  createSession,
  deleteSession,
  deleteSessionsByUserId,
  updateUserLastSignedIn,
  getAllSettings,
  updateSetting,
  bulkUpdateSettings,
  getSettingByKey,
  upsertSettingByKey,
  createService,
  getServices,
  getAllServicesForAdmin,
  updateService,
  deleteService,
  createMilestone,
  getMilestones,
  getAllMilestonesForAdmin,
  updateMilestone,
  deleteMilestone,
  createOffer,
  getOffers,
  getAllOffersForAdmin,
  updateOffer,
  deleteOffer,
} from "./db";

// Sanitization helpers to strip HTML/script tags and enforce max length
const safeString = (maxLen: number) => 
  z.string()
    .max(maxLen)
    .transform(val => val.replace(/<[^>]*>/g, '').trim());

const safeStringOptional = (maxLen: number) => 
  z.string()
    .max(maxLen)
    .transform(val => val.replace(/<[^>]*>/g, '').trim())
    .optional();

const safeLink = z.string()
  .max(255)
  .transform(val => val.trim())
  .refine(val => {
    if (!val) return true;
    return val.startsWith("/") || val.startsWith("http://") || val.startsWith("https://");
  }, {
    message: "Link must be a relative path starting with '/' or an absolute URL starting with http:// or https://",
  });

const safeLinkOptional = z.string()
  .max(255)
  .transform(val => val.trim())
  .refine(val => {
    if (!val) return true;
    return val.startsWith("/") || val.startsWith("http://") || val.startsWith("https://");
  }, {
    message: "Link must be a relative path starting with '/' or an absolute URL starting with http:// or https://",
  })
  .optional();

export const appRouter = router({
  system: systemRouter,
  media: router({
    uploadImage: adminProcedure
      .input(
        z.object({
          filename: z.string(),
          mimeType: z.string(),
          base64: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const matches = input.base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        let buffer: Buffer;
        let mimeType = input.mimeType;

        if (matches && matches.length === 3) {
          mimeType = matches[1];
          buffer = Buffer.from(matches[2], "base64");
        } else {
          buffer = Buffer.from(input.base64, "base64");
        }

        if (!mimeType.startsWith("image/")) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Only image files are allowed",
          });
        }

        if (buffer.length > 5 * 1024 * 1024) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Image must be less than 5MB",
          });
        }

        const ext = mimeType.split("/")[1] || "png";
        const uniqueKey = `uploads/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;

        const uploadResult = await storagePut(uniqueKey, buffer, mimeType);
        return {
          success: true,
          url: uploadResult.url,
        };
      }),
  }),
  survey: router({
    createLink: adminProcedure
      .input(
        z.object({
          label: z.string().min(1).max(100),
          expiryDays: z.number().int().min(1).max(365),
        })
      )
      .mutation(async ({ input }) => {
        const token = crypto.randomBytes(6).toString("hex");
        const expiresAt = new Date(Date.now() + input.expiryDays * 24 * 60 * 60 * 1000);
        
        const setting = await getSettingByKey("survey_links");
        let links: any[] = [];
        if (setting && setting.value) {
          try {
            links = JSON.parse(setting.value);
            if (!Array.isArray(links)) links = [];
          } catch {
            links = [];
          }
        }
        
        links.push({
          token,
          label: input.label,
          expiresAt: expiresAt.toISOString(),
          isActive: 1,
        });
        
        await upsertSettingByKey("survey_links", JSON.stringify(links), "system", "Survey Links");
        return { success: true, token };
      }),
      
    listLinks: adminProcedure.query(async () => {
      const setting = await getSettingByKey("survey_links");
      if (!setting || !setting.value) return [];
      try {
        const links = JSON.parse(setting.value);
        return Array.isArray(links) ? links : [];
      } catch {
        return [];
      }
    }),
    
    deleteLink: adminProcedure
      .input(z.object({ token: z.string() }))
      .mutation(async ({ input }) => {
        const setting = await getSettingByKey("survey_links");
        if (!setting || !setting.value) return { success: false };
        let links: any[] = [];
        try {
          links = JSON.parse(setting.value);
          if (!Array.isArray(links)) links = [];
        } catch {
          links = [];
        }
        
        const updated = links.filter((l: any) => l.token !== input.token);
        await upsertSettingByKey("survey_links", JSON.stringify(updated), "system", "Survey Links");
        return { success: true };
      }),
      
    verifyLink: publicProcedure
      .input(z.object({ token: z.string() }))
      .query(async ({ input }) => {
        const setting = await getSettingByKey("survey_links");
        if (!setting || !setting.value) return { isValid: false, reason: "No active surveys" };
        try {
          const links = JSON.parse(setting.value);
          if (!Array.isArray(links)) return { isValid: false, reason: "Invalid survey config" };
          
          const link = links.find((l: any) => l.token === input.token);
          if (!link) return { isValid: false, reason: "Survey link not found" };
          if (link.isActive !== 1) return { isValid: false, reason: "Survey link is inactive" };
          
          const isExpired = new Date() > new Date(link.expiresAt);
          if (isExpired) return { isValid: false, reason: "Survey link has expired" };
          
          return { isValid: true, label: link.label };
        } catch {
          return { isValid: false, reason: "System error" };
        }
      }),
  }),
  auth: router({
    me: publicProcedure.query(opts => {
      const user = opts.ctx.user;
      if (!user) return null;
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
    }),
    logout: publicProcedure.mutation(async ({ ctx }) => {
      const token = ctx.req.cookies?.[COOKIE_NAME];
      if (token) {
        await deleteSession(token);
      }
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    adminLogin: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          password: z.string().min(6),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const user = await getUserByEmail(input.email);
        
        if (!user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid email or password",
          });
        }

        // Verify password first to prevent timing-based user enumeration
        const isPasswordValid = await authUtils.verifyPassword(
          input.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid email or password",
          });
        }

        // Role check after password verification
        if (user.role !== "admin") {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid email or password",
          });
        }

        if (user.isActive !== 1) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "This account has been deactivated",
          });
        }

        // Delete all old sessions for this user before creating a new one (Session Rotation)
        await deleteSessionsByUserId(user.id);

        // Create session (expires in 24 hours)
        const token = authUtils.generateSessionToken();
        const EXPIRES_24H_MS = 24 * 60 * 60 * 1000;
        const expiresAt = new Date(Date.now() + EXPIRES_24H_MS);

        await createSession({
          userId: user.id,
          token,
          expiresAt,
        });

        // Update last signed in
        await updateUserLastSignedIn(user.id);

        // Set session cookie (expires in 24 hours)
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, token, {
          ...cookieOptions,
          maxAge: EXPIRES_24H_MS,
        });

        return {
          success: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
        };
      }),
  }),

  bookings: router({
    create: publicProcedure
      .input(
        z.object({
          name: safeString(255),
          email: safeStringOptional(320).refine(val => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), { message: "Invalid email format" }),
          phone: safeString(20),
          journeyDate: safeString(50),
          source: safeString(255),
          destination: safeString(255),
          busType: safeString(100),
          passengers: z.number().min(1).max(500),
          specialRequests: safeStringOptional(1000),
        })
      )
      .mutation(async ({ input }) => {
        const booking = await createBooking({
          name: input.name,
          email: input.email || null,
          phone: input.phone,
          journeyDate: input.journeyDate,
          source: input.source,
          destination: input.destination,
          busType: input.busType,
          passengers: input.passengers,
          specialRequests: input.specialRequests || null,
        });
        return { success: true, id: booking.insertId };
      }),
    list: adminProcedure
      .input(
        z.object({
          limit: z.number().int().min(1).max(100).optional(),
          offset: z.number().int().min(0).optional(),
        }).optional()
      )
      .query(async ({ input }) => {
        return await getBookings(input?.limit, input?.offset);
      }),
    updateStatus: adminProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["pending", "confirmed", "cancelled", "completed"]),
        })
      )
      .mutation(async ({ input }) => {
        await updateBookingStatus(input.id, input.status);
        return { success: true };
      }),
  }),

  feedback: router({
    create: publicProcedure
      .input(
        z.object({
          name: safeString(255),
          email: safeStringOptional(320).refine(val => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), { message: "Invalid email format" }),
          rating: z.number().min(1).max(5),
          message: safeString(5000),
        })
      )
      .mutation(async ({ input }) => {
        const feedback = await createFeedback({
          name: input.name,
          email: input.email,
          rating: input.rating,
          message: input.message,
          isPublished: 0, // All public submissions default to unpublished (require admin approval)
        });
        return { success: true, id: (feedback as any).insertId };
      }),
    list: publicProcedure.query(async () => {
      return await getPublishedFeedback();
    }),
    listAll: adminProcedure.query(async () => {
      return await getAllFeedbackForAdmin();
    }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          email: z.string().optional(),
          rating: z.number().optional(),
          message: z.string().optional(),
          isPublished: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...updateData } = input;
        await updateFeedback(id, updateData);
        return { success: true };
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteFeedback(input.id);
        return { success: true };
      }),
  }),

  fleet: router({
    list: publicProcedure.query(async () => {
      return await getBusFleet();
    }),
    create: adminProcedure
      .input(
        z.object({
          name: safeString(100),
          type: safeString(50),
          isAC: z.number(),
          seats: z.number().min(1).max(100),
          class: safeString(50),
          amenities: safeString(500),
          imageUrl: z.string().url().refine(val => val.startsWith("http://") || val.startsWith("https://"), { message: "Image URL must start with http:// or https://" }).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const result = await createBusFleet({
          name: input.name,
          type: input.type,
          isAC: input.isAC,
          seats: input.seats,
          class: input.class,
          amenities: input.amenities,
          imageUrl: input.imageUrl || null,
        });
        return { success: true, id: result.insertId };
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          name: safeStringOptional(100),
          type: safeStringOptional(50),
          isAC: z.number().optional(),
          seats: z.number().min(1).max(100).optional(),
          class: safeStringOptional(50),
          amenities: safeStringOptional(500),
          imageUrl: z.string().url().refine(val => val.startsWith("http://") || val.startsWith("https://"), { message: "Image URL must start with http:// or https://" }).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...updateData } = input;
        await updateBusFleet(id, updateData);
        return { success: true };
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteBusFleet(input.id);
        return { success: true };
      }),
  }),

  banners: router({
    list: publicProcedure.query(async () => {
      return await getActiveBanners();
    }),
    create: adminProcedure
      .input(
        z.object({
          title: safeString(255),
          description: safeStringOptional(1000),
          imageUrl: z.string().url().refine(val => val.startsWith("http://") || val.startsWith("https://"), { message: "Image URL must start with http:// or https://" }),
          ctaText: safeStringOptional(100),
          ctaLink: safeLinkOptional,
        })
      )
      .mutation(async ({ input }) => {
        const banner = await createHomeBanner({
          title: input.title,
          description: input.description || null,
          imageUrl: input.imageUrl,
          ctaText: input.ctaText || null,
          ctaLink: input.ctaLink || null,
        });
        return { success: true, id: (banner as any).insertId };
      }),
    listAll: adminProcedure.query(async () => {
      return await getAllBanners();
    }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          title: safeStringOptional(255),
          description: safeStringOptional(1000),
          imageUrl: z.string().url().refine(val => val.startsWith("http://") || val.startsWith("https://"), { message: "Image URL must start with http:// or https://" }).optional(),
          ctaText: safeStringOptional(100),
          ctaLink: safeLinkOptional,
          isActive: z.number().optional(),
          displayOrder: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...updateData } = input;
        await updateBanner(id, updateData);
        return { success: true };
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteBanner(input.id);
        return { success: true };
      }),
  }),

  gallery: router({
    list: publicProcedure.query(async () => {
      return await getGalleryPhotos();
    }),
    listByCategory: publicProcedure
      .input(z.object({ category: z.enum(["AC Interior", "AC Exterior", "Non-AC Interior", "Non-AC Exterior", "Other"]) }))
      .query(async ({ input }) => {
        return await getGalleryPhotosByCategory(input.category);
      }),
    create: adminProcedure
      .input(
        z.object({
          title: safeString(255),
          description: safeStringOptional(1000),
          imageUrl: z.string().url().refine(val => val.startsWith("http://") || val.startsWith("https://"), { message: "Image URL must start with http:// or https://" }),
          category: z.enum(["AC Interior", "AC Exterior", "Non-AC Interior", "Non-AC Exterior", "Other"]),
          busType: safeStringOptional(50),
          displayOrder: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const result = await createGalleryPhoto({
          title: input.title,
          description: input.description || null,
          imageUrl: input.imageUrl,
          category: input.category,
          busType: input.busType || null,
          displayOrder: input.displayOrder || 0,
          isActive: 1,
        });
        return { success: true, id: result.insertId };
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          title: safeStringOptional(255),
          description: safeStringOptional(1000),
          imageUrl: z.string().url().refine(val => val.startsWith("http://") || val.startsWith("https://"), { message: "Image URL must start with http:// or https://" }).optional(),
          category: z.enum(["AC Interior", "AC Exterior", "Non-AC Interior", "Non-AC Exterior", "Other"]).optional(),
          busType: safeStringOptional(50),
          isActive: z.number().optional(),
          displayOrder: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...updateData } = input;
        await updateGalleryPhoto(id, updateData);
        return { success: true };
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteGalleryPhoto(input.id);
        return { success: true };
      }),
    listAll: adminProcedure.query(async () => {
      return await getAllGalleryPhotosForAdmin();
    }),
  }),

  settings: router({
    getAll: publicProcedure.query(async () => {
      const dbSettings = await getAllSettings();
      const settingsRecord: Record<string, string> = {};
      const PUBLIC_SETTINGS_KEYS = new Set([
        "phone_primary", "phone_secondary", "email_primary", "email_secondary",
        "address_line1", "address_line2", "address_city", "business_hours",
        "google_maps_link", "google_maps_embed",
        "company_name", "established_year", "logo_url", "nav_banner_text",
        "tagline", "company_description",
        "mission_text", "vision_text",
        "stat_buses", "stat_customers", "stat_years", "stat_support",
        "discount_percent", "discount_description",
        "facebook_url", "instagram_url", "whatsapp_number"
      ]);
      dbSettings.forEach(s => {
        if (PUBLIC_SETTINGS_KEYS.has(s.key)) {
          settingsRecord[s.key] = s.value;
        }
      });
      return settingsRecord;
    }),
    list: adminProcedure.query(async () => {
      return await getAllSettings();
    }),
    update: adminProcedure
      .input(
        z.object({
          key: z.string(),
          value: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        await updateSetting(input.key, input.value);
        return { success: true };
      }),
    bulkUpdate: adminProcedure
      .input(
        z.array(
          z.object({
            key: z.string(),
            value: z.string(),
          })
        ).max(100)
      )
      .mutation(async ({ input }) => {
        await bulkUpdateSettings(input);
        return { success: true };
      }),
  }),

  services: router({
    list: publicProcedure.query(async () => {
      return await getServices();
    }),
    listAll: adminProcedure.query(async () => {
      return await getAllServicesForAdmin();
    }),
    create: adminProcedure
      .input(
        z.object({
          title: safeString(255),
          description: safeString(5000),
          icon: safeString(50),
          highlights: safeString(5000), // JSON string
          displayOrder: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const result = await createService({
          title: input.title,
          description: input.description,
          icon: input.icon,
          highlights: input.highlights,
          displayOrder: input.displayOrder || 0,
          isActive: 1,
        });
        return { success: true, id: result.insertId };
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          title: safeStringOptional(255),
          description: safeStringOptional(5000),
          icon: safeStringOptional(50),
          highlights: safeStringOptional(5000),
          isActive: z.number().optional(),
          displayOrder: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...updateData } = input;
        await updateService(id, updateData);
        return { success: true };
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteService(input.id);
        return { success: true };
      }),
  }),

  milestones: router({
    list: publicProcedure.query(async () => {
      return await getMilestones();
    }),
    listAll: adminProcedure.query(async () => {
      return await getAllMilestonesForAdmin();
    }),
    create: adminProcedure
      .input(
        z.object({
          year: safeString(10),
          title: safeString(255),
          description: safeString(5000),
          displayOrder: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const result: Awaited<ReturnType<typeof createMilestone>> = await createMilestone({
          year: input.year,
          title: input.title,
          description: input.description,
          displayOrder: input.displayOrder || 0,
          isActive: 1,
        });
        return { success: true, id: result.insertId };
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          year: safeStringOptional(10),
          title: safeStringOptional(255),
          description: safeStringOptional(5000),
          isActive: z.number().optional(),
          displayOrder: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...updateData } = input;
        await updateMilestone(id, updateData);
        return { success: true };
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteMilestone(input.id);
        return { success: true };
      }),
  }),

  offers: router({
    list: publicProcedure.query(async () => {
      return await getOffers();
    }),
    listAll: adminProcedure.query(async () => {
      return await getAllOffersForAdmin();
    }),
    create: adminProcedure
      .input(
        z.object({
          title: safeString(255),
          description: safeString(5000),
          discountPercent: z.number().min(0).max(100).optional(),
          icon: safeStringOptional(50),
          termsConditions: safeString(5000), // JSON string
          isMainOffer: z.number().optional(),
          displayOrder: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const result = await createOffer({
          title: input.title,
          description: input.description,
          discountPercent: input.discountPercent || null,
          icon: input.icon || null,
          termsConditions: input.termsConditions,
          isMainOffer: input.isMainOffer || 0,
          displayOrder: input.displayOrder || 0,
          isActive: 1,
        });
        return { success: true, id: result.insertId };
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          title: safeStringOptional(255),
          description: safeStringOptional(5000),
          discountPercent: z.number().min(0).max(100).optional(),
          icon: safeStringOptional(50),
          termsConditions: safeStringOptional(5000),
          isMainOffer: z.number().optional(),
          isActive: z.number().optional(),
          displayOrder: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...updateData } = input;
        await updateOffer(id, updateData);
        return { success: true };
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteOffer(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
