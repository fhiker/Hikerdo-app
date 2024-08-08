import validate from '@/utils/functions/validate'
import type React from 'react'
import { useContext, useRef, useState } from 'react'
import { useCreateProject } from '@/utils/hooks/project/useCreateProject'
import { CreateProjectSchema } from './schemas'
import { currentTeamIdContext } from '@/contexts/currentTeamIdContext'
import { useTranslation } from 'react-i18next'

export const AddProjectButton = () => {
    const { currentTeamId } = useContext(currentTeamIdContext)
    // const [titleError, setTitleError] = useState<string | undefined>(undefined)
    const [createMode, setCreateMode] = useState<boolean>(false)
    const addInputRef = useRef<HTMLInputElement>(null)
    const createProject = useCreateProject()

    const { t } = useTranslation()

    const onKeyUpHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            console.log(e.currentTarget.value)
            const data = { title: e.currentTarget.value, teamId: currentTeamId }
            const validatedData = validate<typeof CreateProjectSchema>(data, CreateProjectSchema)
            const foundError = validatedData.errors.find(i => i.path.join('.') === e.currentTarget.name)
            if (foundError) {
                // setTitleError(foundError.message)
            } else {
                // setTitleError(undefined)
                createProject.mutate(validatedData.data)

                setCreateMode(false)

            }
        }
    }

    const handleBlur = () => {
        setCreateMode(false)
    }

    const handleAddButton = () => {
        setCreateMode(!createMode)
        setTimeout(() => {
            addInputRef.current?.focus()
        }, 0);
    }

    return (
        <div className="flex flex-col gap-2 text-white">
            <button type='button' onClick={handleAddButton} aria-label={'add project'} className={'flex items-center pl-3 py-2 rounded-lg hover:bg-gray-700'}>
                +
                <span aria-label='project' className="ms-3">{t('add project')}</span>
            </button>
            {createMode &&
                <input ref={addInputRef} name='AddProjectInput' onBlur={handleBlur} onKeyUp={onKeyUpHandler} className='pl-6 ml-2 mr-2 py-1 rounded-lg bg-[#1d232a] dark:bg-neutral' placeholder={t('new project')} />
            }
            {/* {createMode && titleError && <span className='text-error'>{titleError}</span>} */}
        </div>
    )
}
