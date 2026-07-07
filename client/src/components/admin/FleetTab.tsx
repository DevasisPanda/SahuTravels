import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit2, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { ImageUploadInput } from "./ImageUploadInput";

export default function FleetTab() {
  const fleetQuery = trpc.fleet.list.useQuery();
  const createMutation = trpc.fleet.create.useMutation({
    onSuccess: () => { fleetQuery.refetch(); resetForm(); toast.success("Bus added to fleet!"); },
    onError: (err) => { toast.error(err.message || "Failed to save bus record"); },
  });
  const updateMutation = trpc.fleet.update.useMutation({
    onSuccess: () => { fleetQuery.refetch(); resetForm(); toast.success("Bus updated!"); },
    onError: (err) => { toast.error(err.message || "Failed to save bus record"); },
  });
  const deleteMutation = trpc.fleet.delete.useMutation({
    onSuccess: () => { fleetQuery.refetch(); toast.success("Bus deleted!"); },
    onError: (err) => { toast.error(err.message || "Failed to delete bus record"); },
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState("2x2");
  const [isAC, setIsAC] = useState(1);
  const [seats, setSeats] = useState(42);
  const [className, setClassName] = useState("Premium");
  const [imageUrl, setImageUrl] = useState("");
  const [amenityInput, setAmenityInput] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);

  const resetForm = () => {
    setEditingId(null);
    setName(""); setType("2x2"); setIsAC(1); setSeats(42);
    setClassName("Premium"); setImageUrl(""); setAmenityInput(""); setAmenities([]);
  };

  const handleAddAmenity = () => {
    if (amenityInput.trim()) { setAmenities([...amenities, amenityInput.trim()]); setAmenityInput(""); }
  };

  const handleRemoveAmenity = (idx: number) => {
    setAmenities(amenities.filter((_, i) => i !== idx));
  };

  const handleEdit = (bus: NonNullable<typeof fleetQuery.data>[number]) => {
    setEditingId(bus.id);
    setName(bus.name); setType(bus.type); setIsAC(bus.isAC); setSeats(bus.seats);
    setClassName(bus.class); setImageUrl(bus.imageUrl || "");
    try { setAmenities(JSON.parse(bus.amenities)); } catch { setAmenities([]); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !className) { toast.error("Please fill in name and class"); return; }
    const payload = { name, type, isAC, seats, class: className, amenities: JSON.stringify(amenities), imageUrl: imageUrl || undefined };
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  if (fleetQuery.isLoading) return <p className="text-gray-400">Loading fleet...</p>;
  if (fleetQuery.error) {
    return (
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-yellow-400">Fleet Management</h2>
        <div className="p-6 bg-red-900/20 border border-red-500 rounded-lg text-center">
          <p className="text-red-400 mb-3">Failed to load fleet.</p>
          <Button onClick={() => fleetQuery.refetch()} className="bg-red-600 hover:bg-red-700 text-white">Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-yellow-400">Bus Fleet Management</h2>
        {editingId && <Button onClick={resetForm} className="bg-gray-700 hover:bg-gray-600 text-white font-bold">Cancel Edit</Button>}
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-900 border-2 border-yellow-400 rounded-lg p-6 space-y-4">
        <h3 className="text-xl font-bold text-yellow-400">{editingId ? "✏️ Edit Bus" : "➕ Add New Bus"}</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="fleet-name" className="block text-gray-400 font-bold mb-1">Bus Name *</label>
            <input id="fleet-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. 2x2 AC Premium" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400" />
          </div>
          <div>
            <label htmlFor="fleet-type" className="block text-gray-400 font-bold mb-1">Layout Type</label>
            <input id="fleet-type" type="text" value={type} onChange={(e) => setType(e.target.value)} placeholder="e.g. 2x2 or 3x2" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400" />
          </div>
          <div>
            <label htmlFor="fleet-class" className="block text-gray-400 font-bold mb-1">Bus Class *</label>
            <input id="fleet-class" type="text" value={className} onChange={(e) => setClassName(e.target.value)} placeholder="e.g. Premium, Deluxe" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400" />
          </div>
          <div>
            <label htmlFor="fleet-ac" className="block text-gray-400 font-bold mb-1">Is AC Bus?</label>
            <select id="fleet-ac" value={isAC} onChange={(e) => setIsAC(Number(e.target.value))} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400">
              <option value={1}>Yes (Air Conditioned)</option>
              <option value={0}>No (Non-AC)</option>
            </select>
          </div>
          <div>
            <label htmlFor="fleet-seats" className="block text-gray-400 font-bold mb-1">Seat Capacity</label>
            <input id="fleet-seats" type="number" value={seats} onChange={(e) => setSeats(Number(e.target.value) || 0)} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400" />
          </div>
          <div className="md:col-span-2">
            <ImageUploadInput
              id="fleet-imageUrl"
              value={imageUrl}
              onChange={setImageUrl}
              label="Bus Image"
              placeholder="https://example.com/bus.jpg"
            />
          </div>
          <div className="md:col-span-4">
            <label htmlFor="fleet-amenities" className="block text-gray-400 font-bold mb-1">Amenities</label>
            <div className="flex gap-2">
              <input id="fleet-amenities" type="text" value={amenityInput} onChange={(e) => setAmenityInput(e.target.value)} placeholder="e.g. WiFi, CCTV, Charging Points..." className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400" />
              <Button type="button" onClick={handleAddAmenity} className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold">Add</Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {amenities.map((a, idx) => (
                <span key={idx} className="bg-gray-800 border border-yellow-400 text-yellow-400 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  {a}
                  <button type="button" onClick={() => handleRemoveAmenity(idx)} aria-label="Remove amenity" className="hover:text-red-500"><X size={14} /></button>
                </span>
              ))}
            </div>
          </div>
        </div>
        <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3">
          {editingId ? "Save Bus Info" : "Add Bus to Fleet"}
        </Button>
      </form>

      <div>
        <h3 className="text-2xl font-bold text-yellow-400 mb-4">Current Fleet</h3>
        {!fleetQuery.data || fleetQuery.data.length === 0 ? (
          <p className="text-gray-400">No buses in fleet yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fleetQuery.data.map((bus) => {
              let parsedAmenities: string[] = [];
              try { parsedAmenities = JSON.parse(bus.amenities); } catch {}
              return (
                <div key={bus.id} className="bg-gray-900 border-2 border-yellow-400 rounded-lg overflow-hidden flex flex-col justify-between">
                  {bus.imageUrl && (
                    <div className="h-40 w-full overflow-hidden bg-gray-800">
                      <img src={bus.imageUrl} alt={bus.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-bold text-yellow-400">{bus.name}</h4>
                      <span className="bg-gray-800 text-yellow-400 text-xs px-2 py-0.5 rounded border border-yellow-400">{bus.class}</span>
                    </div>
                    <p className="text-gray-300 text-sm mb-4">{bus.seats} Seats | Layout: {bus.type} | {bus.isAC === 1 ? "❄️ AC" : "🌬️ Non-AC"}</p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {parsedAmenities.map((a, i) => <span key={i} className="bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded">✓ {a}</span>)}
                    </div>
                    <div className="flex gap-2 border-t border-gray-800 pt-4">
                      <Button onClick={() => handleEdit(bus)} className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-bold"><Edit2 size={16} className="mr-1" /> Edit</Button>
                      <Button onClick={() => deleteMutation.mutate({ id: bus.id })} disabled={deleteMutation.isPending} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold"><Trash2 size={16} className="mr-1" /> Delete</Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
