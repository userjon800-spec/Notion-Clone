"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useSubscription } from "@/hooks/use-subscription";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import {
  ChevronDown,
  ChevronRight,
  Copy,
  LucideIcon,
  MoreHorizontal,
  Plus,
  Star,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ItemProps {
  id?: Id<"documents">;
  label: string;
  level?: number;
  expanded?: boolean;
  active?: boolean;
  icon?: LucideIcon;
  documentIcon?: string;
  isSearch?: boolean;
  isSettings?: boolean;
  isFavorite?: boolean;
  onExpand?: () => void;
  onClick?: () => void;
}

const Item = ({
  label,
  expanded,
  id,
  level,
  onExpand,
  active,
  documentIcon,
  isSearch,
  isSettings,
  isFavorite,
  onClick,
  icon: Icon,
}: ItemProps) => {
  const { user } = useUser();
  const createDocument = useMutation(api.document.createDocument);
  const archive = useMutation(api.document.archive);
  const duplicate = useMutation(api.document.duplicate);
  const toggleFavorite = useMutation(api.document.toggleFavorite);
  const { plan } = useSubscription(
    user?.emailAddresses[0]?.emailAddress,
  );
  const documents = useQuery(api.document.getAllDocuments);
  const router = useRouter();

  const onCreateDocument = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    if (!id) return;
    createDocument({
      title: "Nomsiz",
      parentDocument: id,
    }).then(() => {
      if (!expanded) {
        onExpand?.();
      }
    });
  };

  const onDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!id) return;
    if (documents?.length && documents.length >= 7 && plan === "Free") {
      toast.error("You can only create 7 documents in the free plan");
      return;
    }
    const promise = duplicate({ id }).then((newDocId) =>
      router.push(`/documents/${newDocId}`),
    );
    toast.promise(promise, {
      loading: "Duplicating document...",
      success: "Document duplicated!",
      error: "Failed to duplicate document",
    });
  };

  const onToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!id) return;
    const promise = toggleFavorite({ id });
    toast.promise(promise, {
      loading: "Updating favorites...",
      success: (fav) => (fav ? "Added to favorites!" : "Removed from favorites!"),
      error: "Failed to update favorites",
    });
  };

  const handleExpand = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    onExpand?.();
  };

  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  const onArchive = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (!id) return;
    const promise = archive({ id }).then(() => router.push("/documents"));
    toast.promise(promise, {
      loading: "Archiving document...",
      success: "Archived document!",
      error: "Failed to archive document",
    });
  };

  return (
    <div
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }}
      className={cn(
        "group min-h-6.75 text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
        active && "bg-primary/5 text-primary",
      )}
      role="button"
      onClick={onClick}
    >
      {!!id && (
        <div
          className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1"
          role="button"
          onClick={handleExpand}
        >
          <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
        </div>
      )}
      {documentIcon ? (
        <div className="shrink-0 mr-2 text-[18px]">{documentIcon}</div>
      ) : (
        Icon && (
          <Icon className="shrink-0 h-4.5 w-4.5 mr-2 text-muted-foreground" />
        )
      )}
      <span className="truncate">{label}</span>
      {isFavorite && (
        <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0 ml-1" />
      )}
      {isSearch && (
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span> + I
        </kbd>
      )}
      {isSettings && (
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span> + Y
        </kbd>
      )}
      {!!id && (
        <div className="ml-auto flex items-center gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
              <div
                role="button"
                className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-60"
              align="start"
              side="right"
              forceMount
            >
              <DropdownMenuItem onClick={onToggleFavorite}>
                <Star
                  className={cn(
                    "h-4 w-4 mr-2",
                    isFavorite ? "fill-amber-400 text-amber-400" : "",
                  )}
                />
                {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDuplicate}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onArchive}>
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="text-xs text-muted-foreground p-2">
                Last edited by {user?.fullName || "User"}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div
            className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
            role="button"
            onClick={onCreateDocument}
          >
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Item;

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }}
      className="flex gap-x-2 py-0.75"
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  );
};
