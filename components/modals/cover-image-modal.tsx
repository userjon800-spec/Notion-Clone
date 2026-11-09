import { api } from "@/convex/_generated/api";
import { useCoverImage } from "@/hooks/use-cover-image";
import { useEdgeStore } from "@/lib/edge-store";
import { useMutation } from "convex/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { Id } from "@/convex/_generated/dataModel";
import { SingleImageDropzone } from "../shared/single-image-dropzone";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Check, Image as ImageIcon, Palette, Upload } from "lucide-react";
import Image from "next/image";

const GRADIENTS = [
  { name: "Sunset", value: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)" },
  { name: "Ocean Wave", value: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
  { name: "Sky Blue", value: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)" },
  { name: "Purple Horizon", value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { name: "Mint Fresh", value: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)" },
  { name: "Pink Flamingo", value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  { name: "Sunburst", value: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
  { name: "Emerald Spring", value: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" },
  { name: "Deep Midnight", value: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)" },
  { name: "Notion Charcoal", value: "linear-gradient(135deg, #232526 0%, #414345 100%)" },
  { name: "Cyberpunk", value: "linear-gradient(135deg, #f72585 0%, #7209b7 50%, #3a0ca3 100%)" },
  { name: "Northern Lights", value: "linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)" },
];

const SOLID_COLORS = [
  { name: "Slate", value: "#475569" },
  { name: "Navy", value: "#1e293b" },
  { name: "Forest", value: "#166534" },
  { name: "Indigo", value: "#4338ca" },
  { name: "Rose", value: "#be123c" },
  { name: "Amber", value: "#b45309" },
  { name: "Teal", value: "#0f766e" },
  { name: "Violet", value: "#6d28d9" },
];

const PRESET_WALLPAPERS = [
  {
    name: "Minimalist Mountain",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop&q=80",
  },
  {
    name: "Misty Forest",
    url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&auto=format&fit=crop&q=80",
  },
  {
    name: "Calm Ocean",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=80",
  },
  {
    name: "Cosmic Nebula",
    url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1600&auto=format&fit=crop&q=80",
  },
  {
    name: "Modern Architecture",
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&auto=format&fit=crop&q=80",
  },
  {
    name: "Abstract Fluid",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=80",
  },
];

const CoverImageModal = () => {
  const params = useParams();
  const updateFields = useMutation(api.document.updateFields);
  const coverImage = useCoverImage();
  const { edgestore } = useEdgeStore();
  const [tab, setTab] = useState<"gallery" | "upload">("gallery");
  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onClose = () => {
    setFile(undefined);
    setIsSubmitting(false);
    coverImage.onClose();
  };

  const onSelectPreset = async (coverUrl: string) => {
    if (!params.documentId) return;
    setIsSubmitting(true);
    try {
      await updateFields({
        id: params.documentId as Id<"documents">,
        coverImage: coverUrl,
      });
      toast.success("Cover updated!");
      onClose();
    } catch {
      toast.error("Failed to set cover image");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onChange = async (uploadedFile?: File) => {
    if (uploadedFile) {
      setIsSubmitting(true);
      setFile(uploadedFile);
      try {
        const res = await edgestore.publicFiles.upload({
          file: uploadedFile,
          options: {
            replaceTargetUrl:
              coverImage.url && coverImage.url.includes("edgestore")
                ? coverImage.url
                : undefined,
          },
        });
        await updateFields({
          id: params.documentId as Id<"documents">,
          coverImage: res.url,
        });
        toast.success("Cover uploaded!");
        onClose();
      } catch {
        toast.error("Failed to upload image");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-6">
        <DialogHeader className="border-b pb-3">
          <h2 className="text-center text-lg font-semibold">Cover Image</h2>
        </DialogHeader>

        {/* Tab switch */}
        <div className="flex border-b gap-x-6 pt-1">
          <button
            type="button"
            onClick={() => setTab("gallery")}
            className={cn(
              "pb-2.5 text-sm font-medium flex items-center gap-1.5 border-b-2 transition",
              tab === "gallery"
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            <Palette className="h-4 w-4" />
            <span>Gallery & Gradients</span>
          </button>
          <button
            type="button"
            onClick={() => setTab("upload")}
            className={cn(
              "pb-2.5 text-sm font-medium flex items-center gap-1.5 border-b-2 transition",
              tab === "upload"
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            <Upload className="h-4 w-4" />
            <span>Upload Image</span>
          </button>
        </div>

        {/* Tab content */}
        {tab === "gallery" ? (
          <div className="overflow-y-auto pr-1 space-y-5 pt-3">
            {/* Gradients */}
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-2">
                Gradients
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {GRADIENTS.map((grad) => {
                  const isSelected = coverImage.url === grad.value;
                  return (
                    <button
                      key={grad.name}
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => onSelectPreset(grad.value)}
                      className={cn(
                        "relative h-16 rounded-md transition shadow-xs hover:opacity-90 overflow-hidden border-2",
                        isSelected ? "border-primary ring-2 ring-primary/40" : "border-transparent",
                      )}
                      style={{ background: grad.value }}
                      title={grad.name}
                    >
                      {isSelected && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <Check className="h-5 w-5 text-white drop-shadow-md" />
                        </div>
                      )}
                      <span className="absolute bottom-1 left-1.5 text-[10px] text-white font-medium drop-shadow-sm truncate max-w-[90%]">
                        {grad.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Solid Colors */}
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-2">
                Solid Colors
              </p>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {SOLID_COLORS.map((color) => {
                  const isSelected = coverImage.url === color.value;
                  return (
                    <button
                      key={color.name}
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => onSelectPreset(color.value)}
                      className={cn(
                        "relative h-12 rounded-md transition hover:scale-105 border-2",
                        isSelected ? "border-primary ring-2 ring-primary/40" : "border-transparent",
                      )}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    >
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Wallpapers */}
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-2">
                Curated Wallpapers
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {PRESET_WALLPAPERS.map((wp) => {
                  const isSelected = coverImage.url === wp.url;
                  return (
                    <button
                      key={wp.name}
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => onSelectPreset(wp.url)}
                      className={cn(
                        "relative h-20 rounded-md overflow-hidden transition group border-2",
                        isSelected ? "border-primary ring-2 ring-primary/40" : "border-transparent",
                      )}
                    >
                      <Image
                        fill
                        src={wp.url}
                        alt={wp.name}
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 600px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <Check className="h-5 w-5 text-white drop-shadow-md" />
                        </div>
                      )}
                      <span className="absolute bottom-1.5 left-2 text-[11px] text-white font-medium drop-shadow-md truncate max-w-[90%]">
                        {wp.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="pt-4 pb-2">
            <SingleImageDropzone
              className="w-full outline-none"
              disabled={isSubmitting}
              value={file}
              onChange={onChange}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CoverImageModal;
