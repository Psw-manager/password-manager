// pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.API_BASE_URL}/api/login/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials?.email,  // Ensure you're sending the correct key (email)
            password: credentials?.password,
          }),
        });
      
        const user = await res.json();
      
        if (res.ok && user.access_token) {
          return { ...user, accessToken: user.access_token };  // Return the user object with access token
        } else {
          return null;  // Authorization failed, return null
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken as string;  // Save the access token
      }
      return token;
    },
    
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;  // Attach the access token to the session
      return session;
    },
  },
  pages: {
    signIn: "/signup",  // Using JWT as session strategy
  },
  secret: process.env.NEXTAUTH_SECRET,  // Ensure you have a secret set for JWT encryption
});

export { handler as GET, handler as POST };