import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "../ui/button";
import { ImageIcon, X } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
interface CoverProps {
  url?: string;
  preview?: boolean;
}
const Cover = ({ preview, url }: CoverProps) => {
  const onRemove = async () => {};
  return (
    <div
      className={cn(
        "relative w-full h-[35vh] group",
        !url && "h-[10vh]",
        url && "bg-muted"
      )}
    >
      {!url && (
        <Image
          fill
          src={
            // url ??
            "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?cs=srgb&dl=pexels-souvenirpixels-417074.jpg&fm=jpg"
          }
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
            // onClick={() => coverImage.onReplace(url)}
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