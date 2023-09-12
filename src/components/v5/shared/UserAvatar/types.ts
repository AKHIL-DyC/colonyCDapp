import { User } from '~types';
import { UserStatusMode } from '~v5/common/Pills/types';
import { AvatarSize } from '../Avatar/types';

export interface UserAvatarProps {
  userName?: string | null;
  preferThumbnail?: boolean;
  user?: User | null;
  isLink?: boolean;
  size?: AvatarSize;
  userStatus?: UserStatusMode | null;
  isContributorsList?: boolean;
  isAddressVerified?: boolean;
  isUserVerified?: boolean;
}
