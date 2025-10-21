import { useState, useEffect } from 'react';
import { db } from '@/firebase/config';
import { collection, query, orderBy, getDocs, limit } from 'firebase/firestore';
import Navbar from '@/components/Navbar';
import { LeftSidebar, RightSidebar, MobileBottomNav } from '@/components/Sidebar';
import CreatePost from '@/components/CreatePost';
import Post from '@/components/Post';
import { FeedSkeleton } from '@/components/Skeleton';
import { useAuth } from '@/context/AuthContext';

export default function Feed() {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = async () => {
    try {
      const q = query(
        collection(db, 'posts'),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      const querySnapshot = await getDocs(q);
      const postsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-20 lg:pb-0">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
        <div className="flex gap-6">
          <LeftSidebar />
          
          <div className="flex-1 max-w-2xl mx-auto lg:mx-0">
            <CreatePost onPostCreated={loadPosts} />
            
            {loading ? (
              <FeedSkeleton />
            ) : posts.length === 0 ? (
              <div className="text-center py-12 text-gray-500" data-testid="no-posts-message">
                <p className="text-lg">No posts yet. Be the first to post!</p>
              </div>
            ) : (
              <div data-testid="posts-container">
                {posts.map(post => (
                  <Post key={post.id} post={post} postId={post.id} onPostDeleted={loadPosts} onPostUpdated={loadPosts} />
                ))}
              </div>
            )}
          </div>
          
          <RightSidebar />
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
}
