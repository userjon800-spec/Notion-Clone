import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { MenuIcon, Star } from "lucide-react";
import { useParams } from "next/navigation";
import Title from "./title";
import Publish from "./publish";
import Menu from "./menu";
import { Banner } from "./banner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface NavbarProps {
  isCollapsed: boolean;
  reset: () => void;
}

const Navbar = ({ isCollapsed, reset }: NavbarProps) => {
  const params = useParams();
  const document = useQuery(api.document.getDocumentById, {
    id: params.documentId as Id<"documents">,
  });
  const toggleFavorite = useMutation(api.document.toggleFavorite);

  const onToggleFavorite = () => {
    if (!document) return;
    const promise = toggleFavorite({ id: document._id });
    toast.promise(promise, {
      loading: "Updating favorites...",
      success: (isFav) => (isFav ? "Added to favorites!" : "Removed from favorites!"),
      error: "Failed to update favorites",
    });
  };

  if (document === undefined) {
    return (
      <nav className="bg-background px-3 py-2 w-full flex items-center justify-between">
        <Title.Skeleton />
        <div className="flex items-center gap-x-2">
          <Menu.Skeleton />
        </div>
      </nav>
    );
  }

  if (document === null) return null;

  return (
    <>
      <nav className="bg-background px-3 py-2 w-full flex items-center gap-x-4">
        {isCollapsed && (
          <MenuIcon
            className="h-6 w-6 text-muted-foreground"
            role="button"
            onClick={reset}
          />
        )}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-x-1">
            <Title document={document} />
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0"
              onClick={onToggleFavorite}
              title={document.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            >
              <Star
                className={cn(
                  "h-4 w-4 transition",
                  document.isFavorite
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground hover:text-amber-400",
                )}
              />
            </Button>
          </div>
          <div className="flex items-center gap-x-2">
            <Publish document={document} />
            <Menu document={document} documentId={document._id} />
          </div>
        </div>
      </nav>
      {document.isArchived && <Banner documentId={document._id} />}
    </>
  );
};

export default Navbar;
