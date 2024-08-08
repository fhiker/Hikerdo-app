import validate from '@/utils/functions/validate';
import type React from 'react'
import { type ChangeEvent, type Dispatch, type SetStateAction, useEffect, useRef, useState } from 'react'
import { UpdateTeamSchema } from './schemas';
import { useUpdateTeam } from '@/utils/hooks/team/useUpdateTeam';

interface Props {
    id: string;
    title: string;
    setEditMode: Dispatch<SetStateAction<boolean>>;
}

const EditTeamComponent = ({ id, title, setEditMode }: Props) => {
    const [titleValue, setTitleValue] = useState(title)
    const [titleError, setTitleError] = useState({ title: "" })
    const updateTeam = useUpdateTeam()
    const ref = useRef<(HTMLInputElement | null)>(null)

    useEffect(() => {
        setTimeout(() => {
            ref.current?.focus()
        }, 0)
    }, [])

    const onKeyUpHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const data = { title: e.currentTarget.value }
            const validatedData = validate<typeof UpdateTeamSchema>(data, UpdateTeamSchema)
            const foundError = validatedData.errors.find(i => i.path.join('.') === e.currentTarget.name)
            if (foundError) {
                setTitleError({ ...titleError, title: foundError.message })
            } else {
                console.log('update')
                updateTeam.mutate({ teamId: id, data: validatedData.data })
                setEditMode(false)
            }
        }
    }

    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        setTitleValue(e.target.value)
    }

    const handleBlur = () => {
        setTitleValue(title)
        setEditMode(false)
    }

    return (
        <>
            <input ref={ref} onBlur={handleBlur} onKeyUp={onKeyUpHandler} type="text" onChange={handleChange} placeholder={title} value={titleValue} className="input input-ghost w-full max-w-xs text-xl font-bold mt-5 -mb-2" />
            {titleError && <span>{titleError.title}</span>}
        </>
    )
}

export default EditTeamComponent