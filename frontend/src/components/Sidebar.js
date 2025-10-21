import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function LeftSidebar() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const menuItems = [
    { icon: 'home', label: 'Home', path: '/' },
    { icon: 'person', label: 'Profile', path: `/profile/${currentUser?.uid}` },
    { icon: 'settings', label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="hidden lg:block w-64 sticky top-20 h-fit" data-testid="left-sidebar">
      <Card>
        <CardContent className="p-2">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate(item.path)}
                data-testid={`sidebar-${item.label.toLowerCase()}`}
              >
                <span className="material-icons text-xl mr-3">{item.icon}</span>
                <span className="text-base">{item.label}</span>
              </Button>
            ))}
          </nav>
        </CardContent>
      </Card>
    </div>
  );
}

export function RightSidebar() {
  return (
    <div className="hidden xl:block w-80 sticky top-20 h-fit" data-testid="right-sidebar">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">About mincici</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-600">
          <p>
            Welcome to mincici - the social platform for creators.
          </p>
          <p>
            Share your thoughts, connect with others, and express yourself.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <a href="#" className="text-blue-600 hover:underline">About</a>
            <span>•</span>
            <a href="#" className="text-blue-600 hover:underline">Help</a>
            <span>•</span>
            <a href="#" className="text-blue-600 hover:underline">Privacy</a>
            <span>•</span>
            <a href="#" className="text-blue-600 hover:underline">Terms</a>
          </div>
          <p className="text-xs pt-2">© 2025 mincici. All rights reserved.</p>
        </CardContent>
      </Card>
    </div>
  );
}
