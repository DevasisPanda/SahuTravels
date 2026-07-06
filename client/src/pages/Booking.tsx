import { useState } from "react";
import BookingForm from "@/components/BookingForm";
import FeedbackForm from "@/components/FeedbackForm";
import { trpc } from "@/lib/trpc";
import { Star } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function Booking() {
  const [bookingTab, setBookingTab] = useState<"booking" | "feedback">(
    "booking"
  );
  const { get } = useSiteSettings();

  // Fetch feedback
  const { data: feedbackList } = trpc.feedback.list.useQuery();

  return (
    <div className="flex-1">

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black to-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">Book Your Journey</h1>
          <p className="text-gray-300 mt-2">
            Get {get("discount_percent")}% discount on online bookings
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex gap-4 border-b border-gray-300">
            <button
              onClick={() => setBookingTab("booking")}
              className={`px-6 py-3 font-semibold transition ${
                bookingTab === "booking"
                  ? "text-yellow-400 border-b-2 border-yellow-400"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Book a Bus
            </button>
            <button
              onClick={() => setBookingTab("feedback")}
              className={`px-6 py-3 font-semibold transition ${
                bookingTab === "feedback"
                  ? "text-yellow-400 border-b-2 border-yellow-400"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Share Feedback
            </button>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      {bookingTab === "booking" && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6">Bus Booking Form</h2>
              <BookingForm />
            </div>
          </div>
        </section>
      )}

      {/* Feedback Form */}
      {bookingTab === "feedback" && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Feedback Form */}
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6">Share Your Feedback</h2>
                <FeedbackForm />
              </div>

              {/* Testimonials */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Customer Testimonials</h2>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {feedbackList && feedbackList.length > 0 ? (
                    feedbackList.map((feedback, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex gap-1">
                            {[...Array(feedback.rating)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className="text-yellow-400"
                                fill="currentColor"
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {feedback.rating}/5
                          </span>
                        </div>
                        <p className="font-semibold text-gray-900">
                          {feedback.name}
                        </p>
                        <p className="text-gray-700 text-sm mt-2">
                          {feedback.message}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">
                      No testimonials yet. Be the first to share your experience!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
