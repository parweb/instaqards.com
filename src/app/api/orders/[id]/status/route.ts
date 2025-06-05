import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient, OrderStatus } from '@prisma/client';
import { getAuth } from 'lib/auth';

const prisma = new PrismaClient();

// Schema de validation pour la mise à jour du statut
const UpdateStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
  trackingNumber: z.string().optional(),
  notes: z.string().optional(),
  changeReason: z.string().optional()
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await getAuth();

    if (!auth) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const validatedData = UpdateStatusSchema.parse(body);

    const { status, trackingNumber, notes, changeReason } = validatedData;

    // Vérifier que la commande existe et récupérer le statut actuel
    const existingOrder = await prisma.order.findUnique({
      where: { id }
    });

    if (!existingOrder) {
      return NextResponse.json(
        { success: false, error: 'Commande non trouvée' },
        { status: 404 }
      );
    }

    // Si le statut n'a pas changé, on ne fait rien
    if (existingOrder.status === status) {
      return NextResponse.json({
        success: true,
        message: 'Aucun changement de statut détecté',
        order: {
          id: existingOrder.id,
          orderNumber: existingOrder.orderNumber,
          status: existingOrder.status,
          trackingNumber: existingOrder.trackingNumber,
          notes: existingOrder.notes,
          shippedAt: existingOrder.shippedAt,
          deliveredAt: existingOrder.deliveredAt,
          updatedAt: existingOrder.updatedAt
        }
      });
    }

    // Utiliser une transaction pour garantir la cohérence
    const result = await prisma.$transaction(async tx => {
      // Préparer les données de mise à jour
      const updateData: any = {
        status,
        updatedAt: new Date()
      };

      // Ajouter les timestamps selon le statut
      if (status === OrderStatus.SHIPPED && !existingOrder.shippedAt) {
        updateData.shippedAt = new Date();
      }

      if (status === OrderStatus.DELIVERED && !existingOrder.deliveredAt) {
        updateData.deliveredAt = new Date();
      }

      // Ajouter le numéro de suivi si fourni
      if (trackingNumber !== undefined) {
        updateData.trackingNumber = trackingNumber;
      }

      // Ajouter les notes si fournies
      if (notes !== undefined) {
        updateData.notes = notes;
      }

      // Créer l'entrée d'historique
      await tx.orderStatusHistory.create({
        data: {
          orderId: id,
          previousStatus: existingOrder.status,
          newStatus: status,
          changedBy: auth.id,
          changeReason:
            changeReason ||
            `Statut changé de ${existingOrder.status} à ${status}`,
          automaticChange: false // Puisque c'est un changement manuel via l'API
        }
      });

      // Mettre à jour la commande
      const updatedOrder = await tx.order.update({
        where: { id },
        data: updateData,
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
        }
      });

      return updatedOrder;
    });

    return NextResponse.json({
      success: true,
      order: {
        id: result.id,
        orderNumber: result.orderNumber,
        status: result.status,
        trackingNumber: result.trackingNumber,
        notes: result.notes,
        shippedAt: result.shippedAt,
        deliveredAt: result.deliveredAt,
        updatedAt: result.updatedAt
      }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Données invalides',
          details: error.errors
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Erreur serveur lors de la mise à jour du statut'
      },
      { status: 500 }
    );
  }
}
