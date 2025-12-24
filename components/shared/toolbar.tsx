import { Doc } from "@/convex/_generated/dataModel";
import { ElementRef, useRef, useState } from "react";
import { Button } from "../ui/button";
import { ImageIcon, Smile, X } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import IconPicker from "./icon-picker";
import TextareaAutosize from "react-textarea-autosize";
import { useCoverImage } from "@/hooks/use-cover-image";
interface ToolbarProps {
  document: Doc<"documents">;
  preview?: boolean;
}
const Toolbar = ({ document, preview }: ToolbarProps) => {
  const [value, setValue] = useState(document.title);
   const coverImage = useCoverImage();
  const textareaRef = useRef<ElementRef<"textarea">>(null);
  const updateFields = useMutation(api.document.updateFields);
  const [isEditing, setIsEditing] = useState(false);
  const onIconChange = (icon: string) => {
    updateFields({
      id: document._id,
      icon,
    });
  };
  const onRemoveIcon = () => {
    updateFields({
      id: document._id,
      icon: "",
    });
  };
  const disableInput = () => setIsEditing(false);
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      disableInput();
    }
  };
  const onInput = (value: string) => {
    setValue(value);
    updateFields({
      id: document._id,
      icon: value || "Nomsiz",
    });
  };
  const enableInput = () => {
    if (preview) return;
    setIsEditing(true);
    setTimeout(() => {
      setValue(document.title);
      textareaRef.current?.focus();
    }, 0);
  };
  return (
    <div className="pl-13.5 group relative">
      {!!document.icon && !preview && (
        <div className="flex items-center gap-x-2 group/icon pt-6">
          <IconPicker onChange={onIconChange}>
            <p className="text-6xl hover:opacity-75 transition">
              {document.icon}
            </p>
          </IconPicker>
          <Button
            className="rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs"
            variant={"outline"}
            size={"icon"}
            onClick={onRemoveIcon}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      {!!document.icon && preview && (
        <p className="text-6xl pt-6">{document.icon}</p>
      )}
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
        {!document.icon && !preview && (
          <>
            <IconPicker asChild onChange={onIconChange}>
              <Button
                size={"sm"}
                variant={"outline"}
                className="text-muted-foreground text-xs"
              >
                <Smile className="h-4 w-4 mr-2" />
                <span>Add icon</span>
              </Button>
            </IconPicker>
          </>
        )}
        {!document.coverImage && !preview && (
          <Button
            size={"sm"}
            variant={"outline"}
            className="text-muted-foreground text-xs"
            onClick={coverImage.onOpen}
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            <span>Add cover</span>
          </Button>
        )}
      </div>
      {!isEditing && !preview ? (
        <TextareaAutosize
          ref={textareaRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={value}
          onChange={(event) => onInput(event.target.value)}
          className="text-5xl bg-transparent font-bold wrap-break-word outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none"
        />
      ) : (
        <div
          onClick={enableInput}
          className="pb-[11.5px] text-5xl font-bold wrap-break-word outline-none text-[#3F3F3F] dark:text-[#CFCFCF]"
        >
          {document.title}
        </div>
      )}
    </div>
  );
};
export default Toolbar;
