'use client';

import { useState } from 'react';
import { 
  Bell, 
  X, 
  Target, 
  Trophy, 
  Star,
  Gift,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

import { Button } from 'components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/card';
import { Badge } from 'components/ui/badge';
import { ScrollArea } from 'components/ui/scroll-area';

interface Notification {
  id: string;
  type: 'quest' | 'reward' | 'level' | 'achievement' | 'reminder' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  actionLabel?: string;
}

// Fake notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'quest',
    title: 'Nouvelle quête disponible !',
    message: 'Une nouvelle quête "Site Noël - Restaurant" vient d\'être ajoutée. Récompense: 25 points + boost commission.',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    isRead: false,
    priority: 'high',
    actionUrl: '/affiliation?tab=quests',
    actionLabel: 'Voir la quête'
  },
  {
    id: '2',
    type: 'achievement',
    title: 'Nouveau niveau atteint !',
    message: 'Félicitations ! Vous venez de passer au niveau "Confirmé". Votre commission passe à 5.5%.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isRead: false,
    priority: 'high',
    actionUrl: '/affiliation?tab=levels',
    actionLabel: 'Voir mes avantages'
  },
  {
    id: '3',
    type: 'reward',
    title: 'Récompense disponible',
    message: 'Vous avez débloqué une nouvelle récompense : "Boost Commission 20%". Réclamez-la maintenant !',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    isRead: true,
    priority: 'medium',
    actionUrl: '/affiliation?tab=rewards',
    actionLabel: 'Réclamer'
  },
  {
    id: '4',
    type: 'reminder',
    title: 'Quête bientôt expirée',
    message: 'La quête "Site Halloween 2024" expire dans 24h. Il vous reste 2 étapes à compléter.',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    isRead: true,
    priority: 'medium',
    actionUrl: '/affiliation?tab=quests',
    actionLabel: 'Continuer'
  },
  {
    id: '5',
    type: 'system',
    title: 'Mise à jour des templates',
    message: 'De nouveaux templates de partage pour Instagram et TikTok sont maintenant disponibles.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    isRead: true,
    priority: 'low',
    actionUrl: '/affiliation?tab=templates',
    actionLabel: 'Découvrir'
  }
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'quest':
      return <Target className="h-4 w-4" />;
    case 'reward':
      return <Gift className="h-4 w-4" />;
    case 'level':
    case 'achievement':
      return <Trophy className="h-4 w-4" />;
    case 'reminder':
      return <Clock className="h-4 w-4" />;
    case 'system':
      return <Bell className="h-4 w-4" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

const getNotificationColor = (type: string, priority: string) => {
  if (priority === 'high') {
    return 'text-red-600 bg-red-50 border-red-200';
  }
  
  switch (type) {
    case 'quest':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'reward':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'achievement':
      return 'text-purple-600 bg-purple-50 border-purple-200';
    case 'reminder':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'high':
      return <Badge className="bg-red-100 text-red-800">Urgent</Badge>;
    case 'medium':
      return <Badge className="bg-yellow-100 text-yellow-800">Important</Badge>;
    default:
      return null;
  }
};

const formatTimestamp = (timestamp: Date) => {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (minutes < 60) {
    return `Il y a ${minutes} min`;
  } else if (hours < 24) {
    return `Il y a ${hours}h`;
  } else {
    return `Il y a ${days}j`;
  }
};

interface CreatorNotificationsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatorNotifications({ isOpen, onClose }: CreatorNotificationsProps) {
  const [notifications, setNotifications] = useState(mockNotifications);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    );
  };
  
  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-end p-4">
      <Card className="w-full max-w-md h-[80vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
              {unreadCount > 0 && (
                <Badge className="bg-red-100 text-red-800 ml-2">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Tout marquer lu
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-full px-6">
            <div className="space-y-3">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Aucune notification</p>
                </div>
              ) : (
                notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      notification.isRead 
                        ? 'bg-gray-50 border-gray-200' 
                        : getNotificationColor(notification.type, notification.priority)
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${
                        notification.isRead ? 'bg-gray-100' : 'bg-white'
                      }`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={`font-medium text-sm ${
                            notification.isRead ? 'text-gray-700' : 'text-gray-900'
                          }`}>
                            {notification.title}
                          </h4>
                          <div className="flex items-center gap-1">
                            {getPriorityBadge(notification.priority)}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <p className={`text-sm mt-1 ${
                          notification.isRead ? 'text-gray-500' : 'text-gray-700'
                        }`}>
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-gray-400">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          
                          {notification.actionUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs h-7"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Navigation logic here
                                console.log('Navigate to:', notification.actionUrl);
                              }}
                            >
                              {notification.actionLabel}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

// Composant pour le bouton de notification dans la navbar
export function NotificationButton() {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = mockNotifications.filter(n => !n.isRead).length;

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="relative"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>
      
      <CreatorNotifications 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
} 