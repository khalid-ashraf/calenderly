import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EventForm from "@/components/forms/EventForm";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ eventId: string }>;
}

export default async function EditEventPage({ params }: PageProps) {
  const { eventId } = await params;
  const { userId, redirectToSignIn } = await auth();

  if (userId === null) return redirectToSignIn();

  const event = await db.query.EventTable.findFirst({
    where: ({ id, clerkUserId }, { and, eq }) => and(eq(clerkUserId, userId), eq(id, eventId)),
  });

  if (event == null) return notFound();

  return (
    <Card className='max-w-md mx-auto'>
      <CardHeader>
        <CardTitle>Edit Event</CardTitle>
      </CardHeader>

      <CardContent>
        <EventForm event={{ ...event, description: event.description || undefined }} />
      </CardContent>
    </Card>
  );
}
