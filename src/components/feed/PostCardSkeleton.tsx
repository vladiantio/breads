import { Skeleton } from '../ui/skeleton';

interface PostCardSkeletonProps {
  isDetail?: boolean;
}

const PostCardSkeleton: React.FC<PostCardSkeletonProps> = ({
  isDetail = false,
}) => {
  return (
    <article>
      {isDetail ? (
        <div className="px-4 pb-4">
          <div className="flex items-center gap-x-4 mb-4">
            <Skeleton className="size-10 rounded-full" />

            <div className="flex-1 min-w-0">
              <Skeleton className="h-4 my-2 max-w-[16rem]" />
            </div>
          </div>

          <div className="space-y-3">
            <Skeleton className="h-4 my-2" />
            <Skeleton className="h-4 my-2 max-w-[8rem]" />
          </div>
        </div>
      ) : (
        <div className="flex p-4 gap-x-4">
          <Skeleton className="size-10 rounded-full" />

          <div className="flex-1 min-w-0 space-y-3">
            <Skeleton className="h-4 my-2 max-w-[16rem]" />
            <Skeleton className="h-4 my-2" />
            <Skeleton className="h-4 my-2 max-w-[8rem]" />
          </div>
        </div>
      )}
    </article>
  );
};

export { PostCardSkeleton };
