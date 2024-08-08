import { useDeleteTeamMember } from '@/utils/hooks/team/useDeleteTeamMember';
import { useTeamMemberRespond } from '@/utils/hooks/team/useTeamMemberRespond';
import { useCurrentUser } from '@/utils/hooks/useCurrentUser';
import { useNotifications } from '@/utils/hooks/useNotifications';
import { useState } from 'react'
import { useTranslation } from 'react-i18next';

const NotificationsDropDown = () => {
    const [isResponding, setIsResponding] = useState(false);
    const { user } = useCurrentUser()
    const { notifications, hasNewNotifications, fetchNotifications } = useNotifications();
    const memberAccept = useTeamMemberRespond()
    const memberDecline = useDeleteTeamMember()
    const { t } = useTranslation()

    const handleRespond = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const target = e.target as HTMLButtonElement;

        if (isResponding) return;

        setIsResponding(true);

        const notification = notifications?.find(
            notification => notification.attributes.userId === user?.id && !notification.attributes.hasUserAccepted
        );

        if (notification) {
            try {
                if (target.name === 'accept') {
                    await memberAccept.mutateAsync({ memberId: notification.id, data: { hasUserAccepted: true } });
                } else if (target.name === 'decline') {
                    await memberDecline.mutateAsync({ teamId: undefined, memberId: notification.id });
                }

                fetchNotifications();
            } catch (error) {
                console.error('Error responding to invitation:', error);
            }
        }
        setIsResponding(false);
    };


    return (
        <div className="dropdown dropdown-end flex justify-center">
            <div className='flex relative'>
                <button type='button' tabIndex={0} className='text-white border-solid rounded-full'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <title>Notification icon</title><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                    </svg>
                </button>
                <span className={`top-0 right-2 relative flex w-2 h-2 bg-red-500 rounded-full ${!hasNewNotifications && 'hidden'}`} />
            </div>
            {
                hasNewNotifications &&
                <ul className="gap-2 top-8 dropdown-content z-[1] menu p-2 shadow bg-black dark:bg-base-100 rounded-box w-52">
                    <div className='divider text-white'>
                        <p>{t('notifications')}</p>
                    </div>
                    {notifications?.map((notification) => {
                        return <li key={notification.id} className='bg-transparent items-center text-white'>
                            {`${t('team invitation')} ${notification.relationships.team.data.attributes.title}`}
                            <div className='hover:bg-transparent'>
                                <button
                                    type='button'
                                    name='accept'
                                    onClick={handleRespond}
                                    className="btn btn-xs btn-outline btn-success"
                                    disabled={isResponding}
                                >
                                    {t('accept')}
                                </button>
                                <button
                                    type='button'
                                    name='decline'
                                    onClick={handleRespond}
                                    className="btn btn-xs btn-outline btn-error"
                                    disabled={isResponding}
                                >
                                    {t('decline')}
                                </button>
                            </div>
                        </li>
                    })}
                </ul>
            }
            {
                !hasNewNotifications && <ul className="gap-2 top-8 dropdown-content z-[1] menu p-2 shadow bg-black dark:bg-base-100 rounded-box w-52">
                    <li className='bg-transparent items-center text-white'>
                        {t('no notifications')}
                    </li>
                </ul>
            }
        </div >
    );
}

export default NotificationsDropDown
