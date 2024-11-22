import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

export const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/notifications?user_id=${user.id}`);
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

  const handleNotificationClick = async (notification) => {
    try {
      // Mark as read
      await axios.patch(`http://localhost:3000/notifications/${notification.id}/read`);
      // Navigate to forum
      navigate(`/forums/${notification.forum_id}`);
      // Refresh notifications
      fetchNotifications();
    } catch (error) {
      console.error('Failed to handle notification:', error);
    }
  };

  const handleDelete = async (e, notification) => {
    e.stopPropagation();
    try {
      await axios.delete(`http://localhost:3000/notifications/${notification.id}`);
      fetchNotifications();
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative">
          <Bell className="h-5 w-5 mr-4" />
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
                    flex justify-between items-start p-2 rounded-lg cursor-pointer
                    ${notification.read ? 'bg-gray-50' : 'bg-blue-50'}
                    hover:bg-gray-100 transition-colors
                  `}
                >
                  <div>
                    <p className="text-sm font-medium">{notification.message}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleDelete(e, notification)}
                    className="opacity-0 group-hover:opacity-100"
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}; 