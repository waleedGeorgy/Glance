import { useState } from "react";
import CreatePost from "../components/CreatePost";
import Posts from "../components/Posts";

const HomePage = () => {
  const [feedTab, setFeedTab] = useState("forYou");
  // todo: implement search functionality
  return (
    <>
      <div className='flex-[4_4_0] mr-auto border-r border-accent min-h-screen pb-2'>
        <div className='flex w-full border-b border-accent'>
          <div
            className={
              "flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
            }
            onClick={() => setFeedTab("forYou")}
          >
            For You
            {feedTab === "forYou" && (
              <div className='absolute bottom-0 w-12 h-1 rounded-full bg-primary'></div>
            )}
          </div>
          <div
            className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative'
            onClick={() => setFeedTab("following")}
          >
            Following
            {feedTab === "following" && (
              <div className='absolute bottom-0 w-14 h-1 rounded-full bg-primary'></div>
            )}
          </div>
        </div>
        <CreatePost />
        <Posts feedTab={feedTab} />
      </div>
    </>
  );
};
export default HomePage;