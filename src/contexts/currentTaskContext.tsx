import type { TaskInterface } from "@/types/entities"
import { createContext } from "react"

type contextType = {
    currentTask: TaskInterface | undefined
    setCurrentTask: React.Dispatch<React.SetStateAction<TaskInterface | undefined>>
}

export const currentTaskContext = createContext<contextType>({ setCurrentTask: () => { }, currentTask: undefined })