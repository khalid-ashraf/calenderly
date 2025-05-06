"use client";

import { memo, useCallback, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventFormSchema } from "@/schema/events";
import { createEvent, deleteEvent, updateEvent } from "@/server/actions/events.action";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";

import {
  AlertDialogHeader,
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../ui/alert-dialog";

export type FormDataType = z.infer<typeof eventFormSchema>;

const EventForm = ({
  event,
}: {
  event?: {
    id: string;
    name: string;
    description?: string;
    durationMinutes: number;
    isActive: boolean;
  };
}) => {
  const [isDeletePending, startDeleteTransition] = useTransition();

  const form = useForm<FormDataType>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: event ?? {
      isActive: true,
      durationInMinutes: 30,
    },
  });

  const onSubmit = useCallback(async (values: FormDataType) => {
    const action = event == null ? createEvent : updateEvent.bind(null, event.id);

    const data = await action(values);

    if (data?.error)
      form.setError("root", {
        message: "There was an error saving your event",
      });
  }, []);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-6'
        aria-label='Event creation form'
      >
        {form.formState.errors.root && (
          <div className='text-destructive text-sm'>{form.formState.errors.root.message}</div>
        )}

        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel id='event-name'>Event Name</FormLabel>

              <FormControl>
                <Input {...field} required aria-required='true' />
              </FormControl>

              <FormDescription id='name-description'>
                The name users will see when booking
              </FormDescription>

              <FormMessage id='name-error' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='durationInMinutes'
          render={({ field }) => (
            <FormItem>
              <FormLabel id='event-duration'>Duration</FormLabel>

              <FormControl>
                <Input type='number' required aria-required='true' min={1} max={720} {...field} />
              </FormControl>

              <FormDescription id='duration-description'>In minutes</FormDescription>

              <FormMessage id='duration-error' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel id='event-description'>Description</FormLabel>

              <FormControl>
                <Textarea className='resize-none h-32' {...field} />
              </FormControl>

              <FormDescription>Optional description of the event</FormDescription>

              <FormMessage id='description-error' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='isActive'
          render={({ field }) => (
            <FormItem>
              <div className='flex items-center gap-2'>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    role='switch'
                    aria-checked={field.value}
                  />
                </FormControl>

                <FormLabel id='event-active'>Active</FormLabel>
              </div>

              <FormDescription id='active-description'>
                Inactive events will not be visible for the users
              </FormDescription>

              <FormMessage id='active-error' />
            </FormItem>
          )}
        />

        <div className='flex gap-2 justify-end' role='group' aria-label='Form actions'>
          {event && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant='destructiveGhost'
                  disabled={isDeletePending || form.formState.isSubmitting}
                >
                  Delete
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this event.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>

                  <AlertDialogAction
                    disabled={isDeletePending || form.formState.isSubmitting}
                    variant='destructive'
                    onClick={() => {
                      startDeleteTransition(async () => {
                        const data = await deleteEvent(event.id);

                        if (data?.error) {
                          form.setError("root", {
                            message: "There was an error deleting your event",
                          });
                        }
                      });
                    }}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <Button
            type='button'
            variant='secondary'
            disabled={isDeletePending || form.formState.isSubmitting}
            asChild
          >
            <Link href='/events'>Cancel</Link>
          </Button>

          <Button
            type='submit'
            disabled={!form.formState.isValid || form.formState.isSubmitting}
            aria-disabled={!form.formState.isValid || form.formState.isSubmitting}
          >
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default memo(EventForm);
