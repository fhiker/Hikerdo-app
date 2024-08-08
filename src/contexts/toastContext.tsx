import { createContext } from "react"

export type ToastType = { message: string, type: 'error' | 'notify' | 'success' | 'warning', id: number }

type ToastContextType = {
    toasts: ToastType[],
    setToasts: React.Dispatch<React.SetStateAction<ToastType[]>>
}

export const toastContext = createContext<ToastContextType>({ setToasts: () => { }, toasts: [] })