import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, Plus } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function BannersTab() {
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerDescription, setBannerDescription] = useState("");
  const [bannerImageUrl, setBannerImageUrl] = useState("");
  const [bannerCtaText, setBannerCtaText] = useState("");
  const [bannerCtaLink, setBannerCtaLink] = useState("");

  const bannersQuery = trpc.banners.listAll.useQuery();

  const createBannerMutation = trpc.banners.create.useMutation({
    onSuccess: () => {
      bannersQuery.refetch();
      toast.success("Banner uploaded successfully!");
      setBannerTitle("");
      setBannerDescription("");
      setBannerImageUrl("");
      setBannerCtaText("");
      setBannerCtaLink("");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to upload banner");
    },
  });

  const deleteBannerMutation = trpc.banners.delete.useMutation({
    onSuccess: () => {
      bannersQuery.refetch();
      toast.success("Banner deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete banner");
    },
  });

  const submitBanner = async () => {
    if (!bannerTitle || !bannerImageUrl) {
      toast.error("Please fill in title and image URL");
      return;
    }

    await createBannerMutation.mutateAsync({
      title: bannerTitle,
      description: bannerDescription,
      imageUrl: bannerImageUrl,
      ctaText: bannerCtaText,
      ctaLink: bannerCtaLink,
    });
  };

  return (
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
            <label htmlFor="banner-title" className="block text-yellow-400 font-bold mb-2">
              Banner Title *
            </label>
            <input
              id="banner-title"
              type="text"
              value={bannerTitle}
              onChange={(e) => setBannerTitle(e.target.value)}
              placeholder="Enter banner title"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <label htmlFor="banner-description" className="block text-yellow-400 font-bold mb-2">
              Description
            </label>
            <textarea
              id="banner-description"
              value={bannerDescription}
              onChange={(e) => setBannerDescription(e.target.value)}
              placeholder="Enter banner description"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400 h-24"
            />
          </div>

          <div>
            <label htmlFor="banner-imageUrl" className="block text-yellow-400 font-bold mb-2">
              Image URL *
            </label>
            <input
              id="banner-imageUrl"
              type="url"
              value={bannerImageUrl}
              onChange={(e) => setBannerImageUrl(e.target.value)}
              placeholder="https://example.com/banner.jpg"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="banner-ctaText" className="block text-yellow-400 font-bold mb-2">
                CTA Text
              </label>
              <input
                id="banner-ctaText"
                type="text"
                value={bannerCtaText}
                onChange={(e) => setBannerCtaText(e.target.value)}
                placeholder="e.g., Book Now"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label htmlFor="banner-ctaLink" className="block text-yellow-400 font-bold mb-2">
                CTA Link
              </label>
              <input
                id="banner-ctaLink"
                type="text"
                value={bannerCtaLink}
                onChange={(e) => setBannerCtaLink(e.target.value)}
                placeholder="e.g., /booking"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          <Button
            onClick={submitBanner}
            disabled={createBannerMutation.isPending || !bannerTitle || !bannerImageUrl}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload size={20} />
            {createBannerMutation.isPending ? "Uploading..." : "Create Banner"}
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
        ) : bannersQuery.error ? (
          <div className="p-6 bg-red-900/20 border border-red-500 rounded-lg text-center">
            <p className="text-red-400 mb-3">Failed to load banners.</p>
            <Button onClick={() => bannersQuery.refetch()} className="bg-red-600 hover:bg-red-700 text-white">
              Retry
            </Button>
          </div>
        ) : bannersQuery.data && bannersQuery.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bannersQuery.data.map((banner) => (
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
                    onClick={() => deleteBannerMutation.mutateAsync({ id: banner.id })}
                    disabled={deleteBannerMutation.isPending}
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
  );
}
