import { sidebarContext } from '@/contexts/sidebarContext';
import { useTeam } from '@/utils/hooks/team/useTeam';
import type React from 'react'
import { useContext, useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { TeamInterface } from '@/types/entities';
import { ProjectsList } from '../Project/ProjectsList'; import { currentTeamIdContext } from '@/contexts/currentTeamIdContext';
import { AddProjectButton } from '../Project/AddProjectButton';
import { useTranslation } from 'react-i18next';

const SideBar = () => {
    const { isSidebarOpen } = useContext(sidebarContext);
    const { currentTeamId, setCurrentTeamId } = useContext(currentTeamIdContext)
    const { teamData, teamsStatus } = useTeam()
    const ownerId = teamData ? teamData[0]?.attributes.ownerId : undefined
    const [selectedTeamId, setSelectedTeamId] = useState<string | undefined>(() => {
        return localStorage.getItem('selectedTeamId') || undefined;
    });

    const pathName = useLocation().pathname
    const { t } = useTranslation();


    useMemo(() => {
        const length = teamData?.length ? teamData?.length - 1 : 0
        const teamId = teamData ? teamData[length]?.attributes.id : undefined

        if (teamsStatus === 'success' && Array.isArray(teamData)) {
            const currentTeamExits = teamData?.find((team) => team.id === selectedTeamId)
            if (!currentTeamExits) {
                setSelectedTeamId(teamId)
                setCurrentTeamId(teamId)
            }
        }
    }, [teamsStatus, teamData, selectedTeamId, setCurrentTeamId])

    useEffect(() => {
        if (selectedTeamId !== undefined) {
            localStorage.setItem('selectedTeamId', selectedTeamId);
        }
    }, [selectedTeamId]);

    useEffect(() => {
        setCurrentTeamId((() => {
            return localStorage.getItem('selectedTeamId') || undefined;
        }))
    }, [setCurrentTeamId])

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTeamId(e.target.value)
        setCurrentTeamId(e.target.value)
    }
    return (
        <aside id="sidebar" className={`border-r border-black fixed top-0 left-0 bg-[#1d232a] dark:bg-neutral z-40 w-64 h-screen pt-24 transition-transform lg:-translate-x-0 ${isSidebarOpen ? "-translate-x-0" : "-translate-x-full"}`} aria-label="Sidebar">
            <div className="h-full px-3 pb-4 overflow-y-auto">
                <ul className="space-y-2 font-medium">
                    <li>
                        <div className="border-b border-gray-500 pb-6 mb-3">
                            <Link to="/" aria-label='home' className={`flex items-center p-2 rounded-lg text-white ${pathName !== '/home' && "hover:bg-gray-700"} ${pathName === '/' && 'bg-gray-700'} group`}>
                                <svg className="w-5 h-5 transition duration-75" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                                    <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                                    <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                                </svg>
                                <span className="ms-3">{t('dashboard')}</span>
                            </Link>
                        </div>
                    </li>
                    <li>
                        {teamsStatus === 'pending' && <span className="loading loading-dots loading-md" />}
                        {teamsStatus === 'success' &&
                            <form className="max-w-full mx-auto">
                                <select aria-label='team-selector' id="teams"
                                    className="bg-transparent border-0 outline-none text-white rounded-lg block w-full p-2"

                                    value={currentTeamId}
                                    onChange={(e) => { handleChange(e) }}
                                >
                                    {teamData?.map((team: TeamInterface) => {
                                        return <option key={team.attributes.id} value={team.attributes.id}>{team.attributes.title}</option>
                                    })}
                                </select>
                            </form>
                        }
                    </li>
                    <li>
                        <AddProjectButton />
                        <ProjectsList ownerId={ownerId} />
                    </li>
                </ul>
            </div>
        </aside >
    )
}

export default SideBar