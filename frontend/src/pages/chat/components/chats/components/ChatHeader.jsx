import { X } from "lucide-react";

const ChatHeader = () => {
  return (
    <div className=' h-[8vh] border-b-2 border-[#bdbaba] flex items-center justify-between px-20 '>
      <div className='flex gap-5 items-center'>
        <div className=' flex gap-3 items-center justify-center'></div>
        <div className=' flex items-center justify-center gap-5'>
          <button className='text-neutral-900 focus:border-none focus:outline-none focus:text-black
           duration-300 transition-all '>
            <X />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatHeader