import { Card, CardContent, CardHeader } from 'components/ui/card';

export default function OrderDetailsLoading() {
  return (
    <div className="flex min-h-screen flex-1 flex-col gap-6 bg-gray-50 p-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-10 w-32 animate-pulse rounded bg-gray-200"></div>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 animate-pulse rounded-full bg-gray-200"></div>
            <div>
              <div className="mb-2 h-8 w-48 animate-pulse rounded bg-gray-200"></div>
              <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
            </div>
          </div>
        </div>
        <div className="h-8 w-24 animate-pulse rounded bg-gray-200"></div>
      </div>

      {/* Status card skeleton */}
      <Card>
        <CardHeader>
          <div className="h-6 w-48 animate-pulse rounded bg-gray-200"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-16 animate-pulse rounded-lg bg-gray-100"></div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse rounded-lg bg-gray-100"
                ></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Customer info skeleton */}
        <Card>
          <CardHeader>
            <div className="h-6 w-40 animate-pulse rounded bg-gray-200"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="mb-2 h-4 w-20 animate-pulse rounded bg-gray-200"></div>
                <div className="h-5 w-full animate-pulse rounded bg-gray-200"></div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Financial summary skeleton */}
        <Card>
          <CardHeader>
            <div className="h-6 w-36 animate-pulse rounded bg-gray-200"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
                <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Items skeleton */}
      <Card>
        <CardHeader>
          <div className="h-6 w-40 animate-pulse rounded bg-gray-200"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-lg bg-gray-100"
              ></div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
