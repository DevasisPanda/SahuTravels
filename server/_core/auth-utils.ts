import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Password hashing using bcrypt (cost factor 12) with legacy SHA-256 fallback
export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 12);
}

export function verifyPassword(password: string, hash: string): boolean {
  if (hash.startsWith('$2a$') || hash.startsWith('$2b$') || hash.startsWith('$2y$')) {
    try {
      return bcrypt.compareSync(password, hash);
    } catch (e) {
      return false;
    }
  }
  // Fallback for legacy SHA-256 hashes
  const legacyHash = crypto.createHash('sha256').update(password).digest('hex');
  return legacyHash === hash;
}

// Generate secure session token
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Generate session expiry (24 hours from now)
export function getSessionExpiry(): Date {
  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + 24);
  return expiryDate;
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password strength
export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}
