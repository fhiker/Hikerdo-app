import { useDeleteTeamMember } from '@/utils/hooks/team/useDeleteTeamMember'
import TeamsUserIcon from './OrganizationUserIcon'
import { currentTeamIdContext } from '@/contexts/currentTeamIdContext'
import { useContext } from 'react'
import { useCurrentUser } from '@/utils/hooks/useCurrentUser'

type Props = {
    initials: string,
    fullName: string,
    id: string,
    userId: string,
    owner: boolean
}

const TeamMemberCard = ({ initials, fullName, id, userId, owner }: Props) => {
    const { currentTeamId } = useContext(currentTeamIdContext)
    const { user, status } = useCurrentUser()
    const deleteMember = useDeleteTeamMember()
    const handleDeleteClick = () => {
        if (currentTeamId) {
            deleteMember.mutate({ teamId: currentTeamId, memberId: id })
        }
        if (userId === user?.id) {
            localStorage.setItem('selectedTeamId', '')
        }
    }
    if (status === 'pending') {
        return <div>Loading...</div>
    }
    return (
        <div className="group rounded-[10px] border border-stroke px-4 pb-10 pt-12 dark:border-black bg-white dark:bg-neutral">
            <div className="relative z-1 mx-auto h-21 w-full max-w-30 rounded-full">
                <div className='flex flex-col items-center'>
                    <TeamsUserIcon initials={initials} />
                    <h2 className="mt-4 card-title">{fullName}</h2>
                    <button disabled={owner} type='button' onClick={() => handleDeleteClick()} className={`mt-4 rounded-xl pt-4 ${owner && 'cursor-not-allowed'}`}>
                        <svg className="h-6 w-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><title>trash icon</title>  <polyline points="3 6 5 6 21 6" />  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />  <line x1="10" y1="11" x2="10" y2="17" />  <line x1="14" y1="11" x2="14" y2="17" /></svg>
                    </button>

                </div>
            </div>
        </div >
    )
}

export default TeamMemberCard