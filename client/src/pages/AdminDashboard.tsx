import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { LogOut, Upload, BookOpen, ImageIcon, Trash2, Plus } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"bookings" | "banners" | "gallery">("bookings");
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerDescription, setBannerDescription] = useState("");
  const [bannerImageUrl, setBannerImageUrl] = useState("");
  const [bannerCtaText, setBannerCtaText] = useState("");
  const [bannerCtaLink, setBannerCtaLink] = useState("");
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [galleryTitle, setGalleryTitle] = useState("");
  const [galleryDescription, setGalleryDescription] = useState("");
  const [galleryImageUrl, setGalleryImageUrl] = useState("");
  const [galleryCategory, setGalleryCategory] = useState<"AC Interior" | "AC Exterior" | "Non-AC Interior" | "Non-AC Exterior" | "Other">("AC Interior");
  const [galleryBusType, setGalleryBusType] = useState("");

  // Queries
  const bookingsQuery = trpc.bookings.list.useQuery();
  const bannersQuery = trpc.banners.listAll.useQuery();
  const galleryQuery = trpc.gallery.listAll.useQuery();

  // Mutations
  const createBannerMutation = trpc.banners.create.useMutation({
    onSuccess: () => {
      bannersQuery.refetch();
    },
  });
  const deleteBannerMutation = trpc.banners.delete.useMutation({
    onSuccess: () => {
      bannersQuery.refetch();
    },
  });
  const createGalleryMutation = trpc.gallery.create.useMutation({
    onSuccess: () => {
      galleryQuery.refetch();
    },
  });
  const deleteGalleryMutation = trpc.gallery.delete.useMutation({
    onSuccess: () => {
      galleryQuery.refetch();
    },
  });

  // Redirect if not admin
  if (!user || user.role !== "admin") {
    setLocation("/");
    return null;
  }

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!bannerTitle || !bannerImageUrl) {
      toast.error("Please fill in title and image URL");
      return;
    }

    setUploadingBanner(true);
    try {
      await createBannerMutation.mutateAsync({
        title: bannerTitle,
        description: bannerDescription,
        imageUrl: bannerImageUrl,
        ctaText: bannerCtaText,
        ctaLink: bannerCtaLink,
      });

      toast.success("Banner uploaded successfully!");
      setBannerTitle("");
      setBannerDescription("");
      setBannerImageUrl("");
      setBannerCtaText("");
      setBannerCtaLink("");
    } catch (error) {
      toast.error("Failed to upload banner");
      console.error(error);
    } finally {
      setUploadingBanner(false);
    }
  };

  const handleDeleteBanner = async (bannerId: number) => {
    try {
      await deleteBannerMutation.mutateAsync({ id: bannerId });
      toast.success("Banner deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete banner");
      console.error(error);
    }
  };

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
        <div className="container mx-auto flex gap-4 flex-wrap">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition ${
              activeTab === "bookings"
                ? "bg-yellow-400 text-black"
                : "bg-gray-800 text-yellow-400 hover:bg-gray-700"
            }`}
          >
            <BookOpen size={20} /> Bookings
          </button>
          <button
            onClick={() => setActiveTab("banners")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition ${
              activeTab === "banners"
                ? "bg-yellow-400 text-black"
                : "bg-gray-800 text-yellow-400 hover:bg-gray-700"
            }`}
          >
            <ImageIcon size={20} /> Home Banners
          </button>
          <button
            onClick={() => setActiveTab("gallery")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition ${
              activeTab === "gallery"
                ? "bg-yellow-400 text-black"
                : "bg-gray-800 text-yellow-400 hover:bg-gray-700"
            }`}
          >
            <ImageIcon size={20} /> Gallery Photos
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto p-6">
        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-yellow-400">
              Bus Bookings
            </h2>
            {bookingsQuery.isLoading ? (
              <p className="text-gray-400">Loading bookings...</p>
            ) : bookingsQuery.data && bookingsQuery.data.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-900 border-b-2 border-yellow-400">
                      <th className="px-4 py-3 text-left text-yellow-400">Name</th>
                      <th className="px-4 py-3 text-left text-yellow-400">Phone</th>
                      <th className="px-4 py-3 text-left text-yellow-400">Journey Date</th>
                      <th className="px-4 py-3 text-left text-yellow-400">Source</th>
                      <th className="px-4 py-3 text-left text-yellow-400">Destination</th>
                      <th className="px-4 py-3 text-left text-yellow-400">Bus Type</th>
                      <th className="px-4 py-3 text-left text-yellow-400">Passengers</th>
                      <th className="px-4 py-3 text-left text-yellow-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingsQuery.data.map((booking: any) => (
                      <tr key={booking.id} className="border-b border-gray-700 hover:bg-gray-900">
                        <td className="px-4 py-3">{booking.name}</td>
                        <td className="px-4 py-3">{booking.phone}</td>
                        <td className="px-4 py-3">{booking.journeyDate}</td>
                        <td className="px-4 py-3">{booking.source}</td>
                        <td className="px-4 py-3">{booking.destination}</td>
                        <td className="px-4 py-3">{booking.busType}</td>
                        <td className="px-4 py-3">{booking.passengers}</td>
                        <td className="px-4 py-3">
                          <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-400">No bookings yet.</p>
            )}
          </div>
        )}

        {/* Banners Tab */}
        {activeTab === "banners" && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-yellow-400">
              Home Page Banners
            </h2>

            {/* Banner Upload Form */}
            <div className="bg-gray-900 border-2 border-yellow-400 rounded-lg p-8 mb-8">
              <h3 className="text-2xl font-bold text-yellow-400 mb-6">
                <Plus size={24} className="inline mr-2" />
                Upload New Banner
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-yellow-400 font-bold mb-2">
                    Banner Title *
                  </label>
                  <input
                    type="text"
                    value={bannerTitle}
                    onChange={(e) => setBannerTitle(e.target.value)}
                    placeholder="Enter banner title"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-yellow-400 font-bold mb-2">
                    Description
                  </label>
                  <textarea
                    value={bannerDescription}
                    onChange={(e) => setBannerDescription(e.target.value)}
                    placeholder="Enter banner description"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400 h-24"
                  />
                </div>

                <div>
                  <label className="block text-yellow-400 font-bold mb-2">
                    Image URL *
                  </label>
                  <input
                    type="url"
                    value={bannerImageUrl}
                    onChange={(e) => setBannerImageUrl(e.target.value)}
                    placeholder="https://example.com/banner.jpg"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-yellow-400 font-bold mb-2">
                      CTA Text
                    </label>
                    <input
                      type="text"
                      value={bannerCtaText}
                      onChange={(e) => setBannerCtaText(e.target.value)}
                      placeholder="e.g., Book Now"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-yellow-400 font-bold mb-2">
                      CTA Link
                    </label>
                    <input
                      type="text"
                      value={bannerCtaLink}
                      onChange={(e) => setBannerCtaLink(e.target.value)}
                      placeholder="e.g., /booking"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                </div>

                <Button
                  onClick={() => handleBannerUpload({} as any)}
                  disabled={uploadingBanner || !bannerTitle || !bannerImageUrl}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload size={20} />
                  {uploadingBanner ? "Uploading..." : "Create Banner"}
                </Button>
              </div>
            </div>

            {/* Banners List */}
            <div>
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">
                Active Banners
              </h3>
              {bannersQuery.isLoading ? (
                <p className="text-gray-400">Loading banners...</p>
              ) : bannersQuery.data && bannersQuery.data.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {bannersQuery.data.map((banner: any) => (
                    <div
                      key={banner.id}
                      className="bg-gray-900 border-2 border-yellow-400 rounded-lg overflow-hidden"
                    >
                      <img
                        src={banner.imageUrl}
                        alt={banner.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <h4 className="text-xl font-bold text-yellow-400 mb-2">
                          {banner.title}
                        </h4>
                        <p className="text-gray-300 text-sm mb-4">
                          {banner.description || "No description"}
                        </p>
                        {banner.ctaText && (
                          <p className="text-yellow-300 text-sm mb-4">
                            CTA: {banner.ctaText} → {banner.ctaLink}
                          </p>
                        )}
                        <Button
                          onClick={() => handleDeleteBanner(banner.id)}
                          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2"
                        >
                          <Trash2 size={18} /> Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No banners uploaded yet.</p>
              )}
            </div>
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === "gallery" && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-yellow-400">
              Gallery Photos
            </h2>

            {/* Gallery Upload Form */}
            <div className="bg-gray-900 border-2 border-yellow-400 rounded-lg p-8 mb-8">
              <h3 className="text-2xl font-bold text-yellow-400 mb-6">
                <Plus size={24} className="inline mr-2" />
                Upload Gallery Photo
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-yellow-400 font-bold mb-2">
                    Photo Title *
                  </label>
                  <input
                    type="text"
                    value={galleryTitle}
                    onChange={(e) => setGalleryTitle(e.target.value)}
                    placeholder="Enter photo title"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-yellow-400 font-bold mb-2">
                    Description
                  </label>
                  <textarea
                    value={galleryDescription}
                    onChange={(e) => setGalleryDescription(e.target.value)}
                    placeholder="Enter photo description"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400 h-20"
                  />
                </div>

                <div>
                  <label className="block text-yellow-400 font-bold mb-2">
                    Image URL *
                  </label>
                  <input
                    type="url"
                    value={galleryImageUrl}
                    onChange={(e) => setGalleryImageUrl(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-yellow-400 font-bold mb-2">
                      Category *
                    </label>
                    <select
                      value={galleryCategory}
                      onChange={(e) => setGalleryCategory(e.target.value as any)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                    >
                      <option>AC Interior</option>
                      <option>AC Exterior</option>
                      <option>Non-AC Interior</option>
                      <option>Non-AC Exterior</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-yellow-400 font-bold mb-2">
                      Bus Type
                    </label>
                    <input
                      type="text"
                      value={galleryBusType}
                      onChange={(e) => setGalleryBusType(e.target.value)}
                      placeholder="e.g., 2x2 AC"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                </div>

                <Button
                  onClick={async () => {
                    if (!galleryTitle || !galleryImageUrl) {
                      toast.error("Please fill in title and image URL");
                      return;
                    }
                    setUploadingGallery(true);
                    try {
                      await createGalleryMutation.mutateAsync({
                        title: galleryTitle,
                        description: galleryDescription,
                        imageUrl: galleryImageUrl,
                        category: galleryCategory,
                        busType: galleryBusType,
                      });
                      toast.success("Photo uploaded successfully!");
                      setGalleryTitle("");
                      setGalleryDescription("");
                      setGalleryImageUrl("");
                      setGalleryBusType("");
                    } catch (error) {
                      toast.error("Failed to upload photo");
                      console.error(error);
                    } finally {
                      setUploadingGallery(false);
                    }
                  }}
                  disabled={uploadingGallery || !galleryTitle || !galleryImageUrl}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload size={20} />
                  {uploadingGallery ? "Uploading..." : "Upload Photo"}
                </Button>
              </div>
            </div>

            {/* Gallery Photos List */}
            <div>
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">
                All Photos
              </h3>
              {galleryQuery.isLoading ? (
                <p className="text-gray-400">Loading photos...</p>
              ) : galleryQuery.data && galleryQuery.data.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {galleryQuery.data.map((photo: any) => (
                    <div
                      key={photo.id}
                      className="bg-gray-900 border-2 border-yellow-400 rounded-lg overflow-hidden"
                    >
                      <img
                        src={photo.imageUrl}
                        alt={photo.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <h4 className="text-lg font-bold text-yellow-400 mb-2">
                          {photo.title}
                        </h4>
                        <p className="text-gray-300 text-sm mb-2">
                          {photo.category}
                        </p>
                        {photo.busType && (
                          <p className="text-yellow-300 text-sm mb-4">
                            {photo.busType}
                          </p>
                        )}
                        <Button
                          onClick={async () => {
                            await deleteGalleryMutation.mutateAsync({ id: photo.id });
                            toast.success("Photo deleted!");
                          }}
                          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2"
                        >
                          <Trash2 size={18} /> Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No photos uploaded yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
