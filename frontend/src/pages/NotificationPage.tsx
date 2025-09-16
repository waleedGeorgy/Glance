import { Link } from "react-router";
import { Settings2, UserPlus2, Heart, XCircle, Trash2, Calendar1, Clock1 } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type Notification } from "../types";
import { createToast } from "../components/Toast";

const NotificationPage = () => {
    const queryClient = useQueryClient();

    const { data: notifications, isLoading } = useQuery<Notification[]>({
        queryKey: ["notifications"],
    });

    const { mutate: deleteNotifications, isPending: isDeletingNotifications } = useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch("http://localhost:8000/api/notifications", {
                    method: "DELETE",
                    credentials: "include"
                });
                const data = await res.json();

                if (!res.ok) throw new Error(data.error || "Something went wrong");

                return data;
            } catch (error) {
                console.log(error);
                throw error
            }
        },
        onSuccess: () => {
            createToast("success", "Notifications deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
        onError: (error) => {
            createToast("error", error.message);
        }
    });

    const { mutate: deleteOneNotification, isPending: isDeletingOneNotification } = useMutation({
        mutationFn: async (notificationId: string) => {
            try {
                const res = await fetch(`http://localhost:8000/api/notifications/${notificationId}`, {
                    method: "DELETE",
                    credentials: "include"
                });
                const data = await res.json();

                if (!res.ok) throw new Error(data.error || "Something went wrong");

                return data;
            } catch (error) {
                console.log(error);
                throw error
            }
        },
        onSuccess: () => {
            createToast("success", "Notifications deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
        onError: (error) => {
            createToast("error", error.message);
        }
    });

    const handleDeleteNotifications = () => {
        if (isDeletingNotifications) return;
        deleteNotifications();
    };

    const handleDeleteOneNotification = (notificationId: string) => {
        if (isDeletingOneNotification) return;
        deleteOneNotification(notificationId);
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
                                <p onClick={handleDeleteNotifications} className="flex flex-row items-center"><Trash2 className="size-4" />Delete notifications</p>
                            </li>
                        </ul>
                    </div>
                </div>
                {isLoading && (
                    <div className='flex justify-center h-full items-center'>
                        <span className="loading loading-ring loading-xl" />
                    </div>
                )}
                {notifications?.length === 0 && <div className='text-center p-4 font-bold'>No notifications 🤔</div>}
                {notifications?.map((notification: Notification) => (
                    <div className='border-b border-accent' key={notification._id}>
                        <div className='flex flex-row items-center gap-3 p-4'>
                            {notification.type === "follow" && <UserPlus2 className='size-6 text-sky-500' />}
                            {notification.type === "like" && <Heart className='size-6 text-rose-500' />}
                            <Link viewTransition to={`/profile/${notification.from.username}`} className="flex flex-row items-center gap-2 group">
                                <div className='avatar'>
                                    {notification.from.profileImage ?
                                        (
                                            <div className='size-8 rounded-full'>
                                                <img src={notification.from.profileImage} alt={notification.from.username} />
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
                                <div className='flex gap-1 items-center'>
                                    <span className='font-semibold text-primary group-hover:underline underline-offset-2'>@{notification.from.username}</span>{" "}
                                    <span className="font-light">{notification.type === "follow" ? "followed you" : "liked your post"}</span>
                                </div>
                            </Link>
                            <span className="text-sm ml-auto opacity-50 font-semibold flex items-center gap-3">
                                <p className="flex items-center gap-1"><Calendar1 className="size-3.5" /><span>{notification.createdAt.split("T")[0]}</span></p>
                                <p className="flex items-center gap-0.5"><Clock1 className="size-3.5" /><span>{notification.createdAt.split("T")[1].split(".")[0]}</span></p>
                            </span>
                            <p onClick={() => handleDeleteOneNotification(notification._id)} className="ml-auto cursor-pointer hover:scale-105">
                                {isDeletingOneNotification ? (<span className="loading loading-spinner loading-sm" />) : (<XCircle className="size-5 text-red-400" />)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};
export default NotificationPage;