import {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import EmptyChatContainer from './components/empty-chat/EmptyChatContainer';
import ContactsContainer from './components/contacts/ContactsContainer';
import ChatContainer from './components/chats/ChatContainer';

const Chat = () => {
  const [isEmpty, setIsEmpty] = useState(true);
  return (
    <div className='flex pt-12 h-screen text-black overflow-hidden'>
      <ContactsContainer />
      { isEmpty ? <EmptyChatContainer /> :<ChatContainer /> }
    </div>
  )
}

export default Chat;