export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
      <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
} 