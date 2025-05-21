// lib/auth.ts (or app/lib/auth.ts)
import NextAuth from "next-auth"
import { AuthOptions } from "next-auth"

export const authOptions: AuthOptions = {
  // Your NextAuth configuration here
  providers: [
    // Example with GitHub provider:
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID!,
    //   clientSecret: process.env.GITHUB_SECRET!,
    // }),
  ],
  // Add any custom configuration here
  secret: process.env.NEXTAUTH_SECRET,
}