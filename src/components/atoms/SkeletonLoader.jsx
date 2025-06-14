const SkeletonLoader = ({ count = 1, className = '', height = 'h-4' }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className={`bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded ${height}`}></div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;