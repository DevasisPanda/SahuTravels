import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, Plus } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { ImageUploadInput } from "./ImageUploadInput";

const GALLERY_CATEGORIES = ["AC Interior", "AC Exterior", "Non-AC Interior", "Non-AC Exterior", "Other"] as const;

export default function GalleryTab() {
  const [galleryTitle, setGalleryTitle] = useState("");
  const [galleryDescription, setGalleryDescription] = useState("");
  const [galleryImageUrl, setGalleryImageUrl] = useState("");
  const [galleryCategory, setGalleryCategory] = useState<typeof GALLERY_CATEGORIES[number]>("AC Interior");
  const [galleryBusType, setGalleryBusType] = useState("");

  const galleryQuery = trpc.gallery.listAll.useQuery();

  const createGalleryMutation = trpc.gallery.create.useMutation({
    onSuccess: () => {
      galleryQuery.refetch();
      toast.success("Photo uploaded successfully!");
      setGalleryTitle("");
      setGalleryDescription("");
      setGalleryImageUrl("");
      setGalleryBusType("");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to upload photo");
    },
  });

  const deleteGalleryMutation = trpc.gallery.delete.useMutation({
    onSuccess: () => {
      galleryQuery.refetch();
      toast.success("Photo deleted successfully!");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete photo");
    },
  });

  const handleUploadPhoto = () => {
    if (!galleryTitle || !galleryImageUrl) {
      toast.error("Please fill in title and image URL");
      return;
    }
    createGalleryMutation.mutate({
      title: galleryTitle,
      description: galleryDescription,
      imageUrl: galleryImageUrl,
      category: galleryCategory as typeof GALLERY_CATEGORIES[number],
      busType: galleryBusType,
    });
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-yellow-400">Gallery Photos</h2>

      <div className="bg-gray-900 border-2 border-yellow-400 rounded-lg p-8 mb-8">
        <h3 className="text-2xl font-bold text-yellow-400 mb-6">
          <Plus size={24} className="inline mr-2" />
          Upload Gallery Photo
        </h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="gallery-title" className="block text-yellow-400 font-bold mb-2">Photo Title *</label>
            <input
              id="gallery-title"
              type="text"
              value={galleryTitle}
              onChange={(e) => setGalleryTitle(e.target.value)}
              placeholder="Enter photo title"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
            />
          </div>
          <div>
            <label htmlFor="gallery-description" className="block text-yellow-400 font-bold mb-2">Description</label>
            <textarea
              id="gallery-description"
              value={galleryDescription}
              onChange={(e) => setGalleryDescription(e.target.value)}
              placeholder="Enter photo description"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400 h-20"
            />
          </div>
          <div>
            <ImageUploadInput
              id="gallery-imageUrl"
              value={galleryImageUrl}
              onChange={setGalleryImageUrl}
              label="Image *"
              placeholder="https://example.com/photo.jpg"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="gallery-category" className="block text-yellow-400 font-bold mb-2">Category *</label>
              <select
                id="gallery-category"
                value={galleryCategory}
                onChange={(e) => setGalleryCategory(e.target.value as typeof GALLERY_CATEGORIES[number])}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
              >
                {GALLERY_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="gallery-busType" className="block text-yellow-400 font-bold mb-2">Bus Type</label>
              <input
                id="gallery-busType"
                type="text"
                value={galleryBusType}
                onChange={(e) => setGalleryBusType(e.target.value)}
                placeholder="e.g., 2x2 AC"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>
          <Button
            onClick={handleUploadPhoto}
            disabled={createGalleryMutation.isPending || !galleryTitle || !galleryImageUrl}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload size={20} />
            {createGalleryMutation.isPending ? "Uploading..." : "Upload Photo"}
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-yellow-400 mb-4">All Photos</h3>
        {galleryQuery.isLoading ? (
          <p className="text-gray-400">Loading photos...</p>
        ) : galleryQuery.error ? (
          <div className="p-6 bg-red-900/20 border border-red-500 rounded-lg text-center">
            <p className="text-red-400 mb-3">Failed to load photos.</p>
            <Button onClick={() => galleryQuery.refetch()} className="bg-red-600 hover:bg-red-700 text-white">Retry</Button>
          </div>
        ) : galleryQuery.data && galleryQuery.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {galleryQuery.data.map((photo) => (
              <div key={photo.id} className="bg-gray-900 border-2 border-yellow-400 rounded-lg overflow-hidden">
                <img src={photo.imageUrl} alt={photo.title} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h4 className="text-lg font-bold text-yellow-400 mb-2">{photo.title}</h4>
                  <p className="text-gray-300 text-sm mb-2">{photo.category}</p>
                  {photo.busType && <p className="text-yellow-300 text-sm mb-4">{photo.busType}</p>}
                  <Button
                    onClick={() => deleteGalleryMutation.mutate({ id: photo.id })}
                    disabled={deleteGalleryMutation.isPending}
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
  );
}
