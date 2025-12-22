"use client";
import { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";

const DocumentIdPage = () => {
  const params = useParams();
  const documentId = params.documentId as Id<"documents">;  
  return <div className="mt-12">{documentId}</div>;
};

export default DocumentIdPage;
