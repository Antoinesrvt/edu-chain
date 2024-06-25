// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { JWT } from "next-auth/jwt";
import { DefaultSession, Account } from "next-auth";

// Extend the built-in session type
interface ExtendedSession extends DefaultSession {
  accessToken?: string;
}

// Extend the built-in token type
interface ExtendedToken extends JWT {
  accessToken?: string;
}

// Extend the built-in account type
interface ExtendedAccount extends Account {
  access_token?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: { params: { scope: "repo" } },
    }),
  ],

callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token, user }): Promise<ExtendedSession> {
      return {
        ...session,
        accessToken: token.accessToken as string,
      }
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
