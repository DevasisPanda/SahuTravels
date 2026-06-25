import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const galleryQuery = trpc.gallery.list.useQuery();

  // Default gallery items
  const defaultGalleryItems = [
    {
      title: "Luxury AC Bus Interior",
      category: "AC Interior",
      image: "/manus-storage/0V6aVifkFqEW_5fe9ef75.jpg",
    },
    {
      title: "Premium AC Bus Seating",
      category: "AC Interior",
      image: "/manus-storage/9dlR4M3yk2Dw_6dd58858.jpg",
    },
    {
      title: "AC Bus Comfort Features",
      category: "AC Interior",
      image: "/manus-storage/R3banLBSpJmM_20b614e7.jpg",
    },
    {
      title: "Modern Coach Bus Exterior",
      category: "AC Exterior",
      image: "/manus-storage/6im2H7aQdFhM_4541cc7f.jpg",
    },
    {
      title: "Non-AC Bus Interior",
      category: "Non-AC Interior",
      image: "/manus-storage/G3h9PCbfukVk_0894e0ce.jpg",
    },
    {
      title: "Non-AC Bus Seating",
      category: "Non-AC Interior",
      image: "/manus-storage/toJUwHBUYSZA_ccd7dbf5.jpg",
    },
    {
      title: "Comfortable Non-AC Interior",
      category: "Non-AC Interior",
      image: "/manus-storage/tqdRMwuc590A_49561119.jpg",
    },
    {
      title: "Premium Bus Features",
      category: "Other",
      image: "/manus-storage/0V6aVifkFqEW_5fe9ef75.jpg",
    },
  ];

  // Combine uploaded photos with default items
  const allPhotos = galleryQuery.data && galleryQuery.data.length > 0 
    ? [...galleryQuery.data, ...defaultGalleryItems]
    : defaultGalleryItems;

  const categories = ["All", "AC Interior", "AC Exterior", "Non-AC Interior", "Non-AC Exterior", "Other"];

  const filteredItems = activeCategory === "All"
    ? allPhotos
    : allPhotos.filter((item: any) => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black via-yellow-900 to-black py-16">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-yellow-400 mb-4">🚌 Our Gallery</h1>
          <p className="text-gray-300 text-lg">Explore our premium bus fleet and amenities</p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-full font-bold transition ${
                  activeCategory === category
                    ? "bg-yellow-400 text-black"
                    : "bg-gray-800 text-yellow-400 hover:bg-gray-700 border-2 border-yellow-400"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          {galleryQuery.isLoading ? (
            <div className="text-center text-gray-400">Loading gallery...</div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item: any, index: number) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-lg border-2 border-yellow-400 hover:border-yellow-300 transition"
                >
                  <img
                    src={item.image || item.imageUrl}
                    alt={item.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-yellow-400 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-300 text-sm">
                        {item.category}
                      </p>
                      {item.busType && (
                        <p className="text-yellow-300 text-sm mt-2">
                          {item.busType}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-12">
              No photos available in this category.
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
