// lib/auth.ts
import { AuthOptions } from "next-auth"
import { UserRole } from "@/components/types/user";

export const authOptions: AuthOptions = {
  providers: [
    // Add your providers here
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      // This is triggered on sign in
      if (user) {
        token.role = (user as any).role; // ensure role is carried in token
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as UserRole; // expose role in session
      }
      return session;
    },
  },
}
