import { Prisma } from '@prisma/client';
import * as runtime from '@prisma/client/runtime/library';
import { atom, type Atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { isEqual } from 'lodash-es';

// Use Prisma's generated types directly - fully dynamic
type PrismaModelName = Prisma.ModelName;
type PrismaModelNameLower = Uncapitalize<PrismaModelName>;

// Extract available operations dynamically from Prisma's TypeMap
type ExtractOperations<T> = T extends { operations: infer Ops }
  ? keyof Ops
  : never;
type ModelOperations = ExtractOperations<
  Prisma.TypeMap['model'][keyof Prisma.TypeMap['model']]
>;

// Get the payload type for each model dynamically
type GetModelPayload<TModel extends PrismaModelName> =
  TModel extends keyof Prisma.TypeMap['model']
    ? Prisma.TypeMap['model'][TModel]['payload']
    : never;

// Generic type to get the correct args type for any model and operation
type GetArgsType<
  TModel extends PrismaModelName,
  TOperation extends ModelOperations
> = TModel extends keyof Prisma.TypeMap['model']
  ? TOperation extends keyof Prisma.TypeMap['model'][TModel]['operations']
    ? Prisma.TypeMap['model'][TModel]['operations'][TOperation] extends {
        args: infer Args;
      }
      ? Args
      : never
    : never
  : never;

// Generic type to get the correct result type based on specific args
type GetResultType<
  TModel extends PrismaModelName,
  TOperation extends ModelOperations,
  TArgs
> = TModel extends keyof Prisma.TypeMap['model']
  ? TOperation extends keyof Prisma.TypeMap['model'][TModel]['operations']
    ? runtime.Types.Result.GetResult<
        GetModelPayload<TModel>,
        TArgs,
        TOperation & string
      >
    : never
  : never;

type Paginated<T> = {
  data: T;
  total: number;
  take: number;
  skip: number;
};

// Conditional return type based on paginated parameter
type ConditionalResult<
  TResult,
  TPaginated extends boolean | undefined
> = TPaginated extends true ? Paginated<TResult> : TResult;

// Updated atomCreator to preserve argument types for result inference
const atomCreator = <
  TModel extends PrismaModelName,
  TOperation extends ModelOperations
>(
  model: Uncapitalize<TModel>,
  method: TOperation
) =>
  atomFamily(
    <TArgs extends GetArgsType<TModel, TOperation> & { paginated?: boolean }>(
      params: TArgs
    ) => {
      const baseResult = {} as GetResultType<
        TModel,
        TOperation,
        Omit<TArgs, 'paginated'>
      >;

      return atom<
        Promise<ConditionalResult<typeof baseResult, TArgs['paginated']>>
      >(async () => {
        const { paginated, ...queryParams } = params;
        const isPaginated = paginated ?? false;

        const response = await fetch(
          `/api/lake/${model}/${method}${isPaginated ? '?paginated' : ''}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(queryParams)
          }
        );

        if (!response.ok) {
          throw new Error(`API call failed: ${response.statusText}`);
        }

        const data = await response.json();

        return data as ConditionalResult<typeof baseResult, TArgs['paginated']>;
      });
    },
    isEqual
  );

const mapper = new Map<string, any>();

// Type for a single model's operations - with conditional return types based on arguments
type DynamicModelOperations<TModel extends PrismaModelName> = {
  [K in keyof Prisma.TypeMap['model'][TModel]['operations']]: <
    TArgs extends GetArgsType<TModel, K & ModelOperations> & {
      paginated?: boolean;
    }
  >(
    params?: TArgs
  ) => Atom<
    Promise<
      ConditionalResult<
        GetResultType<TModel, K & ModelOperations, Omit<TArgs, 'paginated'>>,
        TArgs['paginated']
      >
    >
  >;
};

// Main type for the $ object - uses lowercase model names but maps to PascalCase internally
type PrismaProxy = {
  [K in PrismaModelName as Uncapitalize<K>]: DynamicModelOperations<K>;
};

/*
Example usage with conditional return typing:

// Returns: Atom<Promise<{ id: string; email: string } | null>>
const userWithSelect = $.user.findUnique({
  where: { id: '123' },
  select: { id: true, email: true }
});

// Returns: Atom<Promise<User & { posts: Post[] } | null>>
const userWithInclude = $.user.findUnique({
  where: { id: '123' },
  include: { posts: true }
});

// Returns: Atom<Promise<User | null>>
const userBasic = $.user.findUnique({
  where: { id: '123' }
});

// Returns: Atom<Promise<{ id: string; content: string; author: { name: string } }[]>>
const commentsWithSelect = $.comment.findMany({
  where: { postId: '123' },
  select: {
    id: true,
    content: true,
    author: { select: { email: true } }
  }
});
*/

export const $ = new Proxy({} as PrismaProxy, {
  get: (target: PrismaProxy, prop: PrismaModelNameLower, receiver: any) => {
    const modelNameLower = prop as string;
    // Convert to PascalCase for internal Prisma type lookup
    const modelNamePascal = (modelNameLower.charAt(0).toUpperCase() +
      modelNameLower.slice(1)) as PrismaModelName;

    // Validate that the model exists in Prisma's ModelName enum
    if (!(modelNamePascal in Prisma.ModelName)) {
      throw new Error(
        `Model '${modelNamePascal}' does not exist in your Prisma schema`
      );
    }

    // Return a proxy that will handle the Prisma methods dynamically
    return new Proxy({} as DynamicModelOperations<typeof modelNamePascal>, {
      get: (
        methodTarget: any,
        methodProp: ModelOperations,
        methodReceiver: any
      ) => {
        const method = methodProp as string;

        // Create a unique key for this model + method combination
        const cacheKey = `${modelNameLower}.${method}`;

        // Get or create the atom family for this combination
        if (!mapper.has(cacheKey)) {
          mapper.set(cacheKey, atomCreator(modelNameLower as any, methodProp));
        }

        const atomFamilyInstance = mapper.get(cacheKey)!;

        // Return a function that creates the atom with the given parameters
        // The return type will be inferred based on the specific arguments passed
        return (params: any = {}) => atomFamilyInstance(params);
      }
    });
  }
});
