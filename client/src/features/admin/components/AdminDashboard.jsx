import {
  Bookmark,
  Clock3,
  History,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  UserCheck,
  UserPlus,
  Users,
} from 'lucide-react';
import AdminPanel from './AdminPanel';
import AdminStatCard from './AdminStatCard';
import { getAdminDashboardData } from '../utils/adminDashboard';

const statCardConfigs = [
  {
    key: 'totalUsers',
    label: 'Total Users',
    helper: 'Registered accounts in the platform.',
    icon: Users,
  },
  {
    key: 'verifiedUsers',
    label: 'Verified Users',
    helper: 'Accounts that completed email verification.',
    icon: UserCheck,
  },
  {
    key: 'adminUsers',
    label: 'Admin Users',
    helper: 'Users with elevated dashboard access.',
    icon: ShieldCheck,
  },
  {
    key: 'newUsersLast7Days',
    label: 'New In 7 Days',
    helper: 'Fresh signups from the last week.',
    icon: UserPlus,
  },
  {
    key: 'savedTotal',
    label: 'Saved Entries',
    helper: 'Items users chose to save.',
    icon: Bookmark,
  },
  {
    key: 'watchLaterTotal',
    label: 'Watch Later',
    helper: 'Titles queued for later viewing.',
    icon: Clock3,
  },
  {
    key: 'watchHistoryTotal',
    label: 'Watch History',
    helper: 'Tracked playback history entries.',
    icon: History,
  },
];

function InsightItem({ label, value, helper }) {
  return (
    <div className="bg-secondary border border-accent-secondary rounded-xl p-4">
      <p className="text-secondary text-xs uppercase tracking-[0.2em]">
        {label}
      </p>
      <p className="text-primary mt-2 text-2xl font-bold">{value}</p>
      <p className="text-secondary mt-1 text-sm">{helper}</p>
    </div>
  );
}

export default function AdminDashboard({
  stats,
  userName,
  isRefreshing,
  onRefresh,
}) {
  const dashboard = getAdminDashboardData(stats);

  return (
    <>
      <AdminPanel className="p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <div className="bg-accent-secondary border border-accent-secondary text-accent inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
              <ShieldCheck size={14} />
              Admin Dashboard
            </div>
            <h1 className="heading text-accent mt-4 text-2xl md:text-3xl font-bold">
              Platform overview
            </h1>
            <p className="text-secondary mt-3 text-sm md:text-base">
              Signed in as {userName || 'Admin'}. This dashboard keeps the
              current admin snapshot aligned with the same light and dark theme
              system used across the rest of MovieMon.
            </p>
          </div>

          <button
            type="button"
            onClick={onRefresh}
            className="bg-accent-secondary hover:bg-accent-hover border border-accent-secondary text-accent inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition"
          >
            <RefreshCcw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            {isRefreshing ? 'Refreshing...' : 'Refresh stats'}
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {dashboard.summaryItems.map((item) => (
            <div
              key={item}
              className="bg-secondary border border-accent-secondary text-primary rounded-full px-4 py-2 text-sm"
            >
              {item}
            </div>
          ))}
        </div>
      </AdminPanel>

      <section className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCardConfigs.map((config) => (
          <AdminStatCard
            key={config.key}
            icon={config.icon}
            label={config.label}
            value={dashboard[config.key]}
            helper={config.helper}
          />
        ))}
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <AdminPanel className="p-5 md:p-6">
          <div className="text-secondary flex items-center gap-2 text-sm uppercase tracking-[0.2em]">
            <Sparkles size={16} />
            Quick Read
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {dashboard.insights.map((insight) => (
              <InsightItem
                key={insight.label}
                label={insight.label}
                value={insight.value}
                helper={insight.helper}
              />
            ))}
          </div>
        </AdminPanel>

        <AdminPanel className="p-5 md:p-6">
          <p className="text-secondary text-sm uppercase tracking-[0.2em]">
            Current Scope
          </p>

          <ul className="text-secondary mt-4 space-y-3 text-sm">
            {dashboard.scopeItems.map((item) => (
              <li
                key={item}
                className="bg-secondary border border-accent-secondary rounded-xl p-3"
              >
                {item}
              </li>
            ))}
          </ul>
        </AdminPanel>
      </section>
    </>
  );
}
