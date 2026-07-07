import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerCustomAuthRoutes } from "./custom-auth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { seedDatabase } from "../db";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Trust proxy for secure cookies and rate limiting behind reverse proxies (e.g. Nginx, Cloudflare)
  app.set("trust proxy", 1);

  // Configure CORS
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );

  // Configure Helmet (Security Headers)
  app.use(
    helmet({
      contentSecurityPolicy: process.env.NODE_ENV === "production" ? {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://www.google.com"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://via.placeholder.com", "https://res.cloudinary.com"],
          connectSrc: ["'self'", "ws:", "wss:"],
          frameSrc: ["'self'", "https://www.google.com", "https://maps.google.com"],
        },
      } : false, // Disable CSP in dev to avoid breaking Vite hot module reloading (HMR)
      crossOriginEmbedderPolicy: false,
    })
  );

  // Stateless CSRF Protection Middleware
  app.use((req, res, next) => {
    if (["POST", "PUT", "DELETE", "PATCH"].includes(req.method)) {
      const requestedWith = req.header("X-Requested-With");
      const trpcSource = req.header("x-trpc-source");
      if (!requestedWith && !trpcSource) {
        res.status(403).json({ error: "CSRF check failed: Missing security headers" });
        return;
      }
    }
    next();
  });

  // Strict Login Rate Limiter (Max 10 requests per 15 minutes)
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many login attempts. Please try again after 15 minutes." },
  });

  app.use("/api/auth/login", loginLimiter);
  app.use("/api/auth/admin-login", loginLimiter);
  app.use("/api/trpc/auth.adminLogin", loginLimiter);

  // General API Rate Limiter (Max 100 requests per 15 minutes)
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests. Please try again after 15 minutes." },
  });

  app.use("/api/", apiLimiter);

  // Configure body parser with safer size limit (10MB) to allow image uploads while preventing large request DoS
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ limit: "10mb", extended: true }));
  app.use(cookieParser());
  registerCustomAuthRoutes(app);
  // Auto-seed database if empty
  await seedDatabase();
  // OAuth is disabled - using custom authentication instead
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
