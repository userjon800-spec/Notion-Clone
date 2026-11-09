import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useSubscription } from "@/hooks/use-subscription";
import { exportToMarkdown, exportToPDF } from "@/lib/export";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { Copy, FileDown, FileText, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface MenuProps {
  documentId?: Id<"documents">;
  document?: Doc<"documents"> | null;
}

const Menu = ({ documentId, document }: MenuProps) => {
  const router = useRouter();
  const { user } = useUser();
  const id = document?._id || documentId;
  const { plan } = useSubscription(
    user?.emailAddresses[0]?.emailAddress,
  );
  const documents = useQuery(api.document.getAllDocuments);
  const archive = useMutation(api.document.archive);
  const duplicate = useMutation(api.document.duplicate);

  const onArchive = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (!id) return;
    const promise = archive({ id });
    toast.promise(promise, {
      loading: "Archiving document...",
      success: "Archived document!",
      error: "Failed to archive document",
    });
    router.push("/documents");
  };

  const onDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!id) return;
    if (documents?.length && documents.length >= 7 && plan === "Free") {
      toast.error("You can only create 7 documents in the free plan");
      return;
    }
    const promise = duplicate({ id }).then((newDoc) => {
      router.push(`/documents/${newDoc}`);
    });
    toast.promise(promise, {
      loading: "Duplicating document...",
      success: "Document duplicated!",
      error: "Failed to duplicate document",
    });
  };

  const onExportMarkdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (document) {
      exportToMarkdown(document);
      toast.success("Markdown file downloaded!");
    } else {
      toast.error("Document content not ready to export");
    }
  };

  const onExportPDF = (e: React.MouseEvent) => {
    e.stopPropagation();
    exportToPDF(document?.title || "Document");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"sm"} variant={"ghost"}>
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-60"
        align="end"
        alignOffset={8}
        forceMount
      >
        <DropdownMenuItem onClick={onDuplicate}>
          <Copy className="h-4 w-4 mr-2" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onExportPDF}>
          <FileDown className="h-4 w-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onExportMarkdown}>
          <FileText className="h-4 w-4 mr-2" />
          Export as Markdown (.md)
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
  );
};

export default Menu;

Menu.Skeleton = function MenuSkeleton() {
  return <Skeleton className="h-10 w-10" />;
};
