export default function ChatLoading() {
  return (
    <div className="flex h-full overflow-hidden -mx-4 md:-mx-6 lg:-mx-8">
      {/* Left Sidebar Skeleton */}
      <div className="w-full md:w-96 border-r border-gray-200 bg-white h-full flex flex-col">
        {/* Header Skeleton */}
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="mb-3 md:mb-4">
            {/* Back button skeleton */}
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Search Skeleton */}
        <div className="p-3 md:p-4">
          <div className="h-10 bg-gray-200 rounded-md animate-pulse" />
        </div>

        {/* Chat List Skeleton */}
        <div className="flex-1 overflow-y-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 border-b border-gray-100 animate-pulse">
              <div className="flex gap-3">
                {/* Avatar skeleton */}
                <div className="h-12 w-12 bg-gray-200 rounded-full flex-shrink-0" />

                <div className="flex-1 min-w-0">
                  {/* Name skeleton */}
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                  {/* Job title skeleton */}
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Chat Window Skeleton */}
      <div className="flex-1 w-full md:w-auto h-full overflow-hidden flex flex-col bg-gray-50">
        {/* Header Skeleton */}
        <div className="border-b border-gray-200 bg-white p-4 flex items-center gap-3 flex-shrink-0 animate-pulse">
          <div className="h-10 w-10 bg-gray-200 rounded-full flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="h-5 bg-gray-200 rounded w-32 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-20" />
          </div>
        </div>

        {/* Messages Area Skeleton */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="space-y-4">
            {/* Received message skeleton */}
            <div className="flex justify-start animate-pulse">
              <div className="h-8 w-8 bg-gray-200 rounded-full mr-2 flex-shrink-0" />
              <div className="max-w-md">
                <div className="h-16 w-64 bg-gray-200 rounded-lg rounded-bl-none" />
              </div>
            </div>

            {/* Sent message skeleton */}
            <div className="flex justify-end animate-pulse">
              <div className="max-w-md">
                <div className="h-12 w-48 bg-blue-200 rounded-lg rounded-br-none" />
              </div>
            </div>

            {/* Received message skeleton */}
            <div className="flex justify-start animate-pulse">
              <div className="h-8 w-8 bg-gray-200 rounded-full mr-2 flex-shrink-0" />
              <div className="max-w-md">
                <div className="h-20 w-72 bg-gray-200 rounded-lg rounded-bl-none" />
              </div>
            </div>

            {/* Sent message skeleton */}
            <div className="flex justify-end animate-pulse">
              <div className="max-w-md">
                <div className="h-16 w-56 bg-blue-200 rounded-lg rounded-br-none" />
              </div>
            </div>

            {/* Received message skeleton */}
            <div className="flex justify-start animate-pulse">
              <div className="h-8 w-8 bg-gray-200 rounded-full mr-2 flex-shrink-0" />
              <div className="max-w-md">
                <div className="h-14 w-60 bg-gray-200 rounded-lg rounded-bl-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Input Area Skeleton */}
        <div className="border-t border-gray-200 bg-white p-3 md:p-4 flex-shrink-0 animate-pulse">
          <div className="flex gap-2">
            <div className="flex-1 h-10 bg-gray-200 rounded" />
            <div className="h-10 w-20 bg-blue-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
