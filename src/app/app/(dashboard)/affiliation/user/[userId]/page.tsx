import { format as formatDateFns, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
  LuActivity,
  LuCalendar,
  LuCircleCheck,
  LuCirclePlay,
  LuCircleX,
  LuGlobe,
  LuHandshake,
  LuKey,
  LuLink,
  LuListChecks,
  LuMail,
  LuMessageSquare,
  LuMessagesSquare,
  LuPackage,
  LuPhone,
  LuPlus,
  LuSend,
  LuShieldCheck,
  LuShoppingCart,
  LuThumbsUp,
  LuUser,
  LuUsers,
  LuVideo,
  LuWorkflow
} from 'react-icons/lu';

import ModalButton from 'components/modal-button';
import ProspectCommentModal from 'components/modal/comment-prospect';
import OutboxCreateModal from 'components/modal/create-outbox';
import CreateSiteModal from 'components/modal/create-site';
import UserMagicLinkModal from 'components/modal/magiclink-user';
import ProspectReservationModal from 'components/modal/reservation-prospect';
import { Badge } from 'components/ui/badge';
import { db } from 'helpers/db';
import { uri } from 'settings';

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
    return formatDateFns(dateObj, 'd MMMM yyyy', { locale: fr });
  } catch (error) {
    console.error(error);
    return 'Invalid Date';
  }
};

const formatRelativeTime = (date: Date | string | null | undefined): string => {
  if (!date) return 'N/A';
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch (error) {
    console.error(error);
    return 'Invalid Date';
  }
};

const formatHour = (date: Date | string | null | undefined): string => {
  if (!date) return '';
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return formatDateFns(dateObj, 'HH:mm');
  } catch {
    return '';
  }
};

const StatusBadge = ({ status }: { status: string | undefined | null }) => {
  if (!status) return null;
  const lowerStatus = status.toLowerCase();
  let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';
  if (
    ['active', 'success', 'completed', 'subscribed', 'verified'].includes(
      lowerStatus
    )
  ) {
    variant = 'default';
  } else if (
    ['pending', 'processing', 'trialing', 'paused'].includes(lowerStatus)
  ) {
    variant = 'secondary';
  } else if (
    [
      'failed',
      'canceled',
      'error',
      'unpaid',
      'incomplete',
      'incomplete_expired',
      'past_due'
    ].includes(lowerStatus)
  ) {
    variant = 'destructive';
  } else {
    variant = 'outline';
  }
  return <Badge variant={variant}>{status}</Badge>;
};

export default async function UserPage(props: {
  params: Promise<{ userId: string }>;
}) {
  const params = await props.params;
  const userId = params.userId;

  if (!userId) {
    notFound();
  }

  const user = await db.user.findUniqueOrThrow({
    where: {
      id: userId
    },
    include: {
      clicks: true,
      accounts: true,
      sessions: { orderBy: { expires: 'desc' } },
      sites: { orderBy: { createdAt: 'desc' } },
      subscriptions: {
        include: {
          price: {
            include: {
              product: true
            }
          }
        },
        orderBy: { created: 'desc' }
      },
      Authenticator: true,
      links: { orderBy: { createdAt: 'desc' } },
      customer: true,
      twoFactorConfirmation: true,
      feedback: { orderBy: { createdAt: 'desc' } },
      likes: { include: { site: true }, orderBy: { createdAt: 'desc' } },
      affiliates: { select: { id: true, name: true, email: true } },
      referer: { select: { id: true, name: true, email: true } },
      events: { orderBy: { createdAt: 'desc' }, take: 20 },
      workflowStates: {
        include: { workflow: true },
        orderBy: { updatedAt: 'desc' }
      },
      executions: {
        include: { action: true },
        orderBy: { executedAt: 'desc' },
        take: 20
      },
      jobs: { orderBy: { createdAt: 'desc' }, take: 20 },
      outbox: { orderBy: { createdAt: 'desc' }, take: 20 },
      comments: { orderBy: { createdAt: 'desc' } }
    }
  });

  if (!user) {
    notFound();
  }

  const reservations = await db.reservation.findMany({
    where: { email: user.email },
    orderBy: { dateStart: 'desc' }
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LuUser />
              User Profile
            </CardTitle>

            <CardDescription>
              Core information and settings for this user.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">
                  User ID:
                </span>

                <p className="font-mono break-all">{user.id}</p>
              </div>

              <div>
                <span className="font-medium text-muted-foreground">
                  Email Verified:
                </span>

                <p className="flex items-center gap-1">
                  {user.emailVerified ? (
                    <>
                      <LuCircleCheck className="h-4 w-4 text-green-600" />
                      {formatDate(user.emailVerified)}
                    </>
                  ) : (
                    <>
                      <LuCircleX className="h-4 w-4 text-red-600" />
                      Not Verified
                    </>
                  )}
                </p>
              </div>

              <div>
                <span className="font-medium text-muted-foreground">
                  Two-Factor Auth:
                </span>

                <p className="flex items-center gap-1">
                  {user.isTwoFactorEnabled ? (
                    <>
                      <LuShieldCheck className="h-4 w-4 text-green-600" />
                      Enabled
                      {user.twoFactorConfirmation && ' (Confirmed)'}
                    </>
                  ) : (
                    <>
                      <LuCircleX className="h-4 w-4 text-muted-foreground" />
                      Disabled
                    </>
                  )}
                </p>
              </div>

              <div>
                <span className="font-medium text-muted-foreground">
                  Joined:
                </span>
                <p>
                  {formatDate(user.createdAt)} (
                  {formatRelativeTime(user.createdAt)})
                </p>
              </div>

              <div>
                <span className="font-medium text-muted-foreground">
                  Last Updated:
                </span>
                <p>
                  {formatDate(user.updatedAt)} (
                  {formatRelativeTime(user.updatedAt)})
                </p>
              </div>

              {user.customer && (
                <div>
                  <span className="font-medium text-muted-foreground">
                    Stripe Customer ID:
                  </span>
                  <p className="font-mono break-all">
                    {user.customer.stripe_customer_id}
                  </p>
                </div>
              )}

              {user.referer && (
                <div>
                  <span className="font-medium text-muted-foreground">
                    Referred By:
                  </span>
                  <p>
                    <Link
                      href={`/affiliation/user/${user.referer.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {user.referer.name ?? user.referer.email}
                    </Link>
                  </p>
                </div>
              )}
            </div>

            {user.billing_address &&
              Object.keys(user.billing_address).length > 0 && (
                <div className="mt-4">
                  <span className="font-medium text-muted-foreground">
                    Billing Address:
                  </span>
                  <pre className="mt-1 text-xs p-2 bg-muted rounded overflow-x-auto">
                    {JSON.stringify(user.billing_address, null, 2)}
                  </pre>
                </div>
              )}

            {user.payment_method &&
              Object.keys(user.payment_method).length > 0 && (
                <div className="mt-4">
                  <span className="font-medium text-muted-foreground">
                    Payment Method:
                  </span>
                  <pre className="mt-1 text-xs p-2 bg-muted rounded overflow-x-auto">
                    {JSON.stringify(user.payment_method, null, 2)}
                  </pre>
                </div>
              )}
          </CardContent>
        </Card>

        {user.subscriptions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LuShoppingCart />
                Subscriptions
              </CardTitle>
            </CardHeader>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Period End</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Trial End</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {user.subscriptions.map(sub => (
                    <TableRow key={sub.id}>
                      <TableCell className="font-medium">
                        {sub.price?.product?.name ?? 'Unknown Plan'}
                      </TableCell>

                      <TableCell>
                        <StatusBadge status={sub.status} />
                      </TableCell>

                      <TableCell>
                        {formatDate(sub.current_period_end)}
                      </TableCell>

                      <TableCell>
                        {sub.price?.unit_amount
                          ? `${(sub.price.unit_amount / 100).toFixed(2)} ${sub.price.currency.toUpperCase()}`
                          : 'N/A'}
                        {sub.price?.type === 'recurring' &&
                          ` / ${sub.price.interval}`}
                      </TableCell>

                      <TableCell>
                        {sub.trial_end ? formatDate(sub.trial_end) : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex-row items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2">
              <LuGlobe />
              Sites
            </CardTitle>

            <div>
              <ModalButton size="sm" label={<LuPlus />}>
                <CreateSiteModal user={user} />
              </ModalButton>
            </div>
          </CardHeader>

          {user.sites.length > 0 && (
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Domain/Subdomain</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {user.sites.map(site => {
                    return (
                      <TableRow key={site.id}>
                        <TableCell className="font-medium">
                          {site.name ?? 'Unnamed Site'}
                        </TableCell>

                        <TableCell>
                          <a
                            href={uri.site(site).link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {uri.site(site).title}
                          </a>
                        </TableCell>

                        <TableCell>
                          {formatRelativeTime(site.createdAt)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          )}
        </Card>

        {user.links.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LuLink />
                Created Links
              </CardTitle>
            </CardHeader>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {user.links.map(link => (
                    <TableRow key={link.id}>
                      <TableCell className="font-medium">
                        {link.name ?? 'Unnamed Link'}
                      </TableCell>

                      <TableCell>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate block max-w-xs"
                        >
                          {link.url}
                        </a>
                      </TableCell>

                      <TableCell>
                        {formatRelativeTime(link.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {(user.events.length > 0 ||
          user.executions.length > 0 ||
          user.jobs.length > 0) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LuActivity />
                Recent Activity
              </CardTitle>

              <CardDescription>
                Latest events, action executions, and background jobs initiated
                by the user.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {user.events.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center gap-1">
                    <LuCirclePlay className="h-4 w-4 text-muted-foreground" />
                    Events
                  </h3>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {user.events.map(event => (
                        <TableRow key={event.id}>
                          <TableCell className="font-medium">
                            {event.eventType}
                          </TableCell>

                          <TableCell>
                            <StatusBadge status={event.status} />
                          </TableCell>

                          <TableCell>
                            {formatRelativeTime(event.createdAt)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {user.executions.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center gap-1">
                    <LuListChecks className="h-4 w-4 text-muted-foreground" />
                    Action Executions
                  </h3>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Action</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Executed At</TableHead>
                        <TableHead>Error</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {user.executions.map(exec => (
                        <TableRow key={exec.id}>
                          <TableCell className="font-medium">
                            {exec.action?.code ?? exec.actionId}
                          </TableCell>

                          <TableCell>
                            <StatusBadge status={exec.status} />
                          </TableCell>

                          <TableCell>
                            {exec.executedAt
                              ? formatRelativeTime(exec.executedAt)
                              : 'Pending'}
                          </TableCell>

                          <TableCell
                            className="text-red-600 text-xs truncate max-w-xs"
                            title={exec.errorMessage ?? ''}
                          >
                            {exec.errorMessage}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {user.jobs.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center gap-1">
                    <LuPackage className="h-4 w-4 text-muted-foreground" />
                    Background Jobs
                  </h3>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Job</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Attempts</TableHead>
                        <TableHead>Scheduled</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {user.jobs.map(job => (
                        <TableRow key={job.id}>
                          <TableCell className="font-medium">
                            {job.job}
                          </TableCell>

                          <TableCell>
                            <StatusBadge status={job.status} />
                          </TableCell>

                          <TableCell>{job.attempts}</TableCell>

                          <TableCell>{formatRelativeTime(job.runAt)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {user.clicks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LuActivity />
                Page visited
              </CardTitle>

              <CardDescription>
                List of pages visited by the user.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Path</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {user.clicks.map(click => (
                      <TableRow key={click.id}>
                        <TableCell>
                          {formatRelativeTime(click.createdAt)}
                        </TableCell>

                        <TableCell className="font-medium">
                          {click.path}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 justify-between">
            <CardTitle className="flex items-center gap-2">
              <LuShieldCheck />
              Security & Auth
            </CardTitle>

            <div>
              <ModalButton label={<LuKey />} size="sm">
                <UserMagicLinkModal user={{ id: user.id, email: user.email }} />
              </ModalButton>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {user.accounts.length > 0 && (
              <div>
                <h3 className="text-md font-medium mb-2">Linked Accounts</h3>
                <ul className="space-y-1 list-disc list-inside">
                  {user.accounts.map(acc => (
                    <li key={acc.id} className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        {acc.provider}
                      </span>
                      ({acc.providerAccountId.substring(0, 10)}...)
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {user.Authenticator.length > 0 && (
              <div>
                <h3 className="text-md font-medium mb-2 pt-3 border-t">
                  Passkeys / Authenticators
                </h3>

                <ul className="space-y-1 list-disc list-inside">
                  {user.Authenticator.map(auth => (
                    <li key={auth.id} className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        {auth.credentialDeviceType}
                      </span>
                      (ID: ...{auth.credentialID.slice(-8)})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {user.sessions.length > 0 && (
              <div>
                <h3 className="text-md font-medium mb-2 pt-3 border-t">
                  Active Sessions
                </h3>
                <ul className="space-y-1 list-disc list-inside">
                  {user.sessions.map(session => (
                    <li
                      key={session.id}
                      className="text-sm text-muted-foreground"
                    >
                      Expires: {formatRelativeTime(session.expires)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {user.affiliates.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LuUsers />
                Users Referred
              </CardTitle>
            </CardHeader>

            <CardContent>
              <ul className="space-y-2">
                {user.affiliates.map(affiliate => (
                  <li key={affiliate.id} className="text-sm">
                    <Link
                      href={`/affiliation/user/${affiliate.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {affiliate.name ?? affiliate.email}
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {user.feedback.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LuMessageSquare />
                Feedback Submitted
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {user.feedback.map(fb => (
                <div
                  key={fb.id}
                  className="text-sm border-b pb-2 last:border-b-0"
                >
                  <p className="text-muted-foreground mb-1">
                    {formatRelativeTime(fb.createdAt)}
                  </p>
                  <p>{fb.message}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {user.likes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LuThumbsUp />
                Liked Sites
              </CardTitle>
            </CardHeader>

            <CardContent>
              <ul className="space-y-2">
                {user.likes.map(like => (
                  <li
                    key={like.id}
                    className="text-sm flex justify-between items-center"
                  >
                    <span>{like.site?.name ?? like.siteId}</span>
                    <span className="text-muted-foreground text-xs">
                      {formatRelativeTime(like.createdAt)}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {user.workflowStates.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LuWorkflow />
                Active Workflows
              </CardTitle>
            </CardHeader>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Workflow</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Started</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {user.workflowStates.map(ws => (
                    <TableRow key={ws.id}>
                      <TableCell className="font-medium">
                        {ws.workflow.name}
                      </TableCell>

                      <TableCell>
                        <StatusBadge status={ws.status} />
                      </TableCell>

                      <TableCell>{formatRelativeTime(ws.startedAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2">
              <LuPackage />
              Réservations
            </CardTitle>
            <div className="flex gap-2 items-center">
              <ModalButton label={<LuPhone />} size="sm">
                <ProspectReservationModal
                  user={{ id: user.id, email: user.email, name: user.name }}
                  type="PHONE"
                />
              </ModalButton>

              <ModalButton label={<LuVideo />} size="sm">
                <ProspectReservationModal
                  user={{ id: user.id, email: user.email, name: user.name }}
                  type="VISIO"
                />
              </ModalButton>

              <ModalButton label={<LuHandshake />} size="sm">
                <ProspectReservationModal
                  user={{ id: user.id, email: user.email, name: user.name }}
                  type="PHYSIC"
                />
              </ModalButton>

              <ModalButton label={<LuCalendar />} size="sm">
                <ProspectReservationModal
                  user={{ id: user.id, email: user.email, name: user.name }}
                  type="REMINDER"
                />
              </ModalButton>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {reservations.map((res: (typeof reservations)[0]) => (
                <li
                  key={res.id}
                  className="text-sm flex flex-col border-b pb-2 last:border-b-0"
                >
                  <span className="font-medium">
                    {res.type || 'Type inconnu'}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {formatDate(res.dateStart)}
                    {res.dateEnd && (
                      <>
                        {res.dateStart &&
                          res.dateEnd &&
                          (new Date(res.dateStart).toDateString() ===
                          new Date(res.dateEnd).toDateString()
                            ? ` (${formatHour(res.dateStart)} → ${formatHour(res.dateEnd)})`
                            : ` → ${formatDate(res.dateEnd)}`)}
                      </>
                    )}
                  </span>
                  {res.comment && (
                    <span className="italic text-xs">{res.comment}</span>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2">
              <LuMessageSquare />
              Commentaires
            </CardTitle>

            <ModalButton label={<LuMessagesSquare />} size="sm">
              <ProspectCommentModal user={{ id: user.id }} />
            </ModalButton>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {user.comments.map(comment => (
                <li
                  key={comment.id}
                  className="text-sm border-b pb-2 last:border-b-0"
                >
                  <span className="text-muted-foreground text-xs">
                    {formatRelativeTime(comment.createdAt)}
                  </span>
                  <div>{comment.content}</div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2">
              <LuMail />
              Recent Outbox Emails
            </CardTitle>

            <div>
              <ModalButton size="sm" label={<LuSend />}>
                <OutboxCreateModal user={user} />
              </ModalButton>
            </div>
          </CardHeader>

          {user.outbox.length > 0 && (
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sent</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {user.outbox.map(o => (
                    <TableRow key={o.id}>
                      <TableCell className="font-medium truncate max-w-[150px]">
                        <Link
                          href={`/affiliation/user/${userId}/outbox/${o.id}`}
                        >
                          {o.subject}
                        </Link>
                      </TableCell>

                      <TableCell>
                        <StatusBadge status={o.status} />
                      </TableCell>

                      <TableCell>{formatRelativeTime(o.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
