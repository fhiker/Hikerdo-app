import { createContext } from "react"

type contextType = {
    currentTaskListId: string | undefined
    setCurrentTaskListId: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const currentTaskListContextId = createContext<contextType>({ setCurrentTaskListId: () => { }, currentTaskListId: undefined })