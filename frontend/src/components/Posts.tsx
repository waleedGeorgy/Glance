import { POSTS } from "../data/dummy";
import Post from "./Post";
import PostsSkeleton from "./skeletons/PostsSkeleton";

const Posts = () => {
  const isLoading = false;

  return (
    <>
      {isLoading && <PostsSkeleton />}
      {!isLoading && POSTS?.length === 0 && <p className='text-center my-4'>No posts yet.</p>}
      {!isLoading && POSTS && (
        POSTS.map((post) => (
          <Post key={post._id} post={post} />
        ))
      )}
    </>
  );
};
export default Posts;