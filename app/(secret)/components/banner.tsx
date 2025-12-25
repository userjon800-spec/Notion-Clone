import ConfirmModal from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useSubscription } from "@/hooks/use-subscription";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
interface BannerProps {
  documentId: Id<"documents">;
}
const Banner = ({ documentId }: BannerProps) => {
  const router = useRouter();
  const { user } = useUser();
  const { plan } = useSubscription(
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    user?.emailAddresses[0]?.emailAddress!
  );
  const documents = useQuery(api.document.getAllDocuments);
  const remove = useMutation(api.document.remove);
  const restore = useMutation(api.document.restore);
  const onRemove = () => {
    const promise = remove({ id: documentId });
    toast.promise(promise, {
      loading: "Removing document...",
      success: "Removed document!",
      error: "Failed to remove document",
    });
    router.push("/documents");
  };
  const onRestore = () => {
    if (documents?.length && documents.length >= 3 && plan === "Free") {
      toast.error("You can only create 3 documents in the free plan");
      return;
    }
    const promise = restore({ id: documentId });
    toast.promise(promise, {
      loading: "Restoring document...",
      success: "Restored document!",
      error: "Failed to restore document",
    });
  };
  return (
    <div className="w-full bg-red-500 text-center text-sm p-2 text-white flex items-center gap-x-2 justify-center">
      <p>This page is in the Trash.</p>
      <Button
        className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
        size={"sm"}
        variant={"outline"}
        onClick={onRestore}
      >
        Restore document
      </Button>
      <ConfirmModal onConfirm={() => onRemove()}>
        <Button
          className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
          size={"sm"}
          variant={"outline"}
        >
          Delete forever
        </Button>
      </ConfirmModal>
    </div>
  );
};
export { Banner };