import { Link } from '@tanstack/react-router';
import { ChatCommunityLogo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { SignInForm } from '@/modules/auth/components/sign-in-form';

export function SignInPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center gap-8">
      <Link to="/">
        <ChatCommunityLogo />
      </Link>
      <Card className="max-w-xl w-full">
        <CardHeader>
          <h1 className="text-2xl">Sign In</h1>
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
        <CardFooter>
          <p>Does not have a account?</p>
          <Link to="/sign-up">
            <Button variant="link" className="hover:cursor-pointer">
              Create your account
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
