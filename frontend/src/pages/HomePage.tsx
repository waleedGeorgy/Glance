import { useState } from "react";
import CreatePost from "../components/CreatePost";
import Posts from "../components/Posts";

const HomePage = () => {
  const [feedType, setFeedType] = useState("forYou");

  return (
    <>
      <div className='flex-[4_4_0] mr-auto border-r border-accent min-h-screen'>
        <div className='flex w-full border-b border-accent'>
          <div
            className={
              "flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
            }
            onClick={() => setFeedType("forYou")}
          >
            For You
            {feedType === "forYou" && (
              <div className='absolute bottom-0 w-12 h-1 rounded-full bg-primary'></div>
            )}
          </div>
          <div
            className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative'
            onClick={() => setFeedType("following")}
          >
            Following
            {feedType === "following" && (
              <div className='absolute bottom-0 w-14 h-1 rounded-full bg-primary'></div>
            )}
          </div>
        </div>
        <CreatePost />
        <Posts />
      </div>
    </>
  );
};
export default HomePage;