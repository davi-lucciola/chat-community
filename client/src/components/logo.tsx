import { MessageCircle } from 'lucide-react';

export function ChatCommunityLogo() {
  return (
    <div className="flex items-center gap-2">
      <MessageCircle className="size-8 text-primary" />
      <span className="text-xl font-bold text-foreground">Chat Community</span>
    </div>
  );
}
