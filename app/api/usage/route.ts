import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({
      req: req,
      secret: process.env.NEXT_AUTH_SECRET!,
    });
    console.log("to", token);

    if (!token?.email) {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const user = await db.query.users.findFirst({
      where: (user, { eq }) => eq(user.email, token.email as string),
      columns: {
        id: true,
        plan: true,
        usageCount: true,
        usageLimit: true,
      },
    });

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User Not Found!" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Usage Data Fetched Successfully",
        data: {
          usageCount: user.usageCount,
          usageLimit: user.usageLimit,
          plan: user.plan,
          // canUpload: (user?.usageCount ?? 0) < (user?.usageLimit ?? 0),
          canUpload: Number(user.usageCount) < Number(user.usageLimit),
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching usage data:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({
      req: req,
      secret: process.env.NEXT_AUTH_SECRET!,
    });
    if (!token?.email) {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const user = await db.query.users.findFirst({
      where: (user, { eq }) => eq(user.email, token.email as string),
      columns: {
        id: true,
        plan: true,
        usageCount: true,
        usageLimit: true,
      },
    });

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User Not Found!" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    // check if user can upload or not

    if (Number(user.usageCount) >= Number(user.usageLimit)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Usage Limit Reached",
          data: {
            usageCount: user.usageCount,
            usageLimit: user.usageLimit,
            plan: user.plan,
            canUpload: false,
          },
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }
    // increment usage count
    const [updatedUser] = await db
      .update(users)
      .set({
        usageCount: Number(user.usageCount) + 1,
      })
      .where(eq(users.id, user.id))
      .returning();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Usage Updated Successfully",
        data: {
          usageCount: Number(updatedUser?.usageCount) + 1,
          usageLimit: updatedUser?.usageLimit,
          plan: updatedUser?.plan,
          canUpload:
            Number(updatedUser?.usageCount) + 1 <
            Number(updatedUser?.usageLimit),
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error updating usage data:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
