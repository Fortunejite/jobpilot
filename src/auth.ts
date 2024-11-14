// import Google from 'next-auth/providers/google';
// import Facebook from 'next-auth/providers/facebook';
import Credentials from 'next-auth/providers/credentials';
import NextAuth from 'next-auth';
import type { NextAuthConfig, User } from 'next-auth';
import { compare } from 'bcrypt';
import { object, string } from 'zod';
import UserModel from './models/user';

const userObject = object({
  email: string().email({ message: 'Invalid email address' }),
  password: string().min(6, {
    message: 'Password must be a minimum of 6 characters',
  }),
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
        const { email, password } = userObject.parse(credentials);
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
          avatar: user.avatar,
          username: user.username,
        } as unknown as User;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === 'google' || account?.provider === 'facebook') {
        const { email, image, fullName, username } = user;
        if (email) {
          const existingUser = await UserModel.findOne({ email });
          if (!existingUser) {
            const newUser = new UserModel({
              email,
              fullName,
              username,
              provider: account?.provider,
              avatar: image,
            });

            await newUser.save();

            if (newUser) {
              token.id = newUser._id.toString();
              token.email = email;
              token.avatar = image || '/icons/profile.png';
              token.fullName = fullName;
              token.username = username;
            }
          } else {
            token.id = existingUser._id.toString();
            token.email = email;
            token.avatar = image || '/icons/profile.png';
            token.fullName = existingUser?.fullName;
            token.username = existingUser?.username;
          }
        } else return token;
      } else {
        // Fallback for other providers or if account is not defined
        if (user) {
          token._id = user._id.toString();
          token.email = user.email || '';
          token.avatar = user.avatar || '/icons/profile.png';
          token.fullName = user.fullName;
          token.username = user.username;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user._id = token._id;
        session.user.email = token.email || '';
        session.user.avatar = token.avatar;
        session.user.fullName = token.fullName;
        session.user.username = token.username;
      }

      return session;
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(option);
