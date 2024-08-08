import { useState } from "react"
import { Link } from "react-router-dom"
import EditTeamComponent from "./EditTeamComponent"
import { useDeleteTeam } from "@/utils/hooks/team/useDeleteTeam"

type Props = {
    title: string,
    id: string
}

const TeamCard = ({ title, id }: Props) => {
    const [editMode, setEditMode] = useState(false)
    const deleteTeam = useDeleteTeam()

    const handleDeleteClick = () => {
        deleteTeam.mutate(id)
    }
    return (

        <div className="group rounded-[10px] border border-stroke px-4 pb-10 pt-12 dark:border-black bg-white dark:bg-neutral">
            <div className="relative z-1 mx-auto h-21 w-full max-w-30 rounded-full">

                <div className='flex flex-col items-center'>
                    <Link to={`/teams/${id}`} replace={true} type="button">
                        <div className=" rounded-full bg-black w-20 h-20 flex justify-center items-center">

                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 text-white"><title>team icon</title>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                            </svg>

                        </div>
                    </Link>
                    {!editMode &&
                        <Link to={`/teams/${id}`} replace={true} type="button">
                            <h2 className="mt-8 text-xl font-bold">{title}</h2>
                        </Link>}
                    {editMode && <EditTeamComponent id={id} title={title} setEditMode={setEditMode} />}

                    <div className="flex gap-8">
                        <button aria-label="delete-button" type='button' onClick={() => handleDeleteClick()} className="mt-4 rounded-xl pt-4">
                            <svg className="h-6 w-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><title>trash icon</title>  <polyline points="3 6 5 6 21 6" />  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />  <line x1="10" y1="11" x2="10" y2="17" />  <line x1="14" y1="11" x2="14" y2="17" /></svg>
                        </button>
                        <button type='button' onClick={() => setEditMode(!editMode)} className="mt-4 rounded-xl pt-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-warning"><title>edit icon</title>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                        </button>
                    </div>

                </div>

            </div>
        </div >
    )
}

export default TeamCard