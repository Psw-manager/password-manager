
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;  // Add accessToken property to the session type
  }

  interface User {
    accessToken?: string;  // Add accessToken property to the user type
  }
}
