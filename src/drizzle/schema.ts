import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { DAYS_OF_WEEK_IN_ORDER } from "@/data/constants";

// In this file you define tables with columns and what type of data each of those column will contain.

const createdAt = timestamp("createdAt").notNull().defaultNow();
const updatedAt = timestamp("updatedAt")
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date());

// Creating an EventTable.
// pgTable means postgre table
// First argument is the table name, then it is the columns and the table schema.
// Finally you use the third argument which is a callback function to define an index for the table. You can define it based on any data or column of the table
export const EventTable = pgTable(
  "events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description"),
    durationMinutes: integer("durationMinutes").notNull(),
    clerkUserId: text("clerkUserId").notNull(),
    isActive: boolean("isActive").notNull().default(true),
    createdAt,
    updatedAt,
  },
  (table) => [index("clerkUseridIndex").on(table.clerkUserId)]
);

export const ScheduleTable = pgTable("schedules", {
  id: uuid("id").primaryKey().defaultRandom(),
  timezone: text("timezone").notNull(),
  clerkUserId: text("clerkUserId").notNull().unique(),
  createdAt,
  updatedAt,
});

export const scheduleDayOfWeekEnum = pgEnum("day", DAYS_OF_WEEK_IN_ORDER);

export const ScheduleAvailabilityTable = pgTable(
  "scheduleAvailabilities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    scheduleId: uuid("scheduleId")
      .notNull()
      .references(() => ScheduleTable.id, { onDelete: "cascade" }),
    startTime: text("startTime").notNull(),
    endTime: text("endTime").notNull(),
    dayOfWeek: scheduleDayOfWeekEnum("dayOfWeek").notNull(),
  },
  (table) => [index("scheduleIndex").on(table.scheduleId)]
);

// Defining relations between the tables
// Defining a relation between ScheduleTable and ScheduleAvailabilityTable for availabilities.
// Since there can be many availabilities, we are using the many arguement for the callback function
export const scheduleRelations = relations(ScheduleTable, ({ many }) => ({
  availabilities: many(ScheduleAvailabilityTable),
}));

export const ScheduleAvailabilityRelations = relations(ScheduleAvailabilityTable, ({ one }) => ({
  schedule: one(ScheduleTable, {
    fields: [ScheduleAvailabilityTable.scheduleId],
    references: [ScheduleTable.id],
  }),
}));
