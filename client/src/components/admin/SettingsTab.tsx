import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function SettingsTab() {
  const settingsQuery = trpc.settings.list.useQuery();
  const updateSettingsMutation = trpc.settings.bulkUpdate.useMutation({
    onSuccess: () => {
      settingsQuery.refetch();
      toast.success("Settings updated successfully!");
    },
    onError: (err) => {
      toast.error(`Failed to update settings: ${err.message}`);
    }
  });

  const [formValues, setFormValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (settingsQuery.data) {
      const initialValues: Record<string, string> = {};
      settingsQuery.data.forEach((s: any) => {
        initialValues[s.key] = s.value;
      });
      setFormValues(initialValues);
    }
  }, [settingsQuery.data]);

  const handleInputChange = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const updates = Object.entries(formValues).map(([key, value]) => ({
      key,
      value,
    }));
    await updateSettingsMutation.mutateAsync(updates);
  };

  if (settingsQuery.isLoading) {
    return <p className="text-gray-400">Loading settings...</p>;
  }

  if (settingsQuery.error) {
    return (
      <div className="p-6 bg-red-900/20 border border-red-500 rounded-lg text-center">
        <p className="text-red-400 mb-3">Failed to load settings.</p>
        <Button onClick={() => settingsQuery.refetch()} className="bg-red-600 hover:bg-red-700 text-white">
          Retry
        </Button>
      </div>
    );
  }

  const allSettings = settingsQuery.data || [];
  if (allSettings.length === 0) {
    return (
      <div className="p-10 text-center text-gray-400 border-2 border-dashed border-gray-700 rounded-lg">
        <p className="text-lg mb-2">No settings configured yet.</p>
        <p className="text-sm">Settings will be seeded when the database initializes.</p>
      </div>
    );
  }

  // Group settings by category
  const categories = {
    contact: {
      title: "📞 Contact Information & Location",
      keys: ["phone_primary", "phone_secondary", "email_primary", "email_secondary", "address_line1", "address_line2", "address_city", "business_hours", "google_maps_link", "google_maps_embed"]
    },
    branding: {
      title: "🎨 Branding & Navigation Banner",
      keys: ["company_name", "established_year", "logo_url", "nav_banner_text", "tagline", "company_description"]
    },
    about: {
      title: "📖 Mission & Vision (About Page)",
      keys: ["mission_text", "vision_text"]
    },
    stats: {
      title: "📊 Stat Counters & Highlight Counts",
      keys: ["stat_buses", "stat_customers", "stat_years", "stat_support"]
    },
    offers: {
      title: "🎁 Discount configuration",
      keys: ["discount_percent", "discount_description"]
    },
    social: {
      title: "🌐 Social Media Links",
      keys: ["facebook_url", "instagram_url", "whatsapp_number"]
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-yellow-400">Site Settings</h2>
        <Button
          type="submit"
          disabled={updateSettingsMutation.isPending}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold flex items-center gap-2 px-6 py-3"
        >
          {updateSettingsMutation.isPending ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Saving...
            </>
          ) : (
            <>
              <Save size={20} />
              Save Settings
            </>
          )}
        </Button>
      </div>

      {Object.entries(categories).map(([catId, catInfo]) => {
        const matchingSettings = allSettings.filter((s: any) => catInfo.keys.includes(s.key));
        if (matchingSettings.length === 0) return null;

        return (
          <div key={catId} className="bg-gray-900 border-2 border-yellow-400 rounded-lg p-6 space-y-4">
            <h3 className="text-xl font-bold text-yellow-400 border-b border-gray-700 pb-2">
              {catInfo.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchingSettings.map((setting: any) => {
                const isTextArea = setting.key.includes("description") || setting.key.includes("text") || setting.key.includes("embed");
                return (
                  <div key={setting.key} className={isTextArea ? "md:col-span-2" : ""}>
                    <label className="block text-gray-400 text-sm font-semibold mb-1">
                      {setting.label} <span className="text-gray-600 text-xs">({setting.key})</span>
                    </label>
                    {isTextArea ? (
                      <textarea
                        value={formValues[setting.key] ?? ""}
                        onChange={(e) => handleInputChange(setting.key, e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400 h-24"
                      />
                    ) : (
                      <input
                        type="text"
                        value={formValues[setting.key] ?? ""}
                        onChange={(e) => handleInputChange(setting.key, e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="flex justify-end mt-6">
        <Button
          type="submit"
          disabled={updateSettingsMutation.isPending}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold flex items-center gap-2 px-6 py-3"
        >
          {updateSettingsMutation.isPending ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Saving...
            </>
          ) : (
            <>
              <Save size={20} />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
