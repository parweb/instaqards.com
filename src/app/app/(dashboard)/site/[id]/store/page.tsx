import { OrderStatus } from '@prisma/client';
import Link from 'next/link';

import { Button } from 'components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import { db } from 'helpers/db';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from 'components/ui/select';

export default async function SiteStoreDashboard(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  // Récupérer le site et le bloc store
  const site = await db.site.findUniqueOrThrow({
    where: { id: decodeURIComponent(params.id) },
    select: {
      id: true,
      name: true,
      userId: true,
      subdomain: true,
      blocks: {
        select: {
          id: true,
          widget: true
        }
      }
    }
  });

  // Trouver le bloc store
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
            {"Vous devez d'abord ajouter un bloc store à votre site."}
          </p>
        </div>
      </div>
    );
  }

  // Dates pour les calculs
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLast7Days = new Date(now);
  startOfLast7Days.setDate(startOfLast7Days.getDate() - 7);

  // Récupérer les statistiques en parallèle
  const [
    todayRevenue,
    yesterdayRevenue,
    todayOrders,
    yesterdayOrders,
    monthlyRevenue,
    recentOrders,
    popularProducts,
    last7DaysRevenue,
    ordersByStatus
  ] = await db.$transaction([
    // Revenus d'aujourd'hui
    db.order.aggregate({
      where: {
        blockId: storeBlock.id,
        createdAt: { gte: startOfToday },
        status: { not: OrderStatus.CANCELLED }
      },
      _sum: { total: true }
    }),

    // Revenus d'hier
    db.order.aggregate({
      where: {
        blockId: storeBlock.id,
        createdAt: { gte: startOfYesterday, lt: startOfToday },
        status: { not: OrderStatus.CANCELLED }
      },
      _sum: { total: true }
    }),

    // Commandes d'aujourd'hui
    db.order.count({
      where: {
        blockId: storeBlock.id,
        createdAt: { gte: startOfToday }
      }
    }),

    // Commandes d'hier
    db.order.count({
      where: {
        blockId: storeBlock.id,
        createdAt: { gte: startOfYesterday, lt: startOfToday }
      }
    }),

    // Revenus du mois
    db.order.aggregate({
      where: {
        blockId: storeBlock.id,
        createdAt: { gte: startOfMonth },
        status: { not: OrderStatus.CANCELLED }
      },
      _sum: { total: true }
    }),

    // Commandes récentes
    db.order.findMany({
      where: { blockId: storeBlock.id },
      select: {
        id: true,
        orderNumber: true,
        customerFirstName: true,
        customerLastName: true,
        total: true,
        status: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 3
    }),

    // Produits populaires (basé sur les ventes)
    db.orderItem.groupBy({
      by: ['inventoryId'],
      where: {
        order: {
          blockId: storeBlock.id,
          status: { not: OrderStatus.CANCELLED }
        }
      },
      _sum: { quantity: true, totalPrice: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 4
    }),

    // Revenus des 7 derniers jours
    db.order.findMany({
      where: {
        blockId: storeBlock.id,
        createdAt: { gte: startOfLast7Days },
        status: { not: OrderStatus.CANCELLED }
      },
      select: {
        createdAt: true,
        total: true
      }
    }),

    // Commandes par statut
    db.order.groupBy({
      by: ['status'],
      where: { blockId: storeBlock.id },
      _count: { _all: true },
      orderBy: { status: 'asc' }
    })
  ]);

  // Récupérer les détails des produits populaires
  const productIds = popularProducts.map(p => p.inventoryId);
  const productDetails = await db.inventory.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true }
  });

  // Calculer les pourcentages de changement
  const todayRevenueAmount = Number(todayRevenue._sum.total || 0);
  const yesterdayRevenueAmount = Number(yesterdayRevenue._sum.total || 0);
  const revenueChange =
    yesterdayRevenueAmount > 0
      ? ((todayRevenueAmount - yesterdayRevenueAmount) /
          yesterdayRevenueAmount) *
        100
      : todayRevenueAmount > 0
        ? 100
        : 0;

  const ordersChange =
    yesterdayOrders > 0
      ? ((todayOrders - yesterdayOrders) / yesterdayOrders) * 100
      : todayOrders > 0
        ? 100
        : 0;

  // Grouper les données par jour pour le graphique
  const revenueByDay = new Map<string, number>();
  last7DaysRevenue.forEach(order => {
    const dateKey = order.createdAt.toDateString();
    const currentRevenue = revenueByDay.get(dateKey) || 0;
    revenueByDay.set(dateKey, currentRevenue + Number(order.total));
  });

  // Compléter les jours manquants avec 0
  const last7Days: Array<{ date: Date; revenue: number }> = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const revenue = revenueByDay.get(date.toDateString()) || 0;
    last7Days.push({
      date,
      revenue
    });
  }

  // Formater la devise
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Formater la date relative
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 60) {
      return `il y a ${diffInMinutes} min`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `il y a ${hours}h`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `il y a ${days}j`;
    }
  };

  // Compter les alertes
  const lowStockCount = await db.inventory.count({
    where: {
      blockId: storeBlock.id,
      stock: { gt: 0, lte: 5 }
    }
  });

  const pendingOrdersCount =
    (ordersByStatus.find(s => s.status === OrderStatus.PENDING)?._count as any)
      ?._all || 0;

  return (
    <div className="flex min-h-screen flex-1 flex-col gap-4 p-4">
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {"Revenus aujourd'hui"}
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {formatCurrency(todayRevenueAmount)}
                </p>
                <p
                  className={`mt-1 text-sm ${revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {revenueChange >= 0 ? '↗' : '↘'}{' '}
                  {Math.abs(revenueChange).toFixed(1)}% vs hier
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <span className="text-xl text-green-600">💰</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Commandes</p>
                <p className="text-3xl font-bold text-blue-600">
                  {todayOrders}
                </p>
                <p
                  className={`mt-1 text-sm ${ordersChange >= 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {ordersChange >= 0 ? '↗' : '↘'}{' '}
                  {Math.abs(ordersChange).toFixed(1)}% vs hier
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <span className="text-xl text-blue-600">📦</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Revenu mensuel
                </p>
                <p className="text-3xl font-bold text-purple-600">
                  {formatCurrency(Number(monthlyRevenue._sum.total || 0))}
                </p>
                <p className="mt-1 text-sm text-gray-500">Ce mois-ci</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <span className="text-xl text-purple-600">👥</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Commandes en attente
                </p>
                <p className="text-3xl font-bold text-orange-600">
                  {pendingOrdersCount}
                </p>
                <p className="mt-1 text-sm text-gray-500">À traiter</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                <span className="text-xl text-orange-600">📈</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques et métriques */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Graphique des ventes */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
            <CardTitle>Revenus des 7 derniers jours</CardTitle>
            <Select defaultValue="7days">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">7 derniers jours</SelectItem>
                <SelectItem value="30days">30 derniers jours</SelectItem>
                <SelectItem value="3months">3 derniers mois</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {(() => {
              const maxRevenue = Math.max(...last7Days.map(d => d.revenue));
              const hasData = maxRevenue > 0;
              const dayNames = [
                'Dim',
                'Lun',
                'Mar',
                'Mer',
                'Jeu',
                'Ven',
                'Sam'
              ];

              if (!hasData) {
                return (
                  <div className="flex h-40 items-center justify-center">
                    <div className="text-center">
                      <div className="mb-4 text-4xl text-gray-300">📊</div>
                      <p className="text-sm text-gray-500">
                        Aucune vente sur les 7 derniers jours
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        Les données apparaîtront dès que vous aurez des
                        commandes
                      </p>
                    </div>
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {/* Légende avec valeurs min/max */}
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>
                      Minimum:{' '}
                      {formatCurrency(
                        Math.min(...last7Days.map(d => d.revenue))
                      )}
                    </span>
                    <span>Maximum: {formatCurrency(maxRevenue)}</span>
                  </div>

                  {/* Graphique à barres */}
                  <div className="flex h-32 items-end justify-between space-x-1">
                    {last7Days.map((day, index) => {
                      const height = (day.revenue / maxRevenue) * 100;
                      const isToday =
                        new Date().toDateString() === day.date.toDateString();

                      return (
                        <div
                          key={index}
                          className="group flex flex-1 flex-col items-center"
                        >
                          {/* Tooltip au hover */}
                          <div className="relative flex w-full flex-1 items-end">
                            <div
                              className={`w-full rounded-t transition-all duration-200 group-hover:opacity-80 ${
                                isToday
                                  ? 'bg-blue-600 shadow-md'
                                  : height > 0
                                    ? 'bg-blue-500'
                                    : 'bg-gray-200'
                              }`}
                              style={{
                                height: `${Math.max(height, height > 0 ? 8 : 4)}%`,
                                minHeight: height > 0 ? '8px' : '2px'
                              }}
                            >
                              {/* Tooltip au hover */}
                              <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 transform opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                <div className="rounded bg-gray-900 px-2 py-1 text-xs whitespace-nowrap text-white">
                                  {formatCurrency(day.revenue)}
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 transform border-t-2 border-r-2 border-l-2 border-transparent border-t-gray-900"></div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Labels des jours */}
                          <span
                            className={`mt-2 text-xs ${isToday ? 'font-semibold text-blue-600' : 'text-gray-500'}`}
                          >
                            {dayNames[day.date.getDay()]}
                          </span>

                          {/* Date */}
                          <span className="text-xs text-gray-400">
                            {day.date.getDate()}/{day.date.getMonth() + 1}
                          </span>

                          {/* Valeur */}
                          <span
                            className={`text-xs font-medium ${isToday ? 'text-blue-600' : 'text-gray-700'}`}
                          >
                            {day.revenue > 0
                              ? formatCurrency(day.revenue)
                              : '-'}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Statistiques résumées */}
                  <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-3">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Total 7 jours</p>
                      <p className="text-sm font-semibold text-green-600">
                        {formatCurrency(
                          last7Days.reduce((sum, day) => sum + day.revenue, 0)
                        )}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Moyenne/jour</p>
                      <p className="text-sm font-semibold text-blue-600">
                        {formatCurrency(
                          last7Days.reduce((sum, day) => sum + day.revenue, 0) /
                            7
                        )}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Jours avec ventes</p>
                      <p className="text-sm font-semibold text-purple-600">
                        {last7Days.filter(day => day.revenue > 0).length}/7
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>

        {/* Top produits */}
        <Card>
          <CardHeader>
            <CardTitle>Produits populaires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularProducts.slice(0, 4).map(product => {
                const productDetail = productDetails.find(
                  p => p.id === product.inventoryId
                );
                const quantity = product._sum?.quantity || 0;
                const revenue = Number(product._sum?.totalPrice || 0);

                return (
                  <div
                    key={product.inventoryId}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded bg-gray-100">
                      <span className="text-gray-400">📷</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {productDetail?.name || 'Produit inconnu'}
                      </p>
                      <p className="text-sm text-gray-500">{quantity} ventes</p>
                    </div>
                    <p className="font-semibold text-green-600">
                      {formatCurrency(revenue)}
                    </p>
                  </div>
                );
              })}

              {popularProducts.length === 0 && (
                <div className="py-8 text-center text-gray-500">
                  Aucune vente pour le moment
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Commandes récentes et alertes */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Commandes récentes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Commandes récentes</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link
                href={`/site/${site.id}/store/orders`}
                className="text-blue-600 hover:text-blue-800"
              >
                Voir toutes
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map(order => {
                const statusColors = {
                  [OrderStatus.PENDING]: 'bg-orange-100 text-orange-800',
                  [OrderStatus.CONFIRMED]: 'bg-blue-100 text-blue-800',
                  [OrderStatus.SHIPPED]: 'bg-purple-100 text-purple-800',
                  [OrderStatus.DELIVERED]: 'bg-green-100 text-green-800',
                  [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800'
                };

                const statusLabels = {
                  [OrderStatus.PENDING]: 'En attente',
                  [OrderStatus.CONFIRMED]: 'Confirmée',
                  [OrderStatus.SHIPPED]: 'Expédiée',
                  [OrderStatus.DELIVERED]: 'Livrée',
                  [OrderStatus.CANCELLED]: 'Annulée'
                };

                return (
                  <Card key={order.id} className="border-gray-200">
                    <CardContent className="flex items-center justify-between p-3">
                      <div>
                        <p className="font-medium text-gray-900">
                          {order.orderNumber}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.customerFirstName} {order.customerLastName} •{' '}
                          {formatRelativeTime(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(Number(order.total))}
                        </p>
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusColors[order.status]}`}
                        >
                          {statusLabels[order.status]}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {recentOrders.length === 0 && (
                <div className="py-8 text-center text-gray-500">
                  Aucune commande récente
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Alertes et notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Alertes importantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockCount > 0 && (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="flex items-start gap-3 p-3">
                    <span className="text-lg text-red-500">⚠️</span>
                    <div>
                      <p className="font-medium text-red-900">Stock faible</p>
                      <p className="text-sm text-red-700">
                        {lowStockCount} produit
                        {lowStockCount > 1 ? 's ont' : ' a'} un stock inférieur
                        à 5 unités
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {pendingOrdersCount > 0 && (
                <Card className="border-orange-200 bg-orange-50">
                  <CardContent className="flex items-start gap-3 p-3">
                    <span className="text-lg text-orange-500">⏳</span>
                    <div>
                      <p className="font-medium text-orange-900">
                        Commandes en attente
                      </p>
                      <p className="text-sm text-orange-700">
                        {pendingOrdersCount} commande
                        {pendingOrdersCount > 1
                          ? 's nécessitent'
                          : ' nécessite'}{' '}
                        votre attention
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="flex items-start gap-3 p-3">
                  <span className="text-lg text-blue-500">📊</span>
                  <div>
                    <p className="font-medium text-blue-900">
                      Analytics disponibles
                    </p>
                    <p className="text-sm text-blue-700">
                      Consultez vos statistiques détaillées
                    </p>
                  </div>
                </CardContent>
              </Card>

              {todayRevenueAmount >
                Number(monthlyRevenue._sum.total || 0) * 0.8 && (
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="flex items-start gap-3 p-3">
                    <span className="text-lg text-green-500">✅</span>
                    <div>
                      <p className="font-medium text-green-900">
                        Excellentes performances
                      </p>
                      <p className="text-sm text-green-700">
                        Vos ventes sont en forte progression !
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
