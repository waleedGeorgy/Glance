import { useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Edit, Link2, Calendar1, Camera } from "lucide-react"
import ProfileHeaderSkeleton from "../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "../components/EditProfileModal";
import Posts from "../components/Posts";
import { POSTS } from "../data/dummy";

const ProfilePage = () => {
    const [coverImg, setCoverImg] = useState<string | null>(null);
    const [profileImg, setProfileImg] = useState<string | null>(null);
    const [feedTab, setFeedTab] = useState("posts");

    const coverImgRef = useRef<HTMLInputElement>(null);
    const profileImgRef = useRef<HTMLInputElement>(null);

    const isLoading = false;
    const isMyProfile = true;

    const user = {
        _id: "1",
        fullName: "John Doe",
        username: "johndoe",
        profileImg: "/avatars/boy2.png",
        coverImg: "/no_image.jpg",
        bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        link: "https://youtube.com/@asaprogrammer",
        following: ["1", "2", "3"],
        followers: ["1", "2", "3"],
    };

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
                {isLoading && <ProfileHeaderSkeleton />}
                {!isLoading && !user && <p className='text-center text-lg mt-4'>User not found</p>}
                <div className='flex flex-col'>
                    {!isLoading && user && (
                        <>
                            {/* Header */}
                            <div className='flex gap-6 px-4 py-2 items-center'>
                                <Link viewTransition to='/'>
                                    <ArrowLeft className='size-4' />
                                </Link>
                                <div className='flex flex-col justify-center'>
                                    <p className='font-semibold text-lg'>{user?.fullName}</p>
                                    <span className='text-sm opacity-50'>{POSTS?.length} posts</span>
                                </div>
                            </div>
                            {/* Profile and cover images */}
                            <div className='relative'>
                                <div className="group">
                                    <img
                                        src={coverImg || user?.coverImg || "/no_image.jpg"}
                                        className='h-56 w-full object-cover'
                                        alt='cover image'
                                    />
                                    {isMyProfile && (
                                        <div
                                            className='absolute top-2 right-2 rounded-full p-2 bg-secondary bg-opacity-75 cursor-pointer opacity-0 group-hover:opacity-100 hover:scale-105'
                                            onClick={() => coverImgRef.current?.click()}
                                        >
                                            <Edit className='size-5' />
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
                                <div className='avatar absolute -bottom-16 left-5 group'>
                                    <div className='size-32 rounded-full relative'>
                                        <img src={profileImg || user?.profileImg || "/avatar-placeholder.png"} />
                                        <div className='absolute top-5 right-4 p-1 bg-secondary rounded-full group-hover:opacity-100 opacity-0 hover:scale-105 cursor-pointer'>
                                            {isMyProfile && (
                                                <Camera
                                                    className='size-4'
                                                    onClick={() => profileImgRef.current?.click()}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Edit and follow buttons */}
                            <div className='flex justify-end px-4 mt-5'>
                                {isMyProfile && <EditProfileModal />}
                                {!isMyProfile && (
                                    <button
                                        className='btn btn-primary rounded-full'
                                        onClick={() => alert("Followed successfully")}
                                    >
                                        Follow
                                    </button>
                                )}
                                {(coverImg || profileImg) && (
                                    <button
                                        className='btn btn-primary rounded-full btn-sm ml-2'
                                        onClick={() => alert("Profile updated successfully")}
                                    >
                                        Update
                                    </button>
                                )}
                            </div>
                            {/* Profile info */}
                            <div className='flex flex-col justify-center gap-4 mt-6 px-4'>
                                <div className='flex flex-col gap-1 justify-center'>
                                    <span className='font-bold text-lg'>{user?.fullName}</span>
                                    <span className='text-sm text-primary'>@{user?.username}</span>
                                    <span className='text-sm my-1'>{user?.bio}</span>
                                    <div className="flex flex-row gap-4 items-center">
                                        {user?.link && (
                                            <div className='flex gap-2 items-center '>
                                                <>
                                                    <Link2 className="size-4" />
                                                    <a
                                                        href='https://youtube.com/@asaprogrammer_'
                                                        target='_blank'
                                                        rel='noreferrer'
                                                        className='text-sm text-blue-400 hover:underline underline-offset-2'
                                                    >
                                                        youtube.com/@asaprogrammer_
                                                    </a>
                                                </>
                                            </div>
                                        )}
                                        <div className='flex gap-1 items-center'>
                                            <Calendar1 className='size-4 opacity-50' />
                                            <span className='text-sm opacity-50'>Joined July 2021</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex items-center gap-3'>
                                    <div className='flex gap-1 items-center bg-emerald-500 px-3 py-1 rounded-2xl text-secondary'>
                                        <span className='font-bold text-sm'>{user?.following.length}</span>
                                        <span className='text-sm'>Following</span>
                                    </div>
                                    <div className='flex gap-1 items-center bg-indigo-500 px-3 py-1 rounded-2xl text-secondary'>
                                        <span className='font-bold text-sm'>{user?.followers.length}</span>
                                        <span className='text-sm'>Followers</span>
                                    </div>
                                </div>
                            </div>
                            {/* Posts and likes bar */}
                            <div className='flex w-full border-b border-accent mt-5'>
                                <div
                                    className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer'
                                    onClick={() => setFeedTab("posts")}
                                >
                                    Posts
                                    {feedTab === "posts" && (
                                        <div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary' />
                                    )}
                                </div>
                                <div
                                    className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer'
                                    onClick={() => setFeedTab("likes")}
                                >
                                    Likes
                                    {feedTab === "likes" && (
                                        <div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary' />
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                    <Posts feedTab={feedTab} />
                </div>
            </div>
        </>
    );
};
export default ProfilePage;