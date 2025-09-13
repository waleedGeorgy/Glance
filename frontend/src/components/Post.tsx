import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { Trash2, Heart, Repeat, MessageCircle, Clock2 } from "lucide-react"
import type { Comment, Post } from "../types";

const Post = ({ post }: { post: Post }) => {
    const [comment, setComment] = useState("");

    const postOwner = post.user;
    const isLiked = false;

    const isMyPost = true;

    const formattedDate = "1h";

    const isCommenting = false;

    const handleDeletePost = () => { };

    const handlePostComment = (e: FormEvent) => {
        e.preventDefault();
    };

    const handleLikePost = () => { };

    return (
        <>
            <div className='flex gap-3 px-4 py-3 border-b-4 border-secondary'>
                <div className='flex flex-col justify-center flex-1 gap-4'>
                    {/* Post header */}
                    <div className="flex flex-row items-center gap-2">
                        <div className='avatar'>
                            {postOwner?.profileImg ?
                                (
                                    <div className='size-7 rounded-full overflow-hidden'>
                                        <img src={postOwner?.profileImg} alt={postOwner.username} />
                                    </div>
                                )
                                :
                                (
                                    <div className="avatar avatar-placeholder">
                                        <div className="bg-neutral text-neutral-content size-7 rounded-full">
                                            <span>{postOwner.fullName[0]}</span>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                        <div className='flex gap-2 items-center'>
                            <Link viewTransition to={`/profile/${postOwner.username}`} className='hover:underline underline-offset-2 font-semibold text-sm'>
                                {postOwner.fullName}
                            </Link>
                            <span className='flex gap-1 text-sm items-center font-light'>
                                <Link className="hover:underline underline-offset-2 text-primary" viewTransition to={`/profile/${postOwner.username}`}>@{postOwner.username}</Link>
                                <span className="flex flex-row gap-0.5 items-center ml-3"><Clock2 className="size-4" />{formattedDate}</span>
                            </span>
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
                            <div
                                className='flex gap-1 items-center cursor-pointer group'
                                onClick={() => {
                                    const modal = document.getElementById("comments_modal" + post._id);
                                    if (modal instanceof HTMLDialogElement) {
                                        modal.showModal()
                                    }
                                }}
                            >
                                <MessageCircle className='size-4 text-slate-500 group-hover:text-cyan-400' />
                                <span className='text-sm text-slate-500 group-hover:text-cyan-400'>
                                    {post.comments.length}
                                </span>
                            </div>
                            <dialog id={`comments_modal${post._id}`} className='modal'>
                                <div className='modal-box rounded-lg border border-accent space-y-6'>
                                    <h3 className='text-lg'>Comments</h3>
                                    <div className='flex flex-col'>
                                        {post.comments.length == 0 && (
                                            <p className='text-sm opacity-50'>
                                                No comments yet. Say something!
                                            </p>
                                        )}
                                        {post.comments.map((comment: Comment) => (
                                            <div key={comment._id} className='flex gap-3'>
                                                {comment?.user.profileImg ?
                                                    (
                                                        <div className='size-8 rounded-full overflow-hidden'>
                                                            <img src={comment.user?.profileImg} alt={comment.user.username} />
                                                        </div>
                                                    )
                                                    :
                                                    (
                                                        <div className="avatar avatar-placeholder">
                                                            <div className="bg-neutral text-neutral-content size-8 rounded-full">
                                                                <span>{comment.user.fullName[0]}</span>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                                <div className='flex flex-col'>
                                                    <div className='flex items-center gap-2'>
                                                        <span>{comment.user.fullName}</span>
                                                        <span className='opacity-50 text-sm'>
                                                            @{comment.user.username}
                                                        </span>
                                                    </div>
                                                    <div className="mt-2">{comment.text}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <form
                                        className='flex gap-3 items-center mt-8'
                                        onSubmit={handlePostComment}
                                    >
                                        <textarea
                                            className='textarea w-full p-2 rounded text-md resize-none border focus:outline-none border-accent'
                                            placeholder='Add a comment...'
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                        />
                                        <button className='btn btn-primary rounded-lg btn-sm px-4'>
                                            {isCommenting ? (
                                                <span className='loading loading-dots loading-md'></span>
                                            ) : (
                                                "Comment"
                                            )}
                                        </button>
                                    </form>
                                </div>
                                <form method='dialog' className='modal-backdrop'>
                                    <button className='outline-none'>close</button>
                                </form>
                            </dialog>
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
export default Post;