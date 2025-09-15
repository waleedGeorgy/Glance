import SinglePost from "./SinglePost";
import PostsSkeleton from "./skeletons/PostsSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import type { Post } from "../types";

const Posts = ({ feedTab }: { feedTab: string }) => {
  const getPostsEndpoint = () => {
    switch (feedTab) {
      case "forYou":
        return "http://localhost:8000/api/posts/all"
      case "following":
        return "http://localhost:8000/api/posts/following"
      default:
        return "http://localhost:8000/api/posts/all"
    }
  }

  const postsEndpoint = getPostsEndpoint();

  const { data: posts, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const res = await fetch(postsEndpoint, { credentials: "include" });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Something went wrong");

        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  });

  useEffect(() => {
    refetch();
  }, [feedTab, refetch]);

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