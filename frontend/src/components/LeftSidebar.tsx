import { Home, Bell, LogOut } from "lucide-react"
import { Link } from 'react-router';

const LeftSidebar = () => {
    const data = {
        fullName: "John Doe",
        username: "johndoe",
        profileImg: "/avatars/boy1.png",
    };

    return (
        <div className='md:flex-[2_2_0] max-w-52'>
            <div className='sticky top-0 left-0 h-screen flex flex-col border-r border-accent w-20 md:w-full px-2'>
                <Link viewTransition to='/' className='flex justify-center md:justify-start'>
                    <h1>Glance Logo</h1>
                </Link>
                <ul className='flex flex-col mt-6'>
                    <li className="text-center md:text-left">
                        <Link
                            viewTransition
                            to='/'
                            className='flex gap-3 items-center justify-center md:justify-start hover:bg-accent transition-all rounded-full duration-300 p-3 cursor-pointer'
                        >
                            <Home className='size-5 text-primary' />
                            <span className='hidden md:block'>Home</span>
                        </Link>
                    </li>
                    <li className="text-center md:text-left">
                        <Link
                            viewTransition
                            to='/notifications'
                            className='flex gap-3 justify-center md:justify-start items-center hover:bg-accent transition-all rounded-full duration-300 p-3 cursor-pointer'
                        >
                            <Bell className='size-5 text-primary' />
                            <span className='hidden md:block'>Notifications</span>
                        </Link>
                    </li>
                    {data && (
                        <div className="flex flex-row items-center gap-3 transition-all duration-300 hover:bg-accent rounded-full justify-center md:justify-start">
                            <Link
                                viewTransition
                                to={`/profile/${data.username}`}
                                className='flex gap-2 items-start py-2 px-3'
                            >
                                <div className='avatar'>
                                    {data?.profileImg ?
                                        (
                                            <div className='size-8 rounded-full'>
                                                <img src={data?.profileImg} alt={data.username} />
                                            </div>
                                        )
                                        :
                                        (
                                            <div className="avatar avatar-placeholder">
                                                <div className="bg-neutral text-neutral-content size-8 rounded-full">
                                                    <span>{data.fullName[0]}</span>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                                <div className='flex justify-between items-center flex-1'>
                                    <div className='hidden md:block'>
                                        <p className='font-bold text-sm truncate'>{data?.fullName}</p>
                                        <p className='opacity-60 text-xs'>@{data?.username}</p>
                                    </div>
                                </div>
                            </Link>
                            <LogOut className='size-5 hidden md:inline-block cursor-pointer text-red-400 hover:text-red-500 hover:scale-105' />
                        </div>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default LeftSidebar;