import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface FeedbackFormProps {
  onSuccess?: () => void;
}

export default function FeedbackForm({ onSuccess }: FeedbackFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 5,
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createFeedback = trpc.feedback.create.useMutation();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Feedback message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Feedback must be at least 10 characters";
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = "Please select a rating between 1 and 5";
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
      await createFeedback.mutateAsync({
        name: formData.name,
        email: formData.email || undefined,
        rating: formData.rating,
        message: formData.message,
      });

      toast.success("Thank you for your feedback!");
      setFormData({
        name: "",
        email: "",
        rating: 5,
        message: "",
      });
      setErrors({});
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to submit feedback. Please try again.");
      console.error("Feedback error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Your Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-600 ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Your name"
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

      {/* Rating */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Rating *
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setFormData({ ...formData, rating: star })}
              className={`transition ${
                star <= formData.rating ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              <Star size={32} fill="currentColor" />
            </button>
          ))}
        </div>
        {errors.rating && (
          <p className="text-red-600 text-sm mt-1">{errors.rating}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Your Feedback *
        </label>
        <textarea
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          rows={5}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-600 ${
            errors.message ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Share your experience with us (minimum 10 characters)"
        ></textarea>
        {errors.message && (
          <p className="text-red-600 text-sm mt-1">{errors.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
      >
        {isSubmitting ? "Submitting..." : "Submit Feedback"}
      </Button>
    </form>
  );
}
