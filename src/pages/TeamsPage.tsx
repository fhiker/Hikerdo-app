import { CreateTeam } from '@/components/Teams/CreateTeam'
import TeamCard from '@/components/Teams/TeamCard'
import PrivateLayout from '@/layouts/PrivateLayout'
import { useTeam } from '@/utils/hooks/team/useTeam'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const TeamPage = () => {
    const { teamData, teamsStatus } = useTeam()
    const [titleError, setTitleError] = useState<string | undefined>(undefined)
    const [createMode, setCreateMode] = useState<boolean>(false)
    const { t } = useTranslation()

    return (
        <PrivateLayout>
            {teamsStatus === 'pending' &&
                <div>
                    <div>
                        <div className="skeleton h-full w-full" />
                    </div>
                </div>
            }
            {teamsStatus === 'success' &&
                <div className='w-full xl:w-2/3 h-full pt-20 mb-16'>
                    <div className='flex justify-between mb-2'>
                        <div className='text-xl flex font-bold'>
                            {t('teams')}
                        </div>
                        <div className='-top-4 sm:relative md:block text-xl font-bold'>
                            {createMode && <CreateTeam setCreateMode={setCreateMode} />}
                            {titleError && <span>{titleError}</span>}
                            <button type='button' onClick={() => setCreateMode(!createMode)} className='btn btn-transparent rounded-full text-primary hover:text-white dark:hover:text-black hover:btn-primary text-lg'>
                                +
                            </button>
                        </div>
                    </div>
                    <div className="p-4 sm:p-6 xl:p-8 2xl:p-15 border-t-2">
                        <div className="mx-auto w-full max-w-[1170px]">
                            {teamsStatus === 'success' &&
                                <div className="grid grid-cols-1 gap-7.5 md:grid-cols-3 2xl:grid-cols-4 gap-4">
                                    {
                                        teamData?.map((team) => {
                                            return <TeamCard key={team.id} title={team.attributes.title} id={team.id} />
                                        })
                                    }
                                </div>
                            }
                        </div>

                    </div>
                </div>
            }
        </PrivateLayout >
    )
}

export default TeamPage