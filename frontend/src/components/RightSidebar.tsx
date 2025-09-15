import { Link } from "react-router";
import RightSidebarSkeleton from "./skeletons/RightSidebarSkeleton";
import { useQuery } from "@tanstack/react-query";
import { createToast } from "./Toast";
import type { User } from "../types";
import useFollow from "../hooks/useFollow";

const RightSidebar = () => {
    const { data: suggestedUsers, isLoading } = useQuery({
        queryKey: ["suggestedUsers"],
        queryFn: async () => {
            try {
                const res = await fetch("http://localhost:8000/api/users/suggested", { credentials: "include" });
                const data = await res.json();

                if (!res.ok) {
                    createToast("error", "Failed to fetch suggested users");
                    throw new Error(data.error || "Something went wrong");
                }

                return data;
            } catch (error) {
                console.log(error);
                throw error;
            }
        }
    });

    const { followUnfollow, isPending } = useFollow();

    if (suggestedUsers?.length === 0) return <div className="md:w-64 w-0"></div>

    return (
        <div className='hidden lg:block ml-2'>
            <div className='bg-secondary px-4 py-3 rounded-md sticky top-2'>
                <p className='mb-3 font-semibold'>Suggested users</p>
                <div className='flex justify-center flex-col gap-4'>
                    {isLoading ?
                        (<RightSidebarSkeleton />)
                        :
                        (<>
                            {suggestedUsers?.map((user: User) => (
                                <Link
                                    viewTransition
                                    to={`/profile/${user.username}`}
                                    className='flex items-center justify-between gap-4'
                                    key={user._id}
                                >
                                    <div className='flex gap-2 items-center'>
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
                                                        <div className="bg-neutral text-neutral-content size-9 rounded-full">
                                                            <span>{user.firstName[0]}</span>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </div>
                                        <div className='flex flex-col'>
                                            <span className='truncate w-28 text-sm'>
                                                {user.firstName} {user.lastName}
                                            </span>
                                            <span className='text-xs opacity-50 font-light'>@{user.username}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <button
                                            disabled={isPending}
                                            className='btn btn-primary btn-outline rounded-full btn-sm'
                                            onClick={(e) => {
                                                e.preventDefault();
                                                followUnfollow(user?._id);
                                            }}
                                        >
                                            {isPending ? (<span><span className="loading loading-dots loading-xs" /></span>) : (<span>Follow</span>)}
                                        </button>
                                    </div>
                                </Link>
                            ))}
                        </>)
                    }
                </div>
            </div>
        </div>
    );
};
export default RightSidebar;