import { EntityType } from '@prisma/client';
import Form from 'next/form';

import {
  LuCopy,
  LuEllipsisVertical,
  LuPackage,
  LuPlus,
  LuTrash
} from 'react-icons/lu';

import ModalButton from 'components/modal-button';
import InventoryMutateModal from 'components/modal/mutate-inventory';
import { Button } from 'components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import { CarouselPictures } from 'components/ui/carousel';
import { Switch } from 'components/ui/switch';
import { db } from 'helpers/db';
import { deleteInventory, toggleInventory } from 'lib/actions';
import { cn } from 'lib/utils';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from 'components/ui/dropdown-menu';

export default async function SiteStoreProducts(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const site = await db.site.findUniqueOrThrow({
    where: { id: params.id },
    select: {
      id: true,
      blocks: {
        select: {
          id: true,
          widget: true,
          categories: {
            select: {
              id: true,
              name: true
            }
          },
          inventories: {
            select: {
              id: true,
              name: true,
              description: true,
              sku: true,
              basePrice: true,
              stock: true,
              active: true,
              isFeatured: true,
              categoryId: true,
              category: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      }
    }
  });

  const block = site.blocks.find(
    // @ts-ignore
    block => block.widget.type === 'other' && block.widget.id === 'store'
  );

  const medias = await db.media.findMany({
    select: {
      id: true,
      url: true,
      entityId: true,
      entityType: true,
      type: true
    },
    where: {
      entityType: EntityType.INVENTORY,
      entityId: { in: block?.inventories.map(inventory => inventory.id) ?? [] }
    },
    orderBy: {
      position: 'asc'
    }
  });

  if (!block) {
    return (
      <div>
        <h1>No block found</h1>
      </div>
    );
  }

  const categories = block.categories || [];

  // // Calculer les statistiques dynamiques
  // const totalProducts = block.inventories.length;
  // const inStockProducts = block.inventories.filter(inv => inv.stock > 0).length;
  // const lowStockProducts = block.inventories.filter(
  //   inv => inv.stock > 0 && inv.stock <= 5
  // ).length;
  // const outOfStockProducts = block.inventories.filter(
  //   inv => inv.stock === 0
  // ).length;

  return (
    <div className="flex min-h-screen flex-1 flex-col gap-6 bg-gray-50 p-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold">Gestion des produits</h1>
        <div className="flex gap-2">
          {/* <Select defaultValue="all">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Toutes les catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              <SelectItem value="tshirts">T-shirts</SelectItem>
              <SelectItem value="caps">Casquettes</SelectItem>
              <SelectItem value="sweats">Sweats</SelectItem>
              <SelectItem value="accessories">Accessoires</SelectItem>
            </SelectContent>
          </Select> */}

          {/* <Input
            type="text"
            placeholder="Rechercher un produit..."
            className="w-48"
          /> */}

          <ModalButton
            label={
              <>
                <LuPlus /> Ajouter un produit
              </>
            }
          >
            <InventoryMutateModal block={block} categories={categories} />
          </ModalButton>
        </div>
      </div>

      {/* Statistiques rapides */}
      {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total produits</p>
                <p className="text-2xl font-semibold">{totalProducts}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <span className="text-xl text-purple-600">📱</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">En stock</p>
                <p className="text-2xl font-semibold text-green-600">
                  {inStockProducts}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <span className="text-xl text-green-600">✅</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Stock faible</p>
                <p className="text-2xl font-semibold text-orange-600">
                  {lowStockProducts}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                <span className="text-xl text-orange-600"><CiWarning /></span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Rupture de stock</p>
                <p className="text-2xl font-semibold text-red-600">
                  {outOfStockProducts}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <span className="text-xl text-red-600"><LuX /></span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div> */}

      {/* Grille des produits */}
      <Card>
        <CardHeader>
          <CardTitle>Catalogue des produits</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {block.inventories.map(inventory => {
              const pictures = medias.filter(
                media =>
                  media.entityId === inventory.id &&
                  media.entityType === EntityType.INVENTORY
              );

              return (
                <Card
                  key={inventory.id}
                  className={cn(
                    'group overflow-hidden transition-all duration-300 hover:shadow-md',
                    !inventory.active && 'opacity-50'
                  )}
                >
                  <div className="flex bg-gray-100">
                    <CarouselPictures
                      pictures={pictures.map(picture => picture.url)}
                    />
                  </div>

                  <CardContent className="p-4">
                    <CardTitle className="mb-1 text-base">
                      {inventory.name}
                    </CardTitle>

                    {/* <p className="mb-2 text-sm text-gray-500">
                      Catégorie: {inventory.category?.name || 'Aucune'}
                    </p> */}

                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-lg font-bold text-green-600">
                        {Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'EUR'
                        }).format(Number(inventory.basePrice))}
                      </span>

                      <div className="flex items-center gap-2">
                        {/* <span
                          className={`text-sm ${inventory.stock === 0 ? 'text-red-500' : inventory.stock <= 5 ? 'text-orange-500' : 'text-gray-500'}`}
                        >
                          Stock: {inventory.stock}
                        </span> */}

                        {!inventory.active && (
                          <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-800">
                            Inactif
                          </span>
                        )}

                        {inventory.isFeatured && (
                          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                            Vedette
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <ModalButton label="Modifier" className="flex-1">
                        <InventoryMutateModal
                          block={block}
                          categories={categories}
                          inventory={inventory}
                          medias={medias}
                        />
                      </ModalButton>

                      <Form
                        action={async (form: FormData) => {
                          'use server';

                          await toggleInventory(form);
                        }}
                      >
                        <Button variant="ghost" size="icon" type="submit">
                          <input type="hidden" name="id" value={inventory.id} />
                          <Switch
                            defaultChecked={inventory.active}
                            name="active"
                          />
                        </Button>
                      </Form>

                      {/* <Switch id="active" name="active" checked={inventory.active} onCheckedChange={active => setData({ ...data, active })} /> */}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                            size="icon"
                          >
                            <LuEllipsisVertical />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent>
                          <DropdownMenuItem disabled asChild>
                            <button type="submit" className="w-full">
                              <LuCopy />
                              Duplicate
                            </button>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <Form
                            action={async (form: FormData) => {
                              'use server';

                              const id = String(form.get('id'));
                              if (!id) return;

                              await deleteInventory(id);
                            }}
                          >
                            <input
                              type="hidden"
                              name="id"
                              value={inventory.id}
                            />

                            <DropdownMenuItem variant="destructive" asChild>
                              <button type="submit" className="w-full">
                                <LuTrash />
                                Delete
                              </button>
                            </DropdownMenuItem>
                          </Form>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {block.inventories.length === 0 && (
              <div className="col-span-full py-12 text-center">
                <div className="mb-4 text-4xl text-gray-400">
                  <LuPackage />
                </div>

                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  Aucun produit
                </h3>

                <p className="mb-4 text-gray-500">
                  Commencez par ajouter votre premier produit
                </p>

                <ModalButton
                  label={
                    <>
                      <LuPlus className="h-4 w-4" /> Ajouter un produit
                    </>
                  }
                >
                  <InventoryMutateModal block={block} categories={categories} />
                </ModalButton>
              </div>
            )}
          </div>

          {/* <Separator className="my-6" /> */}

          {/* Pagination */}
          {/* <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Affichage de 1 à {block.inventories.length} sur{' '}
              {block.inventories.length} produits
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Précédent
              </Button>
              <Button size="sm">1</Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                Suivant
              </Button>
            </div>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
