import { format, formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
  LuArrowLeft,
  LuCalendarClock,
  LuClipboardList,
  LuCode,
  LuExternalLink,
  LuEye,
  LuFileText,
  LuGlobe,
  LuHistory,
  LuMail,
  LuMousePointerClick,
  LuSend,
  LuUser
} from 'react-icons/lu';

import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';
import { Badge } from 'components/ui/badge';
import { Separator } from 'components/ui/separator';
import { db } from 'helpers/db';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from 'components/ui/card';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from 'components/ui/table';

const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return 'N/A';
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'PPP p');
  } catch (error) {
    console.warn('Error formatting date:', date, error);
    return 'Invalid Date';
  }
};

const formatRelativeTime = (date: Date | string | null | undefined): string => {
  if (!date) return 'N/A';
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch (error) {
    console.warn('Error formatting relative time:', date, error);
    return 'Invalid Date';
  }
};

const StatusBadge = ({ status }: { status: string | undefined | null }) => {
  if (!status) return null;
  const lowerStatus = status.toLowerCase();
  let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';

  if (['sent', 'delivered', 'opened', 'success'].includes(lowerStatus)) {
    variant = 'default';
  } else if (['pending', 'processing', 'queued'].includes(lowerStatus)) {
    variant = 'secondary';
  } else if (['failed', 'bounced', 'error'].includes(lowerStatus)) {
    variant = 'destructive';
  } else {
    variant = 'outline';
  }
  return <Badge variant={variant}>{status}</Badge>;
};

interface EmailEvent {
  type: 'sent' | 'open' | 'click' | string;
  createdAt: string | Date;
  ip?: string;
  agent?: string;
  url?: string;
  name?: string;
}

export default async function OutboxDetailPage(props: {
  params: Promise<{ userId: string; outboxId: string }>;
}) {
  const params = await props.params;
  const userId = params.userId;
  const outboxId = params.outboxId;

  if (!userId || !outboxId) {
    notFound();
  }

  let outbox;
  try {
    outbox = await db.outbox.findUniqueOrThrow({
      where: { id: outboxId },
      include: {
        user: {
          select: { id: true, name: true, image: true }
        }
      }
    });
  } catch (error) {
    console.error('Failed to fetch outbox item:', error);
    notFound();
  }

  const recipientUser = outbox.user;

  const metadata = outbox.metadata as unknown as { events: EmailEvent[] };

  const emailEvents: EmailEvent[] = Array.isArray(metadata?.events)
    ? metadata.events.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
    : [];

  const getEventIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'sent':
        return <LuSend className="h-4 w-4 text-blue-500" />;
      case 'open':
        return <LuEye className="h-4 w-4 text-green-500" />;
      case 'click':
        return <LuMousePointerClick className="h-4 w-4 text-orange-500" />;
      default:
        return <LuHistory className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6 max-w-5xl">
      <div className="flex items-center gap-4">
        <Link
          href={`/affiliation/user/${userId}`}
          className="p-2 rounded-md hover:bg-muted"
          aria-label="Back to User Details"
        >
          <LuArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Outbox Email Detail
        </h1>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LuClipboardList className="h-5 w-5" />
            Email Information
          </CardTitle>

          <CardDescription>
            Details about the queued or sent email.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 text-sm">
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <div className="flex items-center gap-2">
              <LuMail className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Recipient:</span>
              <span>{outbox.email}</span>

              {recipientUser && (
                <Link
                  href={`/affiliation/user/${recipientUser.id}`}
                  className="ml-2"
                >
                  <Avatar className="h-5 w-5 inline-block align-middle">
                    <AvatarImage
                      src={recipientUser.image ?? undefined}
                      alt={recipientUser.name ?? ''}
                    />
                    <AvatarFallback className="text-xs">
                      {(
                        recipientUser.name?.[0] || outbox.email[0]
                      )?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              )}
            </div>

            <div className="flex items-center gap-2">
              <LuFileText className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Subject:</span>
              <span>{outbox.subject}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <div className="flex items-center gap-2">
              <LuCalendarClock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Queued:</span>
              <span title={formatDate(outbox.createdAt)}>
                {formatRelativeTime(outbox.createdAt)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-medium">Status:</span>
              <StatusBadge status={outbox.status} />
            </div>
          </div>

          {outbox.metadata &&
            Object.keys(outbox.metadata).length > 0 &&
            !emailEvents.length && (
              <div className="pt-3 mt-3 border-t">
                <h4 className="font-medium mb-1 flex items-center gap-1">
                  <LuCode className="h-4 w-4 text-muted-foreground" /> Metadata:
                </h4>
                <pre className="text-xs p-2 bg-muted rounded overflow-x-auto">
                  {JSON.stringify(outbox.metadata, null, 2)}
                </pre>
              </div>
            )}
        </CardContent>
      </Card>

      {emailEvents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LuHistory className="h-5 w-5" />
              Event History
            </CardTitle>

            <CardDescription>
              Tracking events associated with this email.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Type</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {emailEvents.map((event, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2 capitalize">
                        {getEventIcon(event.type)}
                        {event.type}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col text-xs">
                        <span title={formatDate(event.createdAt)}>
                          {formatRelativeTime(event.createdAt)}
                        </span>
                        <span className="text-muted-foreground">
                          {formatDate(event.createdAt)}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs">
                      <div className="space-y-1">
                        {event.ip && (
                          <div className="flex items-center gap-1">
                            <LuGlobe className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                            <span>IP: {event.ip}</span>
                          </div>
                        )}
                        {event.agent && (
                          <div
                            className="flex items-center gap-1"
                            title={event.agent}
                          >
                            <LuUser className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                            <span className="truncate">
                              Agent: {event.agent}
                            </span>
                          </div>
                        )}

                        {event.type === 'click' && event.url && (
                          <div className="flex items-center gap-1">
                            <LuExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                            <span>
                              URL:{' '}
                              <a
                                href={event.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {event.url}
                              </a>
                            </span>

                            {event.name && (
                              <span className="text-muted-foreground ml-1">
                                ({event.name})
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LuEye className="h-5 w-5" />
            Email Preview
          </CardTitle>

          <CardDescription>
            Rendered view of the HTML email body. Styling may differ slightly
            from an actual email client.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <iframe
            srcDoc={outbox.body}
            title="Email Preview"
            className="w-full h-[600px] border rounded-md bg-white"
            sandbox="allow-same-origin"
          />
        </CardContent>
      </Card>

      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LuCode className="h-5 w-5" />
            Raw HTML Body
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <pre className="text-xs p-3 bg-muted rounded overflow-auto max-h-[400px]">
            <code>{outbox.body}</code>
          </pre>
        </CardContent>
      </Card> */}
    </div>
  );
}
