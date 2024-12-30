import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find({})
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error('GET /category error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
