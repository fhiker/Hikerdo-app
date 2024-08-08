import MyTasksTablist from '@/components/MyTasksTablist/MyTasksTablist'
import PrivateLayout from '@/layouts/PrivateLayout'
import { useCurrentUser } from '@/utils/hooks/useCurrentUser'
import { useTranslation } from 'react-i18next';

const HomePage = () => {
    const { user, status } = useCurrentUser()
    const { t } = useTranslation();

    return (
        <PrivateLayout>
            <div className='overflow-hidden w-full h-full'>
                <div className='flex flex-col items-center'>
                    {status === 'success' &&
                        <div className='text-2xl pb-8'>
                            {`${t('greeting')} ${user?.attributes.fullName}!`}
                        </div>}
                    {status === 'pending' &&
                        <div className='text-2xl pb-8'>
                            <span role='status' className="loading loading-spinner loading-md" />
                        </div>}
                    <div className='flex w-full justify-center'>
                        <div className='flex flex-col border border-black lg:w-1/2 h-96 bg-white dark:bg-neutral rounded-lg'>
                            <div className="py-4 px-7 rounded-t-lg bg-black text-white">
                                <h3 className="font-medium">
                                    {t('tasks assigned to me')}
                                </h3>
                            </div>
                            <MyTasksTablist />
                        </div>
                    </div>
                </div>
            </div >
        </PrivateLayout >
    )
}

export default HomePage