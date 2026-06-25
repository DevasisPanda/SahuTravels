import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle, Phone, Mail } from "lucide-react";

export default function BookingConfirmation() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">Booking Confirmed!</h1>
          <p className="text-green-100 mt-2">
            Your journey with Sahu Travels is confirmed
          </p>
        </div>
      </section>

      {/* Confirmation Message */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Success Icon */}
            <div className="text-center mb-8">
              <CheckCircle
                size={80}
                className="text-green-600 mx-auto mb-4"
                fill="currentColor"
              />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Thank You for Booking!
              </h2>
              <p className="text-gray-600 text-lg">
                Your booking request has been successfully submitted. Our team
                will contact you shortly to confirm your reservation.
              </p>
            </div>

            {/* Confirmation Details */}
            <div className="bg-blue-50 border border-blue-200 p-8 rounded-lg mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                What Happens Next?
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold">
                      1
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Confirmation Call
                    </h4>
                    <p className="text-gray-600">
                      Our team will call you within 2 hours to confirm your
                      booking details
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold">
                      2
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Payment Processing
                    </h4>
                    <p className="text-gray-600">
                      We'll discuss payment options and process your booking
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold">
                      3
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Ticket Confirmation
                    </h4>
                    <p className="text-gray-600">
                      You'll receive your ticket details via email and SMS
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold">
                      4
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Ready to Travel
                    </h4>
                    <p className="text-gray-600">
                      Report to the pickup point 15 minutes before departure
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <Phone className="text-blue-600 mb-3" size={32} />
                <h4 className="font-semibold text-gray-900 mb-2">
                  Call Us Anytime
                </h4>
                <p className="text-gray-600 mb-2">9636380801</p>
                <p className="text-gray-600">9694022157</p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <Mail className="text-blue-600 mb-3" size={32} />
                <h4 className="font-semibold text-gray-900 mb-2">Email Us</h4>
                <p className="text-gray-600 mb-2">info@sahutravels.com</p>
                <p className="text-gray-600">support@sahutravels.com</p>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg mb-8">
              <h4 className="font-semibold text-gray-900 mb-4">
                📋 Important Notes
              </h4>
              <ul className="space-y-2 text-gray-700">
                <li>
                  • Your 20% online booking discount has been applied to your
                  reservation
                </li>
                <li>
                  • Please keep your booking reference number for future
                  reference
                </li>
                <li>
                  • Cancellations made 48 hours before journey are eligible for
                  refund
                </li>
                <li>
                  • Report to the pickup point 15 minutes before scheduled
                  departure
                </li>
                <li>
                  • Carry a valid ID proof for verification at the pickup point
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg">
                  Back to Home
                </Button>
              </Link>
              <Link href="/booking">
                <Button variant="outline" className="font-semibold py-3 px-8 rounded-lg">
                  Make Another Booking
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="font-semibold text-gray-900 mb-2">
                When will I receive my ticket?
              </h4>
              <p className="text-gray-600">
                You will receive your ticket details via email and SMS after
                payment confirmation. Usually within 24 hours of booking.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="font-semibold text-gray-900 mb-2">
                Can I modify my booking?
              </h4>
              <p className="text-gray-600">
                Yes, you can modify your booking up to 48 hours before the
                journey. Contact our support team for assistance.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="font-semibold text-gray-900 mb-2">
                What is the cancellation policy?
              </h4>
              <p className="text-gray-600">
                Cancellations made 48 hours before the journey are eligible for
                full refund. Cancellations within 48 hours may have a
                cancellation charge.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="font-semibold text-gray-900 mb-2">
                Is the 20% discount already applied?
              </h4>
              <p className="text-gray-600">
                Yes! The 20% online booking discount is automatically applied to
                your reservation. You don't need to do anything extra.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
