/* eslint-disable @typescript-eslint/no-unused-vars */
import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      _id: string;
      email?: string;
      fullName: string;
      username: string;
      password?: string;
      avatar?: string;
    };
  }

  interface User {
    _id: string;
    email?: string;
    fullName: string;
    username: string;
    password?: string;
    avatar?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    _id: string;
    email?: string;
    fullName: string;
    username: string;
    password?: string;
    avatar?: string;
  }
}
