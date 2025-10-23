CREATE TYPE "public"."plan" AS ENUM('Free', 'Paid');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('User', 'Admin', 'Moderator');--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"razorpay_subscription_id" text NOT NULL,
	"razorpay_customer_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"avatar" text,
	"razorpay_customer_id" text,
	"plan" "plan" DEFAULT 'Free',
	"role" "role" DEFAULT 'User',
	"usage_count" integer DEFAULT 0,
	"usage_limit" integer DEFAULT 3,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
