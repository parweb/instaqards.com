'use client';

import { EntityType, Prisma } from '@prisma/client';
import va from '@vercel/analytics';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

import LoadingDots from 'components/icons/loading-dots';
import { AutosizeTextarea } from 'components/ui/autosize-textarea';
import { Button } from 'components/ui/button';

import { Uploader } from 'components/editor/form/types/upload';
import { Input } from 'components/ui/input';
import { Label } from 'components/ui/label';
import { Separator } from 'components/ui/separator';
import { Switch } from 'components/ui/switch';
import { mutateInventory } from 'lib/actions';
import { useModal } from './provider';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from 'components/ui/card';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from 'components/ui/select';

export default function InventoryMutateModal({
  block,
  inventory,
  medias = [],
  categories = []
}: {
  block: Prisma.SiteGetPayload<{
    select: {
      id: true;
    };
  }>;
  medias?: Prisma.MediaGetPayload<{
    select: {
      id: true;
      url: true;
      entityId: true;
      entityType: true;
      type: true;
    };
  }>[];
  inventory?: Prisma.InventoryGetPayload<{
    select: {
      id: true;
      name: true;
      description: true;
      sku: true;
      basePrice: true;
      stock: true;
      active: true;
      isFeatured: true;
      categoryId: true;
    };
  }>;
  categories?: Array<{
    id: string;
    name: string;
  }>;
}) {
  const router = useRouter();
  const modal = useModal();

  const [data, setData] = useState(
    inventory
      ? { ...inventory, medias }
      : {
          active: true,
          isFeatured: false,
          sku: '',
          name: '',
          description: '',
          basePrice: 0,
          stock: 0,
          categoryId: 'none',
          medias: []
        }
  );

  return (
    <Card className="max-w-4xl bg-white dark:bg-stone-800">
      <form
        action={async (form: FormData) => {
          for (const [key, value] of Object.entries({ medias: data.medias })) {
            if (Array.isArray(value)) {
              form.delete(key);
              for (const [i, item] of value.entries()) {
                for (const [attr, field] of Object.entries(item)) {
                  form.append(`${key}[${i}][${attr}]`, field);
                }
              }
            } else form.append(key, value);
          }

          console.log({ form: Object.fromEntries(form.entries()) });

          return mutateInventory(form).then(res => {
            if ('error' in res) {
              toast.error(res.error);
              console.error(res.error);
            } else {
              router.refresh();
              modal?.hide();
              toast.success('Product saved!');
              va.track('Product saved');
            }
          });
        }}
      >
        <input type="hidden" name="blockId" value={block.id} />
        {inventory?.id && (
          <input type="hidden" name="id" value={inventory.id} />
        )}
        {data.categoryId && (
          <input type="hidden" name="categoryId" value={data.categoryId} />
        )}

        <CardHeader>
          <CardTitle className="text-2xl">
            {inventory ? 'Modifier le produit' : 'Ajouter un produit'}
          </CardTitle>
        </CardHeader>

        <CardContent className="max-h-[70dvh] space-y-8 overflow-y-auto">
          {/* Section Statut */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Statut
            </h3>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex items-center space-x-3">
                <Switch
                  id="active"
                  name="active"
                  checked={data.active}
                  onCheckedChange={active => setData({ ...data, active })}
                />
                <div className="space-y-1">
                  <Label htmlFor="active" className="text-sm font-medium">
                    Produit actif
                  </Label>
                  <p className="text-xs text-gray-500">
                    Le produit sera visible dans la boutique
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Switch
                  id="isFeatured"
                  name="isFeatured"
                  checked={data.isFeatured}
                  onCheckedChange={isFeatured =>
                    setData({ ...data, isFeatured })
                  }
                />
                <div className="space-y-1">
                  <Label htmlFor="isFeatured" className="text-sm font-medium">
                    Produit vedette
                  </Label>
                  <p className="text-xs text-gray-500">
                    Mettre en avant ce produit
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Section Informations générales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Informations générales
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Nom du produit *
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Ex: T-shirt Qards Original"
                  value={data.name}
                  onChange={e => setData({ ...data, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku" className="text-sm font-medium">
                  SKU (Référence) *
                </Label>
                <Input
                  required
                  id="sku"
                  name="sku"
                  placeholder="Ex: TSH-QRD-001"
                  value={data?.sku ?? ''}
                  onChange={e => setData({ ...data, sku: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <AutosizeTextarea
                id="description"
                className="min-h-[100px]"
                name="description"
                placeholder="Décrivez votre produit en détail..."
                value={data?.description ?? ''}
                onChange={e =>
                  setData({ ...data, description: e.target.value })
                }
              />
            </div>
          </div>

          <Separator />

          {/* Section Prix et Stock */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Prix et inventaire
            </h3>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="basePrice" className="text-sm font-medium">
                  Prix de base (€) *
                </Label>
                <Input
                  id="basePrice"
                  name="basePrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="29.99"
                  value={Number(data.basePrice)}
                  onChange={e =>
                    setData({
                      ...data,
                      basePrice: parseFloat(e.target.value) || 0
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock" className="text-sm font-medium">
                  Stock disponible
                </Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  placeholder="100"
                  value={data.stock}
                  onChange={e =>
                    setData({ ...data, stock: parseInt(e.target.value) || 0 })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoryId" className="text-sm font-medium">
                  Catégorie *
                </Label>
                <Select
                  required
                  name="categoryId"
                  value={data?.categoryId ?? 'none'}
                  onValueChange={categoryId => setData({ ...data, categoryId })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucune catégorie</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          <Uploader
            ref={null as any}
            name="medias"
            data={{
              medias: data.medias
                .filter(
                  item =>
                    item.entityId === inventory?.id &&
                    item.entityType === EntityType.INVENTORY
                )
                .map(item => ({ id: item.id, url: item.url, kind: 'remote' }))
            }}
            shape={{
              kind: 'upload',
              multiple: true,
              preview: true,
              linkable: false,
              accept: { image: ['image/*'] },
              label: 'Images'
            }}
            setValue={(name, value) => {
              setData({ ...data, [name]: value });
            }}
          />
        </CardContent>

        <CardFooter className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={() => modal?.hide()}>
            Annuler
          </Button>
          <InventoryMutateButton />
        </CardFooter>
      </form>
    </Card>
  );
}

function InventoryMutateButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="min-w-[120px]">
      {pending ? <LoadingDots color="#ffffff" /> : 'Sauvegarder'}
    </Button>
  );
}
