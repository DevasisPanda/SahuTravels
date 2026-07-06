import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function MilestonesTab() {
  const milestonesQuery = trpc.milestones.listAll.useQuery();
  const createMutation = trpc.milestones.create.useMutation({
    onSuccess: () => {
      milestonesQuery.refetch();
      resetForm();
      toast.success("Milestone created!");
    },
    onError: (err) => { toast.error(err.message || "Failed to save milestone"); },
  });
  const updateMutation = trpc.milestones.update.useMutation({
    onSuccess: () => {
      milestonesQuery.refetch();
      resetForm();
      toast.success("Milestone updated!");
    },
    onError: (err) => { toast.error(err.message || "Failed to save milestone"); },
  });
  const deleteMutation = trpc.milestones.delete.useMutation({
    onSuccess: () => {
      milestonesQuery.refetch();
      toast.success("Milestone deleted!");
    },
    onError: (err) => { toast.error(err.message || "Failed to delete"); },
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [year, setYear] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);

  const resetForm = () => {
    setEditingId(null);
    setYear("");
    setTitle("");
    setDescription("");
    setDisplayOrder(0);
  };

  const handleEdit = (m: NonNullable<typeof milestonesQuery.data>[number]) => {
    setEditingId(m.id);
    setYear(m.year);
    setTitle(m.title);
    setDescription(m.description);
    setDisplayOrder(m.displayOrder);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!year || !title || !description) {
      toast.error("Please fill in year, title and description");
      return;
    }
    const payload = { year, title, description, displayOrder };
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  if (milestonesQuery.isLoading) return <p className="text-gray-400">Loading milestones...</p>;
  if (milestonesQuery.error) {
    return (
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-yellow-400">Timeline Milestones</h2>
        <div className="p-6 bg-red-900/20 border border-red-500 rounded-lg text-center">
          <p className="text-red-400 mb-3">Failed to load milestones.</p>
          <Button onClick={() => milestonesQuery.refetch()} className="bg-red-600 hover:bg-red-700 text-white">Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-yellow-400">Timeline Milestones (About Page)</h2>
        {editingId && (
          <Button onClick={resetForm} className="bg-gray-700 hover:bg-gray-600 text-white">Cancel Edit</Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-900 border-2 border-yellow-400 rounded-lg p-6 space-y-4">
        <h3 className="text-xl font-bold text-yellow-400">
          {editingId ? "✏️ Edit Timeline Entry" : "➕ Add Timeline Entry"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="milestone-year" className="block text-gray-400 font-bold mb-1">Year *</label>
            <input id="milestone-year" type="text" value={year} onChange={(e) => setYear(e.target.value)} placeholder="e.g. 1989" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400" />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="milestone-title" className="block text-gray-400 font-bold mb-1">Title *</label>
            <input id="milestone-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Founded in Kota" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400" />
          </div>
          <div>
            <label htmlFor="milestone-order" className="block text-gray-400 font-bold mb-1">Display Order</label>
            <input id="milestone-order" type="number" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value) || 0)} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400" />
          </div>
          <div className="md:col-span-4">
            <label htmlFor="milestone-description" className="block text-gray-400 font-bold mb-1">Description *</label>
            <textarea id="milestone-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detail what happened during this milestone..." className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400 h-24" />
          </div>
        </div>
        <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3">
          {editingId ? "Save Milestone" : "Create Milestone"}
        </Button>
      </form>

      <div className="bg-gray-900 border-2 border-yellow-400 rounded-lg p-6">
        <h3 className="text-2xl font-bold text-yellow-400 mb-4">Milestones List</h3>
        {!milestonesQuery.data || milestonesQuery.data.length === 0 ? (
          <p className="text-gray-400">No milestones yet.</p>
        ) : (
          <div className="space-y-4">
            {milestonesQuery.data.map((m) => (
              <div key={m.id} className="border-b border-gray-800 pb-4 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="bg-yellow-400 text-black font-bold px-3 py-1 rounded text-sm">{m.year}</span>
                    <h4 className="text-lg font-bold text-white">{m.title}</h4>
                    <span className="text-xs text-gray-500">Order: {m.displayOrder}</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">{m.description}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button onClick={() => handleEdit(m)} aria-label="Edit milestone" size="icon" className="bg-yellow-400 hover:bg-yellow-500 text-black">
                    <Edit2 size={16} />
                  </Button>
                  <Button onClick={() => deleteMutation.mutate({ id: m.id })} disabled={deleteMutation.isPending} aria-label="Delete milestone" size="icon" className="bg-red-600 hover:bg-red-700 text-white">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
