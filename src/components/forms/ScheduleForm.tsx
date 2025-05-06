"use client";

import { Fragment, memo, useCallback, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { createEvent, updateEvent } from "@/server/actions/events.action";
import { DAYS_OF_WEEK_IN_ORDER } from "@/data/constants";
import { scheduleFormSchema } from "@/schema/schedule";
import { timeToInt } from "@/lib/utils";
import { formatTimezoneOffset } from "@/lib/formatters";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Plus, X } from "lucide-react";
import { Input } from "../ui/input";
import { saveSchedule } from "@/server/actions/schedule.action";

export type ScheduleFormType = z.infer<typeof scheduleFormSchema>;

export type Availability = {
  startTime: string;
  endTime: string;
  dayOfWeek: (typeof DAYS_OF_WEEK_IN_ORDER)[number];
};

const ScheduleForm = ({
  schedule,
}: {
  schedule?: {
    timezone: string;
    availabilities: Availability[];
  };
}) => {
  const [successMessage, setSuccessMessage] = useState<string>();

  const form = useForm<ScheduleFormType>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      timezone: schedule?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
      availabilities: schedule?.availabilities.toSorted((a, b) => {
        return timeToInt(a.startTime) - timeToInt(b.startTime);
      }),
    },
  });

  const {
    append: addAvailability,
    remove: removeAvailability,
    fields: availabilityFields,
  } = useFieldArray({
    name: "availabilities",
    control: form.control,
  });

  const groupedAvailabilityFields = Object.groupBy(
    availabilityFields.map((field, index) => ({ ...field, index })),
    (availability) => availability.dayOfWeek
  );

  const onSubmit = async (values: ScheduleFormType) => {
    try {
      const data = await saveSchedule(values);

      if (data?.error) {
        console.log("Server Error:", data.error);
        form.setError("root", {
          type: "server",
          message: "An error occurred while saving the schedule.",
        });
        return;
      }

      setSuccessMessage("Schedule Saved!");
    } catch (error) {
      console.error("Submit Error:", error);
      form.setError("root", {
        type: "submit",
        message:
          "There was an error saving your schedule. Please check for overlapping time slots.",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-6'
        aria-label='Event creation form'
      >
        {form.formState.errors.root && (
          <div
            className='text-destructive text-sm border border-destructive p-3 rounded'
            role='alert'
            aria-live='polite'
          >
            {form.formState.errors.root.message}
          </div>
        )}

        {successMessage && <div className='text-green-500 text-sm'>{successMessage}</div>}

        <FormField
          control={form.control}
          name='timezone'
          render={({ field }) => (
            <FormItem>
              <FormLabel id='event-name'>Timezone</FormLabel>

              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {Intl.supportedValuesOf("timeZone").map((timezone) => (
                    <SelectItem key={timezone} value={timezone}>
                      {timezone}
                      {` (${formatTimezoneOffset(timezone)})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormDescription id='name-description'>
                The name users will see when booking
              </FormDescription>

              <FormMessage id='name-error' />
            </FormItem>
          )}
        />

        <div className='w-full grid grid-cols-[auto_1fr]  gap-y-6 gap-x-4'>
          {DAYS_OF_WEEK_IN_ORDER.map((dayOfWeek) => {
            return (
              <Fragment key={dayOfWeek}>
                <div className='capitalize text-sm font-semibold min-w-[60px]'>
                  {dayOfWeek.substring(0, 3)}
                </div>
                <div className='flex flex-col gap-2'>
                  <Button
                    type='button'
                    className='size-6'
                    variant='outline'
                    onClick={() => {
                      addAvailability({
                        dayOfWeek,
                        startTime: "9:00",
                        endTime: "17:00",
                      });
                    }}
                  >
                    <Plus className='size-4' />
                  </Button>

                  {groupedAvailabilityFields[dayOfWeek]?.map((field, labelIndex) => (
                    <div className='flex flex-col gap-1' key={field.id}>
                      <div className='flex gap-2 items-center'>
                        <FormField
                          control={form.control}
                          name={`availabilities.${field.index}.startTime`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  className='w-24'
                                  aria-label={`${dayOfWeek} Start Time ${labelIndex + 1}`}
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        -
                        <FormField
                          key={labelIndex}
                          control={form.control}
                          name={`availabilities.${field.index}.endTime`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  className='w-24'
                                  aria-label={`${dayOfWeek} End Time ${labelIndex + 1}`}
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <Button
                          type='button'
                          className='size-6 p-1'
                          variant='destructiveGhost'
                          onClick={() => removeAvailability(field.index)}
                        >
                          <X />
                        </Button>
                      </div>

                      <FormMessage>
                        {form.formState.errors.availabilities?.at?.(field.index)?.root?.message}
                      </FormMessage>
                      <FormMessage>
                        {
                          form.formState.errors.availabilities?.at?.(field.index)?.startTime
                            ?.message
                        }
                      </FormMessage>
                      <FormMessage>
                        {form.formState.errors.availabilities?.at?.(field.index)?.endTime?.message}
                      </FormMessage>
                    </div>
                  ))}
                </div>
              </Fragment>
            );
          })}
        </div>

        <div className='flex gap-2 justify-end' role='group' aria-label='Form actions'>
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

export default memo(ScheduleForm);
