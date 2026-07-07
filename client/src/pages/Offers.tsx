import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Gift, Zap, Users, Calendar } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const iconMap: Record<string, any> = {
  Gift,
  Zap,
  Users,
  Calendar,
};

const fallbackAdditionalOffers = [
  {
    icon: "Gift",
    title: "Group Discounts",
    description: "Special rates for group bookings of 20+ passengers",
  },
  {
    icon: "Zap",
    title: "Early Bird Offers",
    description: "Extra discounts for bookings made 30 days in advance",
  },
  {
    icon: "Users",
    title: "Corporate Packages",
    description: "Customized packages for corporate and institutional clients",
  },
  {
    icon: "Calendar",
    title: "Seasonal Offers",
    description: "Special discounts during festival seasons and holidays",
  },
];

export default function Offers() {
  const { get } = useSiteSettings();
  const query = trpc.offers.list.useQuery();

  const mainOffer = query.data?.find((o) => o.isMainOffer === 1);
  const additionalOffers = query.data?.filter((o) => o.isMainOffer !== 1) || [];

  const discountPercent = mainOffer ? mainOffer.discountPercent : parseInt(get("discount_percent") || "20");
  const discountTitle = mainOffer ? mainOffer.title : `${discountPercent}% Discount on Online Bookings`;
  const discountDesc = mainOffer ? mainOffer.description : get("discount_description");

  const termsList = (() => {
    if (mainOffer && mainOffer.termsConditions) {
      try {
        return JSON.parse(mainOffer.termsConditions) as string[];
      } catch {}
    }
    return [
      `The ${discountPercent}% discount is applicable only on online bookings through our website`,
      "Discount is valid for both AC and Non-AC buses across all routes",
      "Offer cannot be combined with other promotional offers or discounts",
      "Discount is automatically applied at checkout for eligible bookings",
      "Cancellation and refund policies apply as per standard terms",
      "Sahu Travels reserves the right to modify or withdraw offers at any time",
    ];
  })();

  const displayAdditional = additionalOffers.length > 0 ? additionalOffers : fallbackAdditionalOffers;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">Special Offers</h1>
          <p className="text-red-100 mt-2">
            Exclusive discounts on online bookings
          </p>
        </div>
      </section>

      {/* Main Offer */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg p-12 text-center shadow-lg">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {discountTitle}
            </h2>
            <p className="text-xl text-gray-800 mb-2">
              Valid for both AC and Non-AC buses
            </p>
            <p className="text-lg text-gray-700 mb-8">
              {discountDesc}
            </p>
            <a href="https://www.sahubus.in/m/#/tabs/home">
              <Button className="bg-black hover:bg-gray-900 text-white text-lg px-8 py-6">
                Book Now - Get {discountPercent}% Off
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Offer Details */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Offer Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-yellow-500 mb-4">
                ✓ What's Included
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li>• {discountPercent}% discount on ticket fare</li>
                <li>• Valid for all bus types</li>
                <li>• Applicable to both AC and Non-AC buses</li>
                <li>• Available for individual and group bookings</li>
                <li>• Online booking only</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-yellow-500 mb-4">
                📋 How to Avail
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li>1. Visit our booking page</li>
                <li>2. Fill in your journey details</li>
                <li>3. Select your preferred bus</li>
                <li>4. Complete the booking online</li>
                <li>5. Discount applied automatically</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Other Offers */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Additional Offers & Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayAdditional.map((offer: any, idx: number) => {
              const IconComp = iconMap[offer.icon || "Gift"] || Gift;
              return (
                <div key={idx} className="bg-white p-6 rounded-lg shadow-md text-center border border-gray-100 hover:shadow-lg transition">
                  <IconComp className="text-yellow-500 mx-auto mb-4" size={40} />
                  <h3 className="text-lg font-semibold mb-2">{offer.title}</h3>
                  <p className="text-gray-600 text-sm">
                    {offer.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Terms & Conditions */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Terms & Conditions
          </h2>
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <ul className="space-y-4 text-gray-700">
              {termsList.map((term, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-yellow-500 font-bold">•</span>
                  <span>{term}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Don't Miss Out!</h2>
          <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
            Book your journey online today and enjoy {discountPercent}% discount on your bus fare. 
            Limited time offer - book now!
          </p>
          <a href="https://www.sahubus.in/m/#/tabs/home">
            <Button className="bg-black hover:bg-gray-900 text-white text-lg px-8 py-6">
              Book Your Ticket Now
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}
