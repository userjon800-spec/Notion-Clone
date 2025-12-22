"use client";
import { useUser } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { File } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { useSearch } from "@/hooks/use-search";
const SearchCommand = () => {
  const { user } = useUser();
  const search = useSearch();
  const documents = useQuery(api.document.getSearch);
  const { isOpen, onClose, onToggle } = search;
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const onSelect = (id: string) => {
    router.push(`/documents/${id}`);
    onClose();
  };
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "i") {
        e.preventDefault();
        onToggle();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [onToggle]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput placeholder={`Search ${user?.fullName}'s Notion`} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading={"Documents"}>
          {documents?.map(
            (document) =>
              !document.isArchived && (
                <CommandItem
                  key={document._id}
                  value={`${document._id}-${document.title}`}
                  title={document.title}
                  onSelect={() => onSelect(document._id)}
                >
                  {document.icon ? (
                    <p className="mr-2 text-[18px]">{document.icon}</p>
                  ) : (
                    <File className="mr-2 h-4 w-4" />
                  )}
                  <span>{document.title}</span>
                </CommandItem>
              )
          )}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default SearchCommand;
