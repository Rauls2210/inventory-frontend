import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/format';
import Spinner from '../components/Spinner';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: 'admin@example.com', password: 'password123' } });

  if (isAuthenticated) {
    return <Navigate to={location.state?.from || '/'} replace />;
  }

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      await login(values);
      toast.success('Welcome back!');
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err, 'Login failed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-brand-700 p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center text-white">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-xl font-bold">
            I
          </div>
          <h1 className="text-2xl font-bold">Inventory Management</h1>
          <p className="text-sm text-gray-300">Sign in to your account</p>
        </div>

        <div className="card p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="input"
                placeholder="you@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/, message: 'Enter a valid email' },
                })}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="input"
                placeholder="••••••••"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Minimum 6 characters' },
                })}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <button type="submit" className="btn-primary w-full" disabled={submitting}>
              {submitting ? <Spinner className="h-4 w-4" /> : 'Sign in'}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-gray-500">
            Demo credentials are pre-filled — just click Sign in.
          </p>
        </div>
      </div>
    </div>
  );
}
