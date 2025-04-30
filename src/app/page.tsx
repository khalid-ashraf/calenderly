import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default async function HomePage() {
  const { userId } = await auth();

  if (userId !== null) redirect("/events");

  return (
    <div className='text-center container mx-auto min-h-screen flex flex-col justify-center items-center'>
      <h1 className='text-3xl mb-4 font-bold'>Welcome to Calenderly</h1>
      <div className='flex gap-2 justify-center'>
        <Button asChild>
          <SignInButton />
        </Button>
        <Button asChild>
          <SignUpButton />
        </Button>
        <UserButton />
      </div>
    </div>
  );
}

