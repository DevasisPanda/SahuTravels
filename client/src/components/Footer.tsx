import { Link } from "wouter";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white border-t-4 border-yellow-400">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <img
              src="/manus-storage/IMG-20260508-WA0002_2f49e867.jpg"
              alt="Sahu Travels Logo"
              className="h-24 w-auto object-contain mb-4"
            />
            <p className="text-gray-300 mb-4">
              Your trusted travel partner since 1989, providing comfortable and reliable bus travel services across Rajasthan and beyond.
            </p>
            <p className="text-yellow-400 font-semibold">
              Your Fantasy - Our Mission
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold text-yellow-400 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About Us" },
                { href: "/services", label: "Services" },
                { href: "/fleet", label: "Our Fleet" },
                { href: "/booking", label: "Book Now" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a className="text-gray-300 hover:text-yellow-400 transition">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xl font-bold text-yellow-400 mb-4">
              Our Services
            </h4>
            <ul className="space-y-2">
              {[
                "Tours & Pilgrimages",
                "Picnics & Outings",
                "Wedding Parties",
                "Corporate Contracts",
                "Group Travel",
              ].map((service) => (
                <li key={service} className="text-gray-300 hover:text-yellow-400 transition cursor-pointer">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-bold text-yellow-400 mb-4">
              Contact Us
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Phone size={20} className="text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-gray-300">9636380801</p>
                  <p className="text-gray-300">9694022157</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={20} className="text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-gray-300">info@sahutravels.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-yellow-400 flex-shrink-0 mt-1" />
                <p className="text-gray-300">Kota, Rajasthan, India</p>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={20} className="text-yellow-400 flex-shrink-0 mt-1" />
                <p className="text-gray-300">24/7 Available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-yellow-400 my-8"></div>

        {/* Bottom Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-gray-400 text-sm">
            <p>
              &copy; {currentYear} Sahu Travels. All rights reserved. | Established 1989 in Kota, Rajasthan
            </p>
          </div>
          <div className="text-gray-400 text-sm text-right">
            <p>
              Designed for your comfort and safety. Premium bus travel services across India.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
