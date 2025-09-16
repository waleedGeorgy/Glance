import { useEffect, useRef, useState, type FormEvent } from "react";
import { Image, Smile, X } from "lucide-react";
import EmojiPicker, { Theme, EmojiStyle, type EmojiClickData } from 'emoji-picker-react';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createToast } from "./Toast";

const CreatePost = () => {
  const [text, setText] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

  const imgRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiButtonRef = useRef<HTMLDivElement>(null);

  const queryClient = useQueryClient();
  const { mutate: createPost, isPending } = useMutation({
    mutationFn: async ({ text, image }: { text: string, image: string | null }) => {
      try {
        const res = await fetch("http://localhost:8000/api/posts/create", {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ text, image }),
          headers: {
            "Content-Type": "application/json"
          }
        });
        const data = await res.json();

        if (!res.ok) {
          createToast("error", data.error || "Something went wrong");
          throw new Error;
        }

        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: () => {
      setText("");
      setImage(null);
      createToast("success", "Post created successfully!");
      queryClient.invalidateQueries({ queryKey: ["posts/all"] });
    }
  });

  const handleCreatePost = (e: FormEvent) => {
    e.preventDefault();
    createPost({ text, image });
  };

  const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
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
        {image && (
          <div className='relative mx-auto'>
            <X
              className='absolute top-2 right-2 bg-secondary rounded-full size-5 cursor-pointer hover:scale-110'
              onClick={() => {
                setImage(null);
                if (imgRef.current) {
                  imgRef.current.value = "";
                }
              }}
            />
            <img src={image} className='w-full mx-auto h-72 object-contain rounded border border-accent' />
          </div>
        )}
        <div className='flex justify-between py-2 px-4 border-t border-accent'>
          <div className='flex gap-2 items-center'>
            <Image
              className={`size-6 ${isPending ? ("text-neutral-600 hover:scale-100 pointer-events-none") : ("text-primary hover:scale-105 cursor-pointer")}`}
              onClick={() => imgRef.current?.click()}
            />
            <div ref={emojiButtonRef} className="relative">
              <Smile
                aria-disabled={isPending}
                className={`size-6 ${isPending ? ("text-neutral-600 hover:scale-100 pointer-events-none") : ("text-primary hover:scale-105 cursor-pointer")}`}
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              />
              {showEmojiPicker && (
                <div className="absolute top-full left-0 z-10" aria-disabled={isPending}>
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
          <button className='btn btn-primary rounded-full btn-sm px-5' disabled={isPending || (!text && !image)}>
            {isPending ? <span>Posting <span className="loading loading-dots loading-sm" /></span> : <span>Post</span>}
          </button>
        </div>
      </form>
    </div>
  );
};
export default CreatePost;