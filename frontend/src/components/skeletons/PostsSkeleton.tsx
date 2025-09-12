const PostsSkeleton = () => {
    return (
        <div className='flex flex-col justify-center'>
            {[...Array(4)].map((_, id) => (
                <div className='flex flex-col gap-4 w-full p-4' key={id}>
                    <div className='flex gap-2 items-center'>
                        <div className='skeleton size-8 rounded-full shrink-0'></div>
                        <div className='flex flex-col gap-2'>
                            <div className='skeleton h-2 w-12 rounded-full'></div>
                            <div className='skeleton h-2 w-24 rounded-full'></div>
                        </div>
                    </div>
                    <div className='skeleton h-40 w-full rounded'></div>
                </div>
            ))}
        </div>
    );
};
export default PostsSkeleton;