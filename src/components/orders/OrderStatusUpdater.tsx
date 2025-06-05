'use client';

import { useState } from 'react';
import { OrderStatus } from '@prisma/client';
import { Button } from 'components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from 'components/ui/select';
import { Input } from 'components/ui/input';
import { Textarea } from 'components/ui/textarea';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import { Badge } from 'components/ui/badge';
import {
  Settings,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface OrderStatusUpdaterProps {
  orderId: string;
  currentStatus: OrderStatus;
  orderNumber: string;
}

export function OrderStatusUpdater({
  orderId,
  currentStatus,
  orderNumber
}: OrderStatusUpdaterProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | ''>('');
  const [changeReason, setChangeReason] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [notes, setNotes] = useState('');

  const updateOrderStatus = async () => {
    if (!selectedStatus) return;

    try {
      setIsUpdating(true);
      const updateData: any = {
        status: selectedStatus
      };

      if (changeReason.trim()) {
        updateData.changeReason = changeReason.trim();
      }

      if (trackingNumber.trim()) {
        updateData.trackingNumber = trackingNumber.trim();
      }

      if (notes.trim()) {
        updateData.notes = notes.trim();
      }

      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (data.success) {
        // Reset form
        setSelectedStatus('');
        setChangeReason('');
        setTrackingNumber('');
        setNotes('');

        // Refresh the page to show updated data
        router.refresh();
      } else {
        alert(`Erreur lors de la mise à jour: ${data.error}`);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      alert('Erreur lors de la mise à jour du statut');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4 text-orange-600" />;
      case 'CONFIRMED':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'SHIPPED':
        return <Truck className="h-4 w-4 text-purple-600" />;
      case 'DELIVERED':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusText = (status: OrderStatus) => {
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

  const getAvailableActions = (status: OrderStatus) => {
    const actions = [];

    if (status === 'PENDING') {
      actions.push({ value: 'CONFIRMED', label: 'Confirmer la commande' });
      actions.push({ value: 'CANCELLED', label: 'Annuler la commande' });
    }

    if (status === 'CONFIRMED') {
      actions.push({ value: 'SHIPPED', label: 'Marquer comme expédiée' });
      actions.push({ value: 'CANCELLED', label: 'Annuler la commande' });
    }

    if (status === 'SHIPPED') {
      actions.push({ value: 'DELIVERED', label: 'Marquer comme livrée' });
    }

    return actions;
  };

  const availableActions = getAvailableActions(currentStatus);

  if (availableActions.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Actions sur la commande
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
          <div className="flex items-center gap-2">
            {getStatusIcon(currentStatus)}
            <span className="font-medium">Statut actuel:</span>
            <Badge className="ml-2">{getStatusText(currentStatus)}</Badge>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Changer le statut de la commande #{orderNumber}:
            </label>
            <Select
              value={selectedStatus}
              onValueChange={value => setSelectedStatus(value as OrderStatus)}
              disabled={isUpdating}
            >
              <SelectTrigger className="mt-1 w-full">
                <SelectValue placeholder="Sélectionner une action..." />
              </SelectTrigger>
              <SelectContent>
                {availableActions.map(action => (
                  <SelectItem key={action.value} value={action.value}>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(action.value as OrderStatus)}
                      {action.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedStatus && (
            <>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Raison du changement (optionnel):
                </label>
                <Textarea
                  value={changeReason}
                  onChange={e => setChangeReason(e.target.value)}
                  placeholder="Expliquez pourquoi ce changement est nécessaire..."
                  className="mt-1"
                  rows={2}
                  disabled={isUpdating}
                />
              </div>

              {selectedStatus === 'SHIPPED' && (
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Numéro de suivi (optionnel):
                  </label>
                  <Input
                    value={trackingNumber}
                    onChange={e => setTrackingNumber(e.target.value)}
                    placeholder="Saisissez le numéro de suivi..."
                    className="mt-1"
                    disabled={isUpdating}
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Notes additionnelles (optionnel):
                </label>
                <Textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Ajoutez des notes pour cette commande..."
                  className="mt-1"
                  rows={2}
                  disabled={isUpdating}
                />
              </div>

              <Button
                onClick={updateOrderStatus}
                disabled={isUpdating || !selectedStatus}
                className="w-full"
              >
                {isUpdating ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Mise à jour en cours...
                  </div>
                ) : (
                  `Confirmer le changement vers "${getStatusText(selectedStatus)}"`
                )}
              </Button>
            </>
          )}
        </div>

        {!selectedStatus && (
          <div className="mt-2 text-xs text-gray-500">
            <p>
              ⚠️ Cette action mettra à jour le statut de la commande et ne peut
              pas être annulée.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
