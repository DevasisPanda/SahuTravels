import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Users, Zap, Shield } from "lucide-react";
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
    ctaLink: "/booking",
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

  // Use uploaded banners if available, otherwise use defaults
  useEffect(() => {
    if (bannersQuery.data && bannersQuery.data.length > 0) {
      const uploadedSlides = bannersQuery.data.map((banner: any, index: number) => ({
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
      <HeroCarousel slides={slides} />

      {/* Why Choose Us Section */}
      <section className="py-20 bg-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-5xl font-bold text-center mb-4 text-yellow-400">
            Why Choose Sahu Travels?
          </h2>
          <p className="text-center text-gray-300 mb-16 text-lg">
            Experience excellence in every journey with our premium services
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Shield size={40} />,
                title: "Safe & Secure",
                description: "GPS tracking, CCTV surveillance, and emergency support",
              },
              {
                icon: <Zap size={40} />,
                title: "Premium Comfort",
                description: "AC/Non-AC buses with charging points and LED TV",
              },
              {
                icon: <Users size={40} />,
                title: "Expert Team",
                description: "Professional drivers with years of experience",
              },
              {
                icon: <CheckCircle size={40} />,
                title: "Reliable Service",
                description: "On-time departures and punctual arrivals guaranteed",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gray-900 border-2 border-yellow-400 rounded-lg p-8 hover:shadow-lg hover:shadow-yellow-400/50 transition transform hover:scale-105"
              >
                <div className="text-yellow-400 mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-yellow-400 mb-3">{item.title}</h3>
                <p className="text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Highlight */}
      <section className="py-20 bg-gray-900 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-4 text-yellow-400">
            Our Services
          </h2>
          <p className="text-center text-gray-300 mb-16 text-lg">
            Tailored travel solutions for every occasion
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { emoji: "🚌", name: "Tours", desc: "Explore Rajasthan's beauty" },
              { emoji: "🎉", name: "Picnics", desc: "Group outings & events" },
              { emoji: "📋", name: "Contracts", desc: "Corporate solutions" },
              { emoji: "💒", name: "Weddings", desc: "Special occasions" },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-black border-2 border-yellow-400 rounded-lg p-8 text-center hover:bg-yellow-400 hover:text-black transition"
              >
                <div className="text-5xl mb-4">{service.emoji}</div>
                <h3 className="text-2xl font-bold mb-2">{service.name}</h3>
                <p className="text-gray-300 hover:text-black">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offer */}
      <section className="py-20 bg-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-transparent to-yellow-400"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-lg p-12 border-4 border-yellow-400">
            <h2 className="text-5xl font-bold mb-4">🎉 Special Offer!</h2>
            <p className="text-2xl font-bold mb-6">{get("discount_percent")}% Discount on Online Bookings</p>
            <p className="text-lg mb-8">
              {get("discount_description")}
            </p>
            <Button
              onClick={() => setLocation("/booking")}
              className="bg-black hover:bg-gray-900 text-yellow-400 font-bold py-4 px-8 rounded-lg text-lg flex items-center gap-2 mx-auto"
            >
              Book Now <ArrowRight size={24} />
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { number: get("stat_years"), label: "Years of Service" },
              { number: get("stat_buses"), label: "Buses in Fleet" },
              { number: get("stat_customers"), label: "Happy Customers" },
              { number: get("stat_support"), label: "Customer Support" },
            ].map((stat, index) => (
              <div key={index} className="p-6">
                <div className="text-5xl font-bold text-yellow-400 mb-2">
                  {stat.number}
                </div>
                <p className="text-gray-300 text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-center">
        <h2 className="text-5xl font-bold mb-6 text-yellow-400">
          Ready to Start Your Journey?
        </h2>
        <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
          Book your bus ticket today and experience the comfort and reliability of Sahu Travels
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button
            onClick={() => setLocation("/booking")}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg text-lg"
          >
            Book Now
          </Button>
          <Button
            onClick={() => setLocation("/contact")}
            className="bg-gray-800 hover:bg-gray-700 text-yellow-400 font-bold py-3 px-8 rounded-lg text-lg border-2 border-yellow-400"
          >
            Contact Us
          </Button>
        </div>
      </section>
    </div>
  );
}
