import { Link } from "react-router";
import { Trash2, Heart, Repeat, Clock2 } from "lucide-react"
import Comments from "./Comments";
import type { Post } from "../types";

const SinglePost = ({ post }: { post: Post }) => {
    const postOwner = post?.byUser;

    const isLiked = false;

    const isMyPost = true;

    const formattedDate = "1h";

    const handleDeletePost = () => { };

    const handleLikePost = () => { };

    return (
        <>
            <div className='flex gap-3 px-4 py-3 border-b-4 border-secondary'>
                <div className='flex flex-col justify-center flex-1 gap-4'>
                    {/* Post header */}
                    <div className="flex flex-row items-center gap-2">
                        <div className="flex flex-row items-center gap-2 bg-secondary w-fit px-2 py-1 rounded-full">
                            <div className='avatar'>
                                {postOwner?.profileImage ?
                                    (
                                        <div className='size-7 rounded-full overflow-hidden'>
                                            <img src={postOwner?.profileImage} alt={postOwner.username} />
                                        </div>
                                    )
                                    :
                                    (
                                        <div className="avatar avatar-placeholder">
                                            <div className="bg-neutral text-neutral-content size-7 rounded-full">
                                                <span>{postOwner.firstName[0]}</span>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                            <div className='flex gap-2 items-center'>
                                <Link viewTransition to={`/profile/${postOwner.username}`} className='hover:underline underline-offset-2 text-sm'>
                                    {postOwner.firstName} {postOwner.lastName}
                                </Link>
                                <span className="text-lg opacity-50">|</span>
                                <Link className="hover:underline underline-offset-2 text-primary font-light text-sm" viewTransition to={`/profile/${postOwner.username}`}>@{postOwner.username}</Link>
                                <span className="text-lg opacity-50">|</span>
                                <span className="flex text-sm flex-row gap-0.5 items-center"><Clock2 className="size-3.5" />{formattedDate}</span>
                            </div>
                        </div>
                        {isMyPost && (
                            <span className='ml-auto'>
                                <Trash2 className='size-5 cursor-pointer hover:text-red-400 transition-all duration-200 ' onClick={handleDeletePost} />
                            </span>
                        )}
                    </div>
                    {/* Post contents */}
                    <div className='flex flex-col gap-3 overflow-hidden'>
                        <span>{post.text}</span>
                        {post.img && (
                            <img
                                src={post.img}
                                className='h-72 object-contain rounded border border-accent'
                                alt={post.text}
                            />
                        )}
                    </div>
                    {/* Post controls */}
                    <div className='flex items-center'>
                        <div className='flex gap-4 items-center w-full justify-around'>
                            <Comments post={post} />
                            <div className='flex gap-1 items-center group cursor-pointer'>
                                <Repeat className='size-5 text-slate-500 group-hover:text-emerald-500' />
                                <span className='text-sm text-slate-500 group-hover:text-emerald-500'>0</span>
                            </div>
                            <div className='flex gap-1 items-center group cursor-pointer' onClick={handleLikePost}>
                                {!isLiked && (
                                    <Heart className='size-5 cursor-pointer text-slate-500 group-hover:text-pink-500' />
                                )}
                                {isLiked && <Heart className='size-5 cursor-pointer text-pink-500 ' />}
                                <span
                                    className={`text-sm text-slate-500 group-hover:text-pink-500 ${isLiked ? "text-pink-500" : ""
                                        }`}
                                >
                                    {post.likes.length}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default SinglePost;