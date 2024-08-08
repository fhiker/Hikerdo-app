import { createContext } from "react"

type contextType = {
    currentTeamId: string | undefined
    setCurrentTeamId: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const currentTeamIdContext = createContext<contextType>({ setCurrentTeamId: () => { }, currentTeamId: undefined })