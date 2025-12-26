import { createFileRoute, Link } from '@tanstack/react-router';
import { Plus, Search, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';
import { NavigationHeader } from '@/components/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useOverflowY } from '@/components/use-overflow-y';

// Mock data for communities
const mockMyCommunities = [
  {
    id: '1',
    name: 'Web Developers',
    description: 'A community for web developers to share knowledge and collaborate',
    members: 15234,
    online: 892,
    unread: 5,
    image: '/web-development-concept.png',
    category: 'Technology',
  },
  {
    id: '2',
    name: 'Design Systems',
    description: 'Discussing design systems, UI/UX patterns, and best practices',
    members: 8421,
    online: 234,
    unread: 0,
    image: '/design-systems.png',
    category: 'Design',
  },
  {
    id: '3',
    name: 'React Enthusiasts',
    description: 'Everything React - hooks, components, state management, and more',
    members: 21567,
    online: 1453,
    unread: 12,
    image: '/react-logo.png',
    category: 'Technology',
  },
];

const mockDiscoverCommunities = [
  {
    id: '4',
    name: 'AI & Machine Learning',
    description: 'Exploring artificial intelligence, ML models, and data science',
    members: 32451,
    online: 2341,
    trending: true,
    image: '/artificial-intelligence-network.png',
    category: 'Technology',
  },
  {
    id: '5',
    name: 'Startup Founders',
    description: 'Connect with fellow entrepreneurs and startup founders',
    members: 12678,
    online: 567,
    trending: true,
    image: '/startup-business.png',
    category: 'Business',
  },
  {
    id: '6',
    name: 'Digital Art',
    description: 'Share and discuss digital art, illustrations, and creative work',
    members: 18934,
    online: 891,
    trending: false,
    image: '/abstract-digital-composition.png',
    category: 'Art',
  },
  {
    id: '7',
    name: 'Gaming Community',
    description: 'Gaming discussions, reviews, and finding gaming partners',
    members: 45782,
    online: 3456,
    trending: true,
    image: '/gaming-controller.png',
    category: 'Gaming',
  },
  {
    id: '8',
    name: 'Fitness & Health',
    description: 'Share fitness journeys, nutrition tips, and healthy lifestyle',
    members: 28456,
    online: 1234,
    trending: false,
    image: '/fitness-health.png',
    category: 'Health',
  },
];

const communitiesParamsSchema = z.object({
  search: z.string().optional().catch(''),
  explore: z.coerce.boolean().optional().catch(false),
});

export const Route = createFileRoute('/(private)/communities')({
  component: CommunitiesPage,
  validateSearch: (search) => communitiesParamsSchema.parse(search),
});

function CommunitiesPage() {
  useOverflowY();

  const { explore, search } = Route.useSearch();

  console.log(search);
  console.log(explore);

  const [searchQuery, setSearchQuery] = useState(search ?? '');

  const filteredMyCommunities = mockMyCommunities.filter(
    (community) =>
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredDiscoverCommunities = mockDiscoverCommunities.filter(
    (community) =>
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader className="sticky top-0" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Communities</h1>
            <p className="text-muted-foreground">
              Discover and join communities that interest you
            </p>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="size-4 mr-2" />
            Create Community
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search communities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-lg"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue={explore ? 'explore' : 'my-communities'} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="my-communities">My Communities</TabsTrigger>
            <TabsTrigger value="explore">Explore</TabsTrigger>
          </TabsList>

          {/* My Communities Tab */}
          <TabsContent value="my-communities" className="space-y-4">
            {filteredMyCommunities.length === 0 ? (
              <Card className="p-12 text-center">
                <Users className="size-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No communities found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery
                    ? 'Try a different search term'
                    : "You haven't joined any communities yet"}
                </p>
                <Button variant="outline">Browse Communities</Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMyCommunities.map((community) => (
                  <Link
                    key={community.id}
                    to="/community/$communityId/chat"
                    params={{ communityId: community.id }}
                  >
                    <Card className="p-6 hover:bg-card/80 transition-colors cursor-pointer h-full">
                      <div className="flex items-start gap-4 mb-4">
                        <Avatar className="size-16 rounded-lg">
                          <AvatarImage src={community.image || '/placeholder.svg'} />
                          <AvatarFallback className="rounded-lg">
                            {community.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg text-card-foreground truncate">
                              {community.name}
                            </h3>
                            {community.unread > 0 && (
                              <Badge
                                variant="default"
                                className="bg-primary text-primary-foreground"
                              >
                                {community.unread}
                              </Badge>
                            )}
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {community.category}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {community.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="size-4" />
                          <span>{community.members.toLocaleString()} members</span>
                        </div>
                        <div className="flex items-center gap-1 text-green-500">
                          <div className="size-2 rounded-full bg-green-500" />
                          <span>{community.online} online</span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Discover Tab */}
          <TabsContent value="explore" className="space-y-4">
            {filteredDiscoverCommunities.length === 0 ? (
              <Card className="p-12 text-center">
                <Search className="size-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No communities found</h3>
                <p className="text-muted-foreground">Try a different search term</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDiscoverCommunities.map((community) => (
                  <Card
                    key={community.id}
                    className="p-6 hover:bg-card/80 transition-colors h-full"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="size-16 rounded-lg">
                        <AvatarImage src={community.image || '/placeholder.svg'} />
                        <AvatarFallback className="rounded-lg">
                          {community.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg text-card-foreground truncate">
                            {community.name}
                          </h3>
                          {community.trending && (
                            <TrendingUp className="size-4 text-primary shrink-0" />
                          )}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {community.category}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {community.description}
                    </p>
                    <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="size-4" />
                        <span>{community.members.toLocaleString()} members</span>
                      </div>
                      <div className="flex items-center gap-1 text-green-500">
                        <div className="size-2 rounded-full bg-green-500" />
                        <span>{community.online} online</span>
                      </div>
                    </div>
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      Join Community
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
