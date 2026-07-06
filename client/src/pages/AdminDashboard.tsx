import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { LogOut, BookOpen, ImageIcon, Settings, MapPin, Milestone, Gift, Truck, MessageSquare } from "lucide-react";

// Import tab components
import BookingsTab from "@/components/admin/BookingsTab";
import BannersTab from "@/components/admin/BannersTab";
import GalleryTab from "@/components/admin/GalleryTab";
import SettingsTab from "@/components/admin/SettingsTab";
import ServicesTab from "@/components/admin/ServicesTab";
import MilestonesTab from "@/components/admin/MilestonesTab";
import OffersTab from "@/components/admin/OffersTab";
import FleetTab from "@/components/admin/FleetTab";
import FeedbackTab from "@/components/admin/FeedbackTab";

type TabType = "bookings" | "media" | "content" | "feedback" | "settings";

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<TabType>("bookings");
  const [activeMediaSubTab, setActiveMediaSubTab] = useState<"banners" | "gallery">("banners");
  const [activeContentSubTab, setActiveContentSubTab] = useState<"services" | "milestones" | "offers" | "fleet">("services");

  // Wait for auth to resolve
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="inline-flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirect if not admin
  if (!user || user.role !== "admin") {
    setLocation("/");
    return null;
  }

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  const tabs = [
    { id: "bookings" as const, label: "Bookings", icon: <BookOpen size={20} /> },
    { id: "media" as const, label: "Media CMS", icon: <ImageIcon size={20} /> },
    { id: "content" as const, label: "Content CMS", icon: <MapPin size={20} /> },
    { id: "feedback" as const, label: "Feedback & Survey", icon: <MessageSquare size={20} /> },
    { id: "settings" as const, label: "Site Settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b-2 border-yellow-400 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-yellow-400">
              Admin Dashboard
            </h1>
            <p className="text-gray-400 mt-2">Welcome, {user?.name}</p>
          </div>
          <Button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
          >
            <LogOut size={20} /> Logout
          </Button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-gray-900 border-b border-yellow-400 p-4">
        <div className="container mx-auto flex gap-4 justify-between max-w-6xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-bold transition ${
                activeTab === tab.id
                  ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/20"
                  : "bg-gray-800 text-yellow-400 hover:bg-gray-700"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto p-6">
        {/* Sub-tab navigation for Media CMS */}
        {activeTab === "media" && (
          <div className="flex gap-3 mb-8 border-b border-gray-800 pb-4">
            <button
              onClick={() => setActiveMediaSubTab("banners")}
              className={`px-5 py-2.5 rounded-lg font-bold transition ${
                activeMediaSubTab === "banners"
                  ? "bg-yellow-400 text-black"
                  : "bg-gray-900 text-yellow-400 hover:bg-gray-800 border border-yellow-400/20"
              }`}
            >
              🖼️ Home Banners
            </button>
            <button
              onClick={() => setActiveMediaSubTab("gallery")}
              className={`px-5 py-2.5 rounded-lg font-bold transition ${
                activeMediaSubTab === "gallery"
                  ? "bg-yellow-400 text-black"
                  : "bg-gray-900 text-yellow-400 hover:bg-gray-800 border border-yellow-400/20"
              }`}
            >
              📸 Gallery Photos
            </button>
          </div>
        )}

        {/* Sub-tab navigation for Content CMS */}
        {activeTab === "content" && (
          <div className="flex flex-wrap gap-3 mb-8 border-b border-gray-800 pb-4">
            <button
              onClick={() => setActiveContentSubTab("services")}
              className={`px-5 py-2.5 rounded-lg font-bold transition ${
                activeContentSubTab === "services"
                  ? "bg-yellow-400 text-black"
                  : "bg-gray-900 text-yellow-400 hover:bg-gray-800 border border-yellow-400/20"
              }`}
            >
              🎯 Services CMS
            </button>
            <button
              onClick={() => setActiveContentSubTab("fleet")}
              className={`px-5 py-2.5 rounded-lg font-bold transition ${
                activeContentSubTab === "fleet"
                  ? "bg-yellow-400 text-black"
                  : "bg-gray-900 text-yellow-400 hover:bg-gray-800 border border-yellow-400/20"
              }`}
            >
              🚌 Fleet CMS
            </button>
            <button
              onClick={() => setActiveContentSubTab("offers")}
              className={`px-5 py-2.5 rounded-lg font-bold transition ${
                activeContentSubTab === "offers"
                  ? "bg-yellow-400 text-black"
                  : "bg-gray-900 text-yellow-400 hover:bg-gray-800 border border-yellow-400/20"
              }`}
            >
              🎉 Offers CMS
            </button>
            <button
              onClick={() => setActiveContentSubTab("milestones")}
              className={`px-5 py-2.5 rounded-lg font-bold transition ${
                activeContentSubTab === "milestones"
                  ? "bg-yellow-400 text-black"
                  : "bg-gray-900 text-yellow-400 hover:bg-gray-800 border border-yellow-400/20"
              }`}
            >
              📖 Timeline CMS
            </button>
          </div>
        )}

        {/* Render Tabs */}
        {activeTab === "bookings" && <BookingsTab />}
        {activeTab === "media" && activeMediaSubTab === "banners" && <BannersTab />}
        {activeTab === "media" && activeMediaSubTab === "gallery" && <GalleryTab />}
        {activeTab === "content" && activeContentSubTab === "services" && <ServicesTab />}
        {activeTab === "content" && activeContentSubTab === "fleet" && <FleetTab />}
        {activeTab === "content" && activeContentSubTab === "offers" && <OffersTab />}
        {activeTab === "content" && activeContentSubTab === "milestones" && <MilestonesTab />}
        {activeTab === "feedback" && <FeedbackTab />}
        {activeTab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
}
