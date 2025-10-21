import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '@/firebase/config';
import { doc, updateDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function UsernameSetup() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateUsername = (value) => {
    if (value.length < 3) {
      return 'Username must be at least 3 characters';
    }
    if (value.length > 20) {
      return 'Username must be less than 20 characters';
    }
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      return 'Username can only contain letters, numbers, and underscores';
    }
    return '';
  };

  const checkUsernameExists = async (username) => {
    const q = query(collection(db, 'users'), where('username', '==', username.toLowerCase()));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateUsername(username);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Check if username already exists
      const exists = await checkUsernameExists(username);
      if (exists) {
        setError('Username already taken. Please choose another.');
        setLoading(false);
        return;
      }

      // Update user document with username
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        username: username.toLowerCase(),
        usernameSet: true
      });

      toast.success('Username set successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error setting username:', error);
      setError('Failed to set username. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md" data-testid="username-setup-card">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Choose Your Username
          </CardTitle>
          <CardDescription className="text-base">
            Pick a unique username for your mincici profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                className="text-base"
                data-testid="username-input"
              />
              {error && (
                <p className="text-sm text-red-500 mt-2" data-testid="username-error">{error}</p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                3-20 characters, letters, numbers, and underscores only
              </p>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading || !username}
              data-testid="submit-username-btn"
            >
              {loading ? 'Setting up...' : 'Continue'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
