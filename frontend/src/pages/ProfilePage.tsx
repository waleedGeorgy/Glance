import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { Edit, Link2, Calendar1, Camera } from "lucide-react"
import ProfileHeaderSkeleton from "../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "../components/EditProfileModal";
import Posts from "../components/Posts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type Post, type User } from "../types";
import useFollow from "../hooks/useFollow";
import { createToast } from "../components/Toast";

const ProfilePage = () => {
    const [coverImage, setCoverImg] = useState<string | null>(null);
    const [profileImage, setProfileImg] = useState<string | null>(null);
    const [feedTab, setFeedTab] = useState("userPosts");

    const coverImgRef = useRef<HTMLInputElement>(null);
    const profileImgRef = useRef<HTMLInputElement>(null);

    const { username } = useParams();

    const { followUnfollow, isPending } = useFollow();

    const { data: authUser } = useQuery<User>({ queryKey: ["auth/checkAuth"] });
    const { data: userPosts, isPending: isUserPostsLoading } = useQuery<Post[]>({ queryKey: [`posts/user/${authUser?.username}`] })

    const queryClient = useQueryClient();

    const { data: user, isLoading, refetch, isRefetching, error } = useQuery<User>({
        queryKey: [`users/profile/${username}`],
        enabled: !!username,
        retry: 1
    });

    const { mutateAsync: updateProfileImages, isPending: isUpdatingProfileImages } = useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch("http://localhost:8000/api/users/update", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ coverImage, profileImage })
                });
                const data = await res.json();

                if (!res.ok) throw new Error(data.error || "Something went wrong");

                return data
            } catch (error) {
                console.log(error);
                throw error;
            }
        },
        onSuccess: () => {
            createToast("success", "Image updated successfully");
            Promise.all([
                queryClient.invalidateQueries({ queryKey: ["auth/checkAuth"] }),
                queryClient.invalidateQueries({ queryKey: [`users/profile/${user?.username}`] })
            ]);
        },
        onError: (error) => {
            createToast("error", error.message)
        }
    });

    const isMyProfile = authUser?._id === user?._id;

    const userIsFollowed = authUser?.following.includes(user?._id as string);

    const userJoinDate = new Date(user?.createdAt as Date).toLocaleString("en-GB", { month: "long", year: "numeric" })

    useEffect(() => {
        if (username) refetch();
    }, [username, refetch]);

    const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>, state: string) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (state === "coverImg") setCoverImg(reader.result as string);
                if (state === "profileImg") setProfileImg(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            <div className='flex-[4_4_0] border-r border-accent min-h-screen'>
                {(isLoading || isRefetching) && <ProfileHeaderSkeleton />}
                {!isLoading && !isRefetching && error && <p className='text-center text-lg mt-4'>User not found ☹️</p>}
                <div className='flex flex-col'>
                    {!isLoading && !isRefetching && user && (
                        <>
                            {/* Profile and cover images */}
                            <div className='relative'>
                                <div className="group">
                                    <img
                                        src={coverImage || user?.coverImage || "/no_image.jpg"}
                                        className='h-64 w-full object-cover p-1'
                                        alt='cover image'
                                    />
                                    {isMyProfile && (
                                        <div
                                            className='absolute top-4 right-4 rounded-full p-2 bg-secondary bg-opacity-75 cursor-pointer opacity-0 group-hover:opacity-100 hover:scale-105'
                                            onClick={() => coverImgRef.current?.click()}
                                        >
                                            <Edit className='size-4' />
                                        </div>
                                    )}
                                </div>
                                <input
                                    type='file'
                                    hidden
                                    ref={coverImgRef}
                                    onChange={(e) => handleImgChange(e, "coverImg")}
                                />
                                <input
                                    type='file'
                                    hidden
                                    ref={profileImgRef}
                                    onChange={(e) => handleImgChange(e, "profileImg")}
                                />
                                <div className='avatar absolute top-45 left-5 group'>
                                    {profileImage || user.profileImage ?
                                        (
                                            <div className='size-32 rounded-full relative'>
                                                <img src={profileImage || user?.profileImage} />
                                                {isMyProfile && (
                                                    <div className='absolute top-5 right-4 p-1 bg-secondary rounded-full group-hover:opacity-100 opacity-0 hover:scale-105 cursor-pointer'>
                                                        <Camera
                                                            className='size-4'
                                                            onClick={() => profileImgRef.current?.click()}
                                                        />
                                                    </div>)}
                                            </div>
                                        ) :
                                        (
                                            <div className="avatar avatar-placeholder relative">
                                                <div className="bg-neutral text-neutral-content rounded-full bg-radial size-32">
                                                    <span className='text-5xl'>{user?.firstName[0]}{user?.lastName[0]}</span>
                                                </div>
                                                {isMyProfile && (
                                                    <div className='absolute top-5 right-4 p-1 bg-secondary rounded-full group-hover:opacity-100 opacity-0 hover:scale-105 cursor-pointer'>
                                                        <Camera
                                                            className='size-4'
                                                            onClick={() => profileImgRef.current?.click()}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                            {/* Edit and follow buttons */}
                            <div className='flex justify-end px-4 mt-5'>
                                {isMyProfile && <EditProfileModal authUser={authUser as User} />}
                                {!isMyProfile && (
                                    <button
                                        className='btn btn-primary rounded-full' disabled={isPending}
                                        onClick={() => followUnfollow(user._id)}
                                    >
                                        {isPending && <span className="loading loading-spinner loading-sm" />}
                                        {!isPending && !userIsFollowed && <span>Follow</span>}
                                        {!isPending && userIsFollowed && <span>Unfollow</span>}
                                    </button>
                                )}
                                {(coverImage || profileImage) && (
                                    <button
                                        className='btn btn-primary rounded-full ml-2'
                                        onClick={async () => {
                                            await updateProfileImages();
                                            setProfileImg(null);
                                            setCoverImg(null)
                                        }}
                                        disabled={isUpdatingProfileImages}
                                    >
                                        {isUpdatingProfileImages ? (<span className="loading loading-spinner loading-sm" />) : (<span>Update</span>)}
                                    </button>
                                )}
                            </div>
                            {/* Profile info */}
                            <div className='flex flex-col justify-center gap-2 mt-4 px-6'>
                                <div className='flex flex-col gap-1 justify-center'>
                                    <span className='font-semibold text-3xl tracking-wide'>{user?.firstName} {user?.lastName}</span>
                                    <span className='text-primary'>@{user?.username}</span>
                                    <span>{user?.bio}</span>
                                    <div className="flex flex-row gap-4 items-center">
                                        {user?.link && (
                                            <div className='flex gap-2 items-center '>
                                                <>
                                                    <Link2 className="size-4" />
                                                    <a
                                                        href={user.link}
                                                        target='_blank'
                                                        rel='noreferrer'
                                                        className='text-sm text-blue-400 hover:underline underline-offset-2'
                                                    >
                                                        {user.link}
                                                    </a>
                                                </>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className='flex items-center gap-2 mt-1'>
                                    {/* todo: implement showing followers and following users */}
                                    <div className='flex gap-1 items-center bg-emerald-500 px-2 py-1 rounded-3xl text-secondary font-semibold text-sm'>
                                        <span>{user?.following.length}</span>
                                        <span>Following</span>
                                    </div>
                                    <div className='flex gap-1 items-center bg-indigo-500 px-2 py-1 rounded-3xl text-secondary font-semibold text-sm'>
                                        <span>{user?.followers.length}</span>
                                        <span>Followers</span>
                                    </div>
                                    <div className='flex gap-1 items-center ml-1'>
                                        <Calendar1 className='size-4 opacity-70' />
                                        <span className='opacity-70 font-light'>Joined {userJoinDate}</span>
                                    </div>
                                </div>
                            </div>
                            {/* Posts and likes bar */}
                            <div className='flex w-full border-b border-accent mt-8'>
                                <div
                                    className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer truncate'
                                    onClick={() => setFeedTab("userPosts")}
                                >
                                    <span className="text-primary font-semibold mr-1">{`${user?.username}'s`}</span> Posts{" "}
                                    {isUserPostsLoading && (<span className="loading loading-ring loading-sm ml-0.5" />)}
                                    {userPosts && !isUserPostsLoading && (`(${userPosts?.length})`)}
                                    {feedTab === "userPosts" && (
                                        <div className='absolute bottom-0 w-16 h-1 rounded-full bg-primary' />
                                    )}
                                </div>
                                <div
                                    className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer'
                                    onClick={() => setFeedTab("liked")}
                                >
                                    Liked posts
                                    {feedTab === "liked" && (
                                        <div className='absolute bottom-0 w-16 h-1 rounded-full bg-primary' />
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                    <Posts feedTab={feedTab} username={username} userId={user?._id} />
                </div>
            </div>
        </>
    );
};
export default ProfilePage;