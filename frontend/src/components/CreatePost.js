import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebase/config';
import { uploadToCloudinary } from '@/config/cloudinary';
import { collection, addDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Image, Send, X } from 'lucide-react';
import { toast } from 'sonner';

export default function CreatePost({ onPostCreated }) {
  const { currentUser } = useAuth();
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !image) {
      toast.error('Please add some content or an image');
      return;
    }

    setLoading(true);
    try {
      let imageUrl = null;
      
      if (image) {
        imageUrl = await uploadToCloudinary(image);
      }

      await addDoc(collection(db, 'posts'), {
        userId: currentUser.uid,
        userName: currentUser.displayName,
        userPhoto: currentUser.photoURL,
        content: content.trim(),
        imageUrl,
        likes: [],
        commentCount: 0,
        createdAt: new Date().toISOString()
      });

      setContent('');
      setImage(null);
      setImagePreview(null);
      toast.success('Post created successfully!');
      if (onPostCreated) onPostCreated();
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-4 sm:mb-6" data-testid="create-post-card">
      <CardContent className="pt-4 sm:pt-6">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2 sm:gap-4">
            <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
              <AvatarImage src={currentUser?.photoURL} />
              <AvatarFallback>{currentUser?.displayName?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[80px] sm:min-h-[100px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm sm:text-base"
                data-testid="create-post-textarea"
              />
              
              {imagePreview && (
                <div className="relative mt-3 sm:mt-4 rounded-lg overflow-hidden">
                  <img src={imagePreview} alt="Preview" className="w-full max-h-64 sm:max-h-96 object-cover" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 sm:h-10 sm:w-10"
                    onClick={removeImage}
                    data-testid="remove-image-btn"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
              
              <div className="flex items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Button type="button" variant="ghost" size="sm" asChild>
                    <span data-testid="upload-image-btn" className="text-xs sm:text-sm">
                      <Image className="w-4 h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Add Photo</span>
                    </span>
                  </Button>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
                
                <Button 
                  type="submit" 
                  disabled={loading || (!content.trim() && !image)}
                  size="sm"
                  data-testid="post-submit-btn"
                  className="text-xs sm:text-sm"
                >
                  <Send className="w-4 h-4 mr-1 sm:mr-2" />
                  {loading ? 'Posting...' : 'Post'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
