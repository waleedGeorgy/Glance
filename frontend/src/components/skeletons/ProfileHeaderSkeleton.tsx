const ProfileHeaderSkeleton = () => {
    return (
        <div className='w-full p-3'>
            <div className='flex flex-col gap-2 w-full'>
                <div className='skeleton h-64 w-full relative'>
                    <div className='skeleton size-32 rounded-full border border-accent absolute top-45 left-5'></div>
                </div>
                <div className='skeleton h-6 mt-4 w-20 ml-auto rounded-full'></div>
                <div className='skeleton h-7 ml-3 w-32 rounded-full mt-4'></div>
                <div className='skeleton h-4 ml-3 w-20 rounded-full'></div>
                <div className='skeleton h-4 ml-3 w-32 rounded-full'></div>
                <div className='skeleton h-4 ml-3 w-48 rounded-full'></div>
                <div className="flex flex-row items-center gap-2 ml-3">
                    <div className='skeleton h-6 w-24 rounded-full'></div>
                    <div className='skeleton h-6 w-24 rounded-full'></div>
                    <div className='skeleton h-6 w-24 rounded-full'></div>
                </div>
            </div>
        </div>
    );
};
export default ProfileHeaderSkeleton;