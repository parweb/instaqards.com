import Form from 'next/form';

import {
  LuCopy,
  LuEllipsisVertical,
  LuPencil,
  LuPlus,
  LuTrash
} from 'react-icons/lu';

import ModalButton from 'components/modal-button';
import CategoryMutateModal from 'components/modal/mutate-category';
import { Badge } from 'components/ui/badge';
import { Button } from 'components/ui/button';
import { Separator } from 'components/ui/separator';
import { db } from 'helpers/db';
import { deleteCategory } from 'lib/actions';
import { cn } from 'lib/utils';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from 'components/ui/card';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from 'components/ui/dropdown-menu';

export default async function SiteStoreCategories(props: {
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
            orderBy: { position: 'asc' },
            where: {
              category: {
                is: null
              }
            },
            select: {
              id: true,
              name: true,
              description: true,
              active: true,
              _count: {
                select: {
                  inventories: true
                }
              },

              categories: {
                orderBy: { position: 'asc' },
                select: {
                  id: true,
                  name: true,
                  description: true,
                  active: true,
                  _count: {
                    select: {
                      inventories: true
                    }
                  }
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

  if (!block) {
    return (
      <div>
        <h1>No block found</h1>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold">Gestion des catégories</h1>
        <ModalButton
          label={
            <>
              <LuPlus /> Ajouter une catégorie
            </>
          }
        >
          <CategoryMutateModal block={block} />
        </ModalButton>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total catégories</p>
                <p className="text-2xl font-semibold">
                  {block.categories.length}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                <span className="text-xl text-indigo-600">📂</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Catégories actives</p>
                <p className="text-2xl font-semibold text-green-600">
                  {block.categories.filter(category => category.active).length}
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
                <p className="text-sm text-gray-500">
                  Produits moyens/catégorie
                </p>
                <p className="text-2xl font-semibold text-blue-600">
                  {block.categories.reduce(
                    (acc, category) => acc + category._count.inventories,
                    0
                  ) / block.categories.length}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <span className="text-xl text-blue-600">📊</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organisation des catégories</CardTitle>
          <CardDescription>
            Organisez vos produits par catégories pour faciliter la navigation
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {block.categories.map(category => {
              return (
                <Card
                  key={category.id}
                  className={cn({ 'opacity-50': category.active === false })}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400">📁</span>
                        <div>
                          <CardTitle className="text-base">
                            {category.name}
                          </CardTitle>
                          <p className="text-sm text-gray-500">
                            {category._count.inventories} produits
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={category.active ? 'success' : 'destructive'}
                        >
                          {category.active ? 'Active' : 'Désactivée'}
                        </Badge>

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
                            <DropdownMenuItem>
                              <ModalButton
                                className="w-full"
                                label={
                                  <>
                                    <LuPencil />
                                    Edit
                                  </>
                                }
                              >
                                <CategoryMutateModal
                                  block={block}
                                  category={category}
                                />
                              </ModalButton>
                            </DropdownMenuItem>

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

                                await deleteCategory(id);
                              }}
                            >
                              <input
                                type="hidden"
                                name="id"
                                value={category.id}
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
                    </div>
                  </CardHeader>

                  <Separator />

                  {/* Sous-catégories */}
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      {category.categories.map(child => {
                        return (
                          <div
                            key={child.id}
                            className="flex items-center justify-between pl-6"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-gray-300">└─</span>
                              <span className="text-gray-400">👕</span>
                              <div>
                                <span className="text-gray-900">
                                  {child.name}
                                </span>
                                <span className="ml-2 text-sm text-gray-500">
                                  {child._count.inventories} produits
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  child.active ? 'success' : 'destructive'
                                }
                              >
                                {child.active ? 'Active' : 'Désactivée'}
                              </Badge>

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
                                  <DropdownMenuItem>
                                    <ModalButton
                                      className="w-full"
                                      label={
                                        <>
                                          <LuPencil />
                                          Edit
                                        </>
                                      }
                                    >
                                      <CategoryMutateModal
                                        block={block}
                                        category={child}
                                      />
                                    </ModalButton>
                                  </DropdownMenuItem>

                                  <DropdownMenuItem disabled>
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

                                      await deleteCategory(id);
                                    }}
                                  >
                                    <input
                                      type="hidden"
                                      name="id"
                                      value={child.id}
                                    />

                                    <DropdownMenuItem
                                      variant="destructive"
                                      asChild
                                    >
                                      <button type="submit" className="w-full">
                                        <LuTrash />
                                        Delete
                                      </button>
                                    </DropdownMenuItem>
                                  </Form>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        );
                      })}

                      <div className="flex items-center justify-between pl-6">
                        <div className="flex items-center gap-3">
                          <span className="text-gray-300">└─</span>
                          <ModalButton
                            label={
                              <>
                                <LuPlus /> Ajouter une sous-catégorie
                              </>
                            }
                          >
                            <CategoryMutateModal
                              block={block}
                              parent={category}
                            />
                          </ModalButton>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
