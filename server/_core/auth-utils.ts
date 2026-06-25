import crypto from 'crypto';

// Simple password hashing (in production, use bcrypt)
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
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
