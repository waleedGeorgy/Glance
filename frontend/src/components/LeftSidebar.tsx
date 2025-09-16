import { Link } from 'react-router';
import { Home, Bell, LogOut } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createToast } from './Toast';
import { type User } from '../types';

const LeftSidebar = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch("http://localhost:8000/api/auth/logout", {
                    method: "POST", credentials: 'include'
                });
                const data = await res.json();

                if (!res.ok) throw new Error(data.error || "Failed to create account");
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["auth/checkAuth"] });
            createToast("success", "Logged out successfully!");
        },
        onError: () => {
            createToast("error", "Failed to log out");
        }
    });

    const { data: user } = useQuery<User>({ queryKey: ["auth/checkAuth"] });

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
                    {/* User profile button */}
                    {user && (
                        <div className="flex flex-row items-center gap-3 transition-all duration-300 hover:bg-accent rounded-full justify-center md:justify-start">
                            <Link
                                viewTransition
                                to={`/profile/${user?.username}`}
                                className='flex gap-2 items-start py-2 px-3'
                            >
                                <div className='avatar'>
                                    {user?.profileImage ?
                                        (
                                            <div className='size-9 rounded-full'>
                                                <img src={user?.profileImage} alt={user?.username} />
                                            </div>
                                        )
                                        :
                                        (
                                            <div className="avatar avatar-placeholder">
                                                <div className="bg-neutral text-neutral-content size-9 rounded-full border-2 border-primary">
                                                    <span className='font-semibold'>{user?.firstName[0]}</span>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                                <div className='flex justify-between items-center flex-1'>
                                    <div className='hidden md:block'>
                                        <p className='font-bold text-sm truncate max-w-20'>{user?.firstName} {user?.lastName}</p>
                                        <p className='opacity-60 text-xs'>@{user?.username}</p>
                                    </div>
                                </div>
                            </Link>
                            {isPending ?
                                (<span className="loading loading-dots loading-sm" />)
                                :
                                (<LogOut className='size-5 hidden md:inline-block cursor-pointer hover:text-red-400 transition-all duration-300' onClick={() => { mutate() }} />)
                            }
                        </div>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default LeftSidebar;