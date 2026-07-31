import {
  Shield,
  Users,
  Zap,
  Award,
  CheckCircle,
  Target,
  Compass,
  Snowflake,
  Wind,
  Trophy,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const defaultMilestones = [
  {
    year: "1989",
    title: "Founded in Kota",
    description: "Sahu Travels was established in Kota, Rajasthan with a single bus and a vision to provide comfortable travel.",
  },
  {
    year: "1995",
    title: "Expansion Begins",
    description: "Expanded fleet to 5 buses and started operating routes to major pilgrimage centers.",
  },
  {
    year: "2005",
    title: "Modern Fleet",
    description: "Invested in modern AC buses with latest amenities and safety features.",
  },
  {
    year: "2015",
    title: "Digital Presence",
    description: "Launched online booking system and mobile app for customer convenience.",
  },
  {
    year: "2024",
    title: "35+ Buses",
    description: "Now operating over 35 modern buses serving thousands of satisfied passengers daily.",
  },
];

export default function About() {
  const { get } = useSiteSettings();
  const milestonesQuery = trpc.milestones.list.useQuery();

  const timelineData =
    milestonesQuery.data && milestonesQuery.data.length > 0
      ? milestonesQuery.data
      : defaultMilestones;

  return (
    <div className="bg-white text-black min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black via-gray-900 to-black text-white py-16 md:py-20 relative overflow-hidden border-b-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-yellow-400 mb-4 tracking-wide uppercase">
            About {get("company_name")}
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto font-medium">
            {get("tagline")} - Serving passengers with excellence since {get("established_year")}
          </p>
        </div>
      </section>

      {/* Story & History Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-black mb-4">
              Our Journey
            </h2>
            <div className="w-24 h-1 bg-yellow-400 mx-auto mb-6"></div>
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed font-normal">
              {get("company_description")}
            </p>
          </div>

          <div className="space-y-8 max-w-3xl mx-auto">
            {timelineData.map((milestone, idx) => (
              <div key={idx} className="flex gap-4 sm:gap-8 items-start group">
                <div className="shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-400 rounded-full flex items-center justify-center font-black text-black text-base sm:text-lg shadow-md group-hover:scale-110 transition duration-300">
                    {idx + 1}
                  </div>
                </div>
                <div className="bg-white border-2 border-yellow-400/60 hover:border-yellow-400 p-5 sm:p-6 rounded-xl flex-1 shadow-sm hover:shadow-md transition duration-300">
                  <div className="text-xs sm:text-sm font-bold text-yellow-500 mb-1">{milestone.year}</div>
                  <h3 className="text-xl sm:text-2xl font-bold text-black mb-2">{milestone.title}</h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    {milestone.description || (milestone as any).desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision - Dual Pattern (Clean Monochrome Lucide Icons) */}
      <section className="py-16 md:py-20 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
            {/* Mission */}
            <div className="bg-gradient-to-br from-black to-gray-900 p-8 sm:p-12 rounded-2xl border-2 border-yellow-400 shadow-xl">
              <Target className="w-12 h-12 text-yellow-400 mb-4" />
              <h3 className="text-2xl sm:text-3xl font-extrabold text-yellow-400 mb-4 uppercase tracking-wider">
                Our Mission
              </h3>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed font-normal">
                {get("mission_text")}
              </p>
            </div>

            {/* Vision */}
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-8 sm:p-12 rounded-2xl border-2 border-black text-black shadow-xl">
              <Compass className="w-12 h-12 text-black mb-4" />
              <h3 className="text-2xl sm:text-3xl font-black text-black mb-4 uppercase tracking-wider">
                Our Vision
              </h3>
              <p className="text-black/90 text-base sm:text-lg leading-relaxed font-medium">
                {get("vision_text")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Fleet Overview */}
      <section className="py-16 md:py-20 bg-gray-50 border-t border-yellow-400/20">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-black mb-3">
              Our Modern <span className="text-yellow-500">Fleet</span>
            </h2>
            <div className="w-24 h-1 bg-yellow-400 mx-auto mb-4"></div>
            <p className="text-gray-600 text-base sm:text-lg font-medium">
              35+ well-maintained buses with premium amenities
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { type: "2x2 AC", seats: 20, icon: <Snowflake className="w-10 h-10 text-yellow-400" /> },
              { type: "3x2 AC", seats: 30, icon: <Snowflake className="w-10 h-10 text-yellow-400" /> },
              { type: "2x2 Non-AC", seats: 20, icon: <Wind className="w-10 h-10 text-yellow-400" /> },
              { type: "3x2 Non-AC", seats: 30, icon: <Wind className="w-10 h-10 text-yellow-400" /> },
            ].map((bus, idx) => (
              <div
                key={idx}
                className="bg-black border-2 border-yellow-400/60 hover:border-yellow-400 p-8 rounded-xl shadow-lg transition duration-300 text-center group transform hover:-translate-y-1"
              >
                <div className="mb-4 flex justify-center group-hover:scale-110 transition duration-300">
                  {bus.icon}
                </div>
                <h3 className="text-2xl font-bold text-yellow-400 mb-2">{bus.type}</h3>
                <p className="text-gray-300 mb-4 text-sm sm:text-base font-medium">
                  Capacity: {bus.seats} passengers
                </p>
                <div className="text-xs sm:text-sm text-gray-400 space-y-1 font-normal">
                  <div>✓ Comfortable Seats</div>
                  <div>✓ LED TV & Charging</div>
                  <div>✓ CCTV & GPS Support</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-black mb-3">
              Why <span className="text-yellow-500">Choose Us?</span>
            </h2>
            <div className="w-24 h-1 bg-yellow-400 mx-auto mb-4"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: <Shield size={36} />,
                title: "Safety First",
                desc: "CCTV surveillance, GPS tracking, emergency exits, and fire extinguishers in all buses.",
              },
              {
                icon: <Users size={36} />,
                title: "Professional Team",
                desc: "Experienced and courteous drivers trained in safety and customer service.",
              },
              {
                icon: <Zap size={36} />,
                title: "Modern Amenities",
                desc: "AC/Non-AC options, LED TV, charging points, comfortable seating.",
              },
              {
                icon: <Award size={36} />,
                title: "Best Prices",
                desc: "Competitive rates with 20% discount on online bookings.",
              },
              {
                icon: <CheckCircle size={36} />,
                title: "Regular Maintenance",
                desc: "Monthly check-ups ensure maximum comfort and reliability.",
              },
              {
                icon: <Trophy size={36} />,
                title: "2000+ Happy Clients",
                desc: "Trusted by thousands of satisfied customers since 1989.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className={`p-6 sm:p-8 rounded-xl border-2 hover:shadow-xl transition duration-300 ${
                  idx % 2 === 0
                    ? "bg-gray-50 border-yellow-400/60 hover:border-yellow-400"
                    : "bg-black text-white border-yellow-400/60 hover:border-yellow-400"
                }`}
              >
                <div className={idx % 2 === 0 ? "text-yellow-500 mb-3" : "text-yellow-400 mb-3"}>
                  {feature.icon}
                </div>
                <h3 className={`text-xl font-bold mb-2 ${idx % 2 === 0 ? "text-black" : "text-yellow-400"}`}>
                  {feature.title}
                </h3>
                <p className={`text-sm sm:text-base leading-relaxed ${idx % 2 === 0 ? "text-gray-600" : "text-gray-300"}`}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
