import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Login() {
  const { signInWithGoogle, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast.success('Welcome to mincici!');
      navigate('/');
    } catch (error) {
      console.error('Error signing in:', error);
      toast.error('Failed to sign in. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex" data-testid="login-page">
      {/* Left Panel - Auth */}
      <div className="w-full lg:w-1/2 bg-[#1A1A1A] flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Impossible?
              <br />
              Possible.
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300">
              The social platform for creators
            </p>
          </div>

          <div className="space-y-6 pt-8">
            <Button
              onClick={handleGoogleSignIn}
              className="w-full h-14 bg-white hover:bg-gray-100 text-black font-medium text-base border-2 border-gray-200 transition-colors"
              data-testid="google-signin-btn"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <p className="text-sm text-gray-500 text-center">
              By continuing, you acknowledge mincici's{' '}
              <a href="#" className="underline hover:text-gray-300">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#E07A5F] items-end justify-center p-12 relative overflow-hidden">
        {/* Abstract code elements */}
        <div className="absolute top-20 right-20 text-3xl font-mono text-[#3FFF50] opacity-70 rotate-12">
          )//:{'{ }'}
        </div>
        <div className="absolute top-32 left-20 text-2xl font-mono text-[#FF3FFF] opacity-60 -rotate-12">
          &lt;-/-
        </div>
        <div className="absolute top-48 right-32 text-xl font-mono text-[#3FAFFF] opacity-80">
          {'{ .. }'}
        </div>
        <div className="absolute top-64 left-32 text-2xl font-mono text-[#FFFF3F] opacity-70 rotate-6">
          \-
        </div>
        <div className="absolute top-80 right-40 text-xl font-mono text-[#3FFFFF] opacity-60 -rotate-6">
          .-{'{ - }'}
        </div>
        
        {/* Main visual placeholder - you can replace with your image */}
        <div className="w-80 h-96 bg-gradient-to-b from-orange-400/30 to-orange-600/30 rounded-t-3xl flex items-center justify-center">
          <div className="text-center text-white/90">
            <div className="text-8xl mb-4">🎨</div>
            <p className="text-2xl font-bold">mincici</p>
          </div>
        </div>
      </div>
    </div>
  );
}
