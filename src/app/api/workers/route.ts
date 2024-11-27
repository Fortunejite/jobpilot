import dbConnect from '@/lib/mongodb';
import Worker from '@/models/worker'
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
  
    const page = Number(request.nextUrl.searchParams.get('page')) || 1;
    const limit = Number(request.nextUrl.searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;
  
    const workers = await Worker.find().populate('userId').skip(skip).limit(limit);
    
    return NextResponse.json({ data: workers }, { status: 200 });
    
  } catch(e) {
    console.log(e)
    return NextResponse.json({ data: null }, { status: 500 });
  }
}

// export async function POST(request: Request) {
//   const userObject = object({
//     email: string().email({message: 'Invalid email address'}),
//     username: string().min(3, {message: 'Username is a minimum of 3 characters'}).max(20, {message: 'Username is a maximum of 20 characters'}),
//     fullName: string().min(1, {message: 'Full name cannot be empty'}),
//     password:  string().min(6, {message: 'Password is a minimum of 6 characters'}).max(30, {message: 'Password is a maximum of 30 characters'}),
//     isWorker: boolean()
//   })
//   try {
//     const credentials = await request.json();
//     const { email, password, fullName, username, isWorker } =
//       userObject.parse(credentials);
//       await dbConnect()
//     const availableUser = await Worker.findOne({ email });
//     if (availableUser) {
//       return NextResponse.json(
//         { msg: 'Email already exists' },
//         { status: 409 },
//       );
//     }
//     const hashedPassword = await hash(password, 10);
//     const user = new User({
//       email,
//       fullName,
//       username,
//       password: hashedPassword,
//       role: isWorker ? 'worker' : 'employer',
//     });
//     await user.save();
//     return NextResponse.json({ msg: 'signup successful' }, { status: 201 });
//   } catch (e) {
//     if (e instanceof ZodError) {
//       console.log(e);
      
//       return NextResponse.json({ msg: e.issues[0].message }, { status: 401 });
//     }
//     console.log(e)
//     return NextResponse.json({ msg: e }, { status: 409 });
//   }
// }
