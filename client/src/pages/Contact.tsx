import { Phone, Mail, MapPin, Clock, ExternalLink } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function Contact() {
  const { get } = useSiteSettings();

  const rawEmbedUrl = get("google_maps_embed");
  const safeEmbedUrl =
    rawEmbedUrl.startsWith("https://www.google.com/maps/embed") ||
    rawEmbedUrl.startsWith("https://www.google.com/maps/d/embed")
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
    <div className="bg-white text-black min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black via-gray-900 to-black text-white py-16 md:py-20 border-b-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 text-center sm:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-yellow-400 mb-3 tracking-wide">Contact Us</h1>
          <p className="text-lg sm:text-xl text-gray-300 font-medium">
            Get in touch with {get("company_name")} for bookings and inquiries
          </p>
        </div>
      </section>

      {/* Contact Information Cards - Completely fixed for long email/phone text overflow */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Phone Card */}
            <div className="bg-gradient-to-br from-black to-gray-900 p-6 sm:p-8 rounded-2xl shadow-xl text-center border-2 border-yellow-400 hover:shadow-2xl transition duration-300 flex flex-col items-center justify-start min-w-0 overflow-hidden">
              <Phone className="text-yellow-400 mb-4 shrink-0" size={36} />
              <h3 className="text-lg font-extrabold mb-3 text-white uppercase tracking-wider">Phone</h3>
              <div className="space-y-2 w-full min-w-0">
                <a
                  href={`tel:${get("phone_primary")}`}
                  className="text-yellow-300 hover:text-yellow-400 block font-bold text-sm sm:text-base break-words hover:underline"
                >
                  +91 {get("phone_primary")}
                </a>
                {get("phone_secondary") && (
                  <a
                    href={`tel:${get("phone_secondary")}`}
                    className="text-yellow-300 hover:text-yellow-400 block font-bold text-sm sm:text-base break-words hover:underline"
                  >
                    +91 {get("phone_secondary")}
                  </a>
                )}
              </div>
            </div>

            {/* Email Card - Fixed long email text wrapping inside card */}
            <div className="bg-gradient-to-br from-black to-gray-900 p-6 sm:p-8 rounded-2xl shadow-xl text-center border-2 border-yellow-400 hover:shadow-2xl transition duration-300 flex flex-col items-center justify-start min-w-0 overflow-hidden">
              <Mail className="text-yellow-400 mb-4 shrink-0" size={36} />
              <h3 className="text-lg font-extrabold mb-3 text-white uppercase tracking-wider">Email</h3>
              <div className="space-y-2 w-full min-w-0 overflow-hidden">
                <a
                  href={`mailto:${get("email_primary")}`}
                  className="text-yellow-300 hover:text-yellow-400 block font-bold text-xs sm:text-sm md:text-base break-all sm:break-words px-1 hover:underline"
                >
                  {get("email_primary")}
                </a>
                {get("email_secondary") && (
                  <a
                    href={`mailto:${get("email_secondary")}`}
                    className="text-yellow-300 hover:text-yellow-400 block font-bold text-xs sm:text-sm md:text-base break-all sm:break-words px-1 hover:underline"
                  >
                    {get("email_secondary")}
                  </a>
                )}
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-gradient-to-br from-black to-gray-900 p-6 sm:p-8 rounded-2xl shadow-xl text-center border-2 border-yellow-400 hover:shadow-2xl transition duration-300 flex flex-col items-center justify-start min-w-0 overflow-hidden">
              <MapPin className="text-yellow-400 mb-4 shrink-0" size={36} />
              <h3 className="text-lg font-extrabold mb-3 text-white uppercase tracking-wider">Location</h3>
              <div className="text-gray-300 text-xs sm:text-sm font-medium leading-relaxed w-full min-w-0 break-words">
                <p>{get("address_line1")}</p>
                <p>{get("address_line2")}</p>
                <p>{get("address_city")}</p>
              </div>
            </div>

            {/* Hours Card */}
            <div className="bg-gradient-to-br from-black to-gray-900 p-6 sm:p-8 rounded-2xl shadow-xl text-center border-2 border-yellow-400 hover:shadow-2xl transition duration-300 flex flex-col items-center justify-start min-w-0 overflow-hidden">
              <Clock className="text-yellow-400 mb-4 shrink-0" size={36} />
              <h3 className="text-lg font-extrabold mb-3 text-white uppercase tracking-wider">Hours</h3>
              <p className="text-yellow-300 font-extrabold text-base sm:text-lg mb-1">{get("business_hours")}</p>
              <p className="text-gray-300 text-xs sm:text-sm font-medium">For all your travel needs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50 border-t border-yellow-400/20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-3 text-black">Find Us on Google Maps</h2>
          <p className="text-center text-gray-600 mb-8 font-medium">Visit our location in {get("address_city").split(",")[0] || "Kota"}, Rajasthan</p>

          <div className="w-full h-80 sm:h-96 bg-gray-300 rounded-2xl shadow-xl overflow-hidden border-4 border-yellow-400 mb-8">
            <iframe
              src={safeEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Sahu Travels Location"
            ></iframe>
          </div>

          <div className="flex flex-wrap gap-4 justify-center items-center">
            {safeMapsLink !== "#" && (
              <a
                href={safeMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-extrabold py-3 px-6 rounded-xl shadow-md transition transform hover:scale-105"
              >
                Open in Google Maps <ExternalLink size={18} />
              </a>
            )}
            {safeFacebookUrl && (
              <a
                href={safeFacebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition transform hover:scale-105"
              >
                Facebook Page <ExternalLink size={18} />
              </a>
            )}
            {safeInstagramUrl && (
              <a
                href={safeInstagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500 hover:opacity-90 text-white font-bold py-3 px-6 rounded-xl shadow-md transition transform hover:scale-105"
              >
                Instagram Profile <ExternalLink size={18} />
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
