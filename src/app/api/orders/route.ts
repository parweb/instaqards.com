import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient, OrderStatus } from '@prisma/client';

const prisma = new PrismaClient();

// Schema de validation pour les paramètres de requête
const QuerySchema = z.object({
  page: z
    .string()
    .transform(val => parseInt(val) || 1)
    .optional(),
  limit: z
    .string()
    .transform(val => Math.min(parseInt(val) || 10, 100))
    .optional(),
  status: z.nativeEnum(OrderStatus).optional(),
  search: z.string().optional(),
  blockId: z.string().optional()
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = QuerySchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      status: searchParams.get('status'),
      search: searchParams.get('search'),
      blockId: searchParams.get('blockId')
    });

    const { page = 1, limit = 10, status, search, blockId } = query;
    const skip = (page - 1) * limit;

    // Construction des filtres
    const where: any = {};

    if (blockId) {
      where.blockId = blockId;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { customerFirstName: { contains: search, mode: 'insensitive' } },
        { customerLastName: { contains: search, mode: 'insensitive' } },
        { customerEmail: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Récupération des commandes avec pagination
    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        select: {
          id: true,
          orderNumber: true,
          customerFirstName: true,
          customerLastName: true,
          customerEmail: true,
          customerPhone: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          shippedAt: true,
          deliveredAt: true,
          trackingNumber: true,
          total: true,
          items: {
            select: {
              quantity: true,
              unitPrice: true,
              totalPrice: true,
              productName: true,
              inventory: {
                select: {
                  name: true
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
      prisma.order.count({ where })
    ]);

    // Calcul des statistiques pour le dashboard
    const stats = await prisma.order.groupBy({
      by: ['status'],
      where: blockId ? { blockId } : {},
      _count: {
        status: true
      },
      _sum: {
        total: true
      }
    });

    // Calcul du revenu du mois
    const currentMonth = new Date();
    const startOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    );
    const monthlyRevenue = await prisma.order.aggregate({
      where: {
        ...(blockId ? { blockId } : {}),
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
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      data: {
        orders: orders.map(order => ({
          id: order.id,
          orderNumber: order.orderNumber,
          customer: {
            name: `${order.customerFirstName} ${order.customerLastName}`,
            email: order.customerEmail,
            phone: order.customerPhone
          },
          items: order.items.map(item => ({
            name: item.productName || item.inventory.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice
          })),
          itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
          total: order.total,
          status: order.status,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          shippedAt: order.shippedAt,
          deliveredAt: order.deliveredAt,
          trackingNumber: order.trackingNumber
        })),
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNextPage,
          hasPrevPage
        },
        stats: {
          total: totalCount,
          byStatus: stats.reduce(
            (acc, stat) => {
              acc[stat.status] = stat._count.status;
              return acc;
            },
            {} as Record<string, number>
          ),
          monthlyRevenue: monthlyRevenue._sum.total || 0
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Paramètres invalides',
          details: error.errors
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Erreur serveur lors de la récupération des commandes'
      },
      { status: 500 }
    );
  }
}
