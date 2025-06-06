'use client';

import { Badge } from 'components/ui/badge';
import { Button } from 'components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import { useEffect, useState } from 'react';
import { LuX } from 'react-icons/lu';

type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

type OrderDetails = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  customer: {
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phone?: string;
    address: any;
  };
  items: Array<{
    id: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    product: {
      id: string;
      name: string;
      description?: string;
      sku?: string;
    };
  }>;
  pricing: {
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
  };
  tracking: {
    trackingNumber?: string;
    notes?: string;
  };
  timeline: {
    createdAt: string;
    updatedAt: string;
    shippedAt?: string;
    deliveredAt?: string;
  };
  site?: {
    id: string;
    name: string;
    subdomain: string;
  };
};

interface OrderDetailsModalProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderDetailsModal({
  orderId,
  isOpen,
  onClose
}: OrderDetailsModalProps) {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && orderId) {
      fetchOrderDetails();
    }
  }, [isOpen, orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders/${orderId}`);
      const data = await response.json();

      if (data.success) {
        setOrder(data.order);
      } else {
        console.error('Erreur lors du chargement des détails:', data.error);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des détails:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge className="bg-orange-100 text-orange-800">En attente</Badge>
        );
      case 'CONFIRMED':
        return <Badge className="bg-blue-100 text-blue-800">Confirmée</Badge>;
      case 'SHIPPED':
        return (
          <Badge className="bg-purple-100 text-purple-800">Expédiée</Badge>
        );
      case 'DELIVERED':
        return <Badge variant="success">Livrée</Badge>;
      case 'CANCELLED':
        return <Badge className="bg-red-100 text-red-800">Annulée</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-gray-50 p-6">
          <div>
            <h2 className="text-2xl font-bold">Détails de la commande</h2>
            {order && <p className="text-gray-600">#{order.orderNumber}</p>}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <LuX className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
            </div>
          ) : order ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Informations de la commande */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Informations de la commande
                    {getStatusBadge(order.status)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Date de commande
                    </label>
                    <p className="text-sm">
                      {formatDate(order.timeline.createdAt)}
                    </p>
                  </div>

                  {order.timeline.shippedAt && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        {"Date d'expédition"}
                      </label>
                      <p className="text-sm">
                        {formatDate(order.timeline.shippedAt)}
                      </p>
                    </div>
                  )}

                  {order.timeline.deliveredAt && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Date de livraison
                      </label>
                      <p className="text-sm">
                        {formatDate(order.timeline.deliveredAt)}
                      </p>
                    </div>
                  )}

                  {order.tracking.trackingNumber && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Numéro de suivi
                      </label>
                      <p className="font-mono text-sm">
                        {order.tracking.trackingNumber}
                      </p>
                    </div>
                  )}

                  {order.tracking.notes && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Notes
                      </label>
                      <p className="text-sm">{order.tracking.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Informations client */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations client</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Nom
                    </label>
                    <p className="text-sm">{order.customer.fullName}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Email
                    </label>
                    <p className="text-sm">{order.customer.email}</p>
                  </div>

                  {order.customer.phone && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Téléphone
                      </label>
                      <p className="text-sm">{order.customer.phone}</p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Adresse de livraison
                    </label>
                    <p className="text-sm">
                      {formatAddress(order.customer.address)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Articles commandés */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Articles commandés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map(item => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between border-b pb-4"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium">{item.product.name}</h4>
                          {item.product.description && (
                            <p className="text-sm text-gray-500">
                              {item.product.description}
                            </p>
                          )}
                          {item.product.sku && (
                            <p className="text-xs text-gray-400">
                              SKU: {item.product.sku}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm">
                            {item.quantity} × {formatCurrency(item.unitPrice)}
                          </p>
                          <p className="font-medium">
                            {formatCurrency(item.totalPrice)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totaux */}
                  <div className="mt-6 space-y-2 border-t pt-4">
                    <div className="flex justify-between text-sm">
                      <span>Sous-total</span>
                      <span>{formatCurrency(order.pricing.subtotal)}</span>
                    </div>

                    {order.pricing.tax > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Taxes</span>
                        <span>{formatCurrency(order.pricing.tax)}</span>
                      </div>
                    )}

                    {order.pricing.shipping > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Livraison</span>
                        <span>{formatCurrency(order.pricing.shipping)}</span>
                      </div>
                    )}

                    <div className="flex justify-between border-t pt-2 text-lg font-bold">
                      <span>Total</span>
                      <span>{formatCurrency(order.pricing.total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-500">
                Impossible de charger les détails de la commande
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
