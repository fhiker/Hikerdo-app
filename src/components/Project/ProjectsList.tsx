import ProjectListItem from './ProjectListItem'
import type { ProjectInterface } from '@/types/entities'
import { useProjects } from '@/utils/hooks/project/useProjects'
import { currentTeamIdContext } from '@/contexts/currentTeamIdContext'
import { useContext } from 'react'

interface Props {
    ownerId: string | undefined
    iconSize?: number
}

export const ProjectsList = ({ ownerId, iconSize }: Props) => {
    const { currentTeamId } = useContext(currentTeamIdContext)
    const { projectsData, projectsStatus } = useProjects(currentTeamId)

    return (
        <>
            {projectsStatus === 'pending' &&
                <div>
                    <div className="flex items-center gap-4 pl-2">
                        <div className="skeleton h-5 w-5 shrink-0 rounded-lg" data-testid="skeleton-1" />
                        <div className="flex flex-col gap-4">
                            <div className="skeleton h-4 w-20" data-testid="skeleton-2" />
                        </div>
                    </div>
                </div>
            }
            {projectsStatus === 'success' && <>
                {projectsData?.map((project: ProjectInterface) => {
                    return <ProjectListItem key={project.id} iconSize={iconSize} ownerId={ownerId} project={project}
                    />
                })}
            </>
            }
        </>
    )
}
