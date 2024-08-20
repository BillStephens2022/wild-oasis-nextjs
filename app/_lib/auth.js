import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// Dynamically determine the port and set the NEXTAUTH_URL accordingly
const getNextAuthUrl = () => {
  const defaultPort = 3000;
  const port = process.env.PORT || defaultPort;
  return `http://localhost:${port}`;
};

const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async redirect({ url, baseUrl }) {
      return baseUrl.startsWith(getNextAuthUrl()) ? baseUrl : getNextAuthUrl();
    },
  },
};

export const {
  auth,
  handlers: { GET, POST },
} = NextAuth(authConfig);
