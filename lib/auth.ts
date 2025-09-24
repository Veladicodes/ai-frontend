import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { MongoClient } from "mongodb";
import User from "@/models/User";
import dbConnect from "./dbConnect";

const client = new MongoClient(process.env.MONGODB_URI!);
const clientPromise = client.connect();

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          await dbConnect();
          
          // Check if user exists
          const existingUser = await User.findOne({ email: user.email });
          
          if (existingUser) {
            // Update lastLogin and image for existing user
            await User.findByIdAndUpdate(existingUser._id, {
              lastLogin: new Date(),
              image: user.image, // Update image in case it changed
              name: user.name, // Update name in case it changed
            });
          } else {
            // Create new user
            await User.create({
              email: user.email,
              name: user.name,
              image: user.image,
              lastLogin: new Date(),
            });
          }
          
          return true;
        } catch (error) {
          console.error("Error saving user to MongoDB:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.picture = user.image; // Ensure image is in token
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        // Ensure image is properly set in session
        if (token.picture) {
          session.user.image = token.picture as string;
        }
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to dashboard after successful sign in
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/dashboard`;
    },
  },
  pages: {
    signIn: "/auth",
  },
};
