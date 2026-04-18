import { RefreshCcw } from 'lucide-react';
import AdminPanel from './AdminPanel';

export default function AdminErrorState({ message, onRetry }) {
  return (
    <AdminPanel className="p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-accent text-xs uppercase tracking-[0.2em]">
            Admin Dashboard
          </p>
          <h1 className="text-primary mt-2 text-2xl font-bold">
            Unable to load stats
          </h1>
          <p className="text-secondary mt-3 max-w-2xl text-sm">
            {message || 'Something went wrong while loading admin data.'}
          </p>
        </div>

        <button
          type="button"
          onClick={onRetry}
          className="bg-accent-secondary hover:bg-accent-hover border border-accent-secondary text-accent inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition"
        >
          <RefreshCcw size={16} />
          Try again
        </button>
      </div>
    </AdminPanel>
  );
}
