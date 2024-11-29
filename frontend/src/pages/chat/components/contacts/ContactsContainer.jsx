import {useState} from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../../../components/ui/collapsible"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar";
import { SampleChats, SampleGroups, SampleProjects } from '../../../../utils/db/constants'
import { ChevronDown, ChevronUp } from 'lucide-react'

const ContactsContainer = () => {
  return (
    <div className='relative w-[40vw] lg:w-[30vw] xl:w-[20vw] border-r-2 border-[#bdbaba]'>
      <Collapsible className='flex flex-col gap-0'>
        <CollapsibleSection title="Direct Messages" items={SampleChats} />
        <CollapsibleSection title="Groups" items={SampleGroups} />
        <CollapsibleSection title="Projects" items={SampleProjects} />
      </Collapsible>
    </div>
  )
}

export default ContactsContainer

const CollapsibleSection = ({ title, items }) => {
  // Each CollapsibleSection component manages its own open state
  const [isOpen, setIsOpen] = useState(false);

  const toggleSection = () => setIsOpen(prev => !prev);

  return (
    <>
      <CollapsibleTrigger className='text-black text-opacity-90 py-2 ' onClick={toggleSection}>
        <div className='flex items-center gap-2'>
          {isOpen ? <ChevronUp className='ml-2 text-gray-500' /> : <ChevronDown className='ml-2 text-gray-500' />}
          <span className=' font-medium text-sm text-opacity-90'>{title}</span>
        </div>
      </CollapsibleTrigger>
      
      {/* CollapsibleContent will only be shown if isOpen is true */}
      {isOpen && (
        <CollapsibleContent>
          {items.length > 0 ? items.map((name, index) => (
            <div key={index} className='flex items-center px-8 py-2 gap-2 mx-2 rounded-xl hover:bg-gray-100'>
              <div>
               <Avatar className="h-12 w-12">
                    <AvatarImage
                      src=""
                      alt="A"
                    />
                </Avatar>
              </div>
              <div className='flex flex-col'>
                <div className=' flex justify-between items-center w-full'>
                 <span className='text-black'>{name}</span>
                  <span className='text-gray-500 text-opacity-90 text-xs'>16:20 PM</span>
                </div>
                <span className='text-gray-500 font-light text-sm'>This is the Message</span>
              </div>
            </div>
          )) : (
            <p className="text-gray-500 px-8">No items available</p>
          )}
        </CollapsibleContent>
      )}
    </>
  );
};
