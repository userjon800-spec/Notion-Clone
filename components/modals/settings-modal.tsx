"use client";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useSettings } from "@/hooks/use-settings";
import { ModeToggle } from "../shared/mode-toggle";
import { Button } from "../ui/button";
import { Settings } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useUser } from "@clerk/clerk-react";
import Loader from "../ui/loader";
import { Label } from "../ui/label";
export default function SettingsModal() {
  const settings = useSettings();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isOpen, onClose, onToggle } = settings;
  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { data } = await axios.post("/api/stripe/manage", {
        email: user?.emailAddresses[0].emailAddress,
      });
      if (!data.status) {
        setIsSubmitting(false);
        toast.error("You are not subscribed to any plan.");
      }
      window.open(data.url, "_self");
      setIsSubmitting(false);
    } catch {
      setIsSubmitting(false);
      toast.error("Something went wrong. Please try again.");
    }
  };
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "y") {
        e.preventDefault();
        onToggle();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [onToggle]);
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="border-b pb-3">
          <h2 className="text-lg font-medium">My settings</h2>
        </DialogHeader>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-1">
            <Label>Appearance</Label>
            <span className="text-[0.8rem] text-muted-foreground">
              Customize how Notion looks on your device
            </span>
          </div>
          <ModeToggle />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-1">
            <Label>Payments</Label>
            <span className="text-[0.8rem] text-muted-foreground">
              Manage your subscription and billing information
            </span>
          </div>
          <Button size={"sm"} onClick={onSubmit}>
            {isSubmitting ? <Loader /> : <Settings size={16} />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
