export default function SkeletonPost() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="bg-gray-300 h-64 w-full rounded-lg" />
      <div className="h-6 bg-gray-300 rounded w-3/4" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 rounded w-full" />
        <div className="h-4 bg-gray-300 rounded w-5/6" />
        <div className="h-4 bg-gray-300 rounded w-4/6" />
      </div>
    </div>
  );
}
