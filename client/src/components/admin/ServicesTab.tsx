import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit2, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const SERVICE_ICONS = ["MapPin", "Users", "Heart", "Briefcase"] as const;

export default function ServicesTab() {
  const servicesQuery = trpc.services.listAll.useQuery();
  const createMutation = trpc.services.create.useMutation({
    onSuccess: () => { servicesQuery.refetch(); resetForm(); toast.success("Service created!"); },
    onError: (err) => { toast.error(err.message || "Failed to save service"); },
  });
  const updateMutation = trpc.services.update.useMutation({
    onSuccess: () => { servicesQuery.refetch(); resetForm(); toast.success("Service updated!"); },
    onError: (err) => { toast.error(err.message || "Failed to save service"); },
  });
  const deleteMutation = trpc.services.delete.useMutation({
    onSuccess: () => { servicesQuery.refetch(); toast.success("Service deleted!"); },
    onError: (err) => { toast.error(err.message || "Failed to delete service"); },
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("MapPin");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [highlightInput, setHighlightInput] = useState("");
  const [highlights, setHighlights] = useState<string[]>([]);

  const resetForm = () => {
    setEditingId(null);
    setTitle(""); setDescription(""); setIcon("MapPin"); setDisplayOrder(0);
    setHighlightInput(""); setHighlights([]);
  };

  const handleAddHighlight = () => {
    if (highlightInput.trim()) { setHighlights([...highlights, highlightInput.trim()]); setHighlightInput(""); }
  };

  const handleRemoveHighlight = (idx: number) => {
    setHighlights(highlights.filter((_, i) => i !== idx));
  };

  const handleEdit = (service: NonNullable<typeof servicesQuery.data>[number]) => {
    setEditingId(service.id);
    setTitle(service.title); setDescription(service.description); setIcon(service.icon);
    setDisplayOrder(service.displayOrder);
    try { setHighlights(JSON.parse(service.highlights)); } catch { setHighlights([]); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error("Please fill in title and description");
      return;
    }
    const payload = { title, description, icon, highlights: JSON.stringify(highlights), displayOrder };
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  if (servicesQuery.isLoading) return <p className="text-gray-400">Loading services...</p>;
  if (servicesQuery.error) {
    return (
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-yellow-400">Services Management</h2>
        <div className="p-6 bg-red-900/20 border border-red-500 rounded-lg text-center">
          <p className="text-red-400 mb-3">Failed to load services.</p>
          <Button onClick={() => servicesQuery.refetch()} className="bg-red-600 hover:bg-red-700 text-white">Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-yellow-400">Services Management</h2>
        {editingId && <Button onClick={resetForm} className="bg-gray-700 hover:bg-gray-600 text-white font-bold">Cancel Edit</Button>}
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-900 border-2 border-yellow-400 rounded-lg p-6 space-y-4">
        <h3 className="text-xl font-bold text-yellow-400">{editingId ? "✏️ Edit Service" : "➕ Add Service"}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="service-title" className="block text-gray-400 font-bold mb-1">Service Title *</label>
            <input id="service-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Tours, Picnics" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400" />
          </div>
          <div>
            <label htmlFor="service-icon" className="block text-gray-400 font-bold mb-1">Icon Type</label>
            <select id="service-icon" value={icon} onChange={(e) => setIcon(e.target.value)} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400">
              <option value="MapPin">📍 MapPin (Tours)</option>
              <option value="Users">👥 Users (Picnics/Groups)</option>
              <option value="Heart">❤️ Heart (Weddings)</option>
              <option value="Briefcase">💼 Briefcase (Contracts/Tenders)</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <label htmlFor="service-description" className="block text-gray-400 font-bold mb-1">Description *</label>
            <textarea id="service-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter full description..." className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400 h-24" />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="service-highlights" className="block text-gray-400 font-bold mb-1">Highlights</label>
            <div className="flex gap-2">
              <input id="service-highlights" type="text" value={highlightInput} onChange={(e) => setHighlightInput(e.target.value)} placeholder="Type a highlight and click Add..." className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400" />
              <Button type="button" onClick={handleAddHighlight} className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold">Add</Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {highlights.map((h, idx) => (
                <span key={idx} className="bg-gray-800 border border-yellow-400 text-yellow-400 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  {h}
                  <button type="button" onClick={() => handleRemoveHighlight(idx)} aria-label="Remove highlight" className="hover:text-red-500"><X size={14} /></button>
                </span>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="service-order" className="block text-gray-400 font-bold mb-1">Display Order</label>
            <input id="service-order" type="number" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value) || 0)} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400" />
          </div>
        </div>
        <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3">
          {editingId ? "Save Changes" : "Create Service"}
        </Button>
      </form>

      <div>
        <h3 className="text-2xl font-bold text-yellow-400 mb-4">Current Services</h3>
        {!servicesQuery.data || servicesQuery.data.length === 0 ? (
          <p className="text-gray-400">No services created yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {servicesQuery.data.map((service) => {
              let parsedHighlights: string[] = [];
              try { parsedHighlights = JSON.parse(service.highlights); } catch {}
              return (
                <div key={service.id} className="bg-gray-900 border-2 border-yellow-400 rounded-lg p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
                        <span className="text-gray-400 text-sm">[{service.icon}]</span> {service.title}
                      </h4>
                      <span className="text-xs text-gray-500">Order: {service.displayOrder}</span>
                    </div>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">{service.description}</p>
                    <div className="space-y-1 mb-4">
                      {parsedHighlights.map((h, i) => <p key={i} className="text-xs text-gray-400">• {h}</p>)}
                    </div>
                  </div>
                  <div className="flex gap-2 border-t border-gray-800 pt-4 mt-auto">
                    <Button onClick={() => handleEdit(service)} className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-bold"><Edit2 size={16} className="mr-1" /> Edit</Button>
                    <Button onClick={() => deleteMutation.mutate({ id: service.id })} disabled={deleteMutation.isPending} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold"><Trash2 size={16} className="mr-1" /> Delete</Button>
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
