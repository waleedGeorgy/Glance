import { Outlet } from "react-router"
import LeftSidebar from "../components/LeftSidebar"
import RightSidebar from "../components/RightSidebar"

const MainLayout = () => {
    return (
        <main className="flex max-w-6xl mx-auto font-roboto">
            <LeftSidebar />
            <Outlet />
            <RightSidebar />
        </main>
    )
}

export default MainLayout