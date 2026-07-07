import { Phone, Mail, MapPin, Clock, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function Contact() {
  const { get } = useSiteSettings();

  const rawEmbedUrl = get("google_maps_embed");
  const safeEmbedUrl = (rawEmbedUrl.startsWith("https://www.google.com/maps/embed") || rawEmbedUrl.startsWith("https://www.google.com/maps/d/embed"))
    ? rawEmbedUrl
    : "about:blank";

  const validateUrl = (url: string): string => {
    if (!url) return "";
    if (url.startsWith("https://") || url.startsWith("http://")) return url;
    return "";
  };

  const safeMapsLink = validateUrl(get("google_maps_link")) || "#";
  const safeFacebookUrl = validateUrl(get("facebook_url"));
  const safeInstagramUrl = validateUrl(get("instagram_url"));

  return (
    <div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black via-gray-900 to-black text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-gray-300">
            Get in touch with {get("company_name")} for bookings and inquiries
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
                <a href={`tel:${get("phone_primary")}`} className="text-yellow-300 hover:text-yellow-400 block font-semibold">
                  +91 {get("phone_primary")}
                </a>
                {get("phone_secondary") && (
                  <a href={`tel:${get("phone_secondary")}`} className="text-yellow-300 hover:text-yellow-400 block font-semibold">
                    +91 {get("phone_secondary")}
                  </a>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="bg-gradient-to-br from-black to-gray-900 p-8 rounded-lg shadow-lg text-center border-2 border-yellow-400 hover:shadow-xl transition">
              <Mail className="text-yellow-400 mx-auto mb-4" size={40} />
              <h3 className="text-lg font-semibold mb-4 text-white">Email</h3>
              <div className="space-y-2">
                <a href={`mailto:${get("email_primary")}`} className="text-yellow-300 hover:text-yellow-400 block font-semibold">
                  {get("email_primary")}
                </a>
                {get("email_secondary") && (
                  <a href={`mailto:${get("email_secondary")}`} className="text-yellow-300 hover:text-yellow-400 block font-semibold">
                    {get("email_secondary")}
                  </a>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="bg-gradient-to-br from-black to-gray-900 p-8 rounded-lg shadow-lg text-center border-2 border-yellow-400 hover:shadow-xl transition">
              <MapPin className="text-yellow-400 mx-auto mb-4" size={40} />
              <h3 className="text-lg font-semibold mb-4 text-white">Location</h3>
              <div className="text-gray-300 text-sm leading-relaxed">
                <p>{get("address_line1")}</p>
                <p>{get("address_line2")}</p>
                <p>{get("address_city")}</p>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-gradient-to-br from-black to-gray-900 p-8 rounded-lg shadow-lg text-center border-2 border-yellow-400 hover:shadow-xl transition">
              <Clock className="text-yellow-400 mx-auto mb-4" size={40} />
              <h3 className="text-lg font-semibold mb-4 text-white">Hours</h3>
              <p className="text-yellow-300 font-semibold mb-2">{get("business_hours")}</p>
              <p className="text-gray-300 text-sm">For all your travel needs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-black">Find Us on Google Maps</h2>
          <p className="text-center text-gray-600 mb-8">Visit our location in {get("address_city").split(",")[0] || "Kota"}, Rajasthan</p>
          
          <div className="w-full h-96 bg-gray-300 rounded-lg shadow-lg overflow-hidden border-4 border-yellow-400 mb-8">
            <iframe
              src={safeEmbedUrl}
              sandbox="allow-scripts allow-same-origin allow-popups"
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
              href={safeMapsLink}
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
                    <p className="font-semibold">{get("company_name")}</p>
                    <p>{get("address_line1")}</p>
                    <p>{get("address_line2")}</p>
                    <p>{get("address_city")}</p>
                    <p>India</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-yellow-400 mb-4">
                    Contact Hours
                  </h3>
                  <div className="text-gray-300 space-y-2 text-lg">
                    <p>Monday - Sunday: {get("business_hours")}</p>
                    <p>Holidays: Open</p>
                    <p className="text-yellow-300 font-semibold">Always available for bookings</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-yellow-400 mb-4">
                    Established
                  </h3>
                  <p className="text-gray-300 text-lg">{get("established_year")} in {get("address_city").split(",")[0] || "Kota"}, Rajasthan</p>
                </div>
              </div>
            </div>

            {/* Quick Links & Services */}
            <div className="bg-gradient-to-br from-black to-gray-900 p-8 rounded-lg border-2 border-yellow-400">
              <h2 className="text-3xl font-bold mb-8 text-white">Quick Links</h2>
              
              <div className="space-y-4">
                <a href="https://www.sahubus.in/m/#/tabs/home" className="block bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg transition text-center">
                  Book a Bus
                </a>
                <Link href="/services" className="block bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg transition text-center">
                  Our Services
                </Link>
                <Link href="/fleet" className="block bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg transition text-center">
                  View Fleet
                </Link>
                <Link href="/offers" className="block bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg transition text-center">
                  Special Offers
                </Link>
              </div>

              <div className="mt-8 pt-8 border-t border-yellow-400">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">Follow Us</h3>
                <p className="text-gray-300 mb-4">
                  Connect with us on social media for updates and special offers.
                </p>
                <div className="flex gap-4">
                  {safeFacebookUrl && (
                    <a href={safeFacebookUrl} target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-yellow-300 font-semibold">
                      Facebook
                    </a>
                  )}
                  {safeInstagramUrl && (
                    <a href={safeInstagramUrl} target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-yellow-300 font-semibold">
                      Instagram
                    </a>
                  )}
                  {get("whatsapp_number") && (
                    <a href={`https://wa.me/${get("whatsapp_number")}`} target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-yellow-300 font-semibold">
                      WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
