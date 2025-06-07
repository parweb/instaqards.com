import { EntityType, PrismaClient } from '@prisma/client';
import { readdir, readFile } from 'fs/promises';
import { put } from 'helpers/storage';
import { trySafe } from 'helpers/trySafe';
import { join } from 'path';
import slugify from 'slugify';

const eurobisProductsPath = join(process.cwd(), '..', 'eurobis.be', 'products');

// const blockIds = 'cmbgf6n060015v6xig6paqif7'; // local
const blockIds = 'cmbij7wrn0000l404b1yqhrk1'; // prod

const getProducts = async () =>
  Promise.all(
    (await readdir(eurobisProductsPath))
      .filter(product => product.endsWith('.json'))
      .map(async product => {
        const [, productJson] = trySafe(
          () => require(join(eurobisProductsPath, product)),
          {}
        );
        return productJson;
      })
  );

export const importAllEurobisProducts__For__Kartons_fr = async (
  prisma: PrismaClient
) => {
  const products = await getProducts();

  for (const [index, product] of products.entries()) {
    console.log(`importing ${index} of ${products.length}`);

    const [, slug] = trySafe(
      () => slugify(product.name + ' ' + index, { lower: true }),
      product?.id ?? crypto.randomUUID()
    );

    const [, basePrice] = trySafe(() => {
      const pricePerUnit = Number(
        Object.values(product.price).reduce(
          (carry, price) =>
            // @ts-ignore
            Math.max(carry, Number(price.value) * Number(price.min)),
          0
        )
      );

      const minUnit = Number(product?.quantity?.carton?.value) ?? 1;

      return pricePerUnit * minUnit * 1.2 * 1.2;
    }, 0);

    const [, image] = await trySafe(async () => {
      const response = await readFile(
        join(eurobisProductsPath, `${product.id}.77.trimed.png`)
      ).catch(
        async () =>
          await readFile(join(eurobisProductsPath, `${product.id}.png`)).catch(
            () => null
          )
      );

      if (!response) return null;

      const file = new File([response], `${product.id}.png`, {
        type: 'image/png'
      });

      const { url } = await put(`${product.id}.png`, file);

      return url;
    }, null);

    await prisma.$transaction(async tx => {
      const exist = await tx.inventory.count({
        where: {
          sku: product.id
        }
      });

      if (exist > 0) return;
      const inventory = await tx.inventory.create({
        data: {
          blockId: blockIds,

          name: product.name,
          description: product?.description ?? '',
          slug,
          sku: product.id,
          active: true,
          isFeatured: false,

          basePrice
        }
      });

      if (image) {
        await tx.media.create({
          data: {
            entityId: inventory.id,
            entityType: EntityType.INVENTORY,
            type: 'IMAGE',
            url: image,
            alt: inventory.name
          }
        });
      }
    });
  }
};
