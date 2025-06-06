import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { getAuth } from 'lib/auth';

const prisma = new PrismaClient();

// Schema de validation pour la création de commande
const CreateOrderSchema = z.object({
  blockId: z.string(),
  customer: z.object({
    firstName: z.string().min(1, 'Prénom requis'),
    lastName: z.string().min(1, 'Nom requis'),
    email: z.string().email('Email invalide'),
    phone: z.string().optional(),
    address: z.object({
      formatted_address: z.string(),
      components: z.object({
        street_number: z.string().optional(),
        route: z.string().optional(),
        locality: z.string().optional(),
        political: z.string().optional(),
        administrative_area_level_2: z.string().optional(),
        administrative_area_level_1: z.string().optional(),
        country: z.string().optional(),
        postal_code: z.string().optional()
      })
    })
  }),
  items: z
    .array(
      z.object({
        inventoryId: z.string(),
        quantity: z.number().min(1),
        unitPrice: z.number(),
        name: z.string(),
        description: z.string().optional(),
        sku: z.string().optional()
      })
    )
    .min(1, 'Au moins un article requis')
});

// Fonction pour générer un numéro de commande unique
async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear();

  // Compter le nombre de commandes cette année
  const orderCount = await prisma.order.count({
    where: {
      createdAt: {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${year + 1}-01-01`)
      }
    }
  });

  const orderNumber = `ORD-${year}-${String(orderCount + 1).padStart(3, '0')}`;
  return orderNumber;
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuth();

    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = CreateOrderSchema.parse(body);

    const { blockId, customer, items } = validatedData;

    // Calculer le total
    const subtotal = items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
    const tax = 0; // À implémenter selon les règles de taxation
    const shipping = 0; // À implémenter selon les règles de livraison
    const total = subtotal + tax + shipping;

    // Générer le numéro de commande
    const orderNumber = await generateOrderNumber();

    // Créer la commande avec les articles et l'historique initial
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerFirstName: customer.firstName,
        customerLastName: customer.lastName,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        customerAddress: customer.address,
        subtotal,
        tax,
        shipping,
        total,
        blockId,
        items: {
          create: items.map(item => ({
            inventoryId: item.inventoryId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.unitPrice * item.quantity,
            productName: item.name,
            productDescription: item.description,
            productSku: item.sku
          }))
        },
        // Créer l'entrée d'historique initiale
        statusHistory: {
          create: {
            previousStatus: null, // null car c'est la création
            newStatus: 'PENDING',
            changeReason: 'Commande créée par le client',
            automaticChange: true,
            changedBy: auth.id
          }
        }
      },
      include: {
        items: {
          include: {
            inventory: true
          }
        },
        statusHistory: true
      }
    });

    // Optionnel : Mettre à jour le stock des produits
    for (const item of items) {
      await prisma.inventory.update({
        where: { id: item.inventoryId },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      });
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt
      }
    });
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error);

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
        error: 'Erreur serveur lors de la création de la commande'
      },
      { status: 500 }
    );
  }
}
