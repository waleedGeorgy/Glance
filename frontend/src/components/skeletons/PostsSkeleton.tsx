const PostsSkeleton = () => {
    return (
        <div className='flex flex-col justify-center'>
            {[...Array(4)].map((_, id) => (
                <div className='flex flex-col gap-4 w-full p-4' key={id}>
                    <div className='flex gap-2 items-center'>
                        <div className='skeleton size-8 rounded-full shrink-0'></div>
                        <div className='skeleton h-7 w-48 rounded-full'></div>
                    </div>
                    <div className="skeleton h-5 w-72 rounded-full" />
                    <div className='skeleton h-40 w-full rounded'></div>
                </div>
            ))}
        </div>
    );
};
export default PostsSkeleton;