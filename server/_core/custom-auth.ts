import type { Express, Request, Response } from "express";
import * as db from "../db";
import { COOKIE_NAME } from "../../shared/const";
import { getSessionCookieOptions } from "./cookies";
import { hashPassword, verifyPassword, generateSessionToken, getSessionExpiry, isValidEmail, isValidPassword } from "./auth-utils";

export function registerCustomAuthRoutes(app: Express) {
  // User Registration
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { email, password, name, phone } = req.body;

      // Validation
      if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
      }

      if (!isValidEmail(email)) {
        res.status(400).json({ error: "Invalid email format" });
        return;
      }

      if (!isValidPassword(password)) {
        res.status(400).json({ error: "Password must be at least 6 characters" });
        return;
      }

      // Check if user exists
      const existingUser = await db.getUserByEmail(email);
      if (existingUser) {
        res.status(409).json({ error: "Email already registered" });
        return;
      }

      // Create user
      const hashedPassword = hashPassword(password);
      const result = await db.createUser({
        email,
        password: hashedPassword,
        name: name || null,
        phone: phone || null,
        role: "user",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      res.status(201).json({ message: "User registered successfully", userId: result.insertId });
    } catch (error) {
      console.error("[Auth] Registration failed:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  // User Login
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
      }

      // Find user
      const user = await db.getUserByEmail(email);
      if (!user) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }

      // Verify password
      if (!verifyPassword(password, user.password)) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }

      // Check if user is active
      if (!user.isActive) {
        res.status(403).json({ error: "Account is inactive" });
        return;
      }

      // Create session
      const token = generateSessionToken();
      const expiresAt = getSessionExpiry();

      await db.createSession({
        userId: user.id!,
        token,
        expiresAt,
        createdAt: new Date(),
      });

      // Update last signed in
      await db.updateUserLastSignedIn(user.id!);

      // Set cookie
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 });

      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("[Auth] Login failed:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Admin Login
  app.post("/api/auth/admin-login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
      }

      // Find user
      const user = await db.getUserByEmail(email);
      if (!user) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      // Check if admin
      if (user.role !== "admin") {
        res.status(403).json({ error: "Not authorized as admin" });
        return;
      }

      // Verify password
      if (!verifyPassword(password, user.password)) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      // Check if user is active
      if (!user.isActive) {
        res.status(403).json({ error: "Account is inactive" });
        return;
      }

      // Create session
      const token = generateSessionToken();
      const expiresAt = getSessionExpiry();

      await db.createSession({
        userId: user.id!,
        token,
        expiresAt,
        createdAt: new Date(),
      });

      // Update last signed in
      await db.updateUserLastSignedIn(user.id!);

      // Set cookie
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 });

      res.json({
        message: "Admin login successful",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("[Auth] Admin login failed:", error);
      res.status(500).json({ error: "Admin login failed" });
    }
  });

  // Logout
  app.post("/api/auth/logout", async (req: Request, res: Response) => {
    try {
      const token = req.cookies[COOKIE_NAME];
      if (token) {
        await db.deleteSession(token);
      }

      res.clearCookie(COOKIE_NAME);
      res.json({ message: "Logout successful" });
    } catch (error) {
      console.error("[Auth] Logout failed:", error);
      res.status(500).json({ error: "Logout failed" });
    }
  });

  // Get current user
  app.get("/api/auth/me", async (req: Request, res: Response) => {
    try {
      const token = req.cookies[COOKIE_NAME];
      if (!token) {
        res.status(401).json({ error: "Not authenticated" });
        return;
      }

      const session = await db.getSessionByToken(token);
      if (!session) {
        res.status(401).json({ error: "Session expired" });
        return;
      }

      const user = await db.getUserById(session.userId);
      if (!user) {
        res.status(401).json({ error: "User not found" });
        return;
      }

      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });
    } catch (error) {
      console.error("[Auth] Get current user failed:", error);
      res.status(500).json({ error: "Failed to get user info" });
    }
  });
}
