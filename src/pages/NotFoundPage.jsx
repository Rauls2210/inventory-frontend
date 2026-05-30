import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 text-center">
      <p className="text-6xl font-bold text-brand-600">404</p>
      <h1 className="mt-2 text-xl font-semibold text-gray-900">Page not found</h1>
      <p className="mt-1 text-sm text-gray-500">The page you are looking for does not exist.</p>
      <Link to="/" className="btn-primary mt-6">
        Go to Dashboard
      </Link>
    </div>
  );
}
