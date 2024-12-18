
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
            email: credentials?.email,  
            password: credentials?.password,
          }),
        });

        const user = await res.json();

        if (res.ok && user.access_token) {
          return { ...user, accessToken: user.access_token, refreshToken: user.refresh_token };  
        } else {
          return null;  
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken as string; 
        token.refreshToken = user.refreshToken as string; 
        token.email = user.email;  
    
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string; 
      session.refreshToken = token.refreshToken as string;  
      session.user = { ...session.user, email: token.email };  
      return session;
    },
  },
  pages: {
    signIn: "/", 
  },
  secret: process.env.NEXTAUTH_SECRET,  
});

export { handler as GET, handler as POST };
