import ChatHeader from "./components/ChatHeader";
import MessageBar from "./components/MessageBar";
import MessageContainer from "./components/MessageContainer";

const ChatContainer = () => {
  const [selectedChat, setSelectedChat] = useState('');
  return (
    <div className="flex flex-col h-full justify-between w-[100vw] md:static md:flex-1">
      <ChatHeader />
      <MessageContainer />
      <MessageBar />
    </div>
  );
};

export default ChatContainer;
