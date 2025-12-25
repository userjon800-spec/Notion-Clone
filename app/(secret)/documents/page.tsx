"use client";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { api } from "@/convex/_generated/api";
import { useSubscription } from "@/hooks/use-subscription";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
const DocumentPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const { plan, isLoading } = useSubscription(
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    user?.emailAddresses[0]?.emailAddress!
  );
  const documents = useQuery(api.document.getAllDocuments);
  const createDocument = useMutation(api.document.createDocument);
  const onCreateDocument = () => {
    if (documents?.length && documents.length >= 3 && plan === "Free") {
      toast.error("You can only create 3 documents in the free plan");
      return;
    }
    const promise = createDocument({
      title: "Nomsiz",
    }).then((docId) => {
      router.push(`/documents/${docId}`);
    });
    toast.promise(promise, {
      loading: "Creating a new blank...",
      success: "Create a new blank !",
      error: "Failed to create a new blank",
    });
  };
  return (
    <div className="h-screen w-full flex justify-center items-center space-y-4 flex-col">
      <Image
        src={"/note.svg"}
        alt="Logo"
        width={300}
        height={300}
        className="object-cover dark:hidden"
      />
      <Image
        src={"/note-dark.svg"}
        alt="Logo"
        width={300}
        height={300}
        className="object-cover hidden dark:block"
      />
      <h2 className="text-lg font-bold">
        Welcome to {user?.firstName}`s document page!
      </h2>
      <Button onClick={onCreateDocument} disabled={isLoading}>
        {isLoading && (
          <>
            <Loader />
            <span className="ml-2">Loading...</span>
          </>
        )}
        {!isLoading && (
          <>
            <Plus className="h-4 w-4 mr-2" />
            Create a blank
          </>
        )}
      </Button>
    </div>
  );
};

export default DocumentPage;
