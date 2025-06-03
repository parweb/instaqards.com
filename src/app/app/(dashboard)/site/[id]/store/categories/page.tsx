import { LuPlus } from 'react-icons/lu';

import ModalButton from 'components/modal-button';
import CategoryMutateModal from 'components/modal/mutate-category';
import { Badge } from 'components/ui/badge';
import { Button } from 'components/ui/button';
import { Separator } from 'components/ui/separator';
import { db } from 'helpers/db';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from 'components/ui/card';

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
            select: {
              id: true,
              name: true,
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
  });

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
          <CategoryMutateModal site={site} />
        </ModalButton>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total catégories</p>
                <p className="text-2xl font-semibold">8</p>
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
                <p className="text-2xl font-semibold text-green-600">7</p>
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
                <p className="text-2xl font-semibold text-blue-600">6</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <span className="text-xl text-blue-600">📊</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des catégories */}
      <Card>
        <CardHeader>
          <CardTitle>Organisation des catégories</CardTitle>
          <CardDescription>
            Organisez vos produits par catégories pour faciliter la navigation
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {site.blocks
              .find(block => block.widget.type === 'store')
              ?.categories.map(category => {
                return (
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-gray-400">📁</span>
                          <div>
                            <CardTitle className="text-base">
                              Vêtements
                            </CardTitle>
                            <p className="text-sm text-gray-500">32 produits</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="success">Active</Badge>
                          <Button variant="ghost" size="sm">
                            Modifier
                          </Button>
                          <Button variant="ghost" size="sm">
                            •••
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    <Separator />

                    {/* Sous-catégories */}
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pl-6">
                          <div className="flex items-center gap-3">
                            <span className="text-gray-300">└─</span>
                            <span className="text-gray-400">👕</span>
                            <div>
                              <span className="text-gray-900">T-shirts</span>
                              <span className="ml-2 text-sm text-gray-500">
                                15 produits
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="success">Active</Badge>
                            <Button variant="ghost" size="sm">
                              Modifier
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pl-6">
                          <div className="flex items-center gap-3">
                            <span className="text-gray-300">└─</span>
                            <span className="text-gray-400">🧥</span>
                            <div>
                              <span className="text-gray-900">Sweats</span>
                              <span className="ml-2 text-sm text-gray-500">
                                12 produits
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="success">Active</Badge>
                            <Button variant="ghost" size="sm">
                              Modifier
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pl-6">
                          <div className="flex items-center gap-3">
                            <span className="text-gray-300">└─</span>
                            <span className="text-gray-400">👔</span>
                            <div>
                              <span className="text-gray-900">Polos</span>
                              <span className="ml-2 text-sm text-gray-500">
                                5 produits
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="success">Active</Badge>
                            <Button variant="ghost" size="sm">
                              Modifier
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

            {/* Catégorie principale 1 */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400">📁</span>
                    <div>
                      <CardTitle className="text-base">Vêtements</CardTitle>
                      <p className="text-sm text-gray-500">32 produits</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="success">Active</Badge>
                    <Button variant="ghost" size="sm">
                      Modifier
                    </Button>
                    <Button variant="ghost" size="sm">
                      •••
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <Separator />

              {/* Sous-catégories */}
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pl-6">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-300">└─</span>
                      <span className="text-gray-400">👕</span>
                      <div>
                        <span className="text-gray-900">T-shirts</span>
                        <span className="ml-2 text-sm text-gray-500">
                          15 produits
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="success">Active</Badge>
                      <Button variant="ghost" size="sm">
                        Modifier
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pl-6">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-300">└─</span>
                      <span className="text-gray-400">🧥</span>
                      <div>
                        <span className="text-gray-900">Sweats</span>
                        <span className="ml-2 text-sm text-gray-500">
                          12 produits
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="success">Active</Badge>
                      <Button variant="ghost" size="sm">
                        Modifier
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pl-6">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-300">└─</span>
                      <span className="text-gray-400">👔</span>
                      <div>
                        <span className="text-gray-900">Polos</span>
                        <span className="ml-2 text-sm text-gray-500">
                          5 produits
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="success">Active</Badge>
                      <Button variant="ghost" size="sm">
                        Modifier
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Catégorie principale 2 */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400">📁</span>
                    <div>
                      <CardTitle className="text-base">Accessoires</CardTitle>
                      <p className="text-sm text-gray-500">15 produits</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="success">Active</Badge>
                    <Button variant="ghost" size="sm">
                      Modifier
                    </Button>
                    <Button variant="ghost" size="sm">
                      •••
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <Separator />

              {/* Sous-catégories */}
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pl-6">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-300">└─</span>
                      <span className="text-gray-400">🧢</span>
                      <div>
                        <span className="text-gray-900">Casquettes</span>
                        <span className="ml-2 text-sm text-gray-500">
                          8 produits
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="success">Active</Badge>
                      <Button variant="ghost" size="sm">
                        Modifier
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pl-6">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-300">└─</span>
                      <span className="text-gray-400">☕</span>
                      <div>
                        <span className="text-gray-900">Mugs</span>
                        <span className="ml-2 text-sm text-gray-500">
                          4 produits
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="success">Active</Badge>
                      <Button variant="ghost" size="sm">
                        Modifier
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pl-6">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-300">└─</span>
                      <span className="text-gray-400">🏷️</span>
                      <div>
                        <span className="text-gray-900">Stickers</span>
                        <span className="ml-2 text-sm text-gray-500">
                          3 produits
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                        Rupture
                      </Badge>
                      <Button variant="ghost" size="sm">
                        Modifier
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Catégorie désactivée */}
            <Card className="opacity-60">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400">📁</span>
                    <div>
                      <CardTitle className="text-base">
                        Collections Limitées
                      </CardTitle>
                      <p className="text-sm text-gray-500">0 produits</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">Désactivée</Badge>
                    <Button variant="ghost" size="sm">
                      Activer
                    </Button>
                    <Button variant="ghost" size="sm">
                      •••
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
