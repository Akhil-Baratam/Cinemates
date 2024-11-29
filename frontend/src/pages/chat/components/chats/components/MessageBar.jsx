import {useState, useRef, useEffect} from 'react';
import { Paperclip, Smile, SendHorizontal } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
const MessageBar = () => {
  const emojiRef = useRef();
  const [message, setMessage] = useState('');
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  useEffect(()=> {
    function handleClickOutside(event) {
      if(emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  },[emojiRef])

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const handleSentMessage = async (message) => {

  }

  return (
    <div className='h-[8vh] flex justify-center items-center border-2 rounded-full px-4 mx-4 mb-4'>
      <div className='w-full flex rounded-md items-center gap-5'>
        <input
          type='text'
          className='flex-1 px-5 rounded-md focus:border-none focus:outline-none'
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className='text-neutral-900 focus:border-none focus:outline-none'>
          <Paperclip className="text-gray-400 hover:text-gray-700" />
        </button>
        <div className='relative flex gap-2'>
          <button className='text-neutral-900 focus:border-none focus:outline-none'
          onClick={()=>setEmojiPickerOpen(true)}>
            <Smile className=' text-gray-400 hover:text-gray-700' />
          </button>
          <div className='absolute bottom-14 right-0' ref={emojiRef}>
            <EmojiPicker height={300} width={400}
              theme="dark" 
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
              searchDisabled
            />
          </div>
        </div>
      </div>
      <button className=' rounded-md flex items-center justify-center pl-5 focus:border-none focus:outline-none '
       onClick={handleSentMessage}>
        <SendHorizontal className="text-gray-600 hover:text-black" />
      </button>
    </div>
  );
};

export default MessageBar;
