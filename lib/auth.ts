/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/db";
import { users } from "@/db/schema";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const common = async ({
  email,
  name,
  avatar,
  plan,
  usageCount,
  usageLimit,
}: {
  email: string;
  name: string;
  avatar: string;
  plan: "Free" | "Paid";
  usageCount: number;
  usageLimit: number;
}) => {
  try {
    const user = await db.query.users.findFirst({
      where: (user, { eq }) => eq(user.email, email),
    });

    if (!user) {
      const newUser = await db.insert(users).values({
        id: crypto.randomUUID(),
        email: email,
        // If your users schema supports 'name' and 'avatar', keep them; otherwise, remove or rename as needed
        name: name,
        avatar: avatar,
        plan: plan,
        usageCount: usageCount,
        usageLimit: usageLimit,
      });
      return newUser;
    } else {
      return user;
    }
  } catch (error) {
    console.error(error);
  }
};
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXT_AUTH_SECRET!,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile: async (acc) => {
        await common({
          email: acc.email!,
          name: acc.name!,
          avatar: acc.picture!,
          plan: "Free",
          usageCount: 0,
          usageLimit: 3,
        });
        return {
          id: acc.sub, // sub as iid for google auth
          email: acc.email,
          name: acc.name,
          image: acc.picture, // picture for avatar
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.email = user.email;
        token.avatar = user.image;
        token.plan = "Free";
        token.usageCount = 0;
        token.usageLimit = 3;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.email = token.email;
        session.user.avatar = token.image;
        session.user.plan = "Free";
        session.user.usageCount = 0;
        session.user.usageLimit = 3;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
};
