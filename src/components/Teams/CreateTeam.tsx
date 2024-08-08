import validate from '@/utils/functions/validate'
import { type ChangeEvent, type Dispatch, type SetStateAction, useState } from 'react'
import { CreateTeamSchema } from './schemas'
import { useCreateTeam } from '@/utils/hooks/team/useCreateTeam'
import { useTranslation } from 'react-i18next'

interface Props {
    setCreateMode: Dispatch<SetStateAction<boolean>>
}

export const CreateTeam = ({ setCreateMode }: Props) => {
    const [titleError, setTitleError] = useState<{ title: string } | undefined>(undefined)
    const [formValues, setFormValues] = useState<{ title: string }>({ title: '' })
    const createTeam = useCreateTeam()
    const { t } = useTranslation()


    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleBlur = (e: { currentTarget: { name: string } }) => {
        const validatedData = validate<typeof CreateTeamSchema>(formValues, CreateTeamSchema)
        const foundError = validatedData.errors.find(i => i.path.join('.') === e.currentTarget.name)
        if (foundError) {
            setTitleError({ title: foundError.message })
        } else {
            setTitleError(undefined)
        }
    }

    const handleSubmit = () => {
        const validatedData = validate<typeof CreateTeamSchema>(formValues, CreateTeamSchema)
        const foundError = validatedData.errors.find(i => i.path.join('.') === formValues.title)
        if (foundError) {
            setTitleError({ title: foundError.message })
        } else {
            setTitleError(undefined)
            createTeam.mutate({ title: validatedData.data.title })
            setCreateMode(false)
        }
    }

    return (
        <div className="fixed left-0 top-0 z-50 flex h-screen w-full justify-center overflow-y-scroll bg-black/80 px-4 py-5">
            <div className="relative m-auto w-full md:w-1/3 rounded-md border border-black bg-white p-4 dark:bg-neutral sm:p-8 xl:p-10">
                <button type="button" onClick={() => setCreateMode(false)} className="absolute right-1 top-1 sm:right-5 sm:top-5">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <title>cross icon</title><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label aria-label='team' className="mb-2 block font-medium text-black dark:text-white">
                            {t('team')}
                        </label>
                        <label className="input input-bordered flex items-center gap-2">
                            <input aria-label='title-input' name="title" type="text" onBlur={handleBlur} onChange={handleChange} className="grow" placeholder={t('team title')} />
                        </label>
                        {titleError && <span aria-label='title-error' className="text-sm text-red-500">{titleError.title}</span>}
                    </div>
                    <button aria-label='create team' type='submit' className='w-full btn btn-primary text-white dark:text-black mb-4'>
                        {t('create team')}
                    </button>
                </form>
            </div >
        </div>
    )
}
