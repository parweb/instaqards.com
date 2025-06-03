import { Button } from 'components/ui/button';
import { Card, CardContent } from 'components/ui/card';
import { Badge } from 'components/ui/badge';
import { Input } from 'components/ui/input';
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

export default function SiteStoreOrders() {
  return (
    <div className="flex min-h-screen flex-1 flex-col gap-6 bg-gray-50 p-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold">Gestion des commandes</h1>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="confirmed">Confirmée</SelectItem>
              <SelectItem value="shipped">Expédiée</SelectItem>
              <SelectItem value="delivered">Livrée</SelectItem>
              <SelectItem value="cancelled">Annulée</SelectItem>
            </SelectContent>
          </Select>
          <Input type="text" placeholder="Rechercher..." className="w-48" />
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total commandes</p>
                <p className="text-2xl font-semibold">124</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <span className="text-xl text-blue-600">📦</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">En attente</p>
                <p className="text-2xl font-semibold text-orange-600">8</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                <span className="text-xl text-orange-600">⏳</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Expédiées</p>
                <p className="text-2xl font-semibold text-blue-600">15</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <span className="text-xl text-blue-600">🚚</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Revenu du mois</p>
                <p className="text-2xl font-semibold text-green-600">€3,247</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <span className="text-xl text-green-600">💰</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des commandes */}
      <Card>
        <CardContent className="p-0">
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
              <TableRow>
                <TableCell className="font-medium">#ORD-2024-001</TableCell>
                <TableCell>
                  <div className="text-sm text-gray-900">Alice Dupont</div>
                  <div className="text-sm text-gray-500">alice@example.com</div>
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  2 articles
                </TableCell>
                <TableCell className="font-medium">€58.00</TableCell>
                <TableCell>
                  <Badge variant="success">Livrée</Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  12 Jan 2024
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      Voir
                    </Button>
                    <Button variant="ghost" size="sm">
                      Imprimer
                    </Button>
                  </div>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-medium">#ORD-2024-002</TableCell>
                <TableCell>
                  <div className="text-sm text-gray-900">Bob Martin</div>
                  <div className="text-sm text-gray-500">bob@example.com</div>
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  1 article
                </TableCell>
                <TableCell className="font-medium">€29.00</TableCell>
                <TableCell>
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                    Expédiée
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  11 Jan 2024
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      Voir
                    </Button>
                    <Button variant="ghost" size="sm">
                      Imprimer
                    </Button>
                  </div>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-medium">#ORD-2024-003</TableCell>
                <TableCell>
                  <div className="text-sm text-gray-900">Claire Leroy</div>
                  <div className="text-sm text-gray-500">
                    claire@example.com
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  3 articles
                </TableCell>
                <TableCell className="font-medium">€87.50</TableCell>
                <TableCell>
                  <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                    En attente
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  10 Jan 2024
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      Voir
                    </Button>
                    <Button variant="ghost" size="sm">
                      Imprimer
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <Card>
        <CardContent className="flex items-center justify-between p-4">
          <div className="text-sm text-gray-500">
            Affichage de 1 à 10 sur 124 commandes
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
        </CardContent>
      </Card>
    </div>
  );
}
