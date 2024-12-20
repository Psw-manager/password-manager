import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string; // Add accessToken property to the session type
    id?: number;
  }

  interface User {
    accessToken?: string;
    refreshToken?: string; // Add accessToken property to the user type
    id?: number;
  }
}
