import { CheckCircle, Wifi, Music, Zap, Camera, Gauge } from "lucide-react";
import { trpc } from "@/lib/trpc";

const fallbackBuses = [
  {
    name: "2x2 AC Premium",
    type: "2x2",
    seats: 42,
    class: "Premium",
    isAC: true,
    amenities: [
      "Air Conditioned",
      "Push-Back Seats",
      "LED Lights",
      "Music System",
      "Charging Points",
      "WiFi",
      "CCTV",
      "GPS Tracking",
    ],
    color: "from-blue-500 to-blue-600",
    imageUrl: "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=600&h=400&fit=crop",
  },
  {
    name: "3x2 AC Extra Premium",
    type: "3x2",
    seats: 56,
    class: "Extra Premium",
    isAC: true,
    amenities: [
      "Air Conditioned (Cool & Heater)",
      "Push-Back Seats With Comfort",
      "LED Lights",
      "JBL Music System",
      "Charging Points",
      "WiFi",
      "CCTV",
      "GPS Tracking",
    ],
    color: "from-purple-500 to-purple-600",
    imageUrl: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=400&fit=crop",
  },
  {
    name: "2x2 Non-AC Deluxe",
    type: "2x2",
    seats: 32,
    class: "Deluxe",
    isAC: false,
    amenities: [
      "Comfortable Seats",
      "Music System",
      "Charging Points",
      "Reading Lights",
      "CCTV",
      "GPS Tracking",
    ],
    color: "from-green-500 to-green-600",
    imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop",
  },
  {
    name: "3x2 AC Deluxe",
    type: "3x2",
    seats: 56,
    class: "Deluxe",
    isAC: true,
    amenities: [
      "Air Conditioned",
      "Push-Back Seats",
      "Music System",
      "Charging Points",
      "LED Lights",
      "CCTV",
      "GPS Tracking",
    ],
    color: "from-orange-500 to-orange-600",
    imageUrl: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=600&h=400&fit=crop",
  },
];

export default function Fleet() {
  const query = trpc.fleet.list.useQuery();

  const colors = [
    "from-blue-500 to-blue-600",
    "from-purple-500 to-purple-600",
    "from-green-500 to-green-600",
    "from-orange-500 to-orange-600",
    "from-red-500 to-red-600",
    "from-teal-500 to-teal-600",
  ];

  const buses = query.data && query.data.length > 0
    ? query.data.map((bus, idx) => {
        let parsed = [];
        try {
          parsed = JSON.parse(bus.amenities);
        } catch {}
        return {
          id: bus.id,
          name: bus.name,
          type: bus.type,
          seats: bus.seats,
          class: bus.class,
          isAC: bus.isAC === 1,
          amenities: parsed,
          color: colors[idx % colors.length],
          imageUrl: bus.imageUrl || "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=600&h=400&fit=crop",
        };
      })
    : fallbackBuses;

  return (
    <div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black to-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">Our Fleet</h1>
          <p className="text-gray-300 mt-2">
            Modern, comfortable, and well-maintained buses for every journey
          </p>
        </div>
      </section>

      {/* Fleet Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {buses.map((bus, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
              >
                {/* Image */}
                <div className="h-48 overflow-hidden bg-gray-200">
                  <img
                    src={bus.imageUrl}
                    alt={bus.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Header */}
                <div className={`bg-gradient-to-r ${bus.color} text-white p-6`}>
                  <h2 className="text-2xl font-bold">{bus.name}</h2>
                  <p className="text-opacity-90 text-white">
                    {bus.seats} Seats | {bus.class} Class
                  </p>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* AC Badge */}
                  <div className="mb-4">
                    {bus.isAC ? (
                      <span className="inline-block bg-blue-100 text-black px-3 py-1 rounded-full text-sm font-semibold">
                        ❄️ Air Conditioned
                      </span>
                    ) : (
                      <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                        🌬️ Non-AC
                      </span>
                    )}
                  </div>

                  {/* Amenities */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Amenities:
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {bus.amenities.map((amenity: string, i: number) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle
                            size={18}
                            className="text-green-600 flex-shrink-0 mt-0.5"
                          />
                          <span className="text-gray-700 text-sm">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Safety & Comfort Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Camera,
                title: "CCTV Surveillance",
                desc: "24/7 surveillance cameras for passenger security",
              },
              {
                icon: Gauge,
                title: "GPS Tracking",
                desc: "Real-time vehicle tracking and monitoring",
              },
              {
                icon: Zap,
                title: "Charging Points",
                desc: "USB and power outlets for device charging",
              },
              {
                icon: Wifi,
                title: "WiFi Connectivity",
                desc: "High-speed internet on select buses",
              },
              {
                icon: Music,
                title: "Entertainment",
                desc: "Music systems and LED lighting for comfort",
              },
              {
                icon: CheckCircle,
                title: "Regular Maintenance",
                desc: "Monthly check-ups and safety inspections",
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="bg-white p-6 rounded-lg shadow-md">
                  <Icon className="text-yellow-400 mb-3" size={32} />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Bus Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-black text-white">
                  <th className="border border-gray-300 p-4 text-left">
                    Bus Type
                  </th>
                  <th className="border border-gray-300 p-4 text-center">
                    Seats
                  </th>
                  <th className="border border-gray-300 p-4 text-center">
                    AC
                  </th>
                  <th className="border border-gray-300 p-4 text-center">
                    Class
                  </th>
                  <th className="border border-gray-300 p-4 text-center">
                    WiFi
                  </th>
                  <th className="border border-gray-300 p-4 text-center">
                    CCTV
                  </th>
                </tr>
              </thead>
              <tbody>
                {buses.map((bus, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-4 font-semibold">
                      {bus.name}
                    </td>
                    <td className="border border-gray-300 p-4 text-center">
                      {bus.seats}
                    </td>
                    <td className="border border-gray-300 p-4 text-center">
                      {bus.isAC ? "✓" : "✗"}
                    </td>
                    <td className="border border-gray-300 p-4 text-center">
                      {bus.class}
                    </td>
                    <td className="border border-gray-300 p-4 text-center">
                      ✓
                    </td>
                    <td className="border border-gray-300 p-4 text-center">
                      ✓
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
