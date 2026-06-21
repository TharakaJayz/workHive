export default function FullScreenLoader() {
    return (
      <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          {/* Loading Spinner Wheel */}
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-primary" />
          
          {/* Optional subtle text */}
          <p className="text-sm font-medium text-gray-500 animate-pulse tracking-wide">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }