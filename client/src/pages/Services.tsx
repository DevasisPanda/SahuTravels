import { MapPin, Users, Heart, Briefcase } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const iconMap: Record<string, any> = {
  MapPin,
  Users,
  Heart,
  Briefcase
};

const fallbackServices = [
  {
    icon: "MapPin",
    title: "Tours",
    description: "A journey that you do with everyone for pleasure, during which you visit many places, in which friends, relatives and family stay with you. We offer tours to popular pilgrimage centers in Jaipur, Udaipur, Jodhpur, Bikaner and other destinations.",
    highlights: [
      "Pilgrimage tours to religious sites",
      "Tourist destination packages",
      "Multi-day tour packages",
      "Flexible itineraries",
    ],
  },
  {
    icon: "Users",
    title: "Picnics",
    description: "Group outings and recreational travel for families, friends, and organizations. Enjoy comfortable travel to popular destinations and scenic locations with our well-maintained fleet.",
    highlights: [
      "Group picnic packages",
      "Scenic destination trips",
      "Family outings",
      "Corporate team building events",
    ],
  },
  {
    icon: "Heart",
    title: "Marriage Parties",
    description: "When a person in the family or himself is about to get married at a far off place, then taking relatives and friends along in the bus and enjoying the joy before and after the wedding.",
    highlights: [
      "Wedding guest transportation",
      "Pre-wedding event travel",
      "Post-wedding celebrations",
      "Comfortable seating for celebrations",
    ],
  },
  {
    icon: "Briefcase",
    title: "Contract/Tenders",
    description: "For many persons, such as carrying and carrying officers and children, and in local movement, they serve the means with regular duties. Ideal for corporate and government organizations.",
    highlights: [
      "Regular corporate transport",
      "Government organization services",
      "Employee commute solutions",
      "Customized contract packages",
    ],
  },
];

export default function Services() {
  const { get } = useSiteSettings();
  const query = trpc.services.list.useQuery();

  const serviceList = query.data && query.data.length > 0
    ? query.data.map(s => {
        let parsed = [];
        try {
          parsed = JSON.parse(s.highlights);
        } catch {}
        return {
          icon: s.icon,
          title: s.title,
          description: s.description,
          highlights: parsed
        };
      })
    : fallbackServices;

  return (
    <div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black to-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">Our Services</h1>
          <p className="text-gray-300 mt-2">
            Comprehensive travel solutions for every occasion
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {serviceList.map((service, idx) => {
              const Icon = iconMap[service.icon] || MapPin;
              return (
                <div
                  key={idx}
                  className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-lg transition"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Icon className="text-yellow-400" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {service.title}
                    </h2>
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Highlights:</h4>
                    <ul className="space-y-2">
                      {service.highlights.map((highlight: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-yellow-400 font-bold">•</span>
                          <span className="text-gray-700">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Service Statistics */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Service Track Record
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg text-center shadow-md">
              <div className="text-4xl font-bold text-yellow-400 mb-2">{get("stat_marriages", "100+")}</div>
              <p className="text-gray-700 font-semibold">
                Marriage Bookings Per Year
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg text-center shadow-md">
              <div className="text-4xl font-bold text-yellow-400 mb-2">{get("stat_tours", "40+")}</div>
              <p className="text-gray-700 font-semibold">Tour Clients Per Year</p>
            </div>
            <div className="bg-white p-8 rounded-lg text-center shadow-md">
              <div className="text-4xl font-bold text-yellow-400 mb-2">{get("stat_contracts", "16+")}</div>
              <p className="text-gray-700 font-semibold">
                Contract Clients Per Year
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Our Services */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Our Services?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Comfortable Seating",
                desc: "Ergonomic seats designed for long journeys with maximum comfort",
              },
              {
                title: "Professional Drivers",
                desc: "Experienced and courteous drivers trained in passenger safety",
              },
              {
                title: "Modern Fleet",
                desc: "Well-maintained vehicles with latest amenities and technology",
              },
              {
                title: "Flexible Packages",
                desc: "Customizable packages to suit your specific travel needs",
              },
              {
                title: "Competitive Pricing",
                desc: "Affordable rates with special discounts for group bookings",
              },
              {
                title: "24/7 Support",
                desc: "Round-the-clock customer support for your peace of mind",
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-400 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-700">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
