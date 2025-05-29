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
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      emailVerified: true,
      isTwoFactorEnabled: true,
      billing_address: true,
      payment_method: true,
      phone: true,
      clicks: {
        select: {
          id: true,
          createdAt: true,
          path: true
        }
      },
      accounts: {
        select: {
          id: true,
          providerId: true,
          providerAccountId: true
        }
      },
      sessions: {
        select: {
          id: true,
          expires: true
        },
        orderBy: { expires: 'desc' }
      },
      sites: {
        select: {
          id: true,
          name: true,
          subdomain: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' }
      },
      subscriptions: {
        select: {
          id: true,
          status: true,
          current_period_end: true,
          trial_end: true,
          price: {
            select: {
              product: {
                select: {
                  name: true
                }
              },
              unit_amount: true,
              currency: true,
              type: true,
              interval: true
            }
          }
        },
        orderBy: { created: 'desc' }
      },
      authenticator: {
        select: {
          id: true,
          credentialDeviceType: true,
          credentialID: true
        }
      },
      links: {
        select: {
          id: true,
          name: true,
          url: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' }
      },
      customer: {
        select: {
          stripe_customer_id: true
        }
      },
      twoFactorConfirmation: {
        select: {}
      },
      feedback: {
        select: {
          id: true,
          createdAt: true,
          message: true
        },
        orderBy: { createdAt: 'desc' }
      },
      likes: {
        select: {
          id: true,
          siteId: true,
          createdAt: true,
          site: {
            select: {
              name: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      },
      affiliates: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      referer: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      events: {
        select: {
          id: true,
          eventType: true,
          status: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      },
      workflowStates: {
        select: {
          id: true,
          status: true,
          startedAt: true,
          workflow: {
            select: {
              name: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' }
      },
      executions: {
        select: {
          id: true,
          actionId: true,
          status: true,
          executedAt: true,
          errorMessage: true,
          action: { select: { code: true } }
        },
        orderBy: { executedAt: 'desc' },
        take: 20
      },
      jobs: {
        select: {
          id: true,
          job: true,
          status: true,
          attempts: true,
          runAt: true
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      },
      outbox: {
        select: {
          id: true,
          subject: true,
          status: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      },
      comments: {
        select: {
          id: true,
          createdAt: true,
          content: true
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  const reservations = await db.reservation.findMany({
    select: {
      id: true,
      type: true,
      dateStart: true,
      dateEnd: true,
      comment: true
    },
    where: { email: user.email },
    orderBy: { dateStart: 'desc' }
  });

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
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
            <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <div>
                <span className="text-muted-foreground font-medium">
                  User ID:
                </span>

                <p className="font-mono break-all">{user.id}</p>
              </div>

              <div>
                <span className="text-muted-foreground font-medium">
                  Email Verified:
                </span>

                <p className="flex items-center gap-1">
                  {user.emailVerified ? (
                    <LuCircleCheck className="h-4 w-4 text-green-600" />
                  ) : (
                    <>
                      <LuCircleX className="h-4 w-4 text-red-600" />
                      Not Verified
                    </>
                  )}
                </p>
              </div>

              <div>
                <span className="text-muted-foreground font-medium">
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
                      <LuCircleX className="text-muted-foreground h-4 w-4" />
                      Disabled
                    </>
                  )}
                </p>
              </div>

              <div>
                <span className="text-muted-foreground font-medium">
                  Joined:
                </span>
                <p>
                  {formatDate(user.createdAt)} (
                  {formatRelativeTime(user.createdAt)})
                </p>
              </div>

              <div>
                <span className="text-muted-foreground font-medium">
                  Last Updated:
                </span>
                <p>
                  {formatDate(user.updatedAt)} (
                  {formatRelativeTime(user.updatedAt)})
                </p>
              </div>

              {user.customer && (
                <div>
                  <span className="text-muted-foreground font-medium">
                    Stripe Customer ID:
                  </span>
                  <p className="font-mono break-all">
                    {user.customer.stripe_customer_id}
                  </p>
                </div>
              )}

              {user.referer && (
                <div>
                  <span className="text-muted-foreground font-medium">
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
                  <span className="text-muted-foreground font-medium">
                    Billing Address:
                  </span>
                  <pre className="bg-muted mt-1 overflow-x-auto rounded p-2 text-xs">
                    {JSON.stringify(user.billing_address, null, 2)}
                  </pre>
                </div>
              )}

            {user.payment_method &&
              Object.keys(user.payment_method).length > 0 && (
                <div className="mt-4">
                  <span className="text-muted-foreground font-medium">
                    Payment Method:
                  </span>
                  <pre className="bg-muted mt-1 overflow-x-auto rounded p-2 text-xs">
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
                          className="block max-w-xs truncate text-blue-600 hover:underline"
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
                  <h3 className="mb-2 flex items-center gap-1 text-lg font-medium">
                    <LuCirclePlay className="text-muted-foreground h-4 w-4" />
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
                  <h3 className="mb-2 flex items-center gap-1 text-lg font-medium">
                    <LuListChecks className="text-muted-foreground h-4 w-4" />
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
                            className="max-w-xs truncate text-xs text-red-600"
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
                  <h3 className="mb-2 flex items-center gap-1 text-lg font-medium">
                    <LuPackage className="text-muted-foreground h-4 w-4" />
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

      <div className="space-y-6 lg:col-span-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
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
                <h3 className="text-md mb-2 font-medium">Linked Accounts</h3>
                <ul className="list-inside list-disc space-y-1">
                  {user.accounts.map(account => (
                    <li
                      key={account.id}
                      className="text-muted-foreground text-sm"
                    >
                      <span className="text-foreground font-semibold">
                        {account.providerId}
                      </span>
                      ({account.providerAccountId.substring(0, 10)}...)
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {user.authenticator.length > 0 && (
              <div>
                <h3 className="text-md mb-2 border-t pt-3 font-medium">
                  Passkeys / Authenticators
                </h3>

                <ul className="list-inside list-disc space-y-1">
                  {user.authenticator.map(auth => (
                    <li key={auth.id} className="text-muted-foreground text-sm">
                      <span className="text-foreground font-semibold">
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
                <h3 className="text-md mb-2 border-t pt-3 font-medium">
                  Active Sessions
                </h3>
                <ul className="list-inside list-disc space-y-1">
                  {user.sessions.map(session => (
                    <li
                      key={session.id}
                      className="text-muted-foreground text-sm"
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
                  className="border-b pb-2 text-sm last:border-b-0"
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
                    className="flex items-center justify-between text-sm"
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
            <div className="flex items-center gap-2">
              <ModalButton label={<LuPhone />} size="sm">
                <ProspectReservationModal
                  user={{
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    phone: user.phone
                  }}
                  type="PHONE"
                />
              </ModalButton>

              <ModalButton label={<LuVideo />} size="sm">
                <ProspectReservationModal
                  user={{
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    phone: user.phone
                  }}
                  type="VISIO"
                />
              </ModalButton>

              <ModalButton label={<LuHandshake />} size="sm">
                <ProspectReservationModal
                  user={{
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    phone: user.phone
                  }}
                  type="PHYSIC"
                />
              </ModalButton>

              <ModalButton label={<LuCalendar />} size="sm">
                <ProspectReservationModal
                  user={{
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    phone: user.phone
                  }}
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
                  className="flex flex-col border-b pb-2 text-sm last:border-b-0"
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
                    <span className="text-xs italic">{res.comment}</span>
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
                  className="border-b pb-2 text-sm last:border-b-0"
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
                  {user.outbox.map(mail => (
                    <TableRow key={mail.id}>
                      <TableCell className="max-w-[150px] truncate font-medium">
                        <Link
                          href={`/affiliation/user/${userId}/outbox/${mail.id}`}
                        >
                          {mail.subject}
                        </Link>
                      </TableCell>

                      <TableCell>
                        <StatusBadge status={mail.status} />
                      </TableCell>

                      <TableCell>
                        {formatRelativeTime(mail.createdAt)}
                      </TableCell>
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
