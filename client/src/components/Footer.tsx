import { Link } from "wouter";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { get } = useSiteSettings();

  return (
    <footer className="bg-black text-white border-t-4 border-yellow-400">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              {get("logo_url") && (
                <img
                  src={get("logo_url")}
                  alt="Sahu Travels Logo"
                  className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400 shadow-md"
                />
              )}
              <h4 className="text-2xl font-black text-yellow-400 tracking-wider">
                {get("company_name")}
              </h4>
            </div>
            <p className="text-gray-300 mb-4">
              {get("company_description")}
            </p>
            <p className="text-yellow-400 font-semibold">
              {get("tagline")}
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
                { href: "https://www.sahubus.in/m/#/tabs/home", label: "Book Now", isExternal: true },
              ].map((link) => (
                <li key={link.label}>
                  {link.isExternal ? (
                    <a href={link.href} className="text-gray-300 hover:text-yellow-400 transition">
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} className="text-gray-300 hover:text-yellow-400 transition">
                      {link.label}
                    </Link>
                  )}
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
                  <p className="text-gray-300">{get("phone_primary")}</p>
                  <p className="text-gray-300">{get("phone_secondary")}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={20} className="text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-gray-300">{get("email_primary")}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-yellow-400 flex-shrink-0 mt-1" />
                <p className="text-gray-300">{get("address_line1")}, {get("address_line2")}, {get("address_city")}</p>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={20} className="text-yellow-400 flex-shrink-0 mt-1" />
                <p className="text-gray-300">{get("business_hours")}</p>
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
              &copy; {currentYear} {get("company_name")}. All rights reserved. | Established {get("established_year")} in {get("address_city").split(",")[0] || "Kota"}, Rajasthan
            </p>
          </div>
          <div className="text-gray-400 text-sm text-right">
            <p>
              Designed for your comfort and safety. | Created by <span className="text-yellow-400 font-semibold">Star Marketing</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
