import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

export default async function HomePage() {
  const { userId } = await auth();

  // Checking if user is logged in or not. If user is loggedIn then redirect to events page.
  if (userId !== null) redirect("/events");

  return (
    <main
      className='text-center container mx-auto min-h-screen flex flex-col justify-center items-center'
      role='main'
      aria-labelledby='welcome-heading'
    >
      <h1 id='welcome-heading' className='text-3xl mb-4 font-bold' tabIndex={-1}>
        Welcome to Calenderly
      </h1>

      <div role='group' aria-label='Authentication options' className='flex gap-2 justify-center'>
        <Button asChild>
          <SignInButton aria-label='Sign in to your account' />
        </Button>
        <Button asChild>
          <SignUpButton aria-label='Create a new account' />
        </Button>
      </div>
    </main>
  );
}

