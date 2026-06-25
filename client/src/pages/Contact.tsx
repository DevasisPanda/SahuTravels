import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Phone, Mail, MapPin, Clock, ExternalLink } from "lucide-react";
import { Link } from "wouter";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black via-gray-900 to-black text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-gray-300">
            Get in touch with Sahu Travels for bookings and inquiries
          </p>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Phone */}
            <div className="bg-gradient-to-br from-black to-gray-900 p-8 rounded-lg shadow-lg text-center border-2 border-yellow-400 hover:shadow-xl transition">
              <Phone className="text-yellow-400 mx-auto mb-4" size={40} />
              <h3 className="text-lg font-semibold mb-4 text-white">Phone</h3>
              <div className="space-y-2">
                <a href="tel:9636380801" className="text-yellow-300 hover:text-yellow-400 block font-semibold">
                  +91 9636380801
                </a>
                <a href="tel:9694022157" className="text-yellow-300 hover:text-yellow-400 block font-semibold">
                  +91 9694022157
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="bg-gradient-to-br from-black to-gray-900 p-8 rounded-lg shadow-lg text-center border-2 border-yellow-400 hover:shadow-xl transition">
              <Mail className="text-yellow-400 mx-auto mb-4" size={40} />
              <h3 className="text-lg font-semibold mb-4 text-white">Email</h3>
              <div className="space-y-2">
                <a href="mailto:info@sahutravels.com" className="text-yellow-300 hover:text-yellow-400 block font-semibold">
                  info@sahutravels.com
                </a>
                <a href="mailto:support@sahutravels.com" className="text-yellow-300 hover:text-yellow-400 block font-semibold">
                  support@sahutravels.com
                </a>
              </div>
            </div>

            {/* Location */}
            <div className="bg-gradient-to-br from-black to-gray-900 p-8 rounded-lg shadow-lg text-center border-2 border-yellow-400 hover:shadow-xl transition">
              <MapPin className="text-yellow-400 mx-auto mb-4" size={40} />
              <h3 className="text-lg font-semibold mb-4 text-white">Location</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Shop No. 151, Balaji Market<br />
                Sector A, Shrinath Puram<br />
                Kota, Rajasthan 324005
              </p>
            </div>

            {/* Hours */}
            <div className="bg-gradient-to-br from-black to-gray-900 p-8 rounded-lg shadow-lg text-center border-2 border-yellow-400 hover:shadow-xl transition">
              <Clock className="text-yellow-400 mx-auto mb-4" size={40} />
              <h3 className="text-lg font-semibold mb-4 text-white">Hours</h3>
              <p className="text-yellow-300 font-semibold mb-2">24/7 Available</p>
              <p className="text-gray-300 text-sm">For all your travel needs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-black">Find Us on Google Maps</h2>
          <p className="text-center text-gray-600 mb-8">Visit our location in Kota, Rajasthan</p>
          
          <div className="w-full h-96 bg-gray-300 rounded-lg shadow-lg overflow-hidden border-4 border-yellow-400 mb-8">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3560.523456789!2d75.8245!3d25.2048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db6f5c5c5c5c5%3A0x5c5c5c5c5c5c5c5c!2sShop%20No.%20151%2C%20Balaji%20Market%2C%20Sector%20A%2C%20Shrinath%20Puram%2C%20Kota%2C%20Rajasthan%20324005!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          {/* Google Maps Link */}
          <div className="text-center">
            <a
              href="https://share.google.com/pNfl99BAweudsdMJf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg transition transform hover:scale-105 shadow-lg"
            >
              <ExternalLink size={20} />
              Open in Google Maps
            </a>
          </div>
        </div>
      </section>

      {/* Detailed Contact Information */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Office Information */}
            <div className="bg-gradient-to-br from-black to-gray-900 p-8 rounded-lg border-2 border-yellow-400">
              <h2 className="text-3xl font-bold mb-8 text-white">Office Information</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-yellow-400 mb-4">
                    Main Office
                  </h3>
                  <div className="text-gray-300 space-y-2 text-lg">
                    <p className="font-semibold">Sahu Travels</p>
                    <p>Shop No. 151, Balaji Market</p>
                    <p>Sector A, Shrinath Puram</p>
                    <p>Kota, Rajasthan 324005</p>
                    <p>India</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-yellow-400 mb-4">
                    Contact Hours
                  </h3>
                  <div className="text-gray-300 space-y-2 text-lg">
                    <p>Monday - Sunday: 24 Hours</p>
                    <p>Holidays: Open</p>
                    <p className="text-yellow-300 font-semibold">Always available for bookings</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-yellow-400 mb-4">
                    Established
                  </h3>
                  <p className="text-gray-300 text-lg">1989 in Kota, Rajasthan</p>
                </div>
              </div>
            </div>

            {/* Quick Links & Services */}
            <div className="bg-gradient-to-br from-black to-gray-900 p-8 rounded-lg border-2 border-yellow-400">
              <h2 className="text-3xl font-bold mb-8 text-white">Quick Links</h2>
              
              <div className="space-y-4">
                <Link href="/booking">
                  <a className="block bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg transition text-center">
                    Book a Bus
                  </a>
                </Link>
                <Link href="/services">
                  <a className="block bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg transition text-center">
                    Our Services
                  </a>
                </Link>
                <Link href="/fleet">
                  <a className="block bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg transition text-center">
                    View Fleet
                  </a>
                </Link>
                <Link href="/offers">
                  <a className="block bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg transition text-center">
                    Special Offers
                  </a>
                </Link>
              </div>

              <div className="mt-8 pt-8 border-t border-yellow-400">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">Follow Us</h3>
                <p className="text-gray-300">
                  Connect with us on social media for updates and special offers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
