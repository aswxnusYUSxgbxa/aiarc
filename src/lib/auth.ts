import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const hardcodedUsername = "admin";
        const hardcodedPassword = "password";

        if (
          credentials.username === hardcodedUsername &&
          credentials.password === hardcodedPassword
        ) {
          return { id: "1", name: "Editor", email: "editor@blog.local" };
        }

        return null;
      }
    })
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) session.user.id = token.id as string;
      return session;
    }
  }
});
