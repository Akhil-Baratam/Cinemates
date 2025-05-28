import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import EmptyChatContainer from './components/empty-chat/EmptyChatContainer';
import ContactsContainer from './components/contacts/ContactsContainer';
import ChatContainer from './components/chats/ChatContainer';
import { ChatProvider, useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';

const ChatWrapper = () => {
  const { selectedChat } = useChat();
  
  return (
    <div className='flex pt-12 h-screen text-black overflow-hidden'>
      <ContactsContainer />
      {selectedChat ? <ChatContainer /> : <EmptyChatContainer />}
    </div>
  );
};

const Chat = () => {
  const navigate = useNavigate();
  const { authUser, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading && !authUser) {
      navigate("/login");
    }
  }, [authUser, isLoading, navigate]);
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!authUser) return null;
  
  return <ChatWrapper />;
};

export default Chat;