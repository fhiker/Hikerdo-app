import { useContext } from "react"
import DarkModeSwitcher from "@/components/Navbar/DarkModeSwitch"
import UserDropDown from "./UserDropDown"
import { sidebarContext } from "@/contexts/sidebarContext"
import { Link } from "react-router-dom"
import NotificationsDropDown from "./NotificationsDropDown"

type Props = {
    auth: boolean
}

const Navbar = ({ auth }: Props) => {
    const { isSidebarOpen, setIsSidebarOpen } = useContext(sidebarContext)
    return (
        <header className="fixed border-b border-black z-50 bg-[#1d232a] dark:bg-neutral p-4 navbar">
            <div className="flex items-center flex-1">
                {auth && <label className="lg:hidden swap swap-rotate bg-transparent mr-4 text-white">
                    <input type="checkbox" onChange={() => setIsSidebarOpen(!isSidebarOpen)} />
                    <svg className="swap-off fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><title>burger icon</title><path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" /></svg>
                    <svg className="swap-on fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><title>close icon</title><polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" /></svg>
                </label>}
                <Link className="flex" to='/'>
                    <img aria-label="logo" className="w-9 h-9" src="/Logo7.png" />
                    <h1 className="text-white pt-1 pl-2 pr-4 text-xl font-bold">Hikerdo</h1>
                </Link>
            </div>
            <div className="flex align-middle">
                <DarkModeSwitcher />

                {auth && <>
                    <NotificationsDropDown />
                    <UserDropDown />
                </>
                }
            </div>
        </header >
    )
}

export default Navbar