import { Link } from '@tanstack/react-router';
import { ChatCommunityLogo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { SignUpForm } from '@/modules/auth/components/sign-up-form';

export function SignUpPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center gap-8">
      <Link to="/">
        <ChatCommunityLogo />
      </Link>
      <Card className="max-w-xl w-full">
        <CardHeader>
          <h1 className="text-2xl">Sign Up</h1>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
        <CardFooter>
          <p>Already have a account?</p>
          <Link to="/sign-in">
            <Button variant="link" className="hover:cursor-pointer">
              Login with your account
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
