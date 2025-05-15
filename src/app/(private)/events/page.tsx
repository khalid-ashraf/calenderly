import { db } from "@/drizzle/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarPlus, CalendarRange } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatEventDescription } from "@/lib/formatters";
import { memo } from "react";
import CopyEventsButton from "@/components/CopyEventsButton";
import { cn } from "@/lib/utils";

export const revalidate = 0;

export default async function EventsPage() {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) return redirectToSignIn();

  const events = await db.query.EventTable.findMany({
    where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
    orderBy: ({ createdAt }, { desc }) => desc(createdAt),
  });

  return (
    <>
      <div className='flex gap-4 items-baseline'>
        <h1 className='text-3xl lg:text-4xl xl:text-5xl font-semibold mb-6'>Events</h1>
        <Button asChild>
          <Link href='/events/new'>
            <CalendarPlus className='mr-4 size-6' />
            New Event
          </Link>
        </Button>
      </div>

      {events.length > 0 ? <UserEvents events={events} /> : <NoEventDisplay />}
    </>
  );
}

type Event = {
  id: string;
  isActive: boolean;
  name: string;
  description: string | null;
  durationMinutes: number;
  clerkUserId: string;
};

// Child Component to display user events
const UserEvents = memo(({ events }: { events: Event[] }) => {
  return (
    <div className='grid gap-4 grid-cols[repeat(auto-fill, minmax(400px, 1fr))]'>
      {events.map((event) => (
        <EventCard key={event.id} {...event} />
      ))}
    </div>
  );
});

UserEvents.displayName = "UserEvents";

// Child component to display if the user has no events
const NoEventDisplay = memo(() => {
  return (
    <div className='flex flex-col justify-center items-center gap-7'>
      <CalendarRange className='size-16 mx-auto' />
      <p>You do not have any events. Create your first event to get started!</p>

      <Button size='lg' className='text-lg rounded' asChild>
        <Link href='/events/new'>
          <CalendarPlus className='mr-4 size-6' />
          New Event
        </Link>
      </Button>
    </div>
  );
});

NoEventDisplay.displayName = "NoEventDisplay";

const EventCard = memo(
  ({ id, isActive, name, description, durationMinutes, clerkUserId }: Event) => {
    return (
      <Card className={cn("flex flex-col", !isActive && "border-secondary/50")}>
        <CardHeader className={cn(!isActive && "opacity-50")}>
          <CardTitle>{name}</CardTitle>
          <CardDescription>{formatEventDescription(durationMinutes)}</CardDescription>
        </CardHeader>

        {description !== null && <CardContent>{description}</CardContent>}

        <CardFooter className='flex justify-end gap-2 mt-auto'>
          {isActive && (
            <CopyEventsButton variant='outline' eventId={id} clerkUserId={clerkUserId} />
          )}

          <Button asChild>
            <Link href={`/events/${id}/edit`}>Edit</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }
);

EventCard.displayName = "EventCard";
