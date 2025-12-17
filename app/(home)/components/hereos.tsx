import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
// import Link from "next/link";

export function Hereos() {
  return (
    <>
      <div className="max-w-3xl space-y-4">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
          Write, plan, share. With AI at your side.
        </h1>
        <h3 className="text-base sm:text-xl md:text-2xl font-medium">
          Notion is the connected workspace where better, faster work happens.
        </h3>
        <Button>
          Gent Notion Free <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
        {/* {isLoading && (
					<div className='w-full flex justify-center items-center'>
						<Loader />
					</div>
				)} */}
        {/* {isAuthenticated && !isLoading && (
					<Button asChild>
						<Link href={'/documents'}>
							Enter notion <ArrowRight className='h-4 w-4 ml-2' />
						</Link>
					</Button>
				)} */}
        {/* {!isAuthenticated && !isLoading && (
					<>
						<SignInButton mode='modal'>
							<Button>
								Get Notion Free <ArrowRight className='h-4 w-4 ml-2' />
							</Button>
						</SignInButton>
					</>
				)} */}
      </div>
      <div className="flex flex-col items-center justify-center max-w-5xl">
        <div className="flex items-center">
          <div className="relative h-100 w-100 hidden md:block">
            <Image
              src={"/men.svg"}
              alt="Logo"
              fill
              className="object-cover dark:hidden"
            />
            <Image
              src={"/men-dark.svg"}
              alt="Logo"
              fill
              className="object-cover hidden dark:block"
            />
          </div>
        </div>
      </div>
    </>
  );
}
