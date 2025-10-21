import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Home, User, LogOut } from 'lucide-react';

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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <h1 
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer"
              onClick={() => navigate('/')}
              data-testid="app-logo"
            >
              SocialFire
            </h1>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/')}
                data-testid="nav-home-btn"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/profile/${currentUser?.uid}`)}
              data-testid="nav-profile-btn"
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
            <Avatar 
              className="cursor-pointer w-9 h-9"
              onClick={() => navigate(`/profile/${currentUser?.uid}`)}
              data-testid="nav-avatar"
            >
              <AvatarImage src={currentUser?.photoURL} />
              <AvatarFallback>{currentUser?.displayName?.[0]}</AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              data-testid="nav-logout-btn"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
