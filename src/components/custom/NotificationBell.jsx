import { useState, useEffect } from 'react';
import { Bell, FileText, MessagesSquare, Trash2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from "@/components/ui/scroll-area";

export const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const response = await api.get(`/notifications`, {
        params: { user_id: user.id }
      });
      setNotifications(response.data);
      setUnreadCount(response.data.filter(n => !n.read).length);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [user.id]);

  const getNotificationIcon = (notification) => {
    if (notification.forum_id) {
      return <MessagesSquare className="h-5 w-5 text-primary-blue" />;
    } else if (notification.memo_id) {
      return <FileText className="h-5 w-5 text-primary-green" />;
    }
    return null;
  };

  const handleNotificationClick = async (notification) => {
    try {
      await api.patch(`/notifications/${notification.id}/read`);

      if (notification.forum_id) {
        navigate(`/forums/${notification.forum_id}`);
      } else if (notification.memo_id) {
        navigate(`/memos/${notification.memo_id}/details`);
      }

      fetchNotifications();
    } catch (error) {
      console.error('Failed to handle notification:', error);
    }
  };

  const handleDelete = async (e, notification) => {
    e.stopPropagation();
    try {
      await api.delete(`/notifications/${notification.id}`);
      fetchNotifications();
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="relative"
          onClick={() => setOpen(true)}
        >
          <Bell className="h-7 w-7 text-[#24387d]" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Badge
                  className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0
                           bg-red-500 text-white border-2 border-white rounded-full text-xs font-bold"
                >
                  {unreadCount}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[380px] p-4 border border-[#dddddd] bg-white rounded-lg shadow-lg"
        align="end"
        sideOffset={5}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h4 className="text-lg font-semibold text-primary-blue">Notificaciones</h4>
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-sm text-gray-500 hover:text-primary-blue"
                onClick={() => {/* Add clear all functionality */ }}
              >
                Limpiar todo
              </Button>
            )}
          </div>

          <ScrollArea className="h-[400px] pr-4">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <Bell className="h-12 w-12 mb-2 opacity-20" />
                <p className="text-sm">No hay notificaciones</p>
              </div>
            ) : (
              <div className="space-y-2">
                <AnimatePresence>
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div
                        onClick={() => {
                          handleNotificationClick(notification);
                          setOpen(false);
                        }}
                        className={`
                          group flex justify-between items-start p-3 rounded-lg cursor-pointer
                          ${notification.read
                            ? 'bg-gray-50 hover:bg-gray-100'
                            : 'bg-primary-blue/5 hover:bg-primary-blue/10'
                          }
                          border border-transparent hover:border-primary-blue/20
                          transition-all duration-200 ease-in-out
                        `}
                      >
                        <div className="flex items-start space-x-3 flex-1 min-w-0">
                          <div className="mt-1 flex-shrink-0">
                            {getNotificationIcon(notification)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(notification.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(e, notification);
                            }}
                            className="opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 -mr-2"
                            title="Eliminar notificación"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}; 