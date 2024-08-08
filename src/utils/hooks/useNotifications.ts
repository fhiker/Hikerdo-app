import axiosInstance from '@/api/api-client';
import type { TeamMembersInterface } from '@/types/entities';
import type { statusType } from '@/types/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';

type UseNotificationsReturnType = {
  notifications: TeamMembersInterface[];
  hasNewNotifications: boolean;
  notificationsStatus: statusType;
  fetchNotifications: () => void;
};

const fetchNotifications = async () => {
  const response = await axiosInstance.get('/team-members', {
    params: {
      teamId: undefined,
      include: 'team',
    },
  });
  return response.data.data;
};

export const useNotifications = (): UseNotificationsReturnType => {
  const queryClient = useQueryClient();

  const { data, status } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // 30 seconds
    select: (data: TeamMembersInterface[]) => data.filter((member) => member.attributes.hasUserAccepted === false),
  });

  const notifications = data || [];
  const hasNewNotifications = notifications.length > 0;

  const fetchNotificationsManually = () => {
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  };

  return {
    notifications,
    hasNewNotifications,
    notificationsStatus: status,
    fetchNotifications: fetchNotificationsManually,
  };
};
