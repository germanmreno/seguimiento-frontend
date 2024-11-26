import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileIcon, Download, Image as ImageIcon, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from 'lucide-react'

export const ChatMessage = ({ message = {}, onDelete, currentUserId }) => {
  const isImageFile = (fileName) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const ext = fileName?.split('.').pop().toLowerCase();
    return imageExtensions.includes(ext);
  };

  const isPDFFile = (fileName) => {
    return fileName?.split('.').pop().toLowerCase() === 'pdf';
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return FileIcon;
    const ext = fileName.split('.').pop().toLowerCase();
    switch (ext) {
      case 'pdf': return FileText;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return ImageIcon;
      case 'doc':
      case 'docx': return FileText;
      case 'xls':
      case 'xlsx': return FileText;
      default: return FileIcon;
    }
  };

  const FilePreview = ({ fileUrl, fileName }) => {
    const Icon = getFileIcon(fileName);
    const fullFileUrl = `http://localhost:3005${fileUrl}`

    if (isImageFile(fileName)) {
      return (
        <Dialog>
          <DialogTrigger asChild>
            <div className="cursor-pointer">
              <img
                src={fullFileUrl}
                alt={fileName}
                className="max-h-32 rounded-md object-cover hover:opacity-90 transition-opacity"
              />
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <img
              src={fullFileUrl}
              alt={fileName}
              className="w-full h-auto rounded-md"
            />
          </DialogContent>
        </Dialog>
      );
    }

    if (isPDFFile(fileName)) {
      return (
        <Dialog>
          <DialogTrigger asChild>
            <div className="cursor-pointer">
              <div className={cn(
                "inline-flex items-center space-x-2 px-3 py-2",
                "bg-gray-50 rounded-md",
                "hover:bg-primary-blue/10 hover:text-primary-blue",
                "transition-all duration-200",
                "group/file"
              )}>
                <Icon className="w-4 h-4" />
                <span className="text-sm">{fileName}</span>
                <Download className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-4xl h-[80vh]">
            <iframe
              src={fullFileUrl}
              className="w-full h-full rounded-md"
              title={fileName}
            />
          </DialogContent>
        </Dialog>
      );
    }

    return (
      <a
        href={fullFileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-flex items-center space-x-2 px-3 py-2",
          "bg-gray-50 rounded-md",
          "hover:bg-primary-blue/10 hover:text-primary-blue",
          "transition-all duration-200",
          "group/file"
        )}
      >
        <Icon className="w-4 h-4 transition-transform duration-200 group-hover/file:scale-110" />
        <span className="text-sm">{fileName}</span>
        <Download className="w-4 h-4 text-gray-500 transition-transform duration-200 group-hover/file:translate-y-0.5" />
      </a>
    );
  };

  return (
    <div className="group flex items-start space-x-4 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
      <Avatar className="ring-2 ring-primary-blue ring-offset-2">
        <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${message.user.username}`} />
        <AvatarFallback>{message.user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <p className="font-semibold text-primary-blue">{message.user.username}</p>
            <p className="text-xs text-gray-500">{message.createdAt}</p>
          </div>
          {message.user.id === currentUserId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(message.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-100 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="text-gray-700">{message.content}</p>

        {message.fileUrl && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2"
          >
            <FilePreview fileUrl={message.fileUrl} fileName={message.fileName} />
          </motion.div>
        )}
      </div>
    </div>
  )
}