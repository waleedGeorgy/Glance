import { Outlet } from "react-router"
import Sidebar from "../components/LeftSidebar"
import RightSidebar from "../components/RightSidebar"

const MainLayout = () => {
    return (
        <main className="flex max-w-6xl mx-auto font-roboto">
            <Sidebar />
            <Outlet />
            <RightSidebar />
        </main>
    )
}

export default MainLayout