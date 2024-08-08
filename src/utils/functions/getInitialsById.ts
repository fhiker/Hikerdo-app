import type { IncludedUserInterface, TaskInterface } from '@/types/entities';
import getInitials from './getNameInitials';

export function getInitialsById(
  data: {
    data?: TaskInterface[];
    included?: IncludedUserInterface[];
  },
  targetId: string,
) {
  console.log(data);
  const user = data.included?.find((item) => item.type === 'users' && item.id === targetId);

  if (user && 'attributes' in user && 'fullName' in user.attributes) {
    return getInitials(user.attributes.fullName);
  }

  return null;
}
