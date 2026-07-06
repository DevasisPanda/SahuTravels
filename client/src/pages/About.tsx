import { Shield, Users, Zap, Award, CheckCircle } from "lucide-react";
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
    title: "Digital Era",
    description: "Launched online booking system and mobile app for customer convenience.",
  },
  {
    year: "2024",
    title: "35+ Modern Buses",
    description: "Today, we operate 35+ modern buses serving 2000+ satisfied customers annually.",
  },
];

export default function About() {
  const { get } = useSiteSettings();
  const milestonesQuery = trpc.milestones.list.useQuery();

  const timelineData = milestonesQuery.data && milestonesQuery.data.length > 0
    ? milestonesQuery.data
    : defaultMilestones;

  return (
    <div className="bg-white">

      {/* Hero Section with Pattern */}
      <section className="relative bg-black text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <pattern id="diag" patternUnits="userSpaceOnUse" width="8" height="8">
                <path d="M-2,2 l4,-4 M0,8 l8,-8 M6,10 l4,-4" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#diag)" />
          </svg>
        </div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-400 rounded-full opacity-10 blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              About <span className="text-yellow-400">{get("company_name")}</span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-white mb-6"></div>
            <p className="text-xl text-gray-300">
              Delivering excellence in bus travel since {get("established_year")}. {get("company_description")}
            </p>
          </div>
        </div>
      </section>

      {/* Company History - Timeline Pattern */}
      <section className="py-20 bg-gray-50 relative">
        <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-yellow-400 via-black to-yellow-400"></div>

        <div className="container mx-auto px-4 pl-12">
          <h2 className="text-5xl font-bold text-black mb-16">
            Our <span className="text-yellow-400">Journey</span>
          </h2>

          <div className="space-y-12 max-w-3xl">
            {timelineData.map((milestone, idx) => (
              <div key={idx} className="flex gap-8 items-start group">
                <div className="relative">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-black group-hover:scale-125 transition">
                    {idx + 1}
                  </div>
                </div>
                <div className="bg-white border-2 border-yellow-400 p-6 rounded-lg flex-1 hover:shadow-lg transition">
                  <div className="text-sm font-bold text-yellow-400 mb-2">{milestone.year}</div>
                  <h3 className="text-2xl font-bold text-black mb-2">{milestone.title}</h3>
                  <p className="text-gray-700">{milestone.description || (milestone as any).desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision - Dual Pattern */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400 rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-400 rounded-full opacity-5 blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="bg-gradient-to-br from-black to-gray-900 p-12 rounded-xl border-2 border-yellow-400 hover:shadow-2xl transition">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-3xl font-bold text-yellow-400 mb-4">Our Mission</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                {get("mission_text")}
              </p>
            </div>

            {/* Vision */}
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-300 p-12 rounded-xl border-2 border-black hover:shadow-2xl transition">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-3xl font-bold text-black mb-4">Our Vision</h3>
              <p className="text-gray-800 text-lg leading-relaxed">
                {get("vision_text")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Fleet Overview - Grid Pattern */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-3">
          <svg className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <pattern id="squares" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="40" height="40" fill="none" stroke="black" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#squares)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-black mb-4">
              Our Modern <span className="text-yellow-400">Fleet</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-black to-yellow-400 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">
              35+ well-maintained buses with premium amenities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { type: "2x2 AC", seats: 20, icon: "❄️" },
              { type: "3x2 AC", seats: 30, icon: "❄️" },
              { type: "2x2 Non-AC", seats: 20, icon: "🌬️" },
              { type: "3x2 Non-AC", seats: 30, icon: "🌬️" },
            ].map((bus, idx) => (
              <div
                key={idx}
                className="bg-black border-2 border-yellow-400 p-8 rounded-lg hover:shadow-2xl transition text-center group transform hover:-translate-y-2"
              >
                <div className="text-6xl mb-4 group-hover:scale-125 transition">
                  {bus.icon}
                </div>
                <h3 className="text-2xl font-bold text-yellow-400 mb-2">
                  {bus.type}
                </h3>
                <p className="text-gray-300 mb-4">
                  Capacity: {bus.seats} passengers
                </p>
                <div className="text-sm text-gray-400">
                  ✓ Comfortable Seats<br />
                  ✓ LED TV<br />
                  ✓ Charging Points<br />
                  ✓ CCTV & GPS
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Feature Cards */}
      <section className="py-20 bg-white relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-black via-yellow-400 to-black"></div>

        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-black mb-4">
              Why <span className="text-yellow-400">Choose Us?</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-black mx-auto mb-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield size={40} />,
                title: "Safety First",
                desc: "CCTV surveillance, GPS tracking, emergency exits, and fire extinguishers in all buses.",
              },
              {
                icon: <Users size={40} />,
                title: "Professional Team",
                desc: "Experienced and courteous drivers trained in safety and customer service.",
              },
              {
                icon: <Zap size={40} />,
                title: "Modern Amenities",
                desc: "AC/Non-AC options, LED TV, charging points, comfortable seating.",
              },
              {
                icon: <Award size={40} />,
                title: "Best Prices",
                desc: "Competitive rates with 20% discount on online bookings.",
              },
              {
                icon: <CheckCircle size={40} />,
                title: "Regular Maintenance",
                desc: "Monthly check-ups ensure maximum comfort and reliability.",
              },
              {
                icon: <span className="text-4xl">🏆</span>,
                title: "2000+ Happy Clients",
                desc: "Trusted by thousands of satisfied customers since 1989.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className={`p-8 rounded-lg border-2 hover:shadow-xl transition transform hover:-translate-y-2 ${
                  idx % 2 === 0
                    ? "bg-gray-50 border-yellow-400"
                    : "bg-black text-white border-yellow-400"
                }`}
              >
                <div className={idx % 2 === 0 ? "text-yellow-400" : "text-yellow-300"}>
                  {feature.icon}
                </div>
                <h3 className={`text-xl font-bold mt-4 mb-3 ${
                  idx % 2 === 0 ? "text-black" : "text-yellow-400"
                }`}>
                  {feature.title}
                </h3>
                <p className={idx % 2 === 0 ? "text-gray-700" : "text-gray-300"}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Pattern Background */}
      <section className="py-20 bg-gradient-to-r from-black via-gray-900 to-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="2" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: get("stat_buses"), label: "Modern Buses" },
              { number: get("stat_customers"), label: "Happy Clients" },
              { number: get("stat_years"), label: "Years Experience" },
              { number: get("established_year"), label: "Since Founded" },
            ].map((stat, idx) => (
              <div key={idx} className="group">
                <div className="text-5xl md:text-6xl font-bold text-yellow-400 group-hover:scale-110 transition">
                  {stat.number}
                </div>
                <p className="text-gray-300 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
