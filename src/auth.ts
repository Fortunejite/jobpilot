// import Google from 'next-auth/providers/google';
// import Facebook from 'next-auth/providers/facebook';
import Credentials from 'next-auth/providers/credentials';
import NextAuth from 'next-auth';
import type { AuthOptions, User } from 'next-auth';
import { compare } from 'bcrypt';
import UserModel from './models/user';

const option: AuthOptions = {
  pages: {
    signIn: '/auth',
  },
  providers: [
    // Google,
    // Facebook,
    Credentials({
      credentials: {},
      authorize: async (credentials) => {
        const { email, password } = credentials as unknown as User;
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
          name: user.firstName,
          avatar: user.avatar || '/icons/profile.png',
          lastName: user.lastName,
          firstName: user.firstName,
        } as unknown as User;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === 'google' || account?.provider === 'facebook') {
        const { email, image, firstName, lastName } = user;
        if (email) {
          const existingUser = await UserModel.findOne({ email });
          if (!existingUser) {
            const newUser = new UserModel({
              email,
              firstName,
              lastName,
              provider: account?.provider,
              avatar: image,
            });

            await newUser.save();

            if (newUser) {
              token.id = newUser._id.toString();
              token.email = email;
              token.avatar = image || '/icons/profile.png';
              token.firstName = firstName;
              token.lastName = lastName;
            }
          } else {
            token.id = existingUser._id.toString();
            token.email = email;
            token.pic = image || '/icons/profile.png';
            token.firstName = existingUser?.firstName;
            token.lastName = existingUser?.lastName;
          }
        } else return token;
      } else {
        // Fallback for other providers or if account is not defined
        token._id = user._id.toString();
        token.email = user.email || '';
        token.avatar = user.avatar || '/icons/profile.png';
        token.firstName = user.firstName;
        token.lastName = user.lastName;
      }

      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user._id = token._id;
        session.user.email = token.email || '';
        session.user.avatar = token.avatar;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
      }

      return session;
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(option);
