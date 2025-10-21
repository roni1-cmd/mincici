import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '@/firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { MobileBottomNav } from '@/components/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { uploadToCloudinary } from '@/config/cloudinary';
import { toast } from 'sonner';

export default function Settings() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [userData, setUserData] = useState({
    displayName: '',
    username: '',
    bio: '',
    photoURL: ''
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setUserData({
          displayName: data.displayName || '',
          username: data.username || '',
          bio: data.bio || '',
          photoURL: data.photoURL || ''
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const imageUrl = await uploadToCloudinary(file);
      setUserData({ ...userData, photoURL: imageUrl });
      toast.success('Photo uploaded successfully!');
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo. Please check your Cloudinary settings.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        displayName: userData.displayName,
        bio: userData.bio,
        photoURL: userData.photoURL
      });
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-20 lg:pb-0">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card data-testid="settings-card">
          <CardHeader>
            <CardTitle className="text-2xl">Settings</CardTitle>
            <CardDescription>Manage your mincici profile settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Avatar className="w-24 h-24" data-testid="settings-avatar">
                <AvatarImage src={userData.photoURL} />
                <AvatarFallback className="text-2xl">{userData.displayName?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left">
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <Button type="button" variant="outline" disabled={uploading} asChild>
                    <span data-testid="upload-photo-btn">
                      <span className="material-icons text-base mr-2">upload</span>
                      {uploading ? 'Uploading...' : 'Change Photo'}
                    </span>
                  </Button>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">Max size: 5MB</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Display Name</label>
              <Input
                type="text"
                value={userData.displayName}
                onChange={(e) => setUserData({ ...userData, displayName: e.target.value })}
                placeholder="Your display name"
                data-testid="display-name-input"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Username</label>
              <Input
                type="text"
                value={userData.username}
                disabled
                className="bg-gray-100"
                data-testid="username-display"
              />
              <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Bio</label>
              <Textarea
                value={userData.bio}
                onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                placeholder="Tell us about yourself"
                className="min-h-[100px]"
                maxLength={200}
                data-testid="bio-textarea"
              />
              <p className="text-xs text-gray-500 mt-1">
                {userData.bio.length}/200 characters
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={handleSave}
                disabled={loading}
                className="flex-1"
                data-testid="save-settings-btn"
              >
                <span className="material-icons text-base mr-2">save</span>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex-1"
                data-testid="logout-btn"
              >
                <span className="material-icons text-base mr-2">logout</span>
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <MobileBottomNav />
    </div>
  );
}
