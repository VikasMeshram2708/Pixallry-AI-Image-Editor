import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const PlanEnum = pgEnum("plan", ["Free", "Paid"]);
export const RoleEnum = pgEnum("role", ["User", "Admin", "Moderator"]);

export const timeStamps = {
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
};

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  avatar: text("avatar"),
  razorPayCustomerId: text("razorpay_customer_id"),
  plan: PlanEnum("plan").default("Free"),
  role: RoleEnum("role").default("User"),
  usageCount: integer("usage_count").default(0),
  usageLimit: integer("usage_limit").default(3),
  ...timeStamps,
});

export const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  razorPaySubscriptionId: text("razorpay_subscription_id").notNull(),
  razorPayCustomerId: text("razorpay_customer_id").notNull(),
  ...timeStamps,
});

export type User = typeof users.$inferSelect;
export type Plan = typeof PlanEnum;
export type Role = typeof RoleEnum;
export type Subscription = typeof subscriptions.$inferSelect;
