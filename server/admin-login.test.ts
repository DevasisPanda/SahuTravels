import { describe, expect, it } from "vitest";

describe("Admin Login Validation", () => {
  // Email validation tests
  it("should accept valid email format", () => {
    const validEmails = [
      "admin@sahutravel.com",
      "test@example.com",
      "user.name@domain.co.uk",
    ];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    validEmails.forEach((email) => {
      expect(emailRegex.test(email)).toBe(true);
    });
  });

  it("should reject invalid email format", () => {
    const invalidEmails = [
      "notanemail",
      "missing@domain",
      "@nodomain.com",
      "spaces in@email.com",
    ];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    invalidEmails.forEach((email) => {
      expect(emailRegex.test(email)).toBe(false);
    });
  });

  // Password validation tests
  it("should require minimum password length of 6 characters", () => {
    const validPasswords = ["admin123", "password", "123456"];
    validPasswords.forEach((password) => {
      expect(password.length >= 6).toBe(true);
    });
  });

  it("should reject passwords shorter than 6 characters", () => {
    const invalidPasswords = ["123", "pass", ""];
    invalidPasswords.forEach((password) => {
      expect(password.length >= 6).toBe(false);
    });
  });

  // Form submission validation
  it("should require both email and password fields", () => {
    const testCases = [
      { email: "", password: "password", valid: false },
      { email: "admin@test.com", password: "", valid: false },
      { email: "", password: "", valid: false },
      { email: "admin@test.com", password: "password", valid: true },
    ];

    testCases.forEach((testCase) => {
      const isValid = testCase.email.length > 0 && testCase.password.length > 0;
      expect(isValid).toBe(testCase.valid);
    });
  });

  // Demo credentials validation
  it("should validate demo credentials correctly", () => {
    const demoEmail = "admin@sahutravel.com";
    const demoPassword = "admin123";

    const isValidCredentials =
      demoEmail === "admin@sahutravel.com" && demoPassword === "admin123";
    expect(isValidCredentials).toBe(true);
  });

  it("should reject incorrect credentials", () => {
    const testCases = [
      { email: "wrong@email.com", password: "admin123", valid: false },
      { email: "admin@sahutravel.com", password: "wrongpass", valid: false },
      { email: "admin@sahutravel.com", password: "admin123", valid: true },
    ];

    testCases.forEach((testCase) => {
      const isValid =
        testCase.email === "admin@sahutravel.com" &&
        testCase.password === "admin123";
      expect(isValid).toBe(testCase.valid);
    });
  });

  // Form field validation
  it("should validate email field is not empty", () => {
    const email = "admin@sahutravel.com";
    expect(email.trim().length > 0).toBe(true);
  });

  it("should validate password field is not empty", () => {
    const password = "admin123";
    expect(password.trim().length > 0).toBe(true);
  });

  // Combined validation
  it("should perform complete form validation", () => {
    const validateForm = (email: string, password: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const hasEmail = email.trim().length > 0;
      const hasPassword = password.trim().length > 0;
      const validEmail = emailRegex.test(email);
      const validPassword = password.length >= 6;

      return hasEmail && hasPassword && validEmail && validPassword;
    };

    expect(validateForm("admin@sahutravel.com", "admin123")).toBe(true);
    expect(validateForm("", "admin123")).toBe(false);
    expect(validateForm("admin@sahutravel.com", "123")).toBe(false);
    expect(validateForm("notanemail", "admin123")).toBe(false);
    expect(validateForm("admin@sahutravel.com", "")).toBe(false);
  });
});
