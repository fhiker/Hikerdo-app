import { createContext } from "react"

type createModalOpenContext = {
    isCreateModalOpen: boolean,
    setIsCreateModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

export const createModalContext = createContext<createModalOpenContext>({ setIsCreateModalOpen: () => { }, isCreateModalOpen: false })

type editModalOpenContext = {
    isEditModalOpen: boolean,
    setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const editModalContext = createContext<editModalOpenContext>({ setIsEditModalOpen: () => { }, isEditModalOpen: false })