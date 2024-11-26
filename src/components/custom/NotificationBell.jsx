import { useState, useEffect } from 'react';
import { Bell, MessageCircle, FileText, MessagesSquare, Trash2 } from 'lucide-react';
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

export const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
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
      return <MessagesSquare className="h-4 w-4 text-blue-500" />;
    } else if (notification.memo_id) {
      return <FileText className="h-4 w-4 text-green-500" />;
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
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 mr-2"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-medium">Notificaciones</h4>
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500">No hay notificaciones</p>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`
                    group flex justify-between items-start p-2 rounded-lg cursor-pointer
                    ${notification.read ? 'bg-gray-50' : 'bg-blue-50'}
                    hover:bg-gray-100 transition-colors
                  `}
                >
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="mt-1">
                      {getNotificationIcon(notification)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{notification.message}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDelete(e, notification)}
                      className="opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600"
                      title="Eliminar notificación"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}; 