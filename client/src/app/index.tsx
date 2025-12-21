import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowRight, MessageCircle, Sparkles, Users } from 'lucide-react';
import { ChatCommunityLogo } from '@/components/logo';
import { ThemeToogle } from '@/components/theme/theme-toggle';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <ChatCommunityLogo />
            <div className="flex items-center gap-4">
              <Button variant="ghost">About</Button>
              <Button variant="ghost">Features</Button>
              <Link to="/sign-in">
                <Button
                  variant="outline"
                  className="border-border text-foreground bg-transparent"
                >
                  Log in
                </Button>
              </Link>

              <Link to="/sign-up">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Sign up
                </Button>
              </Link>
              <ThemeToogle />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight text-balance">
            <span className="text-foreground">Connect with your</span>
            <br />
            <span className="text-primary">community today</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
            Join thousands of people sharing ideas, building relationships, and engaging
            in conversations that matter. Your community awaits.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 h-14"
            >
              Get Started
              <ArrowRight className="ml-2 size-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border text-foreground text-lg px-8 h-14 bg-transparent"
            >
              Explore Communities
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border/40 bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-primary">50K+</div>
              <div className="text-muted-foreground">Active Members</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl text-destructive font-bold">1M+</div>
              <div className="text-muted-foreground">Messages Shared</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-primary">500+</div>
              <div className="text-muted-foreground">Communities</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground text-balance">
              Everything you need to connect
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Built with powerful features to help you engage, share, and grow your
              community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-8 bg-card hover:bg-card/80 border-border transition-colors">
              <div className="space-y-4">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="size-6 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-card-foreground">
                  Real-time Chat
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Connect instantly with your community through seamless real-time
                  messaging and notifications.
                </p>
              </div>
            </Card>

            <Card className="p-8 bg-card hover:bg-card/80 border-border transition-colors">
              <div className="space-y-4">
                <div className="size-12 rounded-xl bg-destructive/40 flex items-center justify-center">
                  <Users className="size-6 text-muted" />
                </div>
                <h3 className="text-2xl font-semibold text-card-foreground">
                  Communities
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Create or join communities around your interests, hobbies, and
                  passions with like-minded people.
                </p>
              </div>
            </Card>

            <Card className="p-8 bg-card hover:bg-card/80 border-border transition-colors">
              <div className="space-y-4">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="size-6 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-card-foreground">
                  Smart Features
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Enjoy rich media sharing, reactions, threads, and powerful moderation
                  tools for a better experience.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/40 bg-card/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground text-balance">
              Ready to join the conversation?
            </h2>
            <p className="text-xl text-muted-foreground text-pretty">
              Sign up now and discover a community that welcomes you.
            </p>
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 h-14"
            >
              Create Your Account
              <ArrowRight className="ml-2 size-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="size-6 text-primary" />
              <span className="font-semibold text-foreground">Chat Community</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 Chat Community. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
