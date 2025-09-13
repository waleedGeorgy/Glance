import { useEffect, useRef, useState, type FormEvent } from "react";
import { Image, Smile, X } from "lucide-react";
import EmojiPicker, { Theme, EmojiStyle, type EmojiClickData } from 'emoji-picker-react';

const CreatePost = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const imgRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiButtonRef = useRef<HTMLDivElement>(null);

  const isPending = false;
  const isError = false;

  const handleCreatePost = (e: FormEvent) => {
    e.preventDefault();
    alert("Post created successfully");
  };

  const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const emoji = emojiData.emoji;
    const textarea = textareaRef.current;

    if (!textarea) return;

    // Get current cursor position
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // Insert emoji at cursor position
    const newText = text.substring(0, start) + emoji + text.substring(end);
    setText(newText);

    // Set cursor position after the inserted emoji
    setTimeout(() => {
      textarea.selectionStart = start + emoji.length;
      textarea.selectionEnd = start + emoji.length;
      textarea.focus();
    }, 0);

    // Close the emoji picker
    setShowEmojiPicker(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiButtonRef.current && !emojiButtonRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <div className=' bg-secondary'>
      <form className='flex flex-col gap-3 w-full' onSubmit={handleCreatePost}>
        <textarea
          name="post"
          ref={textareaRef}
          className='textarea bg-secondary w-full resize-none border-none focus:outline-none placeholder:text-base'
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onClick={() => setShowEmojiPicker(false)}
        />
        {img && (
          <div className='relative mx-auto'>
            <X
              className='absolute top-2 right-2 bg-secondary rounded-full size-5 cursor-pointer hover:scale-110'
              onClick={() => {
                setImg(null);
                if (imgRef.current) {
                  imgRef.current.value = "";
                }
              }}
            />
            <img src={img} className='w-full mx-auto h-80 object-contain rounded border border-accent' />
          </div>
        )}
        <div className='flex justify-between py-2 px-4 border-t border-accent'>
          <div className='flex gap-2 items-center'>
            <Image
              className='size-6 text-primary cursor-pointer hover:scale-105'
              onClick={() => imgRef.current?.click()}
            />
            <div ref={emojiButtonRef} className="relative">
              <Smile
                className='size-6 text-primary cursor-pointer hover:scale-105'
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              />
              {showEmojiPicker && (
                <div className="absolute top-full left-0 z-10">
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    width={350}
                    height={400}
                    theme={Theme.DARK}
                    emojiStyle={EmojiStyle.NATIVE}
                  />
                </div>
              )}
            </div>
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