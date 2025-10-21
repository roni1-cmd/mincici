import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebase/config';
import { doc, updateDoc, arrayUnion, arrayRemove, collection, addDoc, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function Post({ post, postId, onPostDeleted }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [likes, setLikes] = useState(post.likes || []);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComment, setLoadingComment] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isLiked = likes.includes(currentUser?.uid);
  const isOwnPost = post.userId === currentUser?.uid;

  const handleLike = async () => {
    try {
      const postRef = doc(db, 'posts', postId);
      if (isLiked) {
        await updateDoc(postRef, {
          likes: arrayRemove(currentUser.uid)
        });
        setLikes(likes.filter(id => id !== currentUser.uid));
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(currentUser.uid)
        });
        setLikes([...likes, currentUser.uid]);
      }
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('Failed to like post');
    }
  };

  const loadComments = async () => {
    try {
      const q = query(collection(db, 'comments'), where('postId', '==', postId));
      const querySnapshot = await getDocs(q);
      const commentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      commentsData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      setComments(commentsData);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoadingComment(true);
    try {
      await addDoc(collection(db, 'comments'), {
        postId,
        userId: currentUser.uid,
        userName: currentUser.displayName,
        userPhoto: currentUser.photoURL,
        content: newComment.trim(),
        createdAt: new Date().toISOString()
      });

      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        commentCount: (post.commentCount || 0) + 1
      });

      setNewComment('');
      await loadComments();
      toast.success('Comment added!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setLoadingComment(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin + `/post/${postId}`);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    setDeleting(true);
    try {
      // Delete all comments for this post
      const commentsQuery = query(collection(db, 'comments'), where('postId', '==', postId));
      const commentsSnapshot = await getDocs(commentsQuery);
      const deleteCommentPromises = commentsSnapshot.docs.map(doc => 
        deleteDoc(doc.ref)
      );
      await Promise.all(deleteCommentPromises);

      // Delete the post
      await deleteDoc(doc(db, 'posts', postId));
      
      toast.success('Post deleted successfully');
      if (onPostDeleted) onPostDeleted();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
      setDeleting(false);
    }
  };

  useEffect(() => {
    if (showComments) {
      loadComments();
    }
  }, [showComments]);

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + 'y';
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + 'mo';
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + 'd';
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + 'h';
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + 'm';
    return Math.floor(seconds) + 's';
  };

  if (deleting) {
    return null;
  }

  return (
    <Card className="mb-4" data-testid={`post-${postId}`}>
      <CardContent className="pt-6">
        <div className="flex gap-3">
          <Avatar 
            className="w-10 h-10 cursor-pointer"
            onClick={() => navigate(`/profile/${post.userId}`)}
          >
            <AvatarImage src={post.userPhoto} />
            <AvatarFallback>{post.userName?.[0]}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span 
                  className="font-semibold cursor-pointer hover:underline"
                  onClick={() => navigate(`/profile/${post.userId}`)}
                  data-testid="post-user-name"
                >
                  {post.userName}
                </span>
                <span className="text-xs text-gray-500" data-testid="post-timestamp">
                  {timeAgo(post.createdAt)}
                </span>
              </div>
              
              {isOwnPost && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" data-testid="post-menu-btn">
                      <span className="material-icons text-lg">more_vert</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={handleDelete}
                      className="text-red-600"
                      data-testid="delete-post-btn"
                    >
                      <span className="material-icons text-sm mr-2">delete</span>
                      Delete Post
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            
            <p className="mt-2 text-sm" data-testid="post-content">{post.content}</p>
            
            {post.imageUrl && (
              <img 
                src={post.imageUrl} 
                alt="Post" 
                className="mt-3 rounded-lg w-full max-h-96 object-cover"
                data-testid="post-image"
              />
            )}
            
            <div className="flex items-center gap-6 mt-4 pt-3 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={isLiked ? 'text-red-500' : ''}
                data-testid="like-btn"
              >
                <span className={`material-icons text-base mr-1 ${isLiked ? 'filled' : ''}`}>
                  {isLiked ? 'favorite' : 'favorite_border'}
                </span>
                <span data-testid="like-count">{likes.length}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowComments(!showComments)}
                data-testid="comment-btn"
              >
                <span className="material-icons text-base mr-1">chat_bubble_outline</span>
                <span data-testid="comment-count">{post.commentCount || 0}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                data-testid="share-btn"
              >
                <span className="material-icons text-base mr-1">share</span>
                Share
              </Button>
            </div>
            
            {showComments && (
              <div className="mt-4 space-y-4" data-testid="comments-section">
                <form onSubmit={handleComment} className="flex gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={currentUser?.photoURL} />
                    <AvatarFallback>{currentUser?.displayName?.[0]}</AvatarFallback>
                  </Avatar>
                  <Textarea
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[60px] resize-none"
                    data-testid="comment-textarea"
                  />
                  <Button 
                    type="submit" 
                    size="icon"
                    disabled={loadingComment || !newComment.trim()}
                    data-testid="comment-submit-btn"
                  >
                    <span className="material-icons text-base">send</span>
                  </Button>
                </form>
                
                <div className="space-y-3">
                  {comments.map(comment => (
                    <div key={comment.id} className="flex gap-2" data-testid={`comment-${comment.id}`}>
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={comment.userPhoto} />
                        <AvatarFallback>{comment.userName?.[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{comment.userName}</span>
                          <span className="text-xs text-gray-500">{timeAgo(comment.createdAt)}</span>
                        </div>
                        <p className="text-sm mt-1">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
