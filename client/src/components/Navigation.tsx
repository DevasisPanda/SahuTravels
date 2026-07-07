import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function Navigation() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { get } = useSiteSettings();

  const isActive = (path: string) => location === path;

  const navLinks = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/about", label: "About", icon: "📖" },
    { href: "/services", label: "Services", icon: "🎯" },
    { href: "/fleet", label: "Our Fleet", icon: "🚌" },
    { href: "/gallery", label: "Gallery", icon: "🖼️" },
    { href: "/offers", label: "Offers", icon: "🎉" },
    { href: "/contact", label: "Contact", icon: "📞" },
  ];

  return (
    <nav className="bg-gradient-to-r from-black via-gray-900 to-black border-b-4 border-yellow-400 shadow-lg shadow-yellow-400/20">
      {/* Header Banner */}
      <div className="bg-yellow-400 text-black py-2 text-center font-bold text-sm md:text-base">
        {get("nav_banner_text")}
      </div>

      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center gap-3 group hover:scale-105 transition cursor-pointer">
            {get("logo_url") && (
              <img
                src={get("logo_url")}
                alt="Sahu Travels Logo"
                className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400 shadow-md"
              />
            )}
            <div>
              <div className="text-yellow-400 font-bold text-xl tracking-wider uppercase">{get("company_name")}</div>
              <div className="text-gray-400 text-[10px] md:text-xs">Est. {get("established_year")} | {get("address_city").split(",")[0] || "Kota"}, Rajasthan</div>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1 bg-gray-900/50 backdrop-blur-sm px-6 py-2 rounded-full border border-yellow-400/30">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <div
                className={`px-3 py-2 font-semibold transition rounded-lg flex items-center gap-1 text-sm cursor-pointer ${
                  isActive(link.href)
                    ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/50"
                    : "text-yellow-400 hover:bg-yellow-400/20 hover:text-yellow-300"
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 md:gap-4">
          {user && user.role === "admin" && (
            <Link href="/admin">
              <Button className="hidden md:flex bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold shadow-lg shadow-yellow-400/50 transition transform hover:scale-105">
                ⚙️ Admin Panel
              </Button>
            </Link>
          )}

          {!user && (
            <Link href="/admin-login">
              <Button className="hidden md:flex bg-gray-700 hover:bg-gray-600 text-yellow-400 font-bold border-2 border-yellow-400 transition transform hover:scale-105">
                🔐 Admin Login
              </Button>
            </Link>
          )}

          <a href="https://www.sahubus.in/m/#/tabs/home">
            <Button className="hidden md:flex bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold shadow-lg shadow-yellow-400/50 transition transform hover:scale-105">
              ✈️ Book Now
            </Button>
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-yellow-400 hover:text-yellow-300 p-2 hover:bg-gray-900 rounded-lg transition"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-gradient-to-b from-gray-900 to-black border-t-2 border-yellow-400 shadow-lg">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {/* Mobile Menu Header */}
            <div className="text-yellow-400 font-bold text-center py-2 border-b border-yellow-400/30">
              NAVIGATION MENU
            </div>

            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <div
                  className={`px-4 py-3 font-semibold transition rounded-lg flex items-center gap-2 cursor-pointer ${
                    isActive(link.href)
                      ? "bg-yellow-400 text-black shadow-lg"
                      : "text-yellow-400 hover:bg-gray-800 border border-gray-700"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-lg">{link.icon}</span>
                  <span>{link.label}</span>
                </div>
              </Link>
            ))}

            <div className="border-t border-yellow-400/30 my-2"></div>

            {user && user.role === "admin" && (
              <Link href="/admin">
                <Button
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-3"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ⚙️ Admin Panel
                </Button>
              </Link>
            )}

            {!user && (
              <Link href="/admin-login">
                <Button
                  className="w-full bg-gray-700 hover:bg-gray-600 text-yellow-400 font-bold border-2 border-yellow-400 py-3"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🔐 Admin Login
                </Button>
              </Link>
            )}

            <a href="https://www.sahubus.in/m/#/tabs/home">
              <Button
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                ✈️ Book Now
              </Button>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
