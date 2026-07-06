import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit2, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const OFFER_ICONS = ["Gift", "Zap", "Users", "Briefcase", "Calendar"] as const;

export default function OffersTab() {
  const offersQuery = trpc.offers.listAll.useQuery();
  const createMutation = trpc.offers.create.useMutation({
    onSuccess: () => { offersQuery.refetch(); resetForm(); toast.success("Offer created!"); },
    onError: (err) => { toast.error(err.message || "Failed to save offer"); },
  });
  const updateMutation = trpc.offers.update.useMutation({
    onSuccess: () => { offersQuery.refetch(); resetForm(); toast.success("Offer updated!"); },
    onError: (err) => { toast.error(err.message || "Failed to save offer"); },
  });
  const deleteMutation = trpc.offers.delete.useMutation({
    onSuccess: () => { offersQuery.refetch(); toast.success("Offer deleted!"); },
    onError: (err) => { toast.error(err.message || "Failed to delete offer"); },
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [icon, setIcon] = useState("Gift");
  const [isMainOffer, setIsMainOffer] = useState(0);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [termInput, setTermInput] = useState("");
  const [termsConditions, setTermsConditions] = useState<string[]>([]);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setDiscountPercent(0);
    setIcon("Gift");
    setIsMainOffer(0);
    setDisplayOrder(0);
    setTermInput("");
    setTermsConditions([]);
  };

  const handleAddTerm = () => {
    if (termInput.trim()) {
      setTermsConditions([...termsConditions, termInput.trim()]);
      setTermInput("");
    }
  };

  const handleRemoveTerm = (idx: number) => {
    setTermsConditions(termsConditions.filter((_, i) => i !== idx));
  };

  const handleEdit = (offer: NonNullable<typeof offersQuery.data>[number]) => {
    setEditingId(offer.id);
    setTitle(offer.title);
    setDescription(offer.description);
    setDiscountPercent(offer.discountPercent || 0);
    setIcon(offer.icon || "Gift");
    setIsMainOffer(offer.isMainOffer);
    setDisplayOrder(offer.displayOrder);
    try { setTermsConditions(JSON.parse(offer.termsConditions ?? "[]")); } catch { setTermsConditions([]); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error("Please fill in title and description");
      return;
    }
    const payload = { title, description, discountPercent, icon, termsConditions: JSON.stringify(termsConditions), isMainOffer, displayOrder };
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  if (offersQuery.isLoading) return <p className="text-gray-400">Loading offers...</p>;
  if (offersQuery.error) {
    return (
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-yellow-400">Offers & Benefits</h2>
        <div className="p-6 bg-red-900/20 border border-red-500 rounded-lg text-center">
          <p className="text-red-400 mb-3">Failed to load offers.</p>
          <Button onClick={() => offersQuery.refetch()} className="bg-red-600 hover:bg-red-700 text-white">Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-yellow-400">Offers & Benefits Management</h2>
        {editingId && <Button onClick={resetForm} className="bg-gray-700 hover:bg-gray-600 text-white font-bold">Cancel Edit</Button>}
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-900 border-2 border-yellow-400 rounded-lg p-6 space-y-4">
        <h3 className="text-xl font-bold text-yellow-400">{editingId ? "✏️ Edit Promotional Offer" : "➕ Create New Promotional Offer"}</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="offer-title" className="block text-gray-400 font-bold mb-1">Offer Title *</label>
            <input id="offer-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. 20% Discount on Online Bookings" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400" />
          </div>
          <div>
            <label htmlFor="offer-discount" className="block text-gray-400 font-bold mb-1">Discount %</label>
            <input id="offer-discount" type="number" value={discountPercent} onChange={(e) => setDiscountPercent(Number(e.target.value) || 0)} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400" />
          </div>
          <div>
            <label htmlFor="offer-icon" className="block text-gray-400 font-bold mb-1">Icon Type</label>
            <select id="offer-icon" value={icon} onChange={(e) => setIcon(e.target.value)} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400">
              <option value="Gift">🎁 Gift (Default)</option>
              <option value="Zap">⚡ Zap (Early Bird)</option>
              <option value="Users">👥 Users (Group Discounts)</option>
              <option value="Briefcase">💼 Briefcase (Corporate)</option>
              <option value="Calendar">📅 Calendar (Seasonal)</option>
            </select>
          </div>
          <div className="md:col-span-4">
            <label htmlFor="offer-description" className="block text-gray-400 font-bold mb-1">Description *</label>
            <textarea id="offer-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter description of this discount offer..." className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400 h-20" />
          </div>
          <div className="md:col-span-3">
            <label htmlFor="offer-terms" className="block text-gray-400 font-bold mb-1">Terms & Conditions</label>
            <div className="flex gap-2">
              <input id="offer-terms" type="text" value={termInput} onChange={(e) => setTermInput(e.target.value)} placeholder="Add a term/condition..." className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400" />
              <Button type="button" onClick={handleAddTerm} className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold">Add</Button>
            </div>
            <div className="mt-3 space-y-1">
              {termsConditions.map((term, idx) => (
                <div key={idx} className="bg-gray-800 text-gray-300 px-3 py-1 rounded flex justify-between items-center text-sm">
                  <span>• {term}</span>
                  <button type="button" onClick={() => handleRemoveTerm(idx)} aria-label="Remove term" className="text-red-500 hover:text-red-400"><X size={14} /></button>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="offer-main" className="block text-gray-400 font-bold mb-1">Main Banner Offer?</label>
              <select id="offer-main" value={isMainOffer} onChange={(e) => setIsMainOffer(Number(e.target.value) || 0)} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400">
                <option value={0}>No (Regular Offer)</option>
                <option value={1}>Yes (Main Page Hero Banner Offer)</option>
              </select>
            </div>
            <div>
              <label htmlFor="offer-order" className="block text-gray-400 font-bold mb-1">Display Order</label>
              <input id="offer-order" type="number" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value) || 0)} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400" />
            </div>
          </div>
        </div>
        <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3">
          {editingId ? "Save Changes" : "Create Promotional Offer"}
        </Button>
      </form>

      <div>
        <h3 className="text-2xl font-bold text-yellow-400 mb-4">Current Offers</h3>
        {!offersQuery.data || offersQuery.data.length === 0 ? (
          <p className="text-gray-400">No offers created yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offersQuery.data.map((offer) => {
              let parsedTerms: string[] = [];
              try { parsedTerms = JSON.parse(offer.termsConditions ?? "[]"); } catch {}
              return (
                <div key={offer.id} className="bg-gray-900 border-2 border-yellow-400 rounded-lg p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
                        <span className="text-gray-400 text-sm">[{offer.icon}]</span> {offer.title}
                      </h4>
                      {offer.isMainOffer === 1 && <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded font-bold">Main Offer</span>}
                    </div>
                    {(offer.discountPercent ?? 0) > 0 && <p className="text-yellow-300 text-lg font-bold mb-2">Discount: {offer.discountPercent}%</p>}
                    <p className="text-gray-300 text-sm mb-4">{offer.description}</p>
                    {parsedTerms.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 font-bold mb-1">Terms:</p>
                        {parsedTerms.map((t, i) => <p key={i} className="text-xs text-gray-400">• {t}</p>)}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 border-t border-gray-800 pt-4 mt-auto">
                    <Button onClick={() => handleEdit(offer)} className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-bold"><Edit2 size={16} className="mr-1" /> Edit</Button>
                    <Button onClick={() => deleteMutation.mutate({ id: offer.id })} disabled={deleteMutation.isPending} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold"><Trash2 size={16} className="mr-1" /> Delete</Button>
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
