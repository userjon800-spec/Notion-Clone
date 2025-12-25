import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "../ui/button";
import { ImageIcon, X } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { useCoverImage } from "@/hooks/use-cover-image";
import { useEdgeStore } from "@/lib/edge-store";
interface CoverProps {
  url?: string;
  preview?: boolean;
}
const Cover = ({ preview, url }: CoverProps) => {
  const { edgestore } = useEdgeStore();
  const params = useParams();
  const updateFields = useMutation(api.document.updateFields);
  const coverImage = useCoverImage();
  const onRemove = async () => {
    if (url) {
      await edgestore.publicFiles.delete({ url });
    }
    updateFields({
      id: params.documentId as Id<"documents">,
      coverImage: "",
    });
  };
  return (
    <div className={cn("relative w-full h-[35vh] group", url && "bg-muted")}>
      {!!url && (
        <Image
          fill
          src={url ?? "/image.jpg"}
          alt="cover"
          className="object-cover"
        />
      )}
      {url && !preview && (
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-20 flex items-center gap-x-2">
          <Button
            size={"sm"}
            variant={"outline"}
            className="text-muted-foreground text-xs"
            onClick={() => coverImage.onReplace(url)}
          >
            <ImageIcon />
            <span>Change cover</span>
          </Button>
          <Button
            size={"sm"}
            variant={"outline"}
            className="text-muted-foreground text-xs"
            onClick={onRemove}
          >
            <X />
            <span>remove</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cover;
Cover.Skeleton = function CoverSkeleton() {
  return <Skeleton className="w-full h-[12vh]" />;
};
