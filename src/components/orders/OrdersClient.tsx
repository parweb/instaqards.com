'use client';

import { useState } from 'react';
import { Badge } from 'components/ui/badge';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from 'components/ui/select';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from 'components/ui/table';

type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

type Order = {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  itemCount: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  trackingNumber?: string;
};

interface OrdersClientProps {
  orders: Order[];
  currentPage: number;
  totalPages: number;
  statusFilter: string;
  searchQuery: string;
}

export function OrdersClient({
  orders,
  currentPage,
  totalPages,
  statusFilter: initialStatusFilter,
  searchQuery: initialSearchQuery
}: OrdersClientProps) {
  const router = useRouter();
  const [localStatusFilter, setLocalStatusFilter] =
    useState(initialStatusFilter);
  const [localSearchQuery, setLocalSearchQuery] = useState(initialSearchQuery);

  const updateFilters = (status?: string, search?: string) => {
    const params = new URLSearchParams();

    if (status && status !== 'all') {
      params.set('status', status);
    }

    if (search && search.trim()) {
      params.set('search', search.trim());
    }

    // Reset to page 1 when filters change
    params.set('page', '1');

    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : '');
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (data.success) {
        // Refresh the page to show updated data
        router.refresh();
      } else {
        alert(`Erreur lors de la mise à jour: ${data.error}`);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
            En attente
          </Badge>
        );
      case 'CONFIRMED':
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            Confirmée
          </Badge>
        );
      case 'SHIPPED':
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
            Expédiée
          </Badge>
        );
      case 'DELIVERED':
        return <Badge variant="success">Livrée</Badge>;
      case 'CANCELLED':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            Annulée
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams();

    if (localStatusFilter !== 'all') {
      params.set('status', localStatusFilter);
    }

    if (localSearchQuery.trim()) {
      params.set('search', localSearchQuery.trim());
    }

    params.set('page', page.toString());

    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : '');
  };

  return (
    <>
      {/* Filtres */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold">Gestion des commandes</h1>
        <div className="flex gap-2">
          <Select
            value={localStatusFilter}
            onValueChange={value => {
              setLocalStatusFilter(value);
              updateFilters(value, localSearchQuery);
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="PENDING">En attente</SelectItem>
              <SelectItem value="CONFIRMED">Confirmée</SelectItem>
              <SelectItem value="SHIPPED">Expédiée</SelectItem>
              <SelectItem value="DELIVERED">Livrée</SelectItem>
              <SelectItem value="CANCELLED">Annulée</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="text"
            placeholder="Rechercher..."
            className="w-48"
            value={localSearchQuery}
            onChange={e => setLocalSearchQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                updateFilters(localStatusFilter, localSearchQuery);
              }
            }}
          />
        </div>
      </div>

      {/* Tableau des commandes */}
      {orders.length === 0 ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <span className="text-2xl">📦</span>
            </div>
            <p className="mb-2 text-gray-500">Aucune commande trouvée</p>
            <p className="text-sm text-gray-400">
              {localSearchQuery || localStatusFilter !== 'all'
                ? 'Essayez de modifier vos filtres de recherche'
                : 'Les commandes apparaîtront ici une fois créées'}
            </p>
          </div>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Commande</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Produits</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map(order => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  #{order.orderNumber}
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-900">
                    {order.customer.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.customer.email}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {order.itemCount} article{order.itemCount > 1 ? 's' : ''}
                </TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(order.total)}
                </TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell className="text-sm text-gray-500">
                  {formatDate(order.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Link href={`orders/${order.id}`}>
                      <Button variant="ghost" size="sm">
                        Voir
                      </Button>
                    </Link>
                    <Select
                      onValueChange={value =>
                        updateOrderStatus(order.id, value as OrderStatus)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Actions" />
                      </SelectTrigger>
                      <SelectContent>
                        {order.status === 'PENDING' && (
                          <SelectItem value="CONFIRMED">Confirmer</SelectItem>
                        )}
                        {(order.status === 'CONFIRMED' ||
                          order.status === 'PENDING') && (
                          <SelectItem value="SHIPPED">Expédier</SelectItem>
                        )}
                        {order.status === 'SHIPPED' && (
                          <SelectItem value="DELIVERED">Livrer</SelectItem>
                        )}
                        {order.status !== 'CANCELLED' &&
                          order.status !== 'DELIVERED' && (
                            <SelectItem value="CANCELLED">Annuler</SelectItem>
                          )}
                      </SelectContent>
                    </Select>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4">
          <div className="text-sm text-gray-500">
            Page {currentPage} sur {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Précédent
            </Button>

            {/* Pages */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePageChange(pageNumber)}
                >
                  {pageNumber}
                </Button>
              );
            })}

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Suivant
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
