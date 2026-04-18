import AdminPanel from './AdminPanel';
import { formatAdminNumber } from '../utils/adminDashboard';

export default function AdminStatCard({ icon: Icon, label, value, helper }) {
  return (
    <AdminPanel as="article" className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-secondary text-xs uppercase tracking-[0.2em]">
            {label}
          </p>
          <h2 className="text-primary mt-2 text-2xl font-bold">
            {formatAdminNumber(value)}
          </h2>
          <p className="text-secondary mt-1 text-sm">{helper}</p>
        </div>

        <div className="bg-accent-secondary border border-accent-secondary text-accent rounded-xl p-3">
          <Icon size={20} />
        </div>
      </div>
    </AdminPanel>
  );
}
