import dbConnect from '@/lib/mongodb';
import Worker from '@/models/Worker';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Extract pagination parameters with defaults
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1', 10);
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    // Fetch workers with pagination and user population
    const workers = await Worker.find()
      .populate('userId')
      .skip(skip)
      .limit(limit);

    // Handle empty result
    if (!workers.length) {
      return NextResponse.json({ message: 'No workers found' }, { status: 404 });
    }

    return NextResponse.json(workers, { status: 200 });

  } catch (error) {
    console.error('GET /workers error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
