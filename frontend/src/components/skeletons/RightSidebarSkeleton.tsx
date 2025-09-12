const RightSidebarSkeleton = () => {
    return (
        [...Array<React.ReactNode>(4)].map((_, id) => (
            <div
                key={id}
                className='flex items-center justify-between gap-14'
            >
                <div className='flex gap-2 items-center'>
                    <div className="skeleton size-9 rounded-full"></div>
                    <div className='flex flex-col gap-2'>
                        <div className='skeleton h-3 w-16' />
                        <div className='skeleton h-2 w-12' />
                    </div>
                </div>
                <div className='skeleton rounded-full h-8 w-16' />
            </div>
        ))
    )
}

export default RightSidebarSkeleton