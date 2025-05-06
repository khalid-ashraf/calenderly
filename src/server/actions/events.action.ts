"use server";

import "use-server";

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { FormDataType } from "@/components/forms/EventForm";
import { eventFormSchema } from "@/schema/events";
import { db } from "@/drizzle/db";
import { EventTable } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

export async function createEvent(
  unsafeData: FormDataType
): Promise<{ error: boolean } | undefined> {
  const { userId } = await auth();

  const { success, data } = eventFormSchema.safeParse(unsafeData);

  if (!success || userId === null) {
    return { error: true };
  }

  await db
    .insert(EventTable)
    .values({ ...data, durationMinutes: data.durationInMinutes, clerkUserId: userId });

  redirect("/events");
}

export async function updateEvent(
  id: string,
  unsafeData: FormDataType
): Promise<{ error: boolean } | undefined> {
  const { userId } = await auth();

  const { success, data } = eventFormSchema.safeParse(unsafeData);

  if (!success || userId === null) {
    return { error: true };
  }

  const { rowCount } = await db
    .update(EventTable)
    .set({ ...data })
    .where(and(eq(EventTable.id, id), eq(EventTable.clerkUserId, userId)));

  if (rowCount === 0) {
    return { error: true };
  }

  redirect("/events");
}

export async function deleteEvent(id: string): Promise<{ error: boolean } | undefined> {
  const { userId } = await auth();

  if (userId == null) return { error: true };

  const { rowCount } = await db
    .delete(EventTable)
    .where(and(eq(EventTable.id, id), eq(EventTable.clerkUserId, userId)));

  if (rowCount === 0) {
    return { error: true };
  }

  redirect("/events");
}
