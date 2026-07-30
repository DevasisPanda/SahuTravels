import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  ImageIcon,
  Settings,
  MapPin,
  Milestone,
  Gift,
  Bus,
  MessageSquare,
  Camera,
  Compass,
} from "lucide-react";

import BannersTab from "@/components/admin/BannersTab";
import GalleryTab from "@/components/admin/GalleryTab";
import SettingsTab from "@/components/admin/SettingsTab";
import ServicesTab from "@/components/admin/ServicesTab";
import MilestonesTab from "@/components/admin/MilestonesTab";
import OffersTab from "@/components/admin/OffersTab";
import FleetTab from "@/components/admin/FleetTab";
import FeedbackTab from "@/components/admin/FeedbackTab";

type TabType = "media" | "content" | "feedback" | "settings";

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<TabType>("media");
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
            <h1 className="text-3xl md:text-4xl font-extrabold text-yellow-400 tracking-wide">
              Admin Dashboard
            </h1>
            <p className="text-gray-400 mt-1 text-sm">Welcome, {user?.name}</p>
          </div>
          <Button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 text-sm font-bold"
          >
            <LogOut size={18} /> Logout
          </Button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-gray-900 border-b border-yellow-400 p-4">
        <div className="container mx-auto flex flex-wrap gap-3 justify-between max-w-6xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold transition text-sm ${
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
      <div className="container mx-auto p-4 md:p-6">
        {/* Sub-tab navigation for Media CMS */}
        {activeTab === "media" && (
          <div className="flex flex-wrap gap-3 mb-8 border-b border-gray-800 pb-4">
            <button
              onClick={() => setActiveMediaSubTab("banners")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold transition text-sm ${
                activeMediaSubTab === "banners"
                  ? "bg-yellow-400 text-black"
                  : "bg-gray-900 text-yellow-400 hover:bg-gray-800 border border-yellow-400/20"
              }`}
            >
              <ImageIcon size={18} /> Home Banners
            </button>
            <button
              onClick={() => setActiveMediaSubTab("gallery")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold transition text-sm ${
                activeMediaSubTab === "gallery"
                  ? "bg-yellow-400 text-black"
                  : "bg-gray-900 text-yellow-400 hover:bg-gray-800 border border-yellow-400/20"
              }`}
            >
              <Camera size={18} /> Gallery Photos
            </button>
          </div>
        )}

        {/* Sub-tab navigation for Content CMS */}
        {activeTab === "content" && (
          <div className="flex flex-wrap gap-3 mb-8 border-b border-gray-800 pb-4">
            <button
              onClick={() => setActiveContentSubTab("services")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold transition text-sm ${
                activeContentSubTab === "services"
                  ? "bg-yellow-400 text-black"
                  : "bg-gray-900 text-yellow-400 hover:bg-gray-800 border border-yellow-400/20"
              }`}
            >
              <Compass size={18} /> Services CMS
            </button>
            <button
              onClick={() => setActiveContentSubTab("fleet")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold transition text-sm ${
                activeContentSubTab === "fleet"
                  ? "bg-yellow-400 text-black"
                  : "bg-gray-900 text-yellow-400 hover:bg-gray-800 border border-yellow-400/20"
              }`}
            >
              <Bus size={18} /> Fleet CMS
            </button>
            <button
              onClick={() => setActiveContentSubTab("offers")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold transition text-sm ${
                activeContentSubTab === "offers"
                  ? "bg-yellow-400 text-black"
                  : "bg-gray-900 text-yellow-400 hover:bg-gray-800 border border-yellow-400/20"
              }`}
            >
              <Gift size={18} /> Offers CMS
            </button>
            <button
              onClick={() => setActiveContentSubTab("milestones")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold transition text-sm ${
                activeContentSubTab === "milestones"
                  ? "bg-yellow-400 text-black"
                  : "bg-gray-900 text-yellow-400 hover:bg-gray-800 border border-yellow-400/20"
              }`}
            >
              <Milestone size={18} /> Timeline CMS
            </button>
          </div>
        )}

        {/* Render Tabs */}
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
