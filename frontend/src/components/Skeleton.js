import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Card, CardContent } from '@/components/ui/card';

export function PostSkeleton() {
  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex gap-3">
          <Skeleton circle width={40} height={40} />
          <div className="flex-1">
            <Skeleton width={120} height={16} />
            <Skeleton width="100%" height={60} className="mt-2" />
            <div className="flex gap-4 mt-4">
              <Skeleton width={60} height={24} />
              <Skeleton width={60} height={24} />
              <Skeleton width={60} height={24} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function FeedSkeleton() {
  return (
    <div>
      {[1, 2, 3].map((i) => (
        <PostSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <Skeleton circle width={96} height={96} />
          <div className="flex-1">
            <Skeleton width={200} height={24} />
            <div className="flex gap-6 my-4">
              <Skeleton width={60} height={20} />
              <Skeleton width={80} height={20} />
              <Skeleton width={80} height={20} />
            </div>
            <Skeleton width="100%" height={60} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
