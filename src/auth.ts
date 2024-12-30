// import Google from 'next-auth/providers/google';
// import Facebook from 'next-auth/providers/facebook';
import Credentials from 'next-auth/providers/credentials';
import NextAuth from 'next-auth';
import type { NextAuthConfig, User } from 'next-auth';
import { compare } from 'bcrypt';
import { object, string } from 'zod';
import UserModel from './models/User';
import dbConnect from './lib/mongodb';

const userObject = object({
  email: string().email({ message: 'Invalid email address' }),
  password: string().min(6, {
    message: 'Password must be a minimum of 6 characters',
  }),
  rememberMe: string().transform((value) => value.toLowerCase() === 'true')
});

const option: NextAuthConfig = {
  pages: {
    signIn: '/auth',
  },
  providers: [
    // Google,
    // Facebook,
    Credentials({
      credentials: {},
      authorize: async (credentials) => {
        const { email, password, rememberMe } = userObject.parse(credentials);
        await dbConnect();
        const user = await UserModel.findOne({ email });
        if (!user) {
          return null;
        }
        if (user.provider) return null;
        const isValid = await compare(password!, user.password!);
        if (!isValid) return null;
        return {
          _id: user._id,
          email: user.email,
          fullName: user.fullName,
          username: user.username,
          role: user.role,
          rememberMe: rememberMe,
        } as unknown as User;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === 'google' || account?.provider === 'facebook') {
        const { email, fullName, username } = user;
        if (email) {
          const existingUser = await UserModel.findOne({ email });
          if (!existingUser) {
            const newUser = new UserModel({
              email,
              fullName,
              username,
              provider: account?.provider,
            });

            await newUser.save();

            if (newUser) {
              token.id = (newUser._id as string).toString();
              token.email = email;
              token.fullName = fullName;
              token.username = username;
            }
          } else {
            token.id = (existingUser._id as string).toString();
            token.email = email;
            token.fullName = existingUser?.fullName;
            token.username = existingUser?.username;
          }
        } else return token;
      } else {
        // Fallback for other providers or if account is not defined
        if (user) {
          token._id = user._id.toString();
          token.email = user.email || '';
          token.fullName = user.fullName;
          token.username = user.username;
          token.role = user.role;
          const expires = user.rememberMe
            ? Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
            : Date.now() + 1 * 60 * 60 * 1000; // 1 hour

          token.expires = new Date(expires).toISOString();
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user._id = token._id;
        session.user.email = token.email || '';
        session.user.fullName = token.fullName;
        session.user.username = token.username;
        session.user.role = token.role;
        session.expires = token.expires as Date & string;
      }

      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // Default session max age for "Remember Me" (30 days)
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(option);
