import { OrderStatus } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import { Badge } from 'components/ui/badge';
import { Button } from 'components/ui/button';
import { db } from 'helpers/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { OrderStatusUpdater } from 'components/orders/OrderStatusUpdater';
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  Truck,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle
} from 'lucide-react';

export default async function OrderDetailsPage(props: {
  params: Promise<{ id: string; orderId: string }>;
}) {
  const params = await props.params;
  const { id: siteId, orderId } = params;

  // Fetch order details
  const order = await db.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      orderNumber: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      shippedAt: true,
      deliveredAt: true,
      trackingNumber: true,
      notes: true,
      customerFirstName: true,
      customerLastName: true,
      customerEmail: true,
      customerPhone: true,
      customerAddress: true,
      subtotal: true,
      tax: true,
      shipping: true,
      total: true,
      items: {
        select: {
          id: true,
          quantity: true,
          unitPrice: true,
          totalPrice: true,
          productName: true,
          productDescription: true,
          productSku: true,
          inventory: {
            select: {
              id: true,
              name: true,
              sku: true,
              description: true
            }
          }
        }
      },
      statusHistory: {
        select: {
          id: true,
          previousStatus: true,
          newStatus: true,
          changedAt: true,
          changeReason: true,
          automaticChange: true
        },
        orderBy: {
          changedAt: 'asc'
        }
      },
      block: {
        select: {
          id: true,
          type: true,
          site: {
            select: {
              id: true,
              name: true,
              subdomain: true
            }
          }
        }
      }
    }
  });

  if (!order || order.block?.site.id !== siteId) {
    notFound();
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatAddress = (address: any) => {
    if (!address || typeof address !== 'object')
      return 'Adresse non disponible';

    const { formatted_address, components } = address;

    if (formatted_address) {
      return formatted_address;
    }

    if (components) {
      const parts = [
        components.street_number,
        components.route,
        components.locality,
        components.postal_code,
        components.country
      ].filter(Boolean);

      return parts.join(', ');
    }

    return 'Adresse non disponible';
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge className="border-orange-200 bg-orange-100 text-orange-800">
            <Clock className="mr-1 h-3 w-3" />
            En attente
          </Badge>
        );
      case 'CONFIRMED':
        return (
          <Badge className="border-blue-200 bg-blue-100 text-blue-800">
            <CheckCircle className="mr-1 h-3 w-3" />
            Confirmée
          </Badge>
        );
      case 'SHIPPED':
        return (
          <Badge className="border-purple-200 bg-purple-100 text-purple-800">
            <Truck className="mr-1 h-3 w-3" />
            Expédiée
          </Badge>
        );
      case 'DELIVERED':
        return (
          <Badge className="border-green-200 bg-green-100 text-green-800">
            <CheckCircle className="mr-1 h-3 w-3" />
            Livrée
          </Badge>
        );
      case 'CANCELLED':
        return (
          <Badge className="border-red-200 bg-red-100 text-red-800">
            <XCircle className="mr-1 h-3 w-3" />
            Annulée
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getStatusDescription = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return 'La commande est en attente de confirmation';
      case 'CONFIRMED':
        return 'La commande a été confirmée et est en cours de préparation';
      case 'SHIPPED':
        return 'La commande a été expédiée';
      case 'DELIVERED':
        return 'La commande a été livrée avec succès';
      case 'CANCELLED':
        return 'La commande a été annulée';
      default:
        return '';
    }
  };

  const getStatusName = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return 'En attente';
      case 'CONFIRMED':
        return 'Confirmée';
      case 'SHIPPED':
        return 'Expédiée';
      case 'DELIVERED':
        return 'Livrée';
      case 'CANCELLED':
        return 'Annulée';
      default:
        return status;
    }
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col gap-6 bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/app/site/${siteId}/store/orders`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux commandes
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Commande #{order.orderNumber}
              </h1>
              <p className="text-gray-600">
                Créée le {formatDate(order.createdAt)}
              </p>
            </div>
          </div>
        </div>
        {getStatusBadge(order.status)}
      </div>

      {/* Statut et chronologie */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Statut et chronologie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Statut actuel */}
            <div className="rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">Statut actuel</p>
                  <p className="text-sm text-gray-600">
                    {getStatusDescription(order.status)}
                  </p>
                </div>
                {getStatusBadge(order.status)}
              </div>
            </div>

            {/* Timeline */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div
                className={`rounded-lg p-4 ${order.createdAt ? 'border border-green-200 bg-green-50' : 'border border-gray-200 bg-gray-50'}`}
              >
                <div className="mb-2 flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full ${order.createdAt ? 'bg-green-500' : 'bg-gray-300'}`}
                  ></div>
                  <p
                    className={`text-sm font-medium ${order.createdAt ? 'text-green-700' : 'text-gray-500'}`}
                  >
                    Commande créée
                  </p>
                </div>
                {order.createdAt && (
                  <p className="text-xs text-green-600">
                    {formatDate(order.createdAt)}
                  </p>
                )}
              </div>

              <div
                className={`rounded-lg p-4 ${['CONFIRMED', 'SHIPPED', 'DELIVERED'].includes(order.status) ? 'border border-blue-200 bg-blue-50' : 'border border-gray-200 bg-gray-50'}`}
              >
                <div className="mb-2 flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full ${['CONFIRMED', 'SHIPPED', 'DELIVERED'].includes(order.status) ? 'bg-blue-500' : 'bg-gray-300'}`}
                  ></div>
                  <p
                    className={`text-sm font-medium ${['CONFIRMED', 'SHIPPED', 'DELIVERED'].includes(order.status) ? 'text-blue-700' : 'text-gray-500'}`}
                  >
                    Confirmée
                  </p>
                </div>
              </div>

              <div
                className={`rounded-lg p-4 ${order.shippedAt ? 'border border-purple-200 bg-purple-50' : 'border border-gray-200 bg-gray-50'}`}
              >
                <div className="mb-2 flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full ${order.shippedAt ? 'bg-purple-500' : 'bg-gray-300'}`}
                  ></div>
                  <p
                    className={`text-sm font-medium ${order.shippedAt ? 'text-purple-700' : 'text-gray-500'}`}
                  >
                    Expédiée
                  </p>
                </div>
                {order.shippedAt && (
                  <p className="text-xs text-purple-600">
                    {formatDate(order.shippedAt)}
                  </p>
                )}
              </div>

              <div
                className={`rounded-lg p-4 ${order.deliveredAt ? 'border border-green-200 bg-green-50' : 'border border-gray-200 bg-gray-50'}`}
              >
                <div className="mb-2 flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full ${order.deliveredAt ? 'bg-green-500' : 'bg-gray-300'}`}
                  ></div>
                  <p
                    className={`text-sm font-medium ${order.deliveredAt ? 'text-green-700' : 'text-gray-500'}`}
                  >
                    Livrée
                  </p>
                </div>
                {order.deliveredAt && (
                  <p className="text-xs text-green-600">
                    {formatDate(order.deliveredAt)}
                  </p>
                )}
              </div>
            </div>

            {/* Historique des changements de statut */}
            {order.statusHistory && order.statusHistory.length > 0 && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="mb-4 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-600" />
                  <p className="text-sm font-medium text-gray-700">
                    Historique des changements
                  </p>
                </div>
                <div className="space-y-3">
                  {order.statusHistory.map((history) => (
                    <div
                      key={history.id}
                      className="flex items-start gap-3 border-b border-gray-200 pb-3 last:border-b-0 last:pb-0"
                    >
                      <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500"></div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {history.previousStatus ? (
                              <>
                                Changement:{' '}
                                <span className="text-gray-600">
                                  {getStatusName(history.previousStatus)}
                                </span>
                                {' → '}
                                <span className="text-blue-600">
                                  {getStatusName(history.newStatus)}
                                </span>
                              </>
                            ) : (
                              <>
                                Commande créée avec le statut{' '}
                                <span className="text-blue-600">
                                  {getStatusName(history.newStatus)}
                                </span>
                              </>
                            )}
                          </p>
                          <span className="ml-2 flex-shrink-0 text-xs text-gray-500">
                            {formatDate(history.changedAt)}
                          </span>
                        </div>
                        {history.changeReason && (
                          <p className="mt-1 text-xs text-gray-600">
                            {history.changeReason}
                          </p>
                        )}
                        {history.automaticChange && (
                          <span className="mt-1 inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                            Automatique
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Numéro de suivi */}
            {order.trackingNumber && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-blue-600" />
                  <p className="text-sm font-medium text-blue-700">
                    Numéro de suivi
                  </p>
                </div>
                <p className="mt-1 font-mono text-sm text-blue-900">
                  {order.trackingNumber}
                </p>
              </div>
            )}

            {/* Notes */}
            {order.notes && (
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <p className="text-sm font-medium text-yellow-700">Notes</p>
                </div>
                <p className="mt-1 text-sm text-yellow-900">{order.notes}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Informations client */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations client
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Prénom
                </label>
                <p className="text-base font-medium">
                  {order.customerFirstName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Nom</label>
                <p className="text-base font-medium">
                  {order.customerLastName}
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-base">{order.customerEmail}</p>
            </div>

            {order.customerPhone && (
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Téléphone
                </label>
                <p className="text-base">{order.customerPhone}</p>
              </div>
            )}

            <div>
              <label className="flex items-center gap-1 text-sm font-medium text-gray-600">
                <MapPin className="h-4 w-4" />
                Adresse de livraison
              </label>
              <div className="mt-2 rounded-lg border bg-gray-50 p-3">
                <p className="text-sm leading-relaxed">
                  {formatAddress(order.customerAddress)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Résumé financier */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Résumé financier
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Sous-total</span>
                <span className="font-medium">
                  {formatCurrency(Number(order.subtotal))}
                </span>
              </div>

              {Number(order.tax) > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Taxes</span>
                  <span className="font-medium">
                    {formatCurrency(Number(order.tax))}
                  </span>
                </div>
              )}

              {Number(order.shipping) > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Livraison</span>
                  <span className="font-medium">
                    {formatCurrency(Number(order.shipping))}
                  </span>
                </div>
              )}

              <div className="border-t pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-xl font-bold text-green-600">
                    {formatCurrency(Number(order.total))}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Dernière mise à jour</span>
                <span>{formatDate(order.updatedAt)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions sur la commande */}
      <OrderStatusUpdater
        orderId={order.id}
        currentStatus={order.status}
        orderNumber={order.orderNumber}
      />

      {/* Articles commandés */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Articles commandés ({order.items.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div
                key={item.id}
                className={`rounded-lg border p-4 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      {item.productName || item.inventory.name}
                    </h4>
                    {(item.productDescription ||
                      item.inventory.description) && (
                      <p className="mt-1 text-sm text-gray-600">
                        {item.productDescription || item.inventory.description}
                      </p>
                    )}
                    {(item.productSku || item.inventory.sku) && (
                      <p className="mt-1 font-mono text-xs text-gray-400">
                        SKU: {item.productSku || item.inventory.sku}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Quantité</p>
                      <p className="text-lg font-semibold">{item.quantity}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Prix unitaire</p>
                      <p className="font-medium">
                        {formatCurrency(Number(item.unitPrice))}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="text-lg font-bold text-green-600">
                        {formatCurrency(Number(item.totalPrice))}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
