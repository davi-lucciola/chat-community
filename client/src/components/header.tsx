import { Link } from '@tanstack/react-router';
import chatCommunityIcon from '@/assets/chat-community-logo.png';
import { Container } from './container';
import { Button } from './ui/button';

export function Header() {
  return (
    <header className="px-16">
      <Container className="flex justify-between items-center py-4 ">
        <section className="flex gap-2 items-center">
          <img
            src={chatCommunityIcon}
            alt="Chat Community Logo"
            className="w-12 h-12"
          />
          <h1 className="text-2xl mb-2"> Chat Community </h1>
        </section>
        <section>
          <Link to="/sign-up">
            <Button className="text-lg hover:cursor-pointer p-4" variant="link">
              Cadastre-se
            </Button>
          </Link>
          <Link to="/sign-in">
            <Button className="text-lg hover:cursor-pointer p-4" variant="link">
              Entrar
            </Button>
          </Link>
        </section>
      </Container>
    </header>
  );
}
