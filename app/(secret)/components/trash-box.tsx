"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/loader";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useRouter, useParams } from "next/navigation";
import { Inbox, Search, Trash, Undo } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ConfirmModal from "@/components/modals/confirm-modal";
import { Id } from "@/convex/_generated/dataModel";
import { useSubscription } from "@/hooks/use-subscription";
import { useUser } from "@clerk/nextjs";
import { useEdgeStore } from "@/lib/edge-store";
import {
  deleteEdgeStoreFiles,
  extractEdgeStoreUrls,
} from "@/lib/storage-cleanup";

const TrashBox = () => {
  const router = useRouter();
  const params = useParams();
  const { edgestore } = useEdgeStore();
  const documents = useQuery(api.document.getTrashDocuments);
  const { user } = useUser();
  const { plan } = useSubscription(user?.emailAddresses[0]?.emailAddress);
  const AllDocuments = useQuery(api.document.getAllDocuments);
  const remove = useMutation(api.document.remove);
  const restore = useMutation(api.document.restore);
  const emptyTrash = useMutation(api.document.emptyTrash);
  const [search, setSearch] = useState("");

  if (documents === undefined) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Loader size={"lg"} />
      </div>
    );
  }

  const filteredDocuments = documents.filter((docs) => {
    return docs.title.toLowerCase().includes(search.toLowerCase());
  });

  const onRemove = (documentId: Id<"documents">) => {
    const target = documents.find((d) => d._id === documentId);
    if (target) {
      const urls = extractEdgeStoreUrls(target.content, target.coverImage);
      deleteEdgeStoreFiles(edgestore, urls);
    }

    const promise = remove({ id: documentId });
    toast.promise(promise, {
      loading: "Removing document...",
      success: "Removed document!",
      error: "Failed to remove document",
    });
    if (params.documentId === documentId) {
      router.push("/documents");
    }
  };

  const onRestore = (documentId: Id<"documents">) => {
    if (AllDocuments?.length && AllDocuments.length >= 7 && plan === "Free") {
      toast.error(
        "You already have 7 notes. Please delete one to restore this note.",
      );
      return;
    }
    const promise = restore({ id: documentId });
    toast.promise(promise, {
      loading: "Restoring document...",
      success: "Restored document!",
      error: "Failed to restore document",
    });
  };

  const onEmptyTrash = () => {
    if (documents.length > 0) {
      const allUrls = documents.flatMap((d) =>
        extractEdgeStoreUrls(d.content, d.coverImage),
      );
      deleteEdgeStoreFiles(edgestore, allUrls);
    }

    const promise = emptyTrash({});
    toast.promise(promise, {
      loading: "Emptying trash...",
      success: "All trash documents deleted permanently!",
      error: "Failed to empty trash",
    });
    router.push("/documents");
  };

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input
          className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
          placeholder="Filter by page title..."
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {documents.length > 0 && (
        <div className="flex items-center justify-between px-2 py-1.5 border-b mb-1">
          <span className="text-xs text-muted-foreground font-medium">
            {documents.length} item{documents.length > 1 ? "s" : ""}
          </span>
          <ConfirmModal onConfirm={onEmptyTrash}>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash className="h-3 w-3 mr-1" />
              Empty Trash
            </Button>
          </ConfirmModal>
        </div>
      )}

      {/* Empty State when no trash */}
      {documents.length === 0 && (
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-2 text-muted-foreground">
            <Inbox className="h-5 w-5" />
          </div>
          <p className="text-xs font-medium text-foreground">Trash is empty</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 max-w-[180px]">
            Pages you delete will show up here until permanently removed.
          </p>
        </div>
      )}

      {/* Empty State when filter yields 0 matches */}
      {documents.length > 0 && filteredDocuments.length === 0 && (
        <div className="py-6 text-center text-xs text-muted-foreground">
          No matching pages found in trash
        </div>
      )}

      <div className="max-h-72 overflow-y-auto">
        {filteredDocuments.map((document) => (
          <div
            key={document._id}
            className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between py-1"
            role="button"
            onClick={() => router.push(`/documents/${document._id}`)}
          >
            <span className="truncate pl-2">{document.title}</span>
            <div className="flex items-center">
              <div
                className="rounded-sm p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                role="button"
                title="Restore note"
                onClick={(e) => {
                  e.stopPropagation();
                  onRestore(document._id);
                }}
              >
                <Undo className="h-4 w-4 text-muted-foreground" />
              </div>
              <ConfirmModal onConfirm={() => onRemove(document._id)}>
                <div
                  role="button"
                  title="Delete forever"
                  className="rounded-sm p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Trash className="h-4 w-4 text-muted-foreground" />
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrashBox;
