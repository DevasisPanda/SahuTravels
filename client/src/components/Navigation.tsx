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

  // Strip any accidental emojis from banner text
  const rawBannerText = get("nav_banner_text");
  const bannerText = rawBannerText
    ? rawBannerText.replace(/[^\x00-\x7F]/g, "").trim()
    : "";

  return (
    <nav className="bg-gradient-to-r from-black via-gray-900 to-black border-b-4 border-yellow-400 shadow-lg shadow-yellow-400/20 sticky top-0 z-40">
      {/* Header Top Announcement Banner */}
      {bannerText && (
        <div className="bg-yellow-400 text-black py-1.5 px-4 text-center font-bold text-xs sm:text-sm tracking-wide shadow-inner">
          {bannerText}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex justify-between items-center gap-2 lg:gap-4">
        {/* Brand / Logo */}
        <Link href="/">
          <div className="flex items-center gap-2.5 sm:gap-3 group hover:scale-[1.02] transition cursor-pointer shrink-0">
            {get("logo_url") && (
              <img
                src={get("logo_url")}
                alt="Sahu Travels Logo"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-yellow-400 shadow-md shrink-0"
              />
            )}
            <div className="flex flex-col justify-center">
              <div className="text-yellow-400 font-black text-lg sm:text-xl tracking-wider uppercase leading-tight">
                {get("company_name")}
              </div>
              <div className="text-gray-400 text-[10px] sm:text-xs font-medium whitespace-nowrap">
                Est. {get("established_year")} | {get("address_city").split(",")[0] || "Kota"}, Rajasthan
              </div>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation links - Highly adaptable for squarish windows */}
        <div className="hidden xl:flex items-center gap-1 bg-gray-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-yellow-400/30 shadow-inner">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link key={link.href} href={link.href}>
                <div
                  className={`px-3 py-1.5 font-semibold transition-all rounded-full flex items-center gap-1.5 text-xs xl:text-sm cursor-pointer whitespace-nowrap ${
                    active
                      ? "bg-yellow-400 text-black shadow-md shadow-yellow-400/30"
                      : "text-gray-300 hover:bg-yellow-400/15 hover:text-yellow-400"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? "text-black" : "text-yellow-400"}`} />
                  <span>{link.label}</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mid-screen compact nav bar for squarish windows (lg to xl range: 1024px - 1280px) */}
        <div className="hidden lg:flex xl:hidden items-center gap-0.5 bg-gray-900/80 backdrop-blur-md px-2 py-1 rounded-full border border-yellow-400/30">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link key={link.href} href={link.href}>
                <div
                  title={link.label}
                  className={`px-2 py-1 font-semibold transition-all rounded-full flex items-center gap-1 text-xs cursor-pointer whitespace-nowrap ${
                    active
                      ? "bg-yellow-400 text-black font-bold"
                      : "text-gray-300 hover:bg-yellow-400/15 hover:text-yellow-400"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? "text-black" : "text-yellow-400"}`} />
                  <span>{link.label}</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Header Right Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {user && user.role === "admin" && (
            <Link href="/admin">
              <Button className="hidden sm:inline-flex bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold text-xs sm:text-sm px-3.5 py-1.5 sm:py-2 shadow-md transition-all hover:scale-105 items-center gap-1.5">
                <Settings className="w-4 h-4" />
                <span className="hidden md:inline">Admin Panel</span>
              </Button>
            </Link>
          )}

          {!user && (
            <Link href="/admin-login">
              <Button className="hidden sm:inline-flex bg-gray-800 hover:bg-gray-700 text-yellow-400 font-semibold text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 border border-yellow-400/50 hover:border-yellow-400 transition-all hover:scale-105 items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span className="hidden md:inline">Admin Login</span>
              </Button>
            </Link>
          )}

          <a href="https://www.sahubus.in/m/#/tabs/home" target="_blank" rel="noopener noreferrer">
            <Button className="hidden sm:inline-flex bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-extrabold text-xs sm:text-sm px-3.5 sm:px-4 py-1.5 sm:py-2 shadow-md transition-all hover:scale-105 items-center gap-1.5">
              <ExternalLink className="w-4 h-4" />
              <span>Book Now</span>
            </Button>
          </a>

          {/* Mobile / Tablet Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-yellow-400 hover:text-yellow-300 p-2 hover:bg-gray-800 rounded-lg transition"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Drawer Navigation Menu (Perfect for squarish aspect ratios) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-gradient-to-b from-gray-900 to-black border-t border-yellow-400/30 shadow-2xl max-h-[85vh] overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-2">
            <div className="text-yellow-400 font-bold text-xs tracking-widest text-center py-1.5 border-b border-yellow-400/20 uppercase">
              Navigation Menu
            </div>

            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link key={link.href} href={link.href}>
                  <div
                    className={`px-4 py-2.5 font-medium transition-all rounded-lg flex items-center gap-3 cursor-pointer text-sm ${
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

            <div className="border-t border-yellow-400/20 my-2"></div>

            {user && user.role === "admin" && (
              <Link href="/admin">
                <Button
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-2.5 text-sm flex items-center justify-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Settings className="w-4 h-4" /> Admin Panel
                </Button>
              </Link>
            )}

            {!user && (
              <Link href="/admin-login">
                <Button
                  className="w-full bg-gray-800 hover:bg-gray-700 text-yellow-400 font-bold border border-yellow-400/50 py-2.5 text-sm flex items-center justify-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ShieldCheck className="w-4 h-4" /> Admin Login
                </Button>
              </Link>
            )}

            <a href="https://www.sahubus.in/m/#/tabs/home" target="_blank" rel="noopener noreferrer">
              <Button
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-2.5 text-sm flex items-center justify-center gap-2 mt-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ExternalLink className="w-4 h-4" /> Book Now
              </Button>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
