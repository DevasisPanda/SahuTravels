import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface ImageUploadInputProps {
  value: string;
  onChange: (url: string) => void;
  id?: string;
  placeholder?: string;
  label?: string;
}

export function ImageUploadInput({ value, onChange, id, placeholder, label }: ImageUploadInputProps) {
  const [isUploading, setIsUploading] = useState(false);
  const uploadMutation = trpc.media.uploadImage.useMutation();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    // Validate type
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const base64Data = reader.result as string;
        const response = await uploadMutation.mutateAsync({
          filename: file.name,
          mimeType: file.type,
          base64: base64Data,
        });

        if (response.success && response.url) {
          onChange(response.url);
          toast.success("Image uploaded successfully!");
        } else {
          toast.error("Upload failed");
        }
      } catch (err: any) {
        toast.error(`Upload error: ${err.message || "Unknown error"}`);
      } finally {
        setIsUploading(false);
      }
    };

    reader.onerror = () => {
      toast.error("Failed to read file");
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-gray-400 text-sm font-semibold">
          {label}
        </label>
      )}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Preview image */}
        <div className="w-24 h-24 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center overflow-hidden shrink-0">
          {value ? (
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="text-gray-500" size={32} />
          )}
        </div>

        <div className="flex-1 w-full space-y-2">
          {/* Text Input showing URL */}
          <input
            id={id}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "https://example.com/image.jpg"}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400 text-sm"
          />

          {/* Device Upload Button */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              disabled={isUploading}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-xs flex items-center gap-2 px-3 py-1.5 h-auto rounded"
              onClick={() => document.getElementById(`file-input-${id || 'default'}`)?.click()}
            >
              {isUploading ? (
                <>
                  <Loader2 className="animate-spin" size={14} />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={14} />
                  Upload from Device
                </>
              )}
            </Button>
            <input
              id={`file-input-${id || 'default'}`}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            {value && (
              <Button
                type="button"
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-500/10 text-xs px-3 py-1.5 h-auto rounded"
                onClick={() => onChange("")}
              >
                Clear Image
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
