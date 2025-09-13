import { Link } from "react-router";
import { Settings2, UserPlus2, Heart, XCircle, Trash2 } from "lucide-react"
import LoadingSpinner from "../components/LoadingSpinner";

const NotificationPage = () => {
    const isLoading = false;
    const notifications = [
        {
            _id: "1",
            from: {
                _id: "1",
                username: "johndoe",
                profileImg: "/avatars/boy2.png",
            },
            type: "follow",
        },
        {
            _id: "2",
            from: {
                _id: "2",
                username: "janedoe",
                profileImg: "/avatars/girl1.png",
            },
            type: "like",
        },
    ];

    const deleteNotifications = () => {
        alert("All notifications deleted");
    };

    const deleteOneNotification = () => {
        alert("Notification deleted");
    };

    return (
        <>
            <div className='flex-[4_4_0] border-l border-r border-accent min-h-screen'>
                <div className='flex justify-between items-center p-4 border-b border-accent'>
                    <p className='font-bold'>Notifications</p>
                    <div className='dropdown dropdown-end dropdown-bottom'>
                        <div tabIndex={0} role='button' className='m-1'>
                            <Settings2 className='size-5 cursor-pointer' />
                        </div>
                        <ul
                            tabIndex={0}
                            className='dropdown-content z-[1] menu shadow bg-secondary rounded-md w-52 outline outline-primary'
                        >
                            <li>
                                <p onClick={deleteNotifications} className="flex flex-row items-center"><Trash2 className="size-4" />Delete notifications</p>
                            </li>
                        </ul>
                    </div>
                </div>
                {isLoading && (
                    <div className='flex justify-center h-full items-center'>
                        <LoadingSpinner size='lg' />
                    </div>
                )}
                {notifications?.length === 0 && <div className='text-center p-4 font-bold'>No notifications 🤔</div>}
                {notifications?.map((notification) => (
                    <div className='border-b border-accent' key={notification._id}>
                        <div className='flex flex-row items-center gap-3 p-4'>
                            {notification.type === "follow" && <UserPlus2 className='size-6 text-sky-500' />}
                            {notification.type === "like" && <Heart className='size-6 text-rose-500' />}
                            <Link viewTransition to={`/profile/${notification.from.username}`} className="flex flex-row items-center gap-2 group">
                                <div className='avatar'>
                                    {notification.from.profileImg ?
                                        (
                                            <div className='size-8 rounded-full'>
                                                <img src={notification.from.profileImg} alt={notification.from.username} />
                                            </div>
                                        )
                                        :
                                        (
                                            <div className="avatar avatar-placeholder">
                                                <div className="bg-neutral text-neutral-content size-8 rounded-full">
                                                    <span>{notification.from.username[0]}</span>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                                <div className='flex gap-1'>
                                    <span className='font-semibold text-primary group-hover:underline underline-offset-2'>@{notification.from.username}</span>{" "}
                                    <span className="font-light">{notification.type === "follow" ? "followed you" : "liked your post"}</span>
                                </div>
                            </Link>
                            <p onClick={deleteOneNotification} className="ml-auto cursor-pointer hover:scale-105"><XCircle className="size-5 text-red-400" /></p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};
export default NotificationPage;