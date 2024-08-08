import { Link, useNavigate } from 'react-router-dom'
import { useCurrentUser } from '@/utils/hooks/useCurrentUser'
import getInitials from '@/utils/functions/getNameInitials'
import useSignout from '@/utils/hooks/useSignOut'
import { useTranslation } from 'react-i18next'

const UserDropDown = () => {
    const { user, status } = useCurrentUser()
    const { signout } = useSignout()
    const { t } = useTranslation()
    const navigate = useNavigate()

    const handleSignOut = () => {
        signout()
    }

    const handleTouch = (url: string) => {
        navigate(url)
    }

    return (
        <>
            {status === 'pending' &&
                <div className="flex items-center justify-items-end gap-2">
                    <div className="skeleton h-10 w-10 shrink-0 rounded-full" />
                </div>
            }
            {status === 'success' &&
                < div className='text-white'>
                    <div className="dropdown dropdown-end flex gap-2">
                        <div tabIndex={0} role='button' className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-black rounded-full">
                            <span className="font-medium text-white">{user && getInitials(user.attributes.fullName)}</span>
                        </div>
                        <ul className="mt-12 z-[1] p-2 shadow menu menu-sm dropdown-content bg-black dark:bg-base-100 text-xl rounded-box w-52">
                            <li><Link onTouchEnd={() => handleTouch("/teams")} className='text-lg lg:text-sm' to="/teams">{t('manage teams')}</Link></li>
                            <li><Link onTouchEnd={() => handleTouch("/settings")} className='text-lg lg:text-sm' to="/settings">{t('settings')}</Link></li>
                            <li><Link onTouchEnd={() => handleTouch("/signin")} className='text-lg lg:text-sm' to="/signin" onClick={handleSignOut}>{t('logout')}</Link></li>
                        </ul>
                    </div>
                </div >
            }
        </>
    )
}

export default UserDropDown