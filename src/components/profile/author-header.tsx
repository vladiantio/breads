import { FC } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from '@tanstack/react-router';
import { User } from '@/types/response-schema';
import { Button } from '@/ui/button';
import { sanitizeHandle } from '@/lib/atp/strings/handles';
import { Trans } from '@lingui/react/macro';

interface AuthorHeaderProps {
  user: Partial<User>;
  isCurrentUser?: boolean;
}

const AuthorHeader: FC<AuthorHeaderProps> = ({
  user,
  isCurrentUser = false,
}) => {
  const { history } = useRouter();

  return (
    <div className="sticky top-0 z-[2] bg-background px-4 h-16 flex items-center justify-between gap-x-4">
      <Button
        variant="ghost"
        className="rounded-full !p-2 -ml-1"
        onClick={() => history.go(-1)}
      >
        <ArrowLeft className="size-5" />
      </Button>
      <div className="text-center text-sm overflow-hidden [&>*]:truncate">
        {user.displayName && (
          <p className="font-semibold">{user.displayName}</p>
        )}
        {user.username && (
          <p className="text-muted-foreground">{sanitizeHandle(user.username, '@')}</p>
        )}
      </div>
      <div className="flex items-center">
        {!isCurrentUser ? (
          <Button size="sm">
            <Trans>Follow</Trans>
          </Button>
        ) : (
          <Button size="sm" variant="outline">
            <Trans>Edit profile</Trans>
          </Button>
        )}
      </div>
    </div>
  );
};

export { AuthorHeader };
