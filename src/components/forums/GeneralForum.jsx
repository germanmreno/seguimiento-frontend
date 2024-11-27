import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { forumsService } from "@/services/forums.service";

export const GeneralForum = ({ memoId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      const forumData = await forumsService.getForumMessages(memoId);
      setMessages(forumData.messages || []);
    };
    fetchMessages();
  }, [memoId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    await forumsService.sendMessage(memoId, newMessage);
    setNewMessage("");
    // Refresh messages
    const forumData = await forumsService.getForumMessages(memoId);
    setMessages(forumData.messages || []);
  };

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle>Foro General</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] w-full rounded-md border p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className="mb-4 p-2 rounded bg-gray-100"
            >
              <div className="font-semibold">{message.user.name}</div>
              <div>{message.content}</div>
            </div>
          ))}
        </ScrollArea>
        <div className="flex gap-2 mt-4">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribir mensaje..."
          />
          <Button onClick={handleSendMessage}>Enviar</Button>
        </div>
      </CardContent>
    </Card>
  );
}; 