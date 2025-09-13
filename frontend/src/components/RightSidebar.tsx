import { Link } from "react-router";
import { USERS_FOR_RIGHT_PANEL } from "../data/dummy";
import RightSidebarSkeleton from "./skeletons/RightSidebarSkeleton";

const RightSidebar = () => {
    const isLoading = false;

    return (
        <div className='hidden lg:block ml-2'>
            <div className='bg-secondary px-4 py-3 rounded-md sticky top-2'>
                <p className='mb-3 font-semibold'>Suggested users</p>
                <div className='flex justify-center flex-col gap-4'>
                    {isLoading ?
                        (
                            <RightSidebarSkeleton />
                        )
                        :
                        (
                            <>
                                {USERS_FOR_RIGHT_PANEL?.map((user) => (
                                    <Link
                                        viewTransition
                                        to={`/profile/${user.username}`}
                                        className='flex items-center justify-between gap-4'
                                        key={user._id}
                                    >
                                        <div className='flex gap-2 items-center'>
                                            <div className='avatar'>
                                                {user?.profileImg ?
                                                    (
                                                        <div className='size-9 rounded-full'>
                                                            <img src={user?.profileImg} alt={user?.username} />
                                                        </div>
                                                    )
                                                    :
                                                    (
                                                        <div className="avatar avatar-placeholder">
                                                            <div className="bg-neutral text-neutral-content size-9 rounded-full">
                                                                <span>{user.fullName[0]}</span>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                            <div className='flex flex-col'>
                                                <span className='truncate w-28 text-sm'>
                                                    {user.fullName}
                                                </span>
                                                <span className='text-xs opacity-50 font-light'>@{user.username}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <button
                                                className='btn btn-primary btn-outline rounded-full btn-sm'
                                                onClick={(e) => e.preventDefault()}
                                            >
                                                Follow
                                            </button>
                                        </div>
                                    </Link>
                                ))}
                            </>
                        )}
                </div>
            </div>
        </div>
    );
};
export default RightSidebar;