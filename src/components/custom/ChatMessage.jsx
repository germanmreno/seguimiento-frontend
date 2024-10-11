import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const ChatMessage = ({ message = {} }) => {

  return (
    <div className="flex items-start space-x-4 mb-4">
      <Avatar>
        <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${message.user.username}`} />
        <AvatarFallback>{message.user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-semibold">{message.user.username}</p>
        <p className="text-sm text-gray-500">{message.createdAt}</p>
        <p className="mt-1">{message.content}</p>
      </div>
    </div>
  )
}