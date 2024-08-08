import { createContext } from "react"

type sidebarContextType = {
    isSidebarOpen: boolean,
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const sidebarContext = createContext<sidebarContextType>({ setIsSidebarOpen: () => { }, isSidebarOpen: false })