// loading.tsx
export default function Loading() {
  return (
    <div>
      <div className="grid grid-cols-3 gap-4 h-40 md:h-50">
        {/* Applied Jobs Skeleton */}
        <div className="h-20 md:h-40 border rounded-md flex items-center justify-center animate-pulse bg-gray-100">
          <div className="text-center space-y-2">
            <div className="h-8 md:h-10 w-12 md:w-16 bg-gray-200 rounded mx-auto" />
            <div className="h-3 md:h-4 w-20 md:w-28 bg-gray-200 rounded mx-auto" />
          </div>
        </div>

        {/* Accepted Jobs Skeleton */}
        <div className="h-20 md:h-40 border rounded-md flex items-center justify-center animate-pulse bg-gray-100">
          <div className="text-center space-y-2">
            <div className="h-8 md:h-10 w-12 md:w-16 bg-gray-200 rounded mx-auto" />
            <div className="h-3 md:h-4 w-24 md:w-32 bg-gray-200 rounded mx-auto" />
          </div>
        </div>

        {/* Rejected Jobs Skeleton */}
        <div className="h-20 md:h-40 border rounded-md flex items-center justify-center animate-pulse bg-gray-100">
          <div className="text-center space-y-2">
            <div className="h-8 md:h-10 w-12 md:w-16 bg-gray-200 rounded mx-auto" />
            <div className="h-3 md:h-4 w-24 md:w-32 bg-gray-200 rounded mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
