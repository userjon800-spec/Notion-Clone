import Image from "next/image";

export function Logo() {
  return (
    <div className="flex items-center gap-x-2 select-none">
      <Image
        src={"/logo.svg"}
        alt="Logo"
        width={50}
        height={50}
        className="object-cover dark:hidden"
      />
      <Image
        src={"/logo-dark.svg"}
        alt="Logo"
        width={50}
        height={50}
        className="object-cover hidden dark:block"
      />
      <p className="font-semibold text-xl">Notion</p>
    </div>
  );
}
