import validate from '@/utils/functions/validate'
import type React from 'react'
import { type Dispatch, type SetStateAction, useEffect, useRef, useState } from 'react'
import { useUpdateProject } from '@/utils/hooks/project/useUpdateProject'
import type { ProjectInterface } from '@/types/entities'
import { UpdateProjectSchema } from './schemas';

interface Props {
    project: ProjectInterface;
    setEditMode: Dispatch<SetStateAction<boolean>>;
}

const EditProjectComponent = (props: Props) => {
    const formDefaultErrors = { projectTitle: '' }
    const [titleError, setTitleError] = useState(formDefaultErrors)
    const ref = useRef<(HTMLInputElement | null)>(null);
    const updateProject = useUpdateProject()

    useEffect(() => {
        setTimeout(() => {
            ref.current?.focus()
        }, 0)
    }, [])

    const onKeyUpHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const data = { title: e.currentTarget.value }

            const validatedData = validate<typeof UpdateProjectSchema>(data, UpdateProjectSchema)
            const foundError = validatedData.errors.find(i => i.path.join('.') === e.currentTarget.name)
            if (foundError) {
                setTitleError({ ...titleError, projectTitle: foundError.message })
            } else {
                updateProject.mutate({ projectId: props.project.attributes.id, data: validatedData.data, teamId: props.project.attributes.teamId ? props.project.attributes.teamId : '' })
                props.setEditMode(false)
            }
        }
    }

    const handleBlur = (e: { target: { value: string; name: string }; }) => {
        const data = { title: e.target.value }

        const validatedData = validate<typeof UpdateProjectSchema>(data, UpdateProjectSchema)
        const foundError = validatedData.errors.find(i => i.path.join('.') === e.target.name)
        if (foundError) {
            setTitleError({ ...titleError, projectTitle: foundError.message })
        } else {
            updateProject.mutate({ projectId: props.project.attributes.id, data: validatedData.data, teamId: props.project.attributes.teamId ? props.project.attributes.teamId : '' })
            props.setEditMode(false)
        }
    }

    return (
        <label>
            <input ref={ref} name='title' className={'rounded-lg ml-2 pl-2'} onBlur={handleBlur} onKeyUp={onKeyUpHandler} placeholder={props.project.attributes.title} />
            {titleError.projectTitle && props.project.attributes.id && <div className="label">
                <span className="label-text-alt text-error -mt-2 pl-2 -mb-4">Must be at least 1 character</span>
            </div>}
        </label>
    )
}

export default EditProjectComponent