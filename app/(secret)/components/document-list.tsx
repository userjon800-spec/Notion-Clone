"use client";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useParams, usePathname, useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import Item from "./item";
interface DocumentList {
  parentDocumentId?: Id<"documents">;
  level?: number;
}
const DocumentList = ({ level = 0, parentDocumentId }: DocumentList) => {
  const documents = useQuery(api.document.getDocuments, {
    parentDocument: parentDocumentId,
  });
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const router = useRouter();
  const params = useParams();
  const onExpand = (documentId: string) => {
    setExpanded((prew) => ({
      ...prew,
      [documentId]: !prew[documentId],
    }));
  };
  return (
    <>
      {documents?.map((document) => (
        <div key={document._id}>
          <Item
            label={document.title}
            id={document._id}
            level={level}
            expanded={expanded[document._id]}
            onExpand={() => onExpand(document._id)}
          />
          {expanded[document._id] && (
            <DocumentList parentDocumentId={document._id} level={level + 1} />
          )}
        </div>
      ))}
    </>
  );
};

export default DocumentList;
