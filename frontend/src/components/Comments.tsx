import { useState, type FormEvent } from 'react'
import { Link } from 'react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Clock2, MessageCircle, Trash2 } from 'lucide-react';
import type { Post, User, Comment } from '../types';
import { createToast } from './Toast';
import { formatDate } from '../utils/formatDate';

const Comments = ({ post, feedTab }: { post: Post, feedTab: string }) => {
    const [comment, setComment] = useState("");

    const { data: authUser } = useQuery<User>({ queryKey: ["auth/checkAuth"] });

    const queryClient = useQueryClient();

    const { mutate: addComment, isPending: isCommenting } = useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch(`http://localhost:8000/api/posts/comment/${post._id}`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ text: comment }),
                });
                const data = await res.json();

                if (!res.ok) throw new Error(data.error || "Something went wrong");

                return data;
            } catch (error) {
                console.log(error);
                throw error;
            }
        },
        onSuccess: (updatedComments) => {
            queryClient.setQueryData([feedTab], (oldData: Post[]) => {
                return oldData.map((p) => {
                    if (p._id === post._id) {
                        return { ...p, comments: updatedComments }
                    }
                    return p;
                });
            });
            setComment("");
            createToast("success", "Comment added!");
        },
        onError: (error) => {
            createToast("error", error.message);
        }
    });

    const { mutate: deleteComment, isPending: isDeletingComment } = useMutation({
        mutationFn: async (commentId: string) => {
            try {
                const res = await fetch(`http://localhost:8000/api/posts/${post._id}/${commentId}`, {
                    method: "DELETE",
                    credentials: "include",
                });
                const data = await res.json();

                if (!res.ok) throw new Error(data.error || "Something went wrong");

                return data;
            } catch (error) {
                console.log(error);
                throw error;
            }
        },
        onSuccess: (updatedComments) => {
            createToast("success", "Comment deleted!");
            queryClient.setQueryData([feedTab], (oldData: Post[]) => {
                return oldData.map((p) => {
                    if (p._id === post._id) {
                        return { ...p, comments: updatedComments }
                    }
                    return p;
                });
            });
        },
        onError: (error) => {
            createToast("error", error.message);
        }
    });

    const handlePostComment = (e: FormEvent) => {
        e.preventDefault();
        if (isCommenting) return;
        addComment();
    };

    const handleDeleteComment = (commentId: string) => {
        if (isDeletingComment) return;
        deleteComment(commentId)
    }

    return (
        <>
            <div
                className='flex gap-1 items-center cursor-pointer group'
                onClick={() => {
                    const modal = document.getElementById("comments_modal" + post._id);
                    if (modal instanceof HTMLDialogElement) {
                        modal.showModal()
                    }
                }}
            >
                <MessageCircle className='size-4 text-slate-500 group-hover:text-cyan-400 transition-all duration-300' />
                <span className='text-sm text-slate-500 group-hover:text-cyan-400 transition-all duration-300'>
                    {post.comments.length}
                </span>
            </div>
            <dialog id={`comments_modal${post._id}`} className='modal'>
                <div className='modal-box rounded-lg border border-accent space-y-5'>
                    <h3 className='text-2xl text-right font-bold'>Comments</h3>
                    <div className='flex flex-col'>
                        {post.comments.length === 0 && (
                            <p className='font-light'>
                                No comments yet. Say something 🤔
                            </p>
                        )}
                        {post.comments.map((comment: Comment) => {
                            const isMyComment = authUser?._id === comment?.by._id;
                            const formattedDate = formatDate(comment.createdAt);

                            return (
                                <div key={comment?._id}>
                                    <div className='space-y-2 py-2'>
                                        <div className='flex flex-row gap-1 items-center'>
                                            <div className={`flex flex-row items-center gap-2 pr-2 ${isMyComment ? ("bg-gradient-to-r from-sky-950 to bg-indigo-950") : ("bg-secondary")} w-fit pr-2 rounded-full`}>
                                                <div className='avatar'>
                                                    {comment?.by.profileImage ?
                                                        (
                                                            <Link viewTransition to={`/profile/${comment?.by.username}`}>
                                                                <div className='size-8 rounded-full overflow-hidden'>
                                                                    <img src={comment?.by?.profileImage} alt={comment?.by.username} />
                                                                </div>
                                                            </Link>
                                                        )
                                                        :
                                                        (
                                                            <Link viewTransition to={`/profile/${comment?.by.username}`}>
                                                                <div className="avatar avatar-placeholder">
                                                                    <div className="bg-neutral text-neutral-content size-8 rounded-full">
                                                                        <span>{comment?.by.firstName[0]}</span>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        )
                                                    }
                                                </div>
                                                <div className='flex gap-2 items-center'>
                                                    <Link viewTransition to={`/profile/${comment?.by.username}`} className='hover:underline underline-offset-2 text-sm'>
                                                        {comment?.by.firstName} {comment?.by.lastName}
                                                    </Link>
                                                    <span className="text-lg opacity-50">|</span>
                                                    <Link className="hover:underline underline-offset-2 text-primary text-sm" viewTransition to={`/profile/${comment?.by.username}`}>@{comment?.by.username}</Link>
                                                    <span className="text-lg opacity-50">|</span>
                                                    <span className="flex text-sm flex-row gap-0.5 items-center"><Clock2 className="size-3.5" />{formattedDate}</span>
                                                </div>

                                            </div>
                                            {isMyComment &&
                                                (<button disabled={isDeletingComment} className='ml-auto cursor-pointer hover:text-red-400 transition-colors duration-300 hover:scale-110' onClick={() => handleDeleteComment(comment._id)}>
                                                    {isDeletingComment ? (<span className='loading loading-spinner loading-xs' />) : (<Trash2 className='size-4' />)}
                                                </button>)
                                            }
                                        </div>
                                        <p>{comment?.text}</p>
                                    </div>
                                    <div className='divider my-1' />
                                </div>
                            )
                        })}
                    </div>
                    <form
                        className='flex flex-col gap-2 items-end mt-6'
                        onSubmit={handlePostComment}
                    >
                        <textarea
                            className='textarea w-full rounded resize-none border focus:outline-none border-accent'
                            placeholder='Comment...'
                            name="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <button className='btn btn-primary rounded-full btn-sm px-4' disabled={isCommenting}>
                            {isCommenting ? (
                                <span className='loading loading-dots loading-sm'></span>
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
        </>
    )
}

export default Comments