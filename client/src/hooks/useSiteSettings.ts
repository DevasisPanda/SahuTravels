import { trpc } from "@/lib/trpc";

const fallbackSettings: Record<string, string> = {
  phone_primary: "9636380801",
  phone_secondary: "9694022157",
  email_primary: "info@sahutravels.com",
  email_secondary: "support@sahutravels.com",
  address_line1: "Shop No. 151, Balaji Market",
  address_line2: "Sector A, Shrinath Puram",
  address_city: "Kota, Rajasthan 324005",
  business_hours: "24/7 Available",
  google_maps_embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3560.523456789!2d75.8245!3d25.2048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db6f5c5c5c5c5%3A0x5c5c5c5c5c5c5c5c!2sShop%20No.%20151%2C%20Balaji%20Market%2C%20Sector%20A%2C%20Shrinath%20Puram%2C%20Kota%2C%20Rajasthan%20324005!5e0!3m2!1sen!2sin!4v1234567890",
  google_maps_link: "https://share.google.com/pNfl99BAweudsdMJf",
  tagline: "Your Fantasy - Our Mission",
  logo_url: "/logo.jpg",
  company_name: "SAHU TRAVELS",
  established_year: "1989",
  company_description: "Your trusted travel partner since 1989, providing comfortable and reliable bus travel services across Rajasthan and beyond.",
  nav_banner_text: "Welcome to Sahu Travels - Your Fantasy, Our Mission",
  mission_text: "To provide affordable, comfortable, and safe bus travel services that exceed customer expectations. We are committed to delivering premium travel experiences with professional service, modern buses, and exceptional customer care.",
  vision_text: "To become the most trusted and preferred bus travel company in India, known for reliability, comfort, and customer satisfaction. We aim to expand our services across all major cities while maintaining our commitment to quality and safety.",
  stat_buses: "35+",
  stat_customers: "2000+",
  stat_years: "35",
  stat_support: "24/7",
  facebook_url: "https://facebook.com/sahutravels",
  instagram_url: "https://instagram.com/sahutravels",
  whatsapp_number: "9636380801",
  discount_percent: "20",
  discount_description: "Valid for both AC and Non-AC buses. Book your journey now and save!",
};

export function useSiteSettings() {
  const query = trpc.settings.getAll.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const get = (key: string, fallback?: string): string => {
    if (query.data && query.data[key] !== undefined) {
      return query.data[key];
    }
    return fallback ?? fallbackSettings[key] ?? "";
  };

  return {
    settings: query.data || fallbackSettings,
    get,
    isLoading: query.isLoading,
  };
}
