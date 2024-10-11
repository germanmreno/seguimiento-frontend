import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { ChatMessage } from './ChatMessage'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export const ChatBox = ({ forumId }) => {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const scrollAreaRef = useRef(null)

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/forums/${forumId}/messages`)
      setMessages(response.data)
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
  }

  useEffect(() => {
    fetchMessages()
    const intervalId = setInterval(fetchMessages, 5000) // Fetch messages every 5 seconds
    return () => clearInterval(intervalId)
  }, [forumId])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      const user = JSON.parse(localStorage.getItem('user'))
      await axios.post(`http://localhost:3000/forums/${forumId}/messages`, {
        content: newMessage,
        user_id: user.id
      })
      setNewMessage('')
      fetchMessages()
    } catch (error) {
      console.error('Error al enviar mensaje:', error)
    }
  }

  return (
    <div className="bg-white shadow-md border-2 border-primary-blue rounded-lg p-4 w-full text-black">
      <ScrollArea className="h-[400px] mb-4" ref={scrollAreaRef}>
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </ScrollArea>
      <form onSubmit={handleSendMessage} className="flex space-x-2">
        <Input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe tu mensaje..."
          className="flex-grow"
        />
        <Button type="submit" className="bg-primary-blue text-white">Enviar</Button>
      </form>
    </div>
  )
}