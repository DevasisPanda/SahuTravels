import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  Menu,
  X,
  Home,
  Info,
  Compass,
  Bus,
  Image as ImageIcon,
  Tag,
  Phone,
  Settings,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function Navigation() {
  const [location] = useLocation();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { get } = useSiteSettings();

  const isActive = (path: string) => location === path;

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/about", label: "About", icon: Info },
    { href: "/services", label: "Services", icon: Compass },
    { href: "/fleet", label: "Our Fleet", icon: Bus },
    { href: "/gallery", label: "Gallery", icon: ImageIcon },
    { href: "/offers", label: "Offers", icon: Tag },
    { href: "/contact", label: "Contact", icon: Phone },
  ];

  // Strip non-ASCII emoji characters from top announcement banner text
  const rawBannerText = get("nav_banner_text");
  const bannerText = rawBannerText
    ? rawBannerText.replace(/[^\x00-\x7F]/g, "").trim()
    : "";

  return (
    <nav className="bg-gradient-to-r from-black via-gray-900 to-black border-b-4 border-yellow-400 shadow-lg shadow-yellow-400/20 sticky top-0 z-40 w-full max-w-full overflow-x-clip">
      {/* Header Top Announcement Banner */}
      {bannerText && (
        <div className="bg-yellow-400 text-black py-1 px-3 text-center font-extrabold text-[11px] sm:text-xs md:text-sm tracking-wide shadow-inner w-full truncate">
          {bannerText}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-2.5 flex justify-between items-center gap-2 w-full min-w-0">
        {/* Brand / Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 sm:gap-3 group hover:scale-[1.01] transition cursor-pointer shrink-0 min-w-0">
            {get("logo_url") && (
              <img
                src={get("logo_url")}
                alt="Sahu Travels Logo"
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full object-cover border-2 border-yellow-400 shadow-md shrink-0"
              />
            )}
            <div className="flex flex-col justify-center min-w-0">
              <div className="text-yellow-400 font-black text-sm sm:text-base md:text-lg lg:text-xl tracking-wider uppercase leading-tight whitespace-nowrap">
                {get("company_name")}
              </div>
              <div className="text-gray-400 text-[9px] sm:text-[10px] md:text-xs font-medium whitespace-nowrap hidden min-[380px]:block">
                Est. {get("established_year")} | {get("address_city").split(",")[0] || "Kota"}, Rajasthan
              </div>
            </div>
          </div>
        </Link>

        {/* Full Desktop Navigation Bar - Only renders at xl (1280px+) where there is plenty of room */}
        <div className="hidden xl:flex items-center gap-1 2xl:gap-1.5 bg-gray-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-yellow-400/30 shadow-inner">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link key={link.href} href={link.href}>
                <div
                  className={`px-2.5 2xl:px-3.5 py-1 font-semibold transition-all rounded-full flex items-center gap-1.5 text-xs 2xl:text-sm cursor-pointer whitespace-nowrap ${
                    active
                      ? "bg-yellow-400 text-black font-bold shadow-md shadow-yellow-400/30"
                      : "text-gray-300 hover:bg-yellow-400/15 hover:text-yellow-400"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? "text-black" : "text-yellow-400"}`} />
                  <span>{link.label}</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Header Right Action Buttons - Perfectly proportioned and non-overflowing */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {user && user.role === "admin" && (
            <Link href="/admin">
              <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold text-xs sm:text-sm px-2.5 sm:px-3.5 py-1.5 shadow-md transition-all hover:scale-105 items-center gap-1.5 shrink-0">
                <Settings className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden min-[480px]:inline">Admin Panel</span>
              </Button>
            </Link>
          )}

          {!user && (
            <Link href="/admin-login">
              <Button className="bg-gray-800 hover:bg-gray-700 text-yellow-400 font-semibold text-xs sm:text-sm px-2.5 sm:px-3.5 py-1.5 border border-yellow-400/50 hover:border-yellow-400 transition-all hover:scale-105 items-center gap-1.5 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden min-[480px]:inline">Admin</span>
              </Button>
            </Link>
          )}

          <a href="https://www.sahubus.in/m/#/tabs/home" target="_blank" rel="noopener noreferrer">
            <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-extrabold text-xs sm:text-sm px-3 sm:px-4 py-1.5 shadow-md transition-all hover:scale-105 items-center gap-1.5 shrink-0">
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              <span>Book Now</span>
            </Button>
          </a>

          {/* Mobile / Tablet Menu Hamburger Toggle (Visible on screens < 1280px so header never overflows) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden text-yellow-400 hover:text-yellow-300 p-1.5 sm:p-2 hover:bg-gray-800 rounded-lg transition shrink-0"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-gradient-to-b from-gray-900 to-black border-t border-yellow-400/30 shadow-2xl max-h-[85vh] overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-2">
            <div className="text-yellow-400 font-bold text-xs tracking-widest text-center py-1 border-b border-yellow-400/20 uppercase">
              Navigation Menu
            </div>

            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link key={link.href} href={link.href}>
                  <div
                    className={`px-4 py-2.5 font-medium transition-all rounded-lg flex items-center gap-3 cursor-pointer text-xs sm:text-sm ${
                      active
                        ? "bg-yellow-400 text-black font-bold shadow-md"
                        : "text-gray-200 hover:bg-gray-800 border border-gray-800"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className={`w-4 h-4 ${active ? "text-black" : "text-yellow-400"}`} />
                    <span>{link.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
