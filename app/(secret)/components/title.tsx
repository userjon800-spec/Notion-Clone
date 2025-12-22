import { Doc } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useRef, useState } from "react";
interface TitleProps {
  document: Doc<"documents">;
}
const Title = ({ document }: TitleProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(document.title || "Nomsiz");
  const [isEditing, setIsEditing] = useState(false);
  const updateFields = useMutation(api.document.updateFields);
  const enableInput = () => {
    setTitle(document.title);
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.setSelectionRange(0,inputRef.current.value.length)
    }, 0);
  };
  const disableInput = () => {
    setIsEditing(false);
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    updateFields({
      id: document._id,
      title: e.target.value || 'Untitled',
    });
  };
  const onKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      disableInput();
    }
  };
  return (
    <div className="flex items-center gap-x-1">
      {!!document.icon && <p>{document.icon}</p>}
      {isEditing ? (
        <Input
          ref={inputRef}
          onClick={enableInput}
          onBlur={disableInput}
          onChange={onChange}
          onKeyDown={onKeydown}
          value={title}
          className="h-7 px-2 focus-visible:ring-transparent"
        />
      ) : (
        <Button
          className="font-normal h-auto p-1"
          variant={"ghost"}
          size={"sm"}
          onClick={enableInput}
        >
          <span className="truncate">{document.title}</span>
        </Button>
      )}
    </div>
  );
};
export default Title;

Title.Skeleton = function TitleSkeleton() {
  return <Skeleton className="h-9 w-20 rounded-md" />;
};
