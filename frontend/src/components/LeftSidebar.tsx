import { Home, Bell, User2, LogOut } from "lucide-react"
import { Link } from 'react-router';

const LeftSidebar = () => {
    const data = {
        fullName: "John Doe",
        username: "johndoe",
        profileImg: "/avatars/boy1.png",
    };

    return (
        <div className='md:flex-[2_2_0] w-18 max-w-52'>
            <div className='sticky top-0 left-0 h-screen flex flex-col border-r border-accent w-20 md:w-full px-2'>
                <Link viewTransition to='/' className='flex justify-center md:justify-start'>
                    <h1>Glance</h1>
                </Link>
                <ul className='flex flex-col mt-6'>
                    <li className="text-center md:text-left">
                        <Link
                            viewTransition
                            to='/'
                            className='flex gap-3 items-center hover:bg-accent transition-all rounded-full duration-300 p-3 cursor-pointer'
                        >
                            <Home className='size-6' />
                            <span className='text-lg hidden md:block'>Home</span>
                        </Link>
                    </li>
                    <li className="text-center md:text-left">
                        <Link
                            viewTransition
                            to='/notifications'
                            className='flex gap-3 items-center hover:bg-accent transition-all rounded-full duration-300 p-3 cursor-pointer'
                        >
                            <Bell className='size-6' />
                            <span className='text-lg hidden md:block'>Notifications</span>
                        </Link>
                    </li>
                    <li className="text-center md:text-left">
                        <Link
                            viewTransition
                            to={`/profile/${data?.username}`}
                            className='flex gap-3 items-center hover:bg-accent transition-all rounded-full duration-300 p-3 cursor-pointer'
                        >
                            <User2 className="size-6" />
                            <span className='text-lg hidden md:block'>Profile</span>
                        </Link>
                    </li>
                </ul>
                {data && (
                    <Link
                        viewTransition
                        to={`/profile/${data.username}`}
                        className='mt-auto mb-8 flex gap-2 items-start transition-all duration-300 hover:bg-accent py-2 px-3 rounded-full'
                    >
                        <div className='avatar hidden md:inline-flex'>
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
                            <LogOut className='size-5 cursor-pointer' />
                        </div>
                    </Link>
                )}
            </div>
        </div>
    );
}

export default LeftSidebar;