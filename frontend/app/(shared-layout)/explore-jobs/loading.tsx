export default function Loading() {
  return (
    <div className="container mx-auto px-4 mb-5">
      <div className="mt-10">
        {/* Search Bar Skeleton */}
        <div className="mb-5">
          <div className="lg:w-1/2 flex gap-2 border-2 p-3 rounded-md">
            <div className="h-10 bg-gray-200 animate-pulse rounded flex-1" />
            <div className="h-10 w-20 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>

        <div className="flex gap-0 md:gap-5">
          {/* Desktop Filters Skeleton */}
          <div className="w-0 md:w-2/4">
            <div className="hidden md:block border rounded-lg p-6">
              <div className="h-6 bg-gray-200 animate-pulse rounded w-1/3 mb-4" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <div className="h-5 bg-gray-200 animate-pulse rounded w-1/4 mb-2" />
                    <div className="flex gap-2">
                      <div className="h-8 bg-gray-200 animate-pulse rounded w-20" />
                      <div className="h-8 bg-gray-200 animate-pulse rounded w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Jobs Cards Skeleton */}
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="border rounded-lg p-6 space-y-3 animate-pulse"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
