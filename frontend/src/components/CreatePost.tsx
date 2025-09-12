import { useRef, useState, type FormEvent } from "react";
import { Image, Smile, X } from "lucide-react"

const CreatePost = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const imgRef = useRef(null);

  const isPending = false;
  const isError = false;

  const data = {
    profileImg: "/avatars/boy1.png",
  };

  const handleCreatePost = (e: FormEvent) => {
    e.preventDefault();
    alert("Post created successfully");
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className='flex p-4 items-start gap-4 bg-secondary'>
      <div className='avatar'>
        {data?.profileImg ?
          (
            <div className='size-8 rounded-full'>
              <img src={data?.profileImg} />
            </div>
          )
          :
          (
            <div className="avatar avatar-placeholder">
              <div className="bg-neutral text-neutral-content size-8 rounded-full">
                <span>J</span>
              </div>
            </div>
          )
        }
      </div>
      <form className='flex flex-col gap-2 w-full' onSubmit={handleCreatePost}>
        <textarea
          className='textarea bg-secondary w-full p-0 text-lg resize-none border-none focus:outline-none placeholder:text-base'
          placeholder='What is on your mind?'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {img && (
          <div className='relative mx-auto'>
            <X
              className='absolute top-2 right-2 bg-secondary rounded-full size-4 cursor-pointer hover:scale-110'
              onClick={() => {
                setImg(null);
                imgRef.current.value = null;
              }}
            />
            <img src={img} className='w-full mx-auto h-80 object-contain rounded' />
          </div>
        )}
        <div className='flex justify-between py-2 px-3 border border-accent rounded-full'>
          <div className='flex gap-2 items-center'>
            <Image
              className='size-6 text-primary cursor-pointer hover:scale-105'
              onClick={() => imgRef.current.click()}
            />
            <Smile className='size-6 text-primary cursor-pointer hover:scale-105' />
          </div>
          <input type='file' accept="image/*" hidden ref={imgRef} onChange={handleImgChange} />
          <button className='btn btn-primary rounded-full btn-sm px-5'>
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>
        {isError && <div className='text-red-400'>Something went wrong</div>}
      </form>
    </div>
  );
};
export default CreatePost;