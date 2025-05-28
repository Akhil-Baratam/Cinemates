import { useState, useEffect } from "react";
import ChatHeader from "./components/ChatHeader";
import MessageBar from "./components/MessageBar";
import MessageContainer from "./components/MessageContainer";
import { useChat } from "../../../../contexts/ChatContext";
import { useQuery } from "@tanstack/react-query";

const ChatContainer = () => {
  const { selectedChat, joinChatRoom } = useChat();
  const [isMobile, setIsMobile] = useState(false);
  
  // Fetch messages for the selected chat
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["messages", selectedChat?._id],
    queryFn: async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/message/${selectedChat._id}`, {
          credentials: "include",
          headers: {
            "Accept": "application/json",
          }
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }
        
        return await response.json();
      } catch (error) {
        console.error("Fetch messages error:", error);
        return [];
      }
    },
    enabled: !!selectedChat,
    refetchInterval: 10000, // Refetch every 10 seconds as a fallback
  });
  
  // Join the chat room for socket.io
  useEffect(() => {
    if (selectedChat?._id) {
      joinChatRoom(selectedChat._id);
    }
  }, [selectedChat, joinChatRoom]);
  
  // Check if the device is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);
  
  return (
    <div className="flex flex-col h-full justify-between w-[100vw] md:static md:flex-1">
      <ChatHeader />
      <MessageContainer messages={messages} isLoading={isLoading} />
      <MessageBar chatId={selectedChat?._id} />
    </div>
  );
};

export default ChatContainer;
