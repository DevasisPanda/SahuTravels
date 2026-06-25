import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

interface BookingFormProps {
  onSuccess?: () => void;
}

export default function BookingForm({ onSuccess }: BookingFormProps) {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    journeyDate: "",
    source: "",
    destination: "",
    busType: "",
    passengers: 1,
    specialRequests: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createBooking = trpc.bookings.create.useMutation();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Phone number must be 10 digits";
    }
    if (!formData.journeyDate) {
      newErrors.journeyDate = "Journey date is required";
    } else {
      const selectedDate = new Date(formData.journeyDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.journeyDate = "Journey date cannot be in the past";
      }
    }
    if (!formData.source.trim()) {
      newErrors.source = "Source is required";
    }
    if (!formData.destination.trim()) {
      newErrors.destination = "Destination is required";
    }
    if (
      formData.source.trim().toLowerCase() ===
      formData.destination.trim().toLowerCase()
    ) {
      newErrors.destination =
        "Destination must be different from source";
    }
    if (!formData.busType) {
      newErrors.busType = "Bus type is required";
    }
    const passengerNum = parseInt(formData.passengers.toString());
    if (isNaN(passengerNum) || passengerNum < 1) {
      newErrors.passengers = "At least 1 passenger is required";
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      await createBooking.mutateAsync({
        name: formData.name,
        email: formData.email || undefined,
        phone: formData.phone,
        journeyDate: formData.journeyDate,
        source: formData.source,
        destination: formData.destination,
        busType: formData.busType,
        passengers: formData.passengers,
        specialRequests: formData.specialRequests || undefined,
      });

      toast.success(
        "Booking submitted successfully! Redirecting..."
      );
      setFormData({
        name: "",
        email: "",
        phone: "",
        journeyDate: "",
        source: "",
        destination: "",
        busType: "",
        passengers: 1,
        specialRequests: "",
      });
      setErrors({});
      onSuccess?.();
      // Redirect to confirmation page after 1 second
      setTimeout(() => setLocation("/booking-confirmation"), 1000);
    } catch (error) {
      toast.error("Failed to submit booking. Please try again.");
      console.error("Booking error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Full Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-600 ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Your full name"
        />
        {errors.name && (
          <p className="text-red-600 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-600 ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Your email"
        />
        {errors.email && (
          <p className="text-red-600 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Phone Number *
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-600 ${
            errors.phone ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="10-digit phone number"
        />
        {errors.phone && (
          <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
        )}
      </div>

      {/* Journey Date */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Journey Date *
        </label>
        <input
          type="date"
          value={formData.journeyDate}
          onChange={(e) =>
            setFormData({ ...formData, journeyDate: e.target.value })
          }
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-600 ${
            errors.journeyDate ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.journeyDate && (
          <p className="text-red-600 text-sm mt-1">{errors.journeyDate}</p>
        )}
      </div>

      {/* Source and Destination */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Source *
          </label>
          <input
            type="text"
            value={formData.source}
            onChange={(e) =>
              setFormData({ ...formData, source: e.target.value })
            }
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-600 ${
              errors.source ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Starting point"
          />
          {errors.source && (
            <p className="text-red-600 text-sm mt-1">{errors.source}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Destination *
          </label>
          <input
            type="text"
            value={formData.destination}
            onChange={(e) =>
              setFormData({ ...formData, destination: e.target.value })
            }
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-600 ${
              errors.destination ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Ending point"
          />
          {errors.destination && (
            <p className="text-red-600 text-sm mt-1">{errors.destination}</p>
          )}
        </div>
      </div>

      {/* Bus Type */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Bus Type *
        </label>
        <select
          value={formData.busType}
          onChange={(e) => setFormData({ ...formData, busType: e.target.value })}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-600 ${
            errors.busType ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select a bus type</option>
          <option value="2x2 AC Premium">2x2 AC Premium (42 Seats)</option>
          <option value="3x2 AC Extra Premium">
            3x2 AC Extra Premium (56 Seats)
          </option>
          <option value="2x2 Non-AC Deluxe">2x2 Non-AC Deluxe (32 Seats)</option>
          <option value="3x2 AC Deluxe">3x2 AC Deluxe (56 Seats)</option>
        </select>
        {errors.busType && (
          <p className="text-red-600 text-sm mt-1">{errors.busType}</p>
        )}
      </div>

      {/* Passengers */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Number of Passengers *
        </label>
        <input
          type="number"
          min="1"
          value={formData.passengers}
          onChange={(e) =>
            setFormData({ ...formData, passengers: parseInt(e.target.value) })
          }
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-600 ${
            errors.passengers ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.passengers && (
          <p className="text-red-600 text-sm mt-1">{errors.passengers}</p>
        )}
      </div>

      {/* Special Requests */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Special Requests
        </label>
        <textarea
          value={formData.specialRequests}
          onChange={(e) =>
            setFormData({ ...formData, specialRequests: e.target.value })
          }
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
          placeholder="Any special requests or requirements"
        ></textarea>
      </div>

      {/* Discount Info */}
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <p className="text-yellow-800 font-semibold">
          ✓ Get 20% discount on this online booking!
        </p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
      >
        {isSubmitting ? "Submitting..." : "Submit Booking"}
      </Button>
    </form>
  );
}
