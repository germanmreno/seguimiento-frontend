import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatMessage } from './ChatMessage'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Upload, FileIcon, X, Loader2, RefreshCw, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export const ChatBox = ({ forumId, onDeleteMessage, currentUserId }) => {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [isSending, setIsSending] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const scrollAreaRef = useRef(null)
  const fileInputRef = useRef(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }

  const fetchMessages = async () => {
    setIsRefreshing(true)
    setIsAnimating(true)
    try {
      const response = await axios.get(`http://localhost:3000/forums/${forumId}/messages`)
      setMessages(response.data)
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    } finally {
      setIsRefreshing(false)
      setTimeout(() => setIsAnimating(false), 300)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedFile) || isSending) return;

    setIsSending(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const formData = new FormData();
      formData.append('content', newMessage);
      formData.append('user_id', user.id);

      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const response = await axios.post(
        `http://localhost:3000/forums/${forumId}/messages`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Add the new message to the messages array
      setMessages(prev => [...prev, response.data]);

      // Clear form
      setNewMessage('');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Scroll to bottom after sending
      scrollToBottom();
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await onDeleteMessage(messageId);
      // After successful deletion, refresh messages
      await fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  // Initial fetch when component mounts
  useEffect(() => {
    fetchMessages();
  }, [forumId]); // Add forumId as dependency to refetch if forum changes

  // Existing scroll effect
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="bg-white shadow-md border-2 border-primary-blue rounded-lg p-4 w-full text-black">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-primary-blue">Mensajes</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchMessages}
          disabled={isRefreshing}
          className={cn(
            "transition-all duration-200",
            "hover:bg-primary-blue/10 hover:text-primary-blue",
            "focus:ring-2 focus:ring-primary-blue focus:ring-offset-2",
            "relative"
          )}
        >
          <RefreshCw
            className={cn(
              "h-4 w-4 mr-2 transition-transform duration-300",
              isRefreshing && "animate-spin",
              isAnimating && "rotate-180"
            )}
          />
          Actualizar
        </Button>
      </div>

      <ScrollArea
        className="h-[400px] mb-4 pr-4"
        ref={scrollAreaRef}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isAnimating ? 'refreshing' : 'stable'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: isAnimating ? message.id * 0.1 : 0
                }}
              >
                <ChatMessage
                  message={message}
                  onDelete={handleDeleteMessage}
                  currentUserId={currentUserId}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </ScrollArea>

      <form onSubmit={handleSendMessage} className="space-y-2">
        <div className="flex items-center space-x-2">
          <div className="relative flex-grow group">
            <Input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className={cn(
                "pr-12 transition-all duration-200 ease-in-out",
                "focus:ring-2 focus:ring-primary-blue focus:border-transparent",
                "group-hover:border-primary-blue"
              )}
              disabled={isSending}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "h-8 w-8 transition-all duration-200",
                  "hover:bg-primary-blue/10 hover:text-primary-blue",
                  "focus:ring-2 focus:ring-primary-blue focus:ring-offset-2",
                  isSending && "opacity-50 cursor-not-allowed"
                )}
                disabled={isSending}
              >
                <Upload className="h-4 w-4" />
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                disabled={isSending}
              />
            </div>
          </div>
          <Button
            type="submit"
            className={cn(
              "bg-primary-blue text-white transition-all duration-200",
              "hover:bg-primary-blue/90",
              "focus:ring-2 focus:ring-primary-blue focus:ring-offset-2",
              isSending && "opacity-50 cursor-not-allowed"
            )}
            disabled={isSending}
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Enviar'
            )}
          </Button>
        </div>

        <AnimatePresence>
          {selectedFile && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-md p-2"
            >
              <FileIcon className="h-4 w-4 mr-2 text-primary-blue" />
              <span className="truncate flex-1">{selectedFile.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={cn(
                  "ml-2 h-6 w-6 p-0",
                  "hover:bg-red-100 hover:text-red-600",
                  "focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
                  "transition-all duration-200"
                )}
                onClick={() => {
                  setSelectedFile(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  )
}