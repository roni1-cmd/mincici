import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '@/firebase/config';
import { doc, getDoc, collection, query, where, getDocs, orderBy, addDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { MobileBottomNav } from '@/components/Sidebar';
import Post from '@/components/Post';
import { ProfileSkeleton, PostSkeleton } from '@/components/Skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function Profile() {
  const { userId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState('');

  const isOwnProfile = currentUser?.uid === userId;

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        setUser(userData);
        setBio(userData.bio || '');
      }

      const postsQuery = query(
        collection(db, 'posts'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const postsSnap = await getDocs(postsQuery);
      setPosts(postsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const followersQuery = query(
        collection(db, 'follows'),
        where('followingId', '==', userId)
      );
      const followersSnap = await getDocs(followersQuery);
      setFollowers(followersSnap.docs.map(doc => doc.data().followerId));

      const followingQuery = query(
        collection(db, 'follows'),
        where('followerId', '==', userId)
      );
      const followingSnap = await getDocs(followingQuery);
      setFollowing(followingSnap.docs.map(doc => doc.data().followingId));

      if (currentUser && currentUser.uid !== userId) {
        const isFollowingQuery = query(
          collection(db, 'follows'),
          where('followerId', '==', currentUser.uid),
          where('followingId', '==', userId)
        );
        const isFollowingSnap = await getDocs(isFollowingQuery);
        setIsFollowing(!isFollowingSnap.empty);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        const followQuery = query(
          collection(db, 'follows'),
          where('followerId', '==', currentUser.uid),
          where('followingId', '==', userId)
        );
        const followSnap = await getDocs(followQuery);
        followSnap.forEach(async (document) => {
          await deleteDoc(doc(db, 'follows', document.id));
        });
        setIsFollowing(false);
        setFollowers(followers.filter(id => id !== currentUser.uid));
        toast.success('Unfollowed');
      } else {
        await addDoc(collection(db, 'follows'), {
          followerId: currentUser.uid,
          followingId: userId,
          createdAt: new Date().toISOString()
        });
        setIsFollowing(true);
        setFollowers([...followers, currentUser.uid]);
        toast.success('Following');
      }
    } catch (error) {
      console.error('Error following/unfollowing:', error);
      toast.error('Action failed');
    }
  };

  const handleSaveBio = async () => {
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, { bio });
      setUser({ ...user, bio });
      setEditingBio(false);
      toast.success('Bio updated!');
    } catch (error) {
      console.error('Error updating bio:', error);
      toast.error('Failed to update bio');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-20 lg:pb-0">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <ProfileSkeleton />
          <div className="space-y-4">
            <PostSkeleton />
            <PostSkeleton />
          </div>
        </div>
        <MobileBottomNav />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-20 lg:pb-0">
        <Navbar />
        <div className="text-center py-12">
          <p>User not found</p>
        </div>
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-20 lg:pb-0">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="mb-6" data-testid="profile-card">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <Avatar className="w-24 h-24" data-testid="profile-avatar">
                <AvatarImage src={user.photoURL} />
                <AvatarFallback className="text-2xl">{user.displayName?.[0]}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold" data-testid="profile-name">{user.displayName}</h1>
                  {!isOwnProfile && (
                    <Button
                      onClick={handleFollow}
                      variant={isFollowing ? 'outline' : 'default'}
                      data-testid="follow-btn"
                    >
                      {isFollowing ? (
                        <><span className="material-icons text-base mr-2">person_remove</span>Unfollow</>
                      ) : (
                        <><span className="material-icons text-base mr-2">person_add</span>Follow</>
                      )}
                    </Button>
                  )}
                </div>
                
                <div className="flex gap-6 mb-4">
                  <div data-testid="posts-count">
                    <span className="font-bold">{posts.length}</span>
                    <span className="text-gray-600 ml-1">Posts</span>
                  </div>
                  <div data-testid="followers-count">
                    <span className="font-bold">{followers.length}</span>
                    <span className="text-gray-600 ml-1">Followers</span>
                  </div>
                  <div data-testid="following-count">
                    <span className="font-bold">{following.length}</span>
                    <span className="text-gray-600 ml-1">Following</span>
                  </div>
                </div>
                
                {editingBio ? (
                  <div className="space-y-2">
                    <Textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Write your bio..."
                      className="min-h-[80px]"
                      data-testid="bio-textarea"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveBio} data-testid="save-bio-btn">
                        <span className="material-icons text-base mr-2">save</span>
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingBio(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-700" data-testid="profile-bio">
                      {user.bio || (isOwnProfile ? 'No bio yet. Click edit to add one!' : 'No bio')}
                    </p>
                    {isOwnProfile && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingBio(true)}
                        className="mt-2"
                        data-testid="edit-bio-btn"
                      >
                        <span className="material-icons text-base mr-2">edit</span>
                        Edit Bio
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4" data-testid="user-posts">
          <h2 className="text-xl font-bold">Posts</h2>
          {posts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                No posts yet
              </CardContent>
            </Card>
          ) : (
            posts.map(post => <Post key={post.id} post={post} postId={post.id} onPostDeleted={loadProfile} onPostUpdated={loadProfile} />)
          )}
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
}
