import { z } from "zod";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, adminProcedure } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import * as authUtils from "./_core/auth-utils";
import {
  createBooking,
  getBookings,
  createFeedback,
  getPublishedFeedback,
  getBusFleet,
  createHomeBanner,
  getActiveBanners,
  getAllBanners,
  updateBanner,
  deleteBanner,
  createGalleryPhoto,
  getGalleryPhotos,
  updateGalleryPhoto,
  deleteGalleryPhoto,
  getAllGalleryPhotosForAdmin,
  getUserByEmail,
  createSession,
  updateUserLastSignedIn,
} from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
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

        if (user.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only admin users can log in here",
          });
        }

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

        // Create session
        const token = authUtils.generateSessionToken();
        const expiresAt = new Date(Date.now() + ONE_YEAR_MS);

        await createSession({
          userId: user.id,
          token,
          expiresAt,
        });

        // Update last signed in
        await updateUserLastSignedIn(user.id);

        // Set session cookie
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie("auth_session", token, {
          ...cookieOptions,
          maxAge: ONE_YEAR_MS,
        });

        return {
          success: true,
          user,
        };
      }),
  }),

  bookings: router({
    create: publicProcedure
      .input(
        z.object({
          name: z.string().min(1),
          email: z.string().email().optional(),
          phone: z.string().min(10),
          journeyDate: z.string().min(1),
          source: z.string().min(1),
          destination: z.string().min(1),
          busType: z.string().min(1),
          passengers: z.number().min(1),
          specialRequests: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const booking = await createBooking({
          name: input.name,
          email: input.email,
          phone: input.phone,
          journeyDate: input.journeyDate,
          source: input.source,
          destination: input.destination,
          busType: input.busType,
          passengers: input.passengers,
          specialRequests: input.specialRequests,
        });
        return { success: true, id: (booking as any).insertId };
      }),
    list: adminProcedure.query(async () => {
      return await getBookings();
    }),
  }),

  feedback: router({
    create: publicProcedure
      .input(
        z.object({
          name: z.string().min(1),
          email: z.string().email().optional(),
          rating: z.number().min(1).max(5),
          message: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        const feedback = await createFeedback({
          name: input.name,
          email: input.email,
          rating: input.rating,
          message: input.message,
        });
        return { success: true, id: (feedback as any).insertId };
      }),
    list: publicProcedure.query(async () => {
      return await getPublishedFeedback();
    }),
  }),

  fleet: router({
    list: publicProcedure.query(async () => {
      return await getBusFleet();
    }),
  }),

  banners: router({
    list: publicProcedure.query(async () => {
      return await getActiveBanners();
    }),
    create: adminProcedure
      .input(
        z.object({
          title: z.string().min(1),
          description: z.string().optional(),
          imageUrl: z.string().url(),
          ctaText: z.string().optional(),
          ctaLink: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const banner = await createHomeBanner({
          title: input.title,
          description: input.description,
          imageUrl: input.imageUrl,
          ctaText: input.ctaText,
          ctaLink: input.ctaLink,
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
          title: z.string().optional(),
          description: z.string().optional(),
          imageUrl: z.string().url().optional(),
          ctaText: z.string().optional(),
          ctaLink: z.string().optional(),
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
      .input(z.object({ category: z.string() }))
      .query(async ({ input }) => {
        const photos = await getGalleryPhotos();
        return photos.filter(p => p.category === input.category);
      }),
    create: adminProcedure
      .input(
        z.object({
          title: z.string().min(1),
          description: z.string().optional(),
          imageUrl: z.string().url(),
          category: z.enum(["AC Interior", "AC Exterior", "Non-AC Interior", "Non-AC Exterior", "Other"]),
          busType: z.string().optional(),
          displayOrder: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const result = await createGalleryPhoto({
          ...input,
          isActive: 1,
        });
        return { success: true, id: (result as any).insertId };
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          description: z.string().optional(),
          imageUrl: z.string().url().optional(),
          category: z.enum(["AC Interior", "AC Exterior", "Non-AC Interior", "Non-AC Exterior", "Other"]).optional(),
          busType: z.string().optional(),
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
});

export type AppRouter = typeof appRouter;
