import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle,
  Users,
  Zap,
  Shield,
  Bus,
  Compass,
  FileText,
  Heart,
  Sparkles,
} from "lucide-react";
import { useLocation } from "wouter";
import HeroCarousel from "@/components/HeroCarousel";
import { trpc } from "@/lib/trpc";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const defaultSlides = [
  {
    id: 1,
    title: "Experience Luxury Travel",
    subtitle: "Premium bus services across Rajasthan and beyond",
    image: "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=1200&h=600&fit=crop",
    cta: "Book Now",
    ctaLink: "https://www.sahubus.in/m/#/tabs/home",
  },
  {
    id: 2,
    title: "Comfort Redefined",
    subtitle: "AC and Non-AC buses with premium amenities",
    image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&h=600&fit=crop",
    cta: "View Fleet",
    ctaLink: "/fleet",
  },
  {
    id: 3,
    title: "Your Fantasy - Our Mission",
    subtitle: "Making every journey memorable since 1989",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&h=600&fit=crop",
    cta: "Learn More",
    ctaLink: "/about",
  },
  {
    id: 4,
    title: "Safe & Reliable",
    subtitle: "GPS tracking, CCTV, and emergency support",
    image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=1200&h=600&fit=crop",
    cta: "Contact Us",
    ctaLink: "/contact",
  },
];

export default function Home() {
  const [, setLocation] = useLocation();
  const bannersQuery = trpc.banners.list.useQuery();
  const [slides, setSlides] = useState(defaultSlides);
  const { get } = useSiteSettings();

  useEffect(() => {
    if (bannersQuery.data && bannersQuery.data.length > 0) {
      const uploadedSlides = bannersQuery.data.map((banner: any) => ({
        id: banner.id,
        title: banner.title,
        subtitle: banner.description || "",
        image: banner.imageUrl,
        cta: banner.ctaText || "Learn More",
        ctaLink: banner.ctaLink || "/",
      }));
      setSlides(uploadedSlides.length > 0 ? uploadedSlides : defaultSlides);
    }
  }, [bannersQuery.data]);

  return (
    <div className="bg-black text-white">
      {/* Hero Carousel */}
      <div className="p-2 sm:p-4 max-w-7xl mx-auto">
        <HeroCarousel slides={slides} />
      </div>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-20 bg-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-3 text-yellow-400">
            Why Choose Sahu Travels?
          </h2>
          <p className="text-center text-gray-300 mb-12 sm:mb-16 text-base sm:text-lg max-w-2xl mx-auto">
            Experience excellence in every journey with our premium services
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                icon: <Shield className="w-10 h-10 text-yellow-400" />,
                title: "Safe & Secure",
                description: "GPS tracking, CCTV surveillance, and emergency support",
              },
              {
                icon: <Zap className="w-10 h-10 text-yellow-400" />,
                title: "Premium Comfort",
                description: "AC/Non-AC buses with charging points and LED TV",
              },
              {
                icon: <Users className="w-10 h-10 text-yellow-400" />,
                title: "Expert Team",
                description: "Professional drivers with years of experience",
              },
              {
                icon: <CheckCircle className="w-10 h-10 text-yellow-400" />,
                title: "Reliable Service",
                description: "On-time departures and punctual arrivals guaranteed",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gray-900 border-2 border-yellow-400/40 hover:border-yellow-400 rounded-xl p-6 sm:p-8 hover:shadow-xl hover:shadow-yellow-400/20 transition duration-300 transform hover:-translate-y-1"
              >
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-yellow-400 mb-2">{item.title}</h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Highlight */}
      <section className="py-16 md:py-20 bg-gray-900 relative border-t border-b border-yellow-400/20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-3 text-yellow-400">
            Our Services
          </h2>
          <p className="text-center text-gray-300 mb-12 sm:mb-16 text-base sm:text-lg max-w-2xl mx-auto">
            Tailored travel solutions for every occasion
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Bus className="w-10 h-10" />, name: "Tours", desc: "Explore Rajasthan's beauty" },
              { icon: <Compass className="w-10 h-10" />, name: "Picnics", desc: "Group outings & events" },
              { icon: <FileText className="w-10 h-10" />, name: "Contracts", desc: "Corporate solutions" },
              { icon: <Heart className="w-10 h-10" />, name: "Weddings", desc: "Special occasions" },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-black border-2 border-yellow-400/40 hover:border-yellow-400 rounded-xl p-6 sm:p-8 text-center hover:bg-yellow-400 hover:text-black group transition duration-300 flex flex-col items-center justify-center cursor-pointer shadow-lg"
              >
                <div className="text-yellow-400 group-hover:text-black mb-4 transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2">{service.name}</h3>
                <p className="text-gray-300 group-hover:text-black/90 text-sm sm:text-base transition-colors">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offer */}
      <section className="py-16 md:py-20 bg-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-transparent to-yellow-400"></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-2xl p-8 sm:p-12 border-4 border-yellow-400 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 flex items-center justify-center gap-3">
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-black" />
              Special Offer!
            </h2>
            <p className="text-xl sm:text-2xl font-black mb-4">{get("discount_percent")}% Discount on Online Bookings</p>
            <p className="text-sm sm:text-base md:text-lg font-medium mb-8 max-w-2xl mx-auto">
              {get("discount_description")}
            </p>
            <Button
              onClick={() => (window.location.href = "https://www.sahubus.in/m/#/tabs/home")}
              className="bg-black hover:bg-gray-900 text-yellow-400 font-extrabold py-3.5 px-8 rounded-xl text-base sm:text-lg flex items-center gap-2 mx-auto shadow-xl transition-all hover:scale-105"
            >
              Book Now <ArrowRight size={20} />
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900 border-t border-yellow-400/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { number: get("stat_years"), label: "Years of Service" },
              { number: get("stat_buses"), label: "Buses in Fleet" },
              { number: get("stat_customers"), label: "Happy Customers" },
              { number: get("stat_support"), label: "Customer Support" },
            ].map((stat, index) => (
              <div key={index} className="p-4 sm:p-6 bg-black/40 rounded-xl border border-yellow-400/20">
                <div className="text-3xl sm:text-4xl md:text-5xl font-black text-yellow-400 mb-1">
                  {stat.number}
                </div>
                <p className="text-gray-300 text-xs sm:text-base font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-black text-center border-t border-yellow-400/20">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-yellow-400">
            Ready to Start Your Journey?
          </h2>
          <p className="text-gray-300 mb-8 text-base sm:text-lg leading-relaxed">
            Book your bus ticket today and experience the comfort and reliability of Sahu Travels
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              onClick={() => (window.location.href = "https://www.sahubus.in/m/#/tabs/home")}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-extrabold py-3.5 px-8 rounded-xl text-base shadow-lg transition-all hover:scale-105"
            >
              Book Now
            </Button>
            <Button
              onClick={() => setLocation("/contact")}
              className="bg-gray-900 hover:bg-gray-800 text-yellow-400 font-bold py-3.5 px-8 rounded-xl text-base border-2 border-yellow-400 transition-all hover:scale-105"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
