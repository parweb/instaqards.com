import { User } from '@prisma/client';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from 'components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from 'components/ui/avatar';
import { Mail, MapPin, Share, Building2, Phone, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface ListProps {
  users: User[];
}

export const List = ({ users }: ListProps) => {
  return (
    <div
      data-mode="list"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-8 px-2"
    >
      {users.map(user => (
        <Card
          key={user.id}
          className="group transition-all duration-300 hover:scale-[1.025] hover:shadow-2xl border-0 bg-gradient-to-br from-white via-purple-50 to-purple-100/60 dark:from-background dark:via-purple-950/40 dark:to-purple-900/60 relative overflow-hidden cursor-pointer"
        >
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-purple-400/10 via-pink-300/10 to-blue-400/10" />
          <CardHeader className="flex flex-row items-center gap-4 p-6 pb-2">
            <Avatar className="h-14 w-14 shadow-lg ring-2 ring-purple-300/40 group-hover:ring-4 group-hover:ring-purple-400/60 transition-all duration-300">
              <AvatarImage
                src={user.image ?? undefined}
                alt={user.name ?? user.email}
              />
              <AvatarFallback className="text-lg font-bold bg-purple-200/60 text-purple-700">
                {user.name?.[0] ?? user.email[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <CardTitle className="truncate text-xl font-extrabold text-purple-900 dark:text-white group-hover:text-purple-700 transition-colors duration-300">
                {user.name ?? 'Utilisateur inconnu'}
              </CardTitle>
              <CardDescription className="flex items-center gap-1 text-purple-700/80 dark:text-purple-200/80 mt-1">
                <Mail size={16} className="mr-1 opacity-80" />
                <span className="truncate">{user.email}</span>
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 px-6 pt-0 pb-2">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-purple-400 mr-1" />
              <span className="text-sm text-purple-800/80 dark:text-purple-200/80 truncate">
                {typeof user.location === 'string'
                  ? user.location
                  : user.city || 'Localisation inconnue'}
              </span>
            </div>
            {user.company && (
              <div className="flex items-center gap-2">
                <Building2 size={16} className="text-purple-400 mr-1" />
                <span className="text-sm text-purple-800/80 dark:text-purple-200/80 truncate">
                  {user.company}
                </span>
              </div>
            )}
            {user.activity && (
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-purple-400 mr-1" />
                <span className="text-sm text-purple-800/80 dark:text-purple-200/80 truncate">
                  {user.activity}
                </span>
              </div>
            )}
            {user.phone && (
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-purple-400 mr-1" />
                <span className="text-sm text-purple-800/80 dark:text-purple-200/80 truncate">
                  {user.phone}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-purple-400 mr-1" />
              <span className="text-xs text-purple-700/60 dark:text-purple-200/60 truncate">
                Inscrit le {format(new Date(user.createdAt), 'dd MMMM yyyy')}
              </span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end px-6 pt-0 pb-4">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600 text-white font-semibold shadow-md hover:bg-purple-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400/60 focus:ring-offset-2 group-hover:scale-105"
              title="Découvrir ce profil"
            >
              <Share size={16} />
              Découvrir
            </button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
