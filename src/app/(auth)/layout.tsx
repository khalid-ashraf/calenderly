import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();

  // Checking if user is logged in or not. If user is logged in, redirect to events page
  if (userId !== null) redirect("/events");

  return (
    <section className='min-h-screen flex flex-col justify-center items-center'>{children}</section>
  );
}
