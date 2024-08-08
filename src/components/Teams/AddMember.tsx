
import validate from '@/utils/functions/validate'
import { type ChangeEvent, useState, type Dispatch, type SetStateAction, useContext } from 'react'
import { CreateTeamMemberSchema } from './schemas'
import { currentTeamIdContext } from '@/contexts/currentTeamIdContext'
import { useInviteTeamMember } from '@/utils/hooks/team/useInviteTeamMember'

interface Props {
    setAddMode: Dispatch<SetStateAction<boolean>>
}

export const AddMember = ({ setAddMode }: Props) => {
    // const { user, status } = useCurrentUser()
    const { currentTeamId } = useContext(currentTeamIdContext)
    const [formValues, setFormValues] = useState<{ email: string, teamId: string }>({ email: '', teamId: currentTeamId ? currentTeamId : '' })
    const [titleError, setTitleError] = useState<{ email: string } | undefined>(undefined)
    const inviteMember = useInviteTeamMember()

    const onKeyUpHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const validatedData = validate<typeof CreateTeamMemberSchema>(formValues, CreateTeamMemberSchema)
            const foundError = validatedData.errors.find(i => i.path.join('.') === e.currentTarget.name)

            if (foundError) {
                setTitleError({ email: foundError.message })
            } else {
                setTitleError(undefined)
            }
        }
    }

    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleBlur = (e: { currentTarget: { name: string } }) => {
        const validatedData = validate<typeof CreateTeamMemberSchema>(formValues, CreateTeamMemberSchema)
        const foundError = validatedData.errors.find(i => i.path.join('.') === e.currentTarget.name)

        if (foundError) {
            setTitleError({ email: foundError.message })
        } else {
            setTitleError(undefined)
        }
    }

    const handleSubmit = () => {
        const validatedData = validate<typeof CreateTeamMemberSchema>(formValues, CreateTeamMemberSchema)
        const foundError = validatedData.errors.find(i => i.path.join('.') === 'email')

        if (foundError) {
            setTitleError({ email: foundError.message })
        } else {
            if (currentTeamId) {
                setTitleError(undefined)
                inviteMember.mutate({ email: validatedData.data.email, teamId: currentTeamId }, {
                    onSuccess: () => {
                        setAddMode(false)
                    },
                    onError: (error) => {
                        //@ts-ignore
                        setTitleError({ email: error.response?.data.errors[0].details })
                    }
                })
            }
        }
    }

    return (
        <div className="fixed left-0 top-0 z-50 flex h-screen w-full justify-center overflow-y-scroll bg-black/80 px-4 py-5">
            <div className="relative m-auto w-full md:w-1/3 rounded-md border border-black bg-white p-4 dark:bg-neutral sm:p-8 xl:p-10">
                <button type="button" onClick={() => setAddMode(false)} className="absolute right-1 top-1 sm:right-5 sm:top-5">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <title>cross icon</title><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="mb-4">
                    <label className="mb-2 block font-medium text-black dark:text-white">
                        Email
                    </label>
                    <label className={`input input-bordered flex items-center gap-2 ${titleError?.email && 'input-error'}`}>
                        <input aria-label='email-input' onKeyUp={onKeyUpHandler} onChange={handleChange} onBlur={handleBlur} name="email" type="email" className='grow' placeholder="Member email" />
                    </label>
                    {titleError?.email && <span className='text-error'>{titleError.email}</span>}
                </div>
                <button type='button' onClick={handleSubmit} className='w-full btn btn-primary text-white dark:text-black mb-4'>
                    Invite Member
                </button>
            </div >
        </div>
    )
}
