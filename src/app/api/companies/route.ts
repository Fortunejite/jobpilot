import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Employer from '@/models/Company';
import { NextRequest, NextResponse } from 'next/server';
import { object, string, date, record, ZodError } from 'zod';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = request.nextUrl;
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    const employers = await Employer.find().populate('userId').skip(skip).limit(limit);
    return NextResponse.json(employers, { status: 200 });
  } catch (error) {
    console.error('GET /companies error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const formValidator = object({
    companyName: string().min(1, 'Company Name is required'),
    about: string().min(1, 'About Us is required'),
    orginizationType: string().min(1, 'Organization Type is required'),
    industryType: string().min(1, 'Industry Type is required'),
    teamSize: string(),
    yearOfEstablishment: date().or(string().refine(val => !isNaN(Date.parse(val)), { message: 'Invalid date' })),
    website: string().url('Invalid website URL').min(1, 'Website is required'),
    vision: string().min(1, 'Vision is required'),
    links: record(string().url('Enter a valid social link')),
    phoneNumber: string().min(1, 'Phone number is required'),
    address: string().min(1, 'Address is required'),
    email: string().email('Invalid email address'),
    logo: string().url('Invalid logo URL').min(1, 'Logo URL is required'),
    banner: string().url('Invalid banner URL').min(1, 'Banner URL is required'),
  });

  try {
    const body = await request.json();
    body.yearOfEstablishment = new Date(body.yearOfEstablishment);
    const validatedData = formValidator.parse(body);

    await dbConnect();

    const session = await auth();
    const user = session?.user;
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const existingEmployer = await Employer.findOne({ userId: user._id });
    if (existingEmployer) {
      return NextResponse.json({ message: 'Employer already exists' }, { status: 409 });
    }

    const newEmployer = new Employer({ ...validatedData, userId: user._id });
    await newEmployer.save();

    return NextResponse.json({ message: 'Company created successfully' }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      console.error('Validation error:', error);
      return NextResponse.json({ message: error.issues[0]?.message || 'Invalid input' }, { status: 400 });
    }

    console.error('POST /companies error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
