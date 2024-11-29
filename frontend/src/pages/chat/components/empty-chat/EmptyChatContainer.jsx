import { ainmationDefaultOptions } from "../../../../lib/utils"
import Lottie from "react-lottie"
const EmptyChatContainer = () => {
  return (
    <div className=' flex-1 md:flex flex-col justify-center items-center hidden duration-1000 transition-all '>
      <Lottie
        isClickToPauseDisabled={true} 
        height={200}
        width={200}
        options={ainmationDefaultOptions}
      />
      <div className="text-opacity-80 text-black flex flex-col gap-5 items-center mt-10 
      lg:text-4xl text-3xl transition-all duration-300 text-center">
        <h3 className="poppins-medium">
          Hi <span className=" text-black">!</span> Welcome to
          <span className=" text-black"> Cinemates</span> Chat
        </h3>
      </div>
    </div>
  )
}

export default EmptyChatContainer