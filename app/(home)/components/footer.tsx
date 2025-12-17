import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import Link from "next/link";

export function Footer() {
  return (
    <div className="flex items-center w-full p-6 bg-background z-50">
      <Logo />
      <div className="md:ml-auto w-full justify-evenly md:justify-end flex items-center gap-x-2 text-muted-foreground">
        <Button variant="ghost" size="sm">
          Privacy Policy
        </Button>
        <Button variant="ghost" size="sm">
          Terms & Conditions
        </Button>
        <Button variant="ghost" size="sm">
          Created by{" "}
          <Link target="_blank" href={"https://t.me/Xamdamb0yev"}>
            Javohir
          </Link>
        </Button>
      </div>
    </div>
  );
}
