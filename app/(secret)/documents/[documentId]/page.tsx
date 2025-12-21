"use client";
import { Id } from "@/convex/_generated/dataModel";

interface DocumentIdPageProps {
  params: {
    documentId: Id<"documents">;
  };
}
const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  console.log(params.documentId);
  
  return <div>
    {params.documentId} Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente reiciendis expedita ab numquam. Voluptatibus laudantium, voluptate totam, impedit sapiente eius in dolore quo similique eum, officia rerum laborum ipsum adipisci.
  </div>;
};

export default DocumentIdPage;
