import { useQuery } from "@tanstack/react-query";
import SinglePost from "./SinglePost";
import PostsSkeleton from "./skeletons/PostsSkeleton";
import type { Post } from "../types";

const Posts = ({ feedTab, username, userId }:
  { feedTab: "forYou" | "following" | "userPosts" | "liked", username?: string, userId?: string }) => {
  const getPostsEndpoint = () => {
    switch (feedTab) {
      case "forYou":
        return "posts/all"
      case "following":
        return "posts/following"
      case "userPosts":
        return `posts/user/${username}`
      case "liked":
        return `posts/liked/${userId}`
      default:
        return "posts/all"
    }
  }

  const postsEndpoint = getPostsEndpoint();

  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: [postsEndpoint],
    staleTime: 30000,
    gcTime: 3 * 60 * 1000
  });

  return (
    <>
      {isLoading && <PostsSkeleton />}
      {posts?.length === 0 && <p className='text-center my-6 text-xl font-light'>No posts here 😒</p>}
      {!isLoading && posts &&
        posts.map((post: Post) =>
          <SinglePost key={post._id} post={post} feedTab={postsEndpoint} />
        )
      }
    </>
  );
};
export default Posts;