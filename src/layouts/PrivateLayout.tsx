import Navbar from '@/components/Navbar/Navbar'
import SideBar from '@/components/Sidebar/SideBar'
import Toast from '@/components/Toast/Toast'
import { currentTeamIdContext } from '@/contexts/currentTeamIdContext'
import { sidebarContext } from '@/contexts/sidebarContext'
import { type ToastType, toastContext } from '@/contexts/toastContext'
import { useCurrentUser } from '@/utils/hooks/useCurrentUser'
import i18n from '../../i18n'
import type React from 'react'
import { useState } from 'react'

type Props = {
    children: React.ReactNode
}

const PrivateLayout = ({ children }: Props) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [currentTeamId, setCurrentTeamId] = useState<string | undefined>(undefined)
    const [toasts, setToasts] = useState<ToastType[]>([])
    const { status } = useCurrentUser()
    const authLogin = status === 'success'

    if (!i18n.isInitialized) {
        return <div>Loadin translations...</div>
    }
    return (

        <div>
            {status === 'success' &&
                <sidebarContext.Provider value={{ isSidebarOpen, setIsSidebarOpen }}>
                    <Navbar auth={authLogin} />
                    <toastContext.Provider value={{ toasts, setToasts }}>
                        <currentTeamIdContext.Provider value={{ currentTeamId, setCurrentTeamId }}>
                            <SideBar />
                            <main id="layout">
                                <div className="p-4 lg:ml-64 min-h-dvh h-full flex justify-center items-center">
                                    <Toast />
                                    {children}
                                </div>
                            </main>
                        </currentTeamIdContext.Provider>
                    </toastContext.Provider>
                </sidebarContext.Provider>
            }
        </div >
    )
}

export default PrivateLayout