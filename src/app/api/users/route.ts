import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Worker from '@/models/Worker';
import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { ZodError, object, string, boolean } from 'zod';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1', 10);
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    const users = await User.find().skip(skip).limit(limit);
    
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('GET /users error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const userSchema = object({
    email: string().email({ message: 'Invalid email address' }),
    username: string()
      .min(3, { message: 'Username must be at least 3 characters' })
      .max(20, { message: 'Username must not exceed 20 characters' }),
    fullName: string().min(1, { message: 'Full name is required' }),
    password: string()
      .min(6, { message: 'Password must be at least 6 characters' })
      .max(30, { message: 'Password must not exceed 30 characters' }),
    isWorker: boolean(),
  });

  try {
    const credentials = await request.json();
    const { email, password, fullName, username, isWorker } = userSchema.parse(credentials);

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'Email already exists' }, { status: 409 });
    }

    const hashedPassword = await hash(password, 10);

    const newUser = new User({
      email,
      fullName,
      username,
      password: hashedPassword,
      role: isWorker ? 'worker' : 'employer',
    });
    await newUser.save();

    if (isWorker) {
      const newWorker = new Worker({ userId: newUser._id });
      await newWorker.save();
    }

    return NextResponse.json({ message: 'Signup successful' }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      console.error('Validation error:', error);
      return NextResponse.json({ message: error.issues[0].message }, { status: 400 });
    }
    console.error('POST /users error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
