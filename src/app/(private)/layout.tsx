import { UserButton } from "@clerk/nextjs";
import { CalendarRange } from "lucide-react";
import NavLink from "@/components/NavLink";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className='flex py-2 border-b bg-card' role='banner'>
        <nav
          className='font-medium flex items-center text-sm gap-6 container mx-auto'
          aria-label='Main navigation'
        >
          <div className='flex items-center gap-2 font-semibold mr-auto'>
            <CalendarRange className='size-8' />
            <span className='sr-only md:not-sr-only text-xl' role='heading' aria-level={1}>
              Calendarly
            </span>
          </div>

          <NavLink href='/events' className='text-lg'>
            Events
          </NavLink>
          <NavLink href='/schedule' className='text-lg'>
            Schedule
          </NavLink>

          <div className='ml-auto size-8'>
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: {
                    width: "100%",
                    height: "100%",
                  },
                },
              }}
              aria-label='User menu'
            />
          </div>
        </nav>
      </header>
      <main className='container my-6 mx-auto' role='main' id='main-content' tabIndex={-1}>
        {children}
      </main>
    </>
  );
}
