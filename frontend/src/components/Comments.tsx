import { useState, type FormEvent } from 'react'
import { Link } from 'react-router';
import { MessageCircle } from 'lucide-react';
import type { Post } from '../types';

const Comments = ({ post }: { post: Post }) => {
    const [comment, setComment] = useState("");

    const isCommenting = false;

    const handlePostComment = (e: FormEvent) => {
        e.preventDefault();
        alert("Commented successfully!")
    };

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
                <MessageCircle className='size-4 text-slate-500 group-hover:text-cyan-400' />
                <span className='text-sm text-slate-500 group-hover:text-cyan-400'>
                    {post.comments.length}
                </span>
            </div>
            <dialog id={`comments_modal${post._id}`} className='modal'>
                <div className='modal-box rounded-lg border border-accent space-y-5'>
                    <h3 className='text-2xl text-right font-bold'>Comments</h3>
                    <div className='flex flex-col'>
                        {post.comments.length == 0 && (
                            <p className='text-sm opacity-50'>
                                No comments yet. Say something!
                            </p>
                        )}
                        {post.comments.map((comment) => (
                            <div className='space-y-3 border-b border-accent pb-2' key={comment._id}>
                                <div key={comment._id} className='flex items-center gap-3 bg-secondary w-fit px-2 py-1 rounded-full'>
                                    {comment?.by.profileImage ?
                                        (
                                            <div className='size-7 rounded-full overflow-hidden'>
                                                <img src={comment.by?.profileImage} alt={comment.by.username} />
                                            </div>
                                        )
                                        :
                                        (
                                            <div className="avatar avatar-placeholder">
                                                <div className="bg-neutral text-neutral-content size-7 rounded-full">
                                                    <span>{comment.by.firstName[0]}</span>
                                                </div>
                                            </div>
                                        )
                                    }
                                    <div className='flex items-center gap-2'>
                                        <span className='text-sm'>{comment.by.firstName} {comment.by.lastName}</span>
                                        <span className='opacity-50 text-lg'>|</span>
                                        <Link viewTransition to={`/profile/${comment.by.username}`} className='hover:underline underline-offset-2 text-primary font-light'>
                                            <span>@{comment.by.username}</span>
                                        </Link>
                                    </div>
                                </div>
                                <p>{comment.text}</p>
                            </div>
                        ))}
                    </div>
                    <form
                        className='flex flex-col gap-2 items-end mt-6'
                        onSubmit={handlePostComment}
                    >
                        <textarea
                            className='textarea w-full rounded resize-none border focus:outline-none border-accent'
                            placeholder='Add a comment...'
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <button className='btn btn-primary rounded-full btn-sm px-4'>
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
        </>
    )
}

export default Comments