import { OrderStatus } from '@prisma/client';
import { Card, CardContent } from 'components/ui/card';
import { OrdersClient } from 'components/orders/OrdersClient';
import { db } from 'helpers/db';

export default async function SiteStoreOrders(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  // Parse search parameters
  const page = parseInt((searchParams.page as string) || '1');
  const limit = 10;
  const statusFilter = (searchParams.status as string) || 'all';
  const searchQuery = (searchParams.search as string) || '';
  const skip = (page - 1) * limit;

  // Find the store block for this site
  const site = await db.site.findUniqueOrThrow({
    where: { id: params.id },
    select: {
      id: true,
      blocks: {
        select: {
          id: true,
          widget: true
        }
      }
    }
  });

  const storeBlock = site.blocks.find(
    // @ts-ignore
    block => block.widget.type === 'other' && block.widget.id === 'store'
  );

  if (!storeBlock) {
    return (
      <div className="flex min-h-screen flex-1 flex-col gap-6 bg-gray-50 p-6">
        <div className="py-12 text-center">
          <h1 className="mb-4 text-2xl font-bold">Aucun store configuré</h1>
          <p className="text-gray-500">
            Vous devez d'abord ajouter un bloc store à votre site.
          </p>
        </div>
      </div>
    );
  }

  // Build where clause for filtering
  const where: any = {
    blockId: storeBlock.id
  };

  if (statusFilter !== 'all') {
    where.status = statusFilter as OrderStatus;
  }

  if (searchQuery) {
    where.OR = [
      { orderNumber: { contains: searchQuery, mode: 'insensitive' } },
      { customerFirstName: { contains: searchQuery, mode: 'insensitive' } },
      { customerLastName: { contains: searchQuery, mode: 'insensitive' } },
      { customerEmail: { contains: searchQuery, mode: 'insensitive' } }
    ];
  }

  // Fetch orders and count
  const [orders, totalCount] = await Promise.all([
    db.order.findMany({
      where,
      include: {
        items: {
          include: {
            inventory: {
              select: {
                name: true,
                sku: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    }),
    db.order.count({ where })
  ]);

  // Calculate statistics
  const stats = await db.order.groupBy({
    by: ['status'],
    where: { blockId: storeBlock.id },
    _count: {
      status: true
    }
  });

  // Calculate monthly revenue
  const currentMonth = new Date();
  const startOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );
  const monthlyRevenue = await db.order.aggregate({
    where: {
      blockId: storeBlock.id,
      createdAt: {
        gte: startOfMonth
      },
      status: {
        not: OrderStatus.CANCELLED
      }
    },
    _sum: {
      total: true
    }
  });

  const totalPages = Math.ceil(totalCount / limit);

  // Transform orders for client component
  const transformedOrders = orders.map(order => ({
    id: order.id,
    orderNumber: order.orderNumber,
    customer: {
      name: `${order.customerFirstName} ${order.customerLastName}`,
      email: order.customerEmail,
      phone: order.customerPhone || undefined
    },
    itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
    total: Number(order.total),
    status: order.status,
    createdAt: order.createdAt.toISOString(),
    trackingNumber: order.trackingNumber || undefined
  }));

  // Transform stats
  const transformedStats = {
    total: totalCount,
    byStatus: stats.reduce(
      (acc, stat) => {
        acc[stat.status] = stat._count.status;
        return acc;
      },
      {} as Record<string, number>
    ),
    monthlyRevenue: Number(monthlyRevenue._sum.total || 0)
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col gap-6 bg-gray-50 p-6">
      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total commandes</p>
                <p className="text-2xl font-semibold">
                  {transformedStats.total}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <span className="text-xl text-blue-600">📦</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">En attente</p>
                <p className="text-2xl font-semibold text-orange-600">
                  {transformedStats.byStatus.PENDING || 0}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                <span className="text-xl text-orange-600">⏳</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Expédiées</p>
                <p className="text-2xl font-semibold text-blue-600">
                  {transformedStats.byStatus.SHIPPED || 0}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <span className="text-xl text-blue-600">🚚</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Revenu du mois</p>
                <p className="text-2xl font-semibold text-green-600">
                  {formatCurrency(transformedStats.monthlyRevenue)}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <span className="text-xl text-green-600">💰</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des commandes */}
      <Card>
        <CardContent className="p-0">
          <OrdersClient
            orders={transformedOrders}
            currentPage={page}
            totalPages={totalPages}
            statusFilter={statusFilter}
            searchQuery={searchQuery}
          />
        </CardContent>
      </Card>
    </div>
  );
}
