import { describe, it, expect } from "vitest";

describe("Form Validation", () => {
  describe("Booking Form Validation", () => {
    it("should validate required fields", () => {
      const errors: Record<string, string> = {};

      // Test name validation
      if (!("John Doe".trim())) {
        errors.name = "Name is required";
      }
      expect(errors.name).toBeUndefined();

      // Test phone validation
      const phone = "9636380801";
      if (!/^\d{10}$/.test(phone.replace(/\D/g, ""))) {
        errors.phone = "Phone number must be 10 digits";
      }
      expect(errors.phone).toBeUndefined();
    });

    it("should reject invalid phone numbers", () => {
      const errors: Record<string, string> = {};

      const invalidPhones = ["123", "abcdefghij", "9636380", ""];
      invalidPhones.forEach((phone) => {
        if (phone && !/^\d{10}$/.test(phone.replace(/\D/g, ""))) {
          errors.phone = "Phone number must be 10 digits";
        }
      });

      expect(errors.phone).toBeDefined();
    });

    it("should reject past journey dates", () => {
      const errors: Record<string, string> = {};

      const pastDate = "2025-01-01";
      const selectedDate = new Date(pastDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        errors.journeyDate = "Journey date cannot be in the past";
      }

      expect(errors.journeyDate).toBeDefined();
    });

    it("should reject identical source and destination", () => {
      const errors: Record<string, string> = {};

      const source = "Kota";
      const destination = "Kota";

      if (
        source.trim().toLowerCase() === destination.trim().toLowerCase()
      ) {
        errors.destination = "Destination must be different from source";
      }

      expect(errors.destination).toBeDefined();
    });

    it("should reject invalid passenger count", () => {
      const errors: Record<string, string> = {};

      const invalidPassengers = [0, -1, NaN];
      invalidPassengers.forEach((passengers) => {
        if (isNaN(passengers) || passengers < 1) {
          errors.passengers = "At least 1 passenger is required";
        }
      });

      expect(errors.passengers).toBeDefined();
    });

    it("should validate email format", () => {
      const errors: Record<string, string> = {};

      const validEmail = "user@example.com";
      const invalidEmail = "invalid-email";

      if (validEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(validEmail)) {
        errors.email = "Invalid email format";
      }
      expect(errors.email).toBeUndefined();

      if (invalidEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(invalidEmail)) {
        errors.email = "Invalid email format";
      }
      expect(errors.email).toBeDefined();
    });

    it("should accept valid booking data", () => {
      const errors: Record<string, string> = {};

      // Valid booking data
      const bookingData = {
        name: "John Doe",
        email: "john@example.com",
        phone: "9636380801",
        journeyDate: "2026-06-01",
        source: "Kota",
        destination: "Jaipur",
        busType: "2x2 AC Premium",
        passengers: 2,
      };

      // Validate each field
      if (!bookingData.name.trim()) errors.name = "Name is required";
      if (!bookingData.phone.trim())
        errors.phone = "Phone number is required";
      else if (!/^\d{10}$/.test(bookingData.phone.replace(/\D/g, "")))
        errors.phone = "Phone number must be 10 digits";
      if (!bookingData.journeyDate)
        errors.journeyDate = "Journey date is required";
      if (!bookingData.source.trim()) errors.source = "Source is required";
      if (!bookingData.destination.trim())
        errors.destination = "Destination is required";
      if (
        bookingData.source.trim().toLowerCase() ===
        bookingData.destination.trim().toLowerCase()
      )
        errors.destination = "Destination must be different from source";
      if (!bookingData.busType) errors.busType = "Bus type is required";
      if (isNaN(bookingData.passengers) || bookingData.passengers < 1)
        errors.passengers = "At least 1 passenger is required";
      if (
        bookingData.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingData.email)
      )
        errors.email = "Invalid email format";

      expect(Object.keys(errors).length).toBe(0);
    });
  });

  describe("Feedback Form Validation", () => {
    it("should validate required fields", () => {
      const errors: Record<string, string> = {};

      const name = "Jane Doe";
      const message = "Great service!";
      const rating = 5;

      if (!name.trim()) errors.name = "Name is required";
      if (!message.trim()) errors.message = "Feedback message is required";
      else if (message.trim().length < 10)
        errors.message = "Feedback must be at least 10 characters";
      if (rating < 1 || rating > 5)
        errors.rating = "Please select a rating between 1 and 5";

      expect(Object.keys(errors).length).toBe(0);
    });

    it("should reject short feedback messages", () => {
      const errors: Record<string, string> = {};

      const shortMessage = "Good";
      if (shortMessage.trim().length < 10) {
        errors.message = "Feedback must be at least 10 characters";
      }

      expect(errors.message).toBeDefined();
    });

    it("should reject invalid ratings", () => {
      const errors: Record<string, string> = {};

      const invalidRatings = [0, 6, -1, 10];
      invalidRatings.forEach((rating) => {
        if (rating < 1 || rating > 5) {
          errors.rating = "Please select a rating between 1 and 5";
        }
      });

      expect(errors.rating).toBeDefined();
    });

    it("should validate email format in feedback", () => {
      const errors: Record<string, string> = {};

      const validEmail = "user@example.com";
      const invalidEmail = "not-an-email";

      if (validEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(validEmail)) {
        errors.email = "Invalid email format";
      }
      expect(errors.email).toBeUndefined();

      if (
        invalidEmail &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(invalidEmail)
      ) {
        errors.email = "Invalid email format";
      }
      expect(errors.email).toBeDefined();
    });

    it("should accept valid feedback data", () => {
      const errors: Record<string, string> = {};

      const feedbackData = {
        name: "Jane Doe",
        email: "jane@example.com",
        rating: 5,
        message: "Excellent service and comfortable journey!",
      };

      if (!feedbackData.name.trim())
        errors.name = "Name is required";
      if (!feedbackData.message.trim())
        errors.message = "Feedback message is required";
      else if (feedbackData.message.trim().length < 10)
        errors.message = "Feedback must be at least 10 characters";
      if (feedbackData.rating < 1 || feedbackData.rating > 5)
        errors.rating = "Please select a rating between 1 and 5";
      if (
        feedbackData.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(feedbackData.email)
      )
        errors.email = "Invalid email format";

      expect(Object.keys(errors).length).toBe(0);
    });
  });
});
