import React from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../components/ui/sheet"
import { ScrollArea } from "../components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Button } from "../components/ui/button"

const ProfileModal = ({ user, isOpen, onOpenChange }) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80vh]">
        <ScrollArea className="h-full">
          {user && (
            <div className="flex flex-col items-center p-6">
              <SheetHeader>
                <SheetTitle>User Profile</SheetTitle>
                <SheetDescription>View and interact with the user's profile</SheetDescription>
              </SheetHeader>
              <Avatar className="w-32 h-32 mb-4 mt-4">
                <AvatarImage src={user.profileImg} alt={user.fullName} />
                <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold mb-2">{user.fullName}</h2>
              <p className="text-gray-500 mb-4">@{user.userName}</p>
              <p className="text-center mb-6">{user.bio}</p>
              <Button className="w-full mb-4">Follow</Button>
              <Button variant="outline" className="w-full">Message</Button>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

export default ProfileModal;