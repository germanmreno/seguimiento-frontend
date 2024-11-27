import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatMessage } from './ChatMessage'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Upload, FileIcon, X, Loader2, RefreshCw, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from "@/components/ui/badge"
import { toast } from 'sonner'
import { forumsService } from '@/services/forums.service'

export const ChatBox = ({ forumId, onDeleteMessage, currentUserId, forumStatus }) => {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [isSending, setIsSending] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [currentForumStatus, setCurrentForumStatus] = useState(forumStatus)
  const scrollAreaRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    setCurrentForumStatus(forumStatus)
  }, [forumStatus])

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight
      }
    }
  }

  const fetchMessages = async () => {
    setIsRefreshing(true)
    try {
      const [forumDetails, messages] = await Promise.all([
        forumsService.getForum(forumId),
        forumsService.getForumMessages(forumId)
      ])

      setMessages(messages)
      setCurrentForumStatus(forumDetails.status)

      if (forumDetails.status !== forumStatus) {
        window.dispatchEvent(new CustomEvent('forumStatusChanged', {
          detail: {
            forumId,
            status: forumDetails.status
          }
        }))
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
      toast.error('Error al cargar los mensajes')
    } finally {
      setIsRefreshing(false)
      setTimeout(scrollToBottom, 100)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()

    try {
      const forumDetails = await forumsService.getForum(forumId)
      if (forumDetails.status === 'CLOSED') {
        toast.error('Este foro está cerrado y no permite nuevos mensajes')
        setCurrentForumStatus('CLOSED')
        return
      }
    } catch (error) {
      console.error('Error checking forum status:', error)
      toast.error('Error al verificar el estado del foro')
      return
    }

    if ((!newMessage.trim() && !selectedFile) || isSending) return

    setIsSending(true)
    try {
      const formData = new FormData()
      formData.append('content', newMessage)
      formData.append('user_id', currentUserId)

      if (selectedFile) {
        formData.append('file', selectedFile)
      }

      await forumsService.sendForumMessage(forumId, formData)

      setNewMessage('')
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      await fetchMessages()
      toast.success('Mensaje enviado correctamente')
    } catch (error) {
      console.error('Failed to send message:', error)
      if (error.response?.status === 403) {
        setCurrentForumStatus('CLOSED')
        toast.error('Este foro está cerrado y no permite nuevos mensajes')
      } else {
        toast.error('Error al enviar el mensaje')
      }
    } finally {
      setIsSending(false)
    }
  }

  const handleDeleteMessage = async (messageId) => {
    try {
      await forumsService.deleteForumMessage(forumId, messageId, currentUserId)
      await onDeleteMessage(messageId)
      await fetchMessages()
      setTimeout(scrollToBottom, 100)
    } catch (error) {
      console.error('Error handling message deletion:', error)
      toast.error('Error al eliminar el mensaje')
    }
  }

  // Initial fetch and scroll
  useEffect(() => {
    fetchMessages()
  }, [forumId])

  // Scroll when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages.length])

  return (
    <div className="bg-white shadow-md border-2 border-primary-blue rounded-lg p-4 w-full text-black">
      {currentForumStatus === 'CLOSED' && (
        <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center justify-center gap-2 text-red-700">
            <Lock className="h-4 w-4" />
            <p className="text-sm font-medium">Este foro está cerrado y no permite nuevos mensajes</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-primary-blue">Mensajes</h3>
          {currentForumStatus === 'CLOSED' && (
            <Badge variant="destructive" className="animate-pulse">
              Foro Cerrado
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchMessages}
          disabled={isRefreshing}
          className="text-primary-blue hover:text-primary-blue/80"
        >
          <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
        </Button>
      </div>

      <div className="relative">
        <ScrollArea
          ref={scrollAreaRef}
          className="h-[400px] mb-4 pr-4"
        >
          <AnimatePresence mode="popLayout">
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.2,
                    delay: index * 0.05,
                    ease: "easeOut"
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

          <AnimatePresence>
            {isRefreshing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center space-y-2 text-primary-blue"
                >
                  <RefreshCw className="h-8 w-8 animate-spin" />
                  <span className="text-sm font-medium">Actualizando mensajes...</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </ScrollArea>
      </div>

      <form onSubmit={handleSendMessage} className="space-y-2">
        <motion.div
          className="flex items-center space-x-2"
          initial={false}
          animate={{
            opacity: currentForumStatus === 'CLOSED' ? 0.5 : 1,
            scale: currentForumStatus === 'CLOSED' ? 0.98 : 1
          }}
        >
          <div className="relative flex-grow group">
            <Input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={currentForumStatus === 'CLOSED' ? "Este foro está cerrado" : "Escribe tu mensaje..."}
              disabled={currentForumStatus === 'CLOSED'}
              className={cn(
                "pr-12 transition-all duration-200",
                currentForumStatus === 'CLOSED' && "cursor-not-allowed bg-gray-50"
              )}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <label
                htmlFor="file-upload"
                className={cn(
                  "cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors",
                  currentForumStatus === 'CLOSED' && "cursor-not-allowed opacity-50"
                )}
              >
                <Upload className="h-4 w-4 text-gray-500" />
              </label>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileSelect}
                disabled={currentForumStatus === 'CLOSED'}
              />
            </div>
          </div>

          <motion.div whileHover={{ scale: currentForumStatus === 'CLOSED' ? 1 : 1.05 }}>
            <Button
              type="submit"
              disabled={currentForumStatus === 'CLOSED' || isSending}
              className={cn(
                "bg-primary-blue text-white transition-all duration-200",
                "hover:bg-primary-blue/90",
                "focus:ring-2 focus:ring-primary-blue focus:ring-offset-2",
                (isSending || currentForumStatus === 'CLOSED') && "opacity-50 cursor-not-allowed"
              )}
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Enviar'
              )}
            </Button>
          </motion.div>
        </motion.div>

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
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="ml-2 h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  )
}