import { Button } from 'components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import { Input } from 'components/ui/input';
import { Label } from 'components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from 'components/ui/select';
import { Separator } from 'components/ui/separator';
import { Switch } from 'components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'components/ui/tabs';
import { Textarea } from 'components/ui/textarea';

export default function SiteStoreSettings() {
  return (
    <div className="flex min-h-screen flex-1 flex-col gap-6 bg-gray-50 p-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold">Paramètres du magasin</h1>
        <Button>Sauvegarder les modifications</Button>
      </div>

      {/* Navigation des onglets */}
      <Card>
        <Tabs defaultValue="general" className="w-full">
          <CardHeader className="pb-3">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general">Général</TabsTrigger>
              <TabsTrigger value="payment">Paiement</TabsTrigger>
              <TabsTrigger value="shipping">Livraison</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>
          </CardHeader>

          {/* Contenu de l'onglet Général */}
          <TabsContent value="general">
            <CardContent>
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Informations générales */}
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900">
                      Informations générales
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="storeName">Nom du magasin</Label>
                        <Input
                          id="storeName"
                          type="text"
                          defaultValue="Qards Store"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          rows={3}
                          defaultValue="Boutique officielle de produits Qards et Aldo. Découvrez nos collections uniques de vêtements et accessoires."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email de contact</Label>
                        <Input
                          id="email"
                          type="email"
                          defaultValue="contact@qards.store"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          defaultValue="+33 1 23 45 67 89"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Adresse */}
                  <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900">
                      Adresse du magasin
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="address">Adresse</Label>
                        <Input
                          id="address"
                          type="text"
                          defaultValue="123 Rue de la République"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="zipCode">Code postal</Label>
                          <Input
                            id="zipCode"
                            type="text"
                            defaultValue="75001"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">Ville</Label>
                          <Input id="city" type="text" defaultValue="Paris" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="country">Pays</Label>
                        <Select defaultValue="france">
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un pays" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="france">France</SelectItem>
                            <SelectItem value="belgium">Belgique</SelectItem>
                            <SelectItem value="switzerland">Suisse</SelectItem>
                            <SelectItem value="canada">Canada</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Paramètres du magasin */}
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900">
                      Paramètres du magasin
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currency">Devise</Label>
                        <Select defaultValue="eur">
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une devise" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="eur">EUR (€)</SelectItem>
                            <SelectItem value="usd">USD ($)</SelectItem>
                            <SelectItem value="cad">CAD ($)</SelectItem>
                            <SelectItem value="chf">CHF (CHF)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="timezone">Fuseau horaire</Label>
                        <Select defaultValue="europe-paris">
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un fuseau horaire" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="europe-paris">
                              Europe/Paris (UTC+1)
                            </SelectItem>
                            <SelectItem value="europe-london">
                              Europe/London (UTC+0)
                            </SelectItem>
                            <SelectItem value="america-new-york">
                              America/New_York (UTC-5)
                            </SelectItem>
                            <SelectItem value="america-montreal">
                              America/Montreal (UTC-5)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="language">Langue par défaut</Label>
                        <Select defaultValue="fr">
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une langue" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fr">Français</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="de">Deutsch</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Statut du magasin */}
                  <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900">
                      Statut du magasin
                    </h3>
                    <div className="space-y-4">
                      <Card className="border-green-200 bg-green-50">
                        <CardContent className="flex items-center justify-between p-4">
                          <div className="flex items-center">
                            <div className="mr-3 h-3 w-3 rounded-full bg-green-400"></div>
                            <div>
                              <p className="text-sm font-medium text-green-900">
                                Magasin en ligne
                              </p>
                              <p className="text-sm text-green-700">
                                Votre magasin est accessible au public
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-700 hover:text-green-900"
                          >
                            Désactiver
                          </Button>
                        </CardContent>
                      </Card>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Mode maintenance
                            </p>
                            <p className="text-sm text-gray-500">
                              Afficher une page de maintenance
                            </p>
                          </div>
                          <Switch />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Mot de passe requis
                            </p>
                            <p className="text-sm text-gray-500">
                              Protéger l'accès avec un mot de passe
                            </p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Domaine personnalisé */}
                  <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900">
                      Domaine personnalisé
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentUrl">URL actuelle</Label>
                        <div className="flex">
                          <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                            https://
                          </span>
                          <Input
                            id="currentUrl"
                            type="text"
                            defaultValue="qards-store.mystore.com"
                            className="rounded-l-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="customDomain">
                          Domaine personnalisé
                        </Label>
                        <div className="flex">
                          <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                            https://
                          </span>
                          <Input
                            id="customDomain"
                            type="text"
                            placeholder="shop.qards.com"
                            className="rounded-l-none"
                          />
                        </div>
                        <p className="text-sm text-gray-500">
                          Configurez votre propre domaine pour une meilleure
                          image de marque
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-8" />

              {/* Actions */}
              <div className="flex justify-between">
                <Button
                  variant="destructive"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  Supprimer le magasin
                </Button>
                <div className="space-x-3">
                  <Button variant="outline">Annuler</Button>
                  <Button>Sauvegarder</Button>
                </div>
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="payment">
            <CardContent>
              <p className="py-8 text-center text-gray-500">
                Configuration des moyens de paiement à venir...
              </p>
            </CardContent>
          </TabsContent>

          <TabsContent value="shipping">
            <CardContent>
              <p className="py-8 text-center text-gray-500">
                Configuration des options de livraison à venir...
              </p>
            </CardContent>
          </TabsContent>

          <TabsContent value="notifications">
            <CardContent>
              <p className="py-8 text-center text-gray-500">
                Configuration des notifications à venir...
              </p>
            </CardContent>
          </TabsContent>

          <TabsContent value="seo">
            <CardContent>
              <p className="py-8 text-center text-gray-500">
                Configuration SEO à venir...
              </p>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
