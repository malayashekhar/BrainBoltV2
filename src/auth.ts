import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import db from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
 ...authConfig,
 adapter: PrismaAdapter(db as unknown as Parameters<typeof PrismaAdapter>[0]),
 session: {
  strategy: "jwt",
 },
 pages: {
  signIn: "/",
 },
 callbacks: {
  async jwt({ token, user }) {
   if (user) {
    // TODO: Implement user data handling
   }

   return token;
  },

  async session({ session, token }) {
   if (token) {
    // TODO: Implement token to session mapping
   }

   return session;
  },

  redirect() {
   return "/";
  },
 },
});