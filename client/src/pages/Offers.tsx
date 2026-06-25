import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Gift, Zap, Users, Calendar } from "lucide-react";

export default function Offers() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">Special Offers</h1>
          <p className="text-red-100 mt-2">
            Exclusive discounts on online bookings
          </p>
        </div>
      </section>

      {/* Main Offer */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg p-12 text-center shadow-lg">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              20% Discount on Online Bookings
            </h2>
            <p className="text-xl text-gray-800 mb-2">
              Valid for both AC and Non-AC buses
            </p>
            <p className="text-lg text-gray-700 mb-8">
              Book your journey online and save up to 20% on your ticket fare
            </p>
            <Link href="/booking">
              <Button className="bg-black hover:bg-gray-900 text-white text-lg px-8 py-6">
                Book Now - Get 20% Off
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Offer Details */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Offer Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-yellow-400 mb-4">
                ✓ What's Included
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li>• 20% discount on ticket fare</li>
                <li>• Valid for all bus types</li>
                <li>• Applicable to both AC and Non-AC buses</li>
                <li>• Available for individual and group bookings</li>
                <li>• Online booking only</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-yellow-400 mb-4">
                📋 How to Avail
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li>1. Visit our booking page</li>
                <li>2. Fill in your journey details</li>
                <li>3. Select your preferred bus</li>
                <li>4. Complete the booking online</li>
                <li>5. Discount applied automatically</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Other Offers */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Additional Offers & Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Gift className="text-yellow-400 mx-auto mb-4" size={40} />
              <h3 className="text-lg font-semibold mb-2">Group Discounts</h3>
              <p className="text-gray-600 text-sm">
                Special rates for group bookings of 20+ passengers
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Zap className="text-yellow-600 mx-auto mb-4" size={40} />
              <h3 className="text-lg font-semibold mb-2">Early Bird Offers</h3>
              <p className="text-gray-600 text-sm">
                Extra discounts for bookings made 30 days in advance
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Users className="text-green-600 mx-auto mb-4" size={40} />
              <h3 className="text-lg font-semibold mb-2">Corporate Packages</h3>
              <p className="text-gray-600 text-sm">
                Customized packages for corporate and institutional clients
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Calendar className="text-purple-600 mx-auto mb-4" size={40} />
              <h3 className="text-lg font-semibold mb-2">Seasonal Offers</h3>
              <p className="text-gray-600 text-sm">
                Special discounts during festival seasons and holidays
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Terms & Conditions */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Terms & Conditions
          </h2>
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-yellow-400 font-bold">•</span>
                <span>
                  The 20% discount is applicable only on online bookings through our website
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-400 font-bold">•</span>
                <span>
                  Discount is valid for both AC and Non-AC buses across all routes
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-400 font-bold">•</span>
                <span>
                  Offer cannot be combined with other promotional offers or discounts
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-400 font-bold">•</span>
                <span>
                  Discount is automatically applied at checkout for eligible bookings
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-400 font-bold">•</span>
                <span>
                  Cancellation and refund policies apply as per standard terms
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-400 font-bold">•</span>
                <span>
                  Sahu Travels reserves the right to modify or withdraw offers at any time
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Don't Miss Out!</h2>
          <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
            Book your journey online today and enjoy 20% discount on your bus fare. 
            Limited time offer - book now!
          </p>
          <Link href="/booking">
            <Button className="bg-black hover:bg-gray-900 text-white text-lg px-8 py-6">
              Book Your Ticket Now
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
