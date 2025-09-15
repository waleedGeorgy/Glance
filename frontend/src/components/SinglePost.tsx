import { Link } from "react-router";
import { Trash2, Heart, Repeat, Clock2 } from "lucide-react"
import Comments from "./Comments";
import { type Post, type User } from "../types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createToast } from "./Toast";

const SinglePost = ({ post }: { post: Post }) => {
    const postOwner = post?.byUser;
    const { data: authUser } = useQuery<User>({ queryKey: ["authUser"] });
    const isMyPost = authUser?._id === post.byUser._id;

    const queryClient = useQueryClient()
    const { mutate: deletePost, isPending } = useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch(`http://localhost:8000/api/posts/${post._id}`, {
                    method: "DELETE", credentials: "include"
                });
                const data = await res.json();

                if (!res.ok) throw new Error(data.error || "Something went wrong");

                return data;
            } catch (error) {
                console.log(error);
                throw error;
            }
        },
        onSuccess: () => {
            createToast("success", "Post deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        }
    });

    const isLiked = false;

    const formattedDate = "1h";

    const handleDeletePost = () => {
        deletePost();
    };

    const handleLikePost = () => { };

    return (
        <>
            <div className='flex gap-3 px-4 py-3 border-b border-secondary'>
                <div className='flex flex-col justify-center flex-1 gap-4'>
                    {/* Post header */}
                    <div className="flex flex-row items-center gap-2">
                        <div className={`flex flex-row items-center gap-2 ${isMyPost ? ("bg-gradient-to-r from-sky-950 to bg-indigo-950") : ("bg-secondary")}  w-fit pr-2 rounded-full`}>
                            <div className='avatar'>
                                {postOwner?.profileImage ?
                                    (
                                        <Link viewTransition to={`/profile/${postOwner.username}`}>
                                            <div className='size-8 rounded-full overflow-hidden'>
                                                <img src={postOwner?.profileImage} alt={postOwner.username} />
                                            </div>
                                        </Link>
                                    )
                                    :
                                    (
                                        <Link viewTransition to={`/profile/${postOwner.username}`}>
                                            <div className="avatar avatar-placeholder">
                                                <div className="bg-neutral text-neutral-content size-8 rounded-full">
                                                    <span>{postOwner.firstName[0]}</span>
                                                </div>
                                            </div>
                                        </Link>
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
                                {isPending ?
                                    (<span className="loading loading-spinner loading-sm" />)
                                    :
                                    (<Trash2 className='size-5 cursor-pointer hover:text-red-400 transition-all duration-200 ' onClick={handleDeletePost} />)
                                }
                            </span>
                        )}
                    </div>
                    {/* Post contents */}
                    <div className='flex flex-col gap-3 overflow-hidden'>
                        <p className="text-lg">{post.text}</p>
                        {post.image && (
                            <img
                                src={post.image}
                                className='h-80 object-contain rounded'
                                alt={post.text}
                            />
                        )}
                    </div>
                    {/* Post controls */}
                    <div className='flex items-center'>
                        <div className='flex gap-4 items-center w-full justify-around'>
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
                            <Comments post={post} />
                            <div className='flex gap-1 items-center group cursor-pointer'>
                                <Repeat className='size-5 text-slate-500 group-hover:text-emerald-500' />
                                <span className='text-sm text-slate-500 group-hover:text-emerald-500'>0</span>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default SinglePost;