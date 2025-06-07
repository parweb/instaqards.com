'use client';

import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { Suspense, useEffect, useRef, useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  EntityType,
  Inventory as InventoryType,
  type Prisma
} from '@prisma/client';

import {
  LuLoader,
  LuMinus,
  LuPlus,
  LuShoppingCart,
  LuSparkles,
  LuX
} from 'react-icons/lu';

import { Address } from 'components/editor/form/types/address';
import { useModal } from 'components/modal/provider';
import { Button } from 'components/ui/button';
import { Card, CardContent, CardTitle } from 'components/ui/card';
import { CarouselPictures } from 'components/ui/carousel';
import { Input } from 'components/ui/input';
import { $ } from 'helpers/$';
import { InventorySchema } from '../../../../../prisma/generated/zod';

export const input = z.object({});

const CartSchema = InventorySchema.pick({
  id: true,
  name: true,
  basePrice: true
}).merge(z.object({ quantity: z.number() }));

// Utilisation d'une Map pour stocker les atomes par blockId
const cartAtoms = new Map<
  string,
  ReturnType<typeof atomWithStorage<z.infer<typeof CartSchema>[]>>
>();
const cartOpenAtoms = new Map<string, ReturnType<typeof atom<boolean>>>();
const cartAnimationAtoms = new Map<string, ReturnType<typeof atom<boolean>>>();

const getCartAtom = (blockId: string) => {
  if (!cartAtoms.has(blockId)) {
    cartAtoms.set(
      blockId,
      atomWithStorage<z.infer<typeof CartSchema>[]>(`cart-${blockId}`, [])
    );
  }
  return cartAtoms.get(blockId)!;
};

const getCartOpenAtom = (blockId: string) => {
  if (!cartOpenAtoms.has(blockId)) {
    cartOpenAtoms.set(blockId, atom<boolean>(false));
  }
  return cartOpenAtoms.get(blockId)!;
};

const getCartAnimationAtom = (blockId: string) => {
  if (!cartAnimationAtoms.has(blockId)) {
    cartAnimationAtoms.set(blockId, atom<boolean>(false));
  }
  return cartAnimationAtoms.get(blockId)!;
};

// État pour la modal de détail produit
const productModalAtoms = new Map<
  string,
  ReturnType<typeof atom<string | null>>
>();

const getProductModalAtom = (blockId: string) => {
  if (!productModalAtoms.has(blockId)) {
    productModalAtoms.set(blockId, atom<string | null>(null));
  }
  return productModalAtoms.get(blockId)!;
};

type FlyingItem = {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  timestamp: number;
  productName: string;
};

type Particle = {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
};

const $flyingItems = atom<FlyingItem[]>([]);
const $particles = atom<Particle[]>([]);
const $cartBurst = atom<boolean>(false);

const addToCart =
  (item: Omit<z.infer<typeof CartSchema>, 'quantity'>) =>
  (prev: z.infer<typeof CartSchema>[]) => {
    const existingItemIndex = prev.findIndex(
      cartItem => cartItem.id === item.id
    );

    if (existingItemIndex >= 0) {
      const updatedCart = [...prev];
      updatedCart[existingItemIndex].quantity += 1;
      return updatedCart;
    }

    return [...prev, { ...item, quantity: 1 }];
  };

const removeFromCart = (id: string) => (prev: z.infer<typeof CartSchema>[]) =>
  prev.filter(item => item.id !== id);

const updateQuantity =
  (id: string, quantity: number) => (prev: z.infer<typeof CartSchema>[]) => {
    if (quantity <= 0) {
      return prev.filter(item => item.id !== id);
    }

    return prev.map(item => (item.id === id ? { ...item, quantity } : item));
  };

const triggerCartAnimation = (
  setCartAnimation: (update: (prev: boolean) => boolean) => void
) => {
  setCartAnimation(() => true);
  setTimeout(() => {
    setCartAnimation(() => false);
  }, 1000);
};

const createParticles = (x: number, y: number): Particle[] => {
  return Array.from({ length: 8 }, _ => ({
    id: Math.random().toString(36).substr(2, 9),
    x,
    y,
    vx: (Math.random() - 0.5) * 8,
    vy: (Math.random() - 0.5) * 8,
    life: 60,
    maxLife: 60,
    size: Math.random() * 4 + 2
  }));
};

const createFlyingAnimation = (
  buttonElement: HTMLElement,
  productName: string,
  setFlyingItems: (update: (prev: FlyingItem[]) => FlyingItem[]) => void,
  setParticles: (update: (prev: Particle[]) => Particle[]) => void,
  setCartAnimation: (update: (prev: boolean) => boolean) => void,
  setCartBurst: (update: (prev: boolean) => boolean) => void
) => {
  // Petite attente pour laisser le DOM se mettre à jour avec le nouvel état du panier
  setTimeout(() => {
    const cartIndicator = document.querySelector(
      '[data-cart-indicator]'
    ) as HTMLElement;
    const buttonRect = buttonElement.getBoundingClientRect();

    let endX, endY;

    if (cartIndicator) {
      // L'indicateur existe, on utilise sa position
      const cartRect = cartIndicator.getBoundingClientRect();
      endX = cartRect.left + cartRect.width / 2;
      endY = cartRect.top + cartRect.height / 2;
    } else {
      // L'indicateur n'existe pas encore, on utilise une position par défaut (coin bas-droit)
      endX = window.innerWidth - 80;
      endY = window.innerHeight - 80;
    }

    const flyingItem: FlyingItem = {
      id: Math.random().toString(36).substr(2, 9),
      startX: buttonRect.left + buttonRect.width / 2,
      startY: buttonRect.top + buttonRect.height / 2,
      endX,
      endY,
      timestamp: Date.now(),
      productName
    };

    // Ajouter l'item volant
    setFlyingItems(prev => [...prev, flyingItem]);

    // Créer des particules à l'origine
    const originParticles = createParticles(
      flyingItem.startX,
      flyingItem.startY
    );
    setParticles(prev => [...prev, ...originParticles]);

    // Animation terminée
    setTimeout(() => {
      // Supprimer l'item volant
      setFlyingItems(prev => prev.filter(item => item.id !== flyingItem.id));

      // Créer burst à l'arrivée
      setCartBurst(() => true);
      const burstParticles = createParticles(flyingItem.endX, flyingItem.endY);
      setParticles(prev => [...prev, ...burstParticles]);

      setTimeout(() => setCartBurst(() => false), 500);

      // Animation du panier
      triggerCartAnimation(setCartAnimation);
    }, 1200);
  }, 50); // 50ms d'attente pour laisser React mettre à jour le DOM
};

const ProductModalInner = ({
  inventoryId
}: {
  inventoryId: InventoryType['id'];
}) => {
  const modal = useModal();

  const inventory = useAtomValue(
    $.inventory.findUniqueOrThrow({
      select: {
        id: true,
        name: true,
        basePrice: true,
        description: true,
        blockId: true
      },
      where: {
        id: inventoryId
      }
    })
  );

  const medias = useAtomValue(
    $.media.findMany({
      select: {
        id: true,
        url: true
      },
      where: {
        entityId: inventoryId,
        entityType: EntityType.INVENTORY
      }
    })
  );

  const blockId = inventory.blockId;

  const setCart = useSetAtom(getCartAtom(blockId));
  const setCartAnimation = useSetAtom(getCartAnimationAtom(blockId));
  const setFlyingItems = useSetAtom($flyingItems);
  const setParticles = useSetAtom($particles);
  const setCartBurst = useSetAtom($cartBurst);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const onClose = () => {
    modal?.hide();
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between border-b p-6">
        <h2 className="text-2xl font-bold">Détail du produit</h2>

        <Button variant="ghost" size="sm" onClick={onClose}>
          <LuX />
        </Button>
      </div>

      {/* Content */}
      <div className="max-h-[70vh] overflow-y-auto p-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Images */}
          <div className="group relative bg-white">
            <CarouselPictures pictures={medias.map(picture => picture.url)} />
          </div>

          {/* Info produit */}
          <div className="space-y-6">
            {inventory.basePrice && (
              <div className="text-4xl font-bold text-green-600">
                {Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'EUR'
                }).format(Number(inventory.basePrice))}
              </div>
            )}

            {/* Description (placeholder) */}
            <div>
              <h3 className="mb-3 text-lg font-semibold">Description</h3>
              <p className="leading-relaxed text-gray-700">
                {inventory.description}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                ref={buttonRef}
                size="lg"
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => {
                  setCart(
                    addToCart({
                      id: inventory.id,
                      name: inventory.name,
                      basePrice: inventory.basePrice
                    })
                  );

                  if (buttonRef.current) {
                    createFlyingAnimation(
                      buttonRef.current,
                      inventory.name,
                      setFlyingItems,
                      setParticles,
                      setCartAnimation,
                      setCartBurst
                    );
                  }
                  // Fermer la modal après ajout
                  setTimeout(() => onClose(), 300);
                }}
              >
                <LuShoppingCart className="mr-2 h-5 w-5" />
                Ajouter au panier
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const ProductModal = ({
  inventoryId
}: {
  inventoryId: InventoryType['id'];
}) => {
  return (
    <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl">
      <Suspense
        fallback={
          <div className="my-10 flex min-w-sm items-center justify-center bg-white p-4">
            <LuLoader className="animate-spin" />
          </div>
        }
      >
        <ProductModalInner inventoryId={inventoryId} />
      </Suspense>
    </div>
  );
};

const Inventory = ({
  inventory,
  medias,
  blockId
}: {
  inventory: Prisma.InventoryGetPayload<{
    select: {
      id: true;
      name: true;
      basePrice: true;
    };
  }>;
  medias: Prisma.MediaGetPayload<{
    select: {
      id: true;
      url: true;
      entityId: true;
      entityType: true;
    };
  }>[];
  blockId: string;
}) => {
  const setCart = useSetAtom(getCartAtom(blockId));
  const setCartAnimation = useSetAtom(getCartAnimationAtom(blockId));
  const setFlyingItems = useSetAtom($flyingItems);
  const setParticles = useSetAtom($particles);
  const setCartBurst = useSetAtom($cartBurst);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const modal = useModal();

  return (
    <Card
      key={inventory.id}
      className="group cursor-pointer overflow-hidden transition-shadow hover:shadow-md"
      onClick={() => {
        modal?.show(<ProductModal inventoryId={inventory.id} />);
      }}
    >
      <div className="flex bg-gray-100">
        <CarouselPictures pictures={medias.map(picture => picture.url)} />
      </div>

      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div>
          <CardTitle className="mb-1 text-base">{inventory.name}</CardTitle>

          {inventory.basePrice && (
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-green-600">
                {Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'EUR'
                }).format(Number(inventory.basePrice))}
              </span>
            </div>
          )}
        </div>

        <div>
          <Button
            ref={buttonRef}
            onClick={e => {
              e.stopPropagation(); // Empêcher l'ouverture de la modal
              setCart(
                addToCart({
                  id: inventory.id,
                  name: inventory.name,
                  basePrice: inventory.basePrice
                })
              );
              if (buttonRef.current) {
                createFlyingAnimation(
                  buttonRef.current,
                  inventory.name,
                  setFlyingItems,
                  setParticles,
                  setCartAnimation,
                  setCartBurst
                );
              }
            }}
          >
            <LuShoppingCart className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Formulaire de commande
const OrderForm = ({
  onClose,
  blockId
}: {
  onClose: () => void;
  blockId: string;
}) => {
  const cart = useAtomValue(getCartAtom(blockId));
  const setCart = useSetAtom(getCartAtom(blockId));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      address: null
    }
  });

  const onSubmit = async (data: any) => {
    if (cart.length === 0) {
      alert('Votre panier est vide');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        blockId,
        customer: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          address: data.address
        },
        items: cart.map(item => ({
          inventoryId: item.id,
          quantity: item.quantity,
          unitPrice: Number(item.basePrice),
          name: item.name,
          description: '', // On pourrait ajouter cela plus tard
          sku: '' // On pourrait ajouter cela plus tard
        }))
      };

      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (result.success) {
        // Vider le panier
        setCart([]);

        // Afficher un message de succès
        alert(
          `Commande créée avec succès ! Numéro de commande: ${result.order.orderNumber}`
        );

        // Fermer le formulaire
        onClose();
        reset();
      } else {
        alert(`Erreur lors de la création de la commande: ${result.error}`);
      }
    } catch (error) {
      console.error('Erreur lors de la commande:', error);
      alert('Erreur lors de la création de la commande. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="flex w-full max-w-lg flex-col gap-4 rounded-lg bg-white p-8 shadow-xl"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="mb-4 text-2xl font-bold">Finaliser ma commande</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Controller
          name="firstName"
          control={control}
          rules={{ required: 'Prénom requis' }}
          render={({ field }) => (
            <Input {...field} placeholder="Prénom" autoComplete="given-name" />
          )}
        />
        <Controller
          name="lastName"
          control={control}
          rules={{ required: 'Nom requis' }}
          render={({ field }) => (
            <Input {...field} placeholder="Nom" autoComplete="family-name" />
          )}
        />
      </div>
      <Controller
        name="phone"
        control={control}
        rules={{ required: 'Téléphone requis' }}
        render={({ field }) => (
          <Input {...field} placeholder="Téléphone" autoComplete="tel" />
        )}
      />
      <Controller
        name="email"
        control={control}
        rules={{ required: 'Email requis' }}
        render={({ field }) => (
          <Input
            {...field}
            placeholder="Email"
            type="email"
            autoComplete="email"
          />
        )}
      />
      <div>
        <Address
          control={control}
          name="address"
          shape={{
            kind: 'address' as const,
            label: 'Adresse de livraison',
            placeholder: 'Entrez votre adresse',
            defaultValue: {
              components: {
                street_number: '',
                route: '',
                locality: '',
                political: '',
                administrative_area_level_2: '',
                administrative_area_level_1: '',
                country: '',
                postal_code: ''
              },
              formatted_address: ''
            }
          }}
          data={{}}
        />
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          className="bg-green-600 hover:bg-green-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Validation en cours...' : 'Valider la commande'}
        </Button>
      </div>
    </form>
  );
};

const Cart = ({ blockId }: { blockId: string }) => {
  const [cart, setCart] = useAtom(getCartAtom(blockId));
  const setCartAnimation = useSetAtom(getCartAnimationAtom(blockId));
  const modal = useModal();

  const total = cart.reduce(
    (sum, item) => sum + Number(item.basePrice) * item.quantity,
    0
  );

  // Affiche le formulaire de commande dans la modale
  const handleOrder = () => {
    modal?.show(<OrderForm onClose={() => modal?.hide()} blockId={blockId} />);
  };

  return (
    <div className="max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-xl">
      <div className="flex items-center justify-between p-6">
        <h2 className="flex items-center gap-2 text-2xl font-bold">
          <LuShoppingCart />
          Mon Panier ({cart.length})
        </h2>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => modal?.hide()}
          className="text-gray-500 hover:text-gray-900"
        >
          <LuX />
        </Button>
      </div>

      <div className="max-h-96 overflow-y-auto p-4">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 px-8 text-center">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 shadow-inner">
                <LuShoppingCart className="h-12 w-12 text-gray-400" />
              </div>
              <div className="absolute -top-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                <span className="text-xl font-bold text-red-500">×</span>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800">
              Votre panier est vide
            </h3>

            <p className="mb-6 max-w-sm leading-relaxed text-gray-500">
              Découvrez nos produits exceptionnels et ajoutez vos articles
              préférés pour commencer vos achats !
            </p>

            <Button
              onClick={() => modal?.hide()}
              className="transform rounded-full bg-gradient-to-r from-green-500 to-green-600 px-8 py-3 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-green-600 hover:to-green-700"
            >
              <span className="mr-2">🛍️</span>
              Continuer mes achats
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map(item => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="font-bold text-green-600">
                    {Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR'
                    }).format(Number(item.basePrice))}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCart(updateQuantity(item.id, item.quantity - 1))
                      }
                      className="h-8 w-8 p-0"
                    >
                      <LuMinus className="h-3 w-3" />
                    </Button>

                    <span className="w-8 text-center font-semibold">
                      {item.quantity}
                    </span>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCart(updateQuantity(item.id, item.quantity + 1));
                        triggerCartAnimation(setCartAnimation);
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <LuPlus className="h-3 w-3" />
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCart(removeFromCart(item.id))}
                    className="text-red-500 hover:bg-red-50 hover:text-red-700"
                  >
                    <LuX className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t bg-gray-50 p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xl font-bold">Total:</span>
          <span className="text-2xl font-bold text-green-600">
            {Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: 'EUR'
            }).format(total)}
          </span>
        </div>

        <div className="flex justify-end">
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={handleOrder}
          >
            Commander
          </Button>
        </div>
      </div>
    </div>
  );
};

const Inventories = ({ blockId }: { blockId: string }) => {
  const inventories = useAtomValue(
    $.inventory.findMany({
      where: { blockId },
      select: {
        id: true,
        name: true,
        description: true,
        basePrice: true,
        stock: true,
        category: { select: { name: true } }
      }
    })
  );

  const medias = useAtomValue(
    $.media.findMany({
      where: {
        entityType: EntityType.INVENTORY,
        entityId: { in: inventories.map(inventory => inventory.id) }
      },
      select: {
        id: true,
        url: true,
        entityId: true,
        entityType: true
      }
    })
  );

  const cart = useAtomValue(getCartAtom(blockId));
  const [cartOpen, setCartOpen] = useAtom(getCartOpenAtom(blockId));
  const [selectedProductId] = useAtom(getProductModalAtom(blockId));

  // Fermer automatiquement la modal si le panier devient vide
  useEffect(() => {
    if (cart.length === 0 && cartOpen) {
      setCartOpen(false);
    }
  }, [cart.length, cartOpen, setCartOpen]);

  // Trouver le produit sélectionné
  const selectedProduct = selectedProductId
    ? inventories.find(inv => inv.id === selectedProductId)
    : null;

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        {inventories.map(inventory => (
          <Inventory
            key={inventory.id}
            inventory={inventory}
            blockId={blockId}
            medias={medias.filter(
              media =>
                media.entityId === inventory.id &&
                media.entityType === EntityType.INVENTORY
            )}
          />
        ))}
      </div>

      {/* Modal produit */}
      {selectedProduct && (
        <ProductModal
          inventoryId={selectedProduct.id}
          // inventory={selectedProduct}
          // medias={selectedProductMedias}
          // blockId={blockId}
          // isOpen={!!selectedProductId}
          // onClose={() => setSelectedProductId(null)}
        />
      )}
    </>
  );
};

const ParticleSystem = () => {
  const [particles, setParticles] = useAtom($particles);

  useEffect(() => {
    if (particles.length === 0) return;

    const interval = setInterval(() => {
      setParticles(prev =>
        prev
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vy: particle.vy + 0.3, // gravity
            vx: particle.vx * 0.98, // air resistance
            life: particle.life - 1
          }))
          .filter(particle => particle.life > 0)
      );
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [particles.length, setParticles]);

  return (
    <div className="pointer-events-none fixed inset-0 z-40">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-green-400"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.life / particle.maxLife,
            transform: `scale(${particle.life / particle.maxLife})`,
            boxShadow: `0 0 ${particle.size * 2}px rgba(34, 197, 94, 0.5)`
          }}
        />
      ))}
    </div>
  );
};

const FlyingItems = () => {
  const flyingItems = useAtomValue($flyingItems);

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {flyingItems.map(item => {
        const deltaX = item.endX - item.startX;
        const deltaY = item.endY - item.startY;
        const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

        // Points de contrôle pour une courbe de Bézier plus naturelle
        const controlX = deltaX * 0.5 + (Math.random() - 0.5) * 100;
        const controlY = deltaY * 0.3 - Math.min(distance * 0.3, 150);

        return (
          <div
            key={item.id}
            className="absolute"
            style={{
              left: `${item.startX}px`,
              top: `${item.startY}px`
            }}
          >
            {/* Trail effect */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute h-8 w-8 rounded-full bg-green-400 opacity-50"
                style={{
                  animation: `trail-${item.id}-${i} 1.2s cubic-bezier(0.25, 0.1, 0.25, 1) forwards`,
                  animationDelay: `${i * 0.03}s`,
                  filter: 'blur(1px)'
                }}
              />
            ))}

            {/* Item principal avec glow */}
            <div
              className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white shadow-2xl"
              style={{
                animation: `flyToCart-${item.id} 1.2s cubic-bezier(0.25, 0.1, 0.25, 1) forwards`,
                filter: 'drop-shadow(0 0 20px rgba(34, 197, 94, 0.8))',
                zIndex: 10
              }}
            >
              <LuShoppingCart className="h-6 w-6" />

              {/* Ring d'expansion */}
              <div
                className="absolute inset-0 rounded-full border-2 border-green-300"
                style={{
                  animation: `expand-${item.id} 1.2s cubic-bezier(0.25, 0.1, 0.25, 1) forwards`
                }}
              />

              {/* Glow inner */}
              <div
                className="absolute inset-1 rounded-full bg-green-300/30"
                style={{
                  animation: `pulse-${item.id} 1.2s ease-in-out forwards`
                }}
              />

              {/* Tooltip avec nom du produit */}
              <div
                className="absolute -top-10 left-1/2 -translate-x-1/2 transform rounded-full bg-gradient-to-r from-green-600 to-green-700 px-3 py-1 text-xs whitespace-nowrap text-white shadow-lg"
                style={{
                  animation: `fadeOut-${item.id} 1.2s ease-out forwards`
                }}
              >
                <LuSparkles /> {item.productName}
              </div>
            </div>

            <style
              dangerouslySetInnerHTML={{
                __html: `
                @keyframes flyToCart-${item.id} {
                  0% {
                    transform: translate(0, 0) scale(1) rotate(0deg);
                    opacity: 1;
                  }
                  15% {
                    transform: translate(${controlX * 0.2}px, ${controlY * 0.2}px) scale(1.1) rotate(45deg);
                    opacity: 1;
                  }
                  50% {
                    transform: translate(${controlX}px, ${controlY}px) scale(0.9) rotate(180deg);
                    opacity: 0.9;
                  }
                  85% {
                    transform: translate(${deltaX * 0.9}px, ${deltaY * 0.9}px) scale(0.6) rotate(315deg);
                    opacity: 0.7;
                  }
                  100% {
                    transform: translate(${deltaX}px, ${deltaY}px) scale(0.2) rotate(360deg);
                    opacity: 0;
                  }
                }
                
                @keyframes expand-${item.id} {
                  0% {
                    transform: scale(1);
                    opacity: 0.8;
                  }
                  50% {
                    transform: scale(2.5);
                    opacity: 0.4;
                  }
                  100% {
                    transform: scale(5);
                    opacity: 0;
                  }
                }
                
                @keyframes pulse-${item.id} {
                  0%, 100% {
                    opacity: 0.3;
                    transform: scale(1);
                  }
                  50% {
                    opacity: 0.8;
                    transform: scale(1.2);
                  }
                }
                
                @keyframes fadeOut-${item.id} {
                  0% {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0) scale(1);
                  }
                  30% {
                    opacity: 1;
                    transform: translateX(-50%) translateY(-8px) scale(1.05);
                  }
                  100% {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-25px) scale(0.9);
                  }
                }
                
                ${Array.from({ length: 8 })
                  .map(
                    (_, i) => `
                  @keyframes trail-${item.id}-${i} {
                    0% {
                      transform: translate(0, 0) scale(1);
                      opacity: ${0.6 - i * 0.07};
                    }
                    15% {
                      transform: translate(${controlX * 0.2 * (1 - i * 0.1)}px, ${controlY * 0.2 * (1 - i * 0.1)}px) scale(${1 - i * 0.1});
                      opacity: ${0.5 - i * 0.06};
                    }
                    50% {
                      transform: translate(${controlX * (1 - i * 0.1)}px, ${controlY * (1 - i * 0.1)}px) scale(${0.9 - i * 0.08});
                      opacity: ${0.4 - i * 0.05};
                    }
                    85% {
                      transform: translate(${deltaX * 0.9 * (1 - i * 0.1)}px, ${deltaY * 0.9 * (1 - i * 0.1)}px) scale(${0.6 - i * 0.06});
                      opacity: ${0.2 - i * 0.025};
                    }
                    100% {
                      transform: translate(${deltaX * (1 - i * 0.1)}px, ${deltaY * (1 - i * 0.1)}px) scale(0);
                      opacity: 0;
                    }
                  }
                `
                  )
                  .join('')}
              `
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

const CartIndicator = ({ blockId }: { blockId: string }) => {
  const cart = useAtomValue(getCartAtom(blockId));
  const cartAnimation = useAtomValue(getCartAnimationAtom(blockId));
  const cartBurst = useAtomValue($cartBurst);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [prevCount, setPrevCount] = useState(0);

  const modal = useModal();

  useEffect(() => {
    if (itemCount > prevCount) {
      // Animation de croissance du nombre
      setPrevCount(itemCount);
    } else {
      setPrevCount(itemCount);
    }
  }, [itemCount, prevCount]);

  if (itemCount === 0) return null;

  return (
    <div className="fixed right-6 bottom-6 z-40">
      {/* Burst effect background */}
      {cartBurst && (
        <div className="absolute inset-0 -m-8">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-2 w-2 rounded-full bg-green-300"
              style={{
                left: '50%',
                top: '50%',
                animation: `burst-${i} 0.5s ease-out forwards`,
                animationDelay: `${i * 0.02}s`
              }}
            />
          ))}
          <style
            dangerouslySetInnerHTML={{
              __html: Array.from({ length: 12 })
                .map((_, i) => {
                  const angle = i * 30 * (Math.PI / 180);
                  const distance = 60 + Math.random() * 40;
                  const endX = Math.cos(angle) * distance;
                  const endY = Math.sin(angle) * distance;

                  return `
                @keyframes burst-${i} {
                  0% {
                    transform: translate(-50%, -50%) translate(0, 0) scale(1);
                    opacity: 1;
                  }
                  100% {
                    transform: translate(-50%, -50%) translate(${endX}px, ${endY}px) scale(0);
                    opacity: 0;
                  }
                }
              `;
                })
                .join('')
            }}
          />
        </div>
      )}

      <button
        data-cart-indicator
        onClick={() => modal?.show(<Cart blockId={blockId} />)}
        className={`relative flex transform items-center gap-3 rounded-full bg-gradient-to-br from-green-500 to-green-700 px-6 py-3 text-white shadow-2xl transition-all duration-500 hover:scale-105 hover:from-green-600 hover:to-green-800 ${
          cartAnimation
            ? 'scale-125 animate-pulse shadow-green-500/50'
            : 'scale-100'
        } ${
          cartBurst
            ? 'ring-8 ring-green-300/50 ring-offset-2 ring-offset-transparent'
            : ''
        }`}
        style={{
          filter: cartAnimation
            ? 'drop-shadow(0 0 30px rgba(34, 197, 94, 0.8))'
            : 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.2))'
        }}
      >
        {/* Glow effect */}
        <div
          className={`absolute inset-0 rounded-full bg-green-400/30 ${cartAnimation ? 'animate-ping' : ''}`}
        />

        {/* Icon avec micro-rotation */}
        <LuShoppingCart
          className={`relative z-10 h-6 w-6 transition-transform duration-300 ${
            cartAnimation ? 'rotate-12 animate-bounce' : 'rotate-0'
          }`}
        />

        {/* Counter avec effet de pop */}
        <div className="relative z-10">
          <span
            className={`text-lg font-bold transition-all duration-300 ${
              itemCount > prevCount ? 'scale-110 animate-pulse' : 'scale-100'
            }`}
          >
            {itemCount}
          </span>

          {/* Badge notification si nouveau */}
          {itemCount > prevCount && (
            <div className="absolute -top-2 -right-2 h-3 w-3 animate-ping rounded-full bg-yellow-400" />
          )}
        </div>

        {/* Ripple effect on hover */}
        <div className="absolute inset-0 scale-0 rounded-full bg-white/20 opacity-0 transition-transform duration-300 hover:scale-100 hover:opacity-100" />
      </button>

      {/* Floating labels */}
      {cartAnimation && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 transform" />
      )}
    </div>
  );
};

export default function Store({
  block
}: Partial<z.infer<typeof input>> & {
  block?: Prisma.BlockGetPayload<{ select: { id: true } }>;
}) {
  return (
    <div className="relative">
      <Suspense fallback={null}>
        <Inventories blockId={block?.id ?? ''} />
      </Suspense>

      <ParticleSystem />
      <FlyingItems />
      <CartIndicator blockId={block?.id ?? ''} />
    </div>
  );
}
