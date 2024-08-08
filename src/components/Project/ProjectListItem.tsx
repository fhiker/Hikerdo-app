import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import ProjectIcon from '../Sidebar/ProjectIcon';
import { useDeleteProject } from '@/utils/hooks/project/useDeleteProject';
import EditProjectComponent from './EditProjectComponent';
import type { ProjectInterface } from '@/types/entities';
import { useTranslation } from 'react-i18next';

interface Props {
    project: ProjectInterface
    iconSize?: number
    ownerId?: string | undefined
}
const ProjectListItem = ({ project, iconSize, ownerId }: Props) => {
    const [editMode, setEditMode] = useState<boolean>(false)
    const pathName = useLocation().pathname
    const deleteProject = useDeleteProject()
    const { t } = useTranslation();

    const handleEditClick = () => {
        setEditMode(true)
    }

    const handleDelete = () => {
        if (project.attributes.teamId) {
            const projectId = project.id
            const teamId = project.attributes.teamId;

            deleteProject.mutate(
                { projectId, teamId }
            )
        } else {
            console.log('No teamId found');
        }
    };

    return (<div className={`flex justify-between group rounded-lg ${pathName !== `/project/${project.attributes.id}` && "hover:bg-gray-700"} ${pathName === `/project/${project.attributes.id}` && 'bg-gray-700'}`}>
        <Link to={`/project/${project.attributes.id}`} replace={true} key={project.attributes.id} aria-label={project.attributes.id} className={'flex items-center w-full pl-3 py-2 rounded-lg group'}>
            <ProjectIcon size={iconSize ? iconSize : 4} iconColor={project.attributes.iconColor} />
            {editMode && <EditProjectComponent project={project} setEditMode={setEditMode} />}
            {!editMode && <span aria-label='project' className={'ms-3 text-white'}>{project.attributes.title}</span>}
        </Link>
        {!editMode && ownerId &&
            <div className="dropdown dropdown-end text-primary invisible group-hover:visible ">
                <div tabIndex={0} role="button">
                    <svg className="h-8 w-8 pt-2 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" />  <circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /><title>more icon</title></svg>
                </div>
                <ul className="dropdown-content z-[1] menu p-2 pt-4 shadow bg-neutral dark:bg-[#1d232a] rounded-box w-52">
                    <li>
                        <button type='button' onTouchEnd={handleEditClick} onClick={handleEditClick} className='text-warning'>{t('edit')}</button>
                    </li>
                    <li>
                        <button type='button' onTouchEnd={handleDelete} onClick={handleDelete} className='text-error'>{t('delete')}</button>
                    </li>
                </ul>
            </div>
        }
    </div>
    )
}

export default ProjectListItem