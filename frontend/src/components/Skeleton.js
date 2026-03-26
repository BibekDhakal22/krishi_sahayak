import './Skeleton.css';

export function CardSkeleton() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-line w60"></div>
      <div className="skeleton-line w30"></div>
      <div className="skeleton-line w100"></div>
      <div className="skeleton-line w100"></div>
      <div className="skeleton-line w40"></div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="skeleton-grid">
      {Array(count).fill(0).map((_, i) => <CardSkeleton key={i} />)}
    </div>
  );
}