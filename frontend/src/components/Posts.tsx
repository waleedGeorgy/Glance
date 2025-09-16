import SinglePost from "./SinglePost";
import PostsSkeleton from "./skeletons/PostsSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import type { Post } from "../types";

const Posts = ({ feedTab, username, userId }: { feedTab: string, username?: string | undefined, userId?: string | undefined }) => {
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

  const { data: posts, isLoading, refetch, isRefetching } = useQuery<Post[]>({
    queryKey: [postsEndpoint]
  });

  useEffect(() => {
    refetch();
  }, [feedTab, refetch, username, userId]);

  return (
    <>
      {(isLoading || isRefetching) && <PostsSkeleton />}
      {(!isLoading && !isRefetching) && posts?.length === 0 && <p className='text-center my-6 text-xl font-light'>No posts here 😒</p>}
      {(!isLoading && !isRefetching) && posts && (
        posts.map((post: Post) => (
          <SinglePost key={post._id} post={post} />
        ))
      )}
    </>
  );
};
export default Posts;