export default function Pagination({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null;

  const prev = () => onChange(Math.max(1, page - 1));
  const next = () => onChange(Math.min(totalPages, page + 1));

  return (
    <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
      <p className="text-sm text-gray-600">
        Page <span className="font-medium">{page}</span> of{' '}
        <span className="font-medium">{totalPages}</span>
      </p>
      <div className="flex gap-2">
        <button className="btn-secondary" onClick={prev} disabled={page <= 1}>
          Previous
        </button>
        <button className="btn-secondary" onClick={next} disabled={page >= totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}
