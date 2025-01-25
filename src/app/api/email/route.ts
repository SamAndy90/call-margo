import { createClient } from '@/lib/supabase';
import { 
  sendBusinessWelcomeEmail, 
  sendMarketerWelcomeEmail, 
  sendPasswordResetEmail, 
  sendVerificationEmail 
} from '@/lib/email';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { type, email, url, name, userType, company, expertise } = await request.json();

    // Verify the request is authenticated for certain operations
    const {
      data: { session },
    } = await supabase.auth.getSession();

    switch (type) {
      case 'welcome':
        if (!session && !process.env.INTERNAL_API_KEY) {
          return new NextResponse('Unauthorized', { status: 401 });
        }
        if (userType === 'business') {
          if (!company) {
            return new NextResponse('Company name is required for business users', { status: 400 });
          }
          await sendBusinessWelcomeEmail(email, name, company);
        } else if (userType === 'marketer') {
          if (!expertise || !Array.isArray(expertise)) {
            return new NextResponse('Expertise is required for marketers', { status: 400 });
          }
          await sendMarketerWelcomeEmail(email, name, expertise);
        } else {
          return new NextResponse('Invalid user type', { status: 400 });
        }
        break;

      case 'password-reset':
        await sendPasswordResetEmail(email, url);
        break;

      case 'verification':
        await sendVerificationEmail(email, url);
        break;

      default:
        return new NextResponse('Invalid email type', { status: 400 });
    }

    return new NextResponse('Email sent successfully', { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return new NextResponse('Error sending email', { status: 500 });
  }
}
