import Navbar from "@/components/Navbar/Navbar"

type Props = {
    children: React.ReactNode
}
const PublicLayout = ({ children }: Props) => {
    return (
        <main id="layout">
            <Navbar auth={false} />
            <div>
                <div className="flex h-screen overflow-hidden justify-center items-center">
                    {children}
                </div>
            </div>
        </main>
    )
}

export default PublicLayout