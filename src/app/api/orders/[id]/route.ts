import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        customerFirstName: true,
        customerLastName: true,
        customerEmail: true,
        customerPhone: true,
        customerAddress: true,
        subtotal: true,
        tax: true,
        shipping: true,
        total: true,
        trackingNumber: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
        shippedAt: true,
        deliveredAt: true,
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
        block: {
          select: {
            id: true,
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

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Commande non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,

        // Informations client
        customer: {
          firstName: order.customerFirstName,
          lastName: order.customerLastName,
          fullName: `${order.customerFirstName} ${order.customerLastName}`,
          email: order.customerEmail,
          phone: order.customerPhone,
          address: order.customerAddress
        },

        // Articles
        items: order.items.map(item => ({
          id: item.id,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          product: {
            id: item.inventory.id,
            name: item.productName || item.inventory.name,
            description: item.productDescription || item.inventory.description,
            sku: item.productSku || item.inventory.sku
          }
        })),

        // Totaux
        pricing: {
          subtotal: order.subtotal,
          tax: order.tax,
          shipping: order.shipping,
          total: order.total
        },

        // Métadonnées
        tracking: {
          trackingNumber: order.trackingNumber,
          notes: order.notes
        },

        // Dates
        timeline: {
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          shippedAt: order.shippedAt,
          deliveredAt: order.deliveredAt
        },

        // Informations du site
        site: order.block
          ? {
              id: order.block.site.id,
              name: order.block.site.name,
              subdomain: order.block.site.subdomain
            }
          : null
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la commande:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Erreur serveur lors de la récupération de la commande'
      },
      { status: 500 }
    );
  }
}
