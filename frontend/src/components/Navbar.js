import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center gap-4 sm:gap-8">
            <h1 
              className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer"
              onClick={() => navigate('/')}
              data-testid="app-logo"
            >
              mincici
            </h1>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              data-testid="nav-home-btn"
              className="hidden sm:flex"
            >
              <span className="material-icons text-xl mr-2">home</span>
              Home
            </Button>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              data-testid="nav-home-mobile"
              className="sm:hidden"
            >
              <span className="material-icons text-xl">home</span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar 
                  className="cursor-pointer w-8 h-8 sm:w-9 sm:h-9"
                  data-testid="nav-avatar"
                >
                  <AvatarImage src={currentUser?.photoURL} />
                  <AvatarFallback>{currentUser?.displayName?.[0]}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem 
                  onClick={() => navigate(`/profile/${currentUser?.uid}`)}
                  data-testid="menu-profile-btn"
                >
                  <span className="material-icons text-lg mr-2">person</span>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => navigate('/settings')}
                  data-testid="menu-settings-btn"
                >
                  <span className="material-icons text-lg mr-2">settings</span>
                  Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
