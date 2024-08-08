import { AddMember } from '@/components/Teams/AddMember'
import TeamMemberCard from '@/components/Teams/TeamMemberCard'
import PrivateLayout from '@/layouts/PrivateLayout'
import getInitials from '@/utils/functions/getNameInitials'
import { useTeam } from '@/utils/hooks/team/useTeam'
import { useTeamMembers } from '@/utils/hooks/team/useTeamMembers'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

const MembersPage = () => {
    const { id } = useParams()
    const { teamData, teamsStatus } = useTeam()
    const { teamMembersData, teamMembersStatus } = useTeamMembers(id, 'user')
    const [addMode, setAddMode] = useState<boolean>(false)
    const { t } = useTranslation()

    const getOwnerId = () => {
        const currentTeam = teamData?.find((team) => team.attributes.id === id);
        const ownerId = currentTeam?.attributes.ownerId
        return ownerId
    }

    const getTeamName = (id: string) => {
        const foundTeam = teamData?.find((team) => team.attributes.id === id);
        const fullname = foundTeam?.attributes.title
        return fullname
    }

    return (
        <PrivateLayout>
            {addMode && <AddMember setAddMode={setAddMode} />}
            {teamsStatus === 'pending' && <div>loading...</div>}
            {teamsStatus === 'success' &&
                <div className='w-full xl:w-2/3 h-full pt-20 mb-16'>
                    <div className='flex justify-between mb-2'>
                        <div className='text-xl flex font-bold'>
                            {getTeamName(id ? id : '')}
                        </div>
                    </div>
                    <div className="p-4 sm:p-6 xl:p-9 2xl:p-15 border-t-2">
                        <div className="mx-auto w-full max-w-[1170px]">
                            <div className="grid grid-cols-1 gap-7.5 md:grid-cols-3 2xl:grid-cols-4 gap-4">
                                {teamMembersStatus === 'pending' &&
                                    <div>
                                        <div className="skeleton h-full w-full" />
                                    </div>
                                }
                                {teamMembersStatus === 'success' && <>
                                    {
                                        teamMembersData?.map((member) => {
                                            if ((member.attributes.hasUserAccepted)) {
                                                return <TeamMemberCard
                                                    key={member.id}
                                                    initials={getInitials(member.relationships.user.data.attributes.fullName)}
                                                    fullName={member.relationships.user.data.attributes.fullName}
                                                    id={member.id}
                                                    userId={member.attributes.userId}
                                                    owner={getOwnerId() === member.attributes.userId}
                                                />
                                            }
                                        })
                                    }
                                </>
                                }
                                <button type='button' onClick={() => { setAddMode(true) }} className="group rounded-[10px] h-80 flex items-center justify-center border border-neutral border-dashed bg-transparent">
                                    <h2 className="card-title">{`+ ${t('invite member')}`}</h2>
                                </button >
                            </div>
                        </div>

                    </div>
                </div>
            }
            {teamsStatus === 'error' && <div className='text-error'>Error getting team members!</div>}
        </PrivateLayout >
    )
}

export default MembersPage