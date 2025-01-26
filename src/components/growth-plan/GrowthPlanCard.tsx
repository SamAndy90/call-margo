import { Database } from '@/types/supabase';
import { CalendarIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

type GrowthPlan = Database['public']['Tables']['growth_plans']['Row'];

interface GrowthPlanCardProps {
  plan: GrowthPlan;
}

export default function GrowthPlanCard({ plan }: GrowthPlanCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Link href={`/growth-plan/${plan.id}`}>
      <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition duration-200 ease-in-out hover:shadow-md">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
              plan.status
            )}`}
          >
            {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
          </span>
        </div>
        
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {plan.description || 'No description provided'}
        </p>

        <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
          {plan.start_date && (
            <div className="flex items-center">
              <CalendarIcon className="mr-1 h-4 w-4" />
              <span>
                {new Date(plan.start_date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          )}
          {plan.metrics && (
            <div className="flex items-center">
              <ChartBarIcon className="mr-1 h-4 w-4" />
              <span>{(plan.metrics as any[]).length} metrics</span>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center space-x-2">
          {(plan.goals as any[]).slice(0, 2).map((goal, index) => (
            <span
              key={index}
              className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
            >
              {goal.name}
            </span>
          ))}
          {(plan.goals as any[]).length > 2 && (
            <span className="text-xs text-gray-500">
              +{(plan.goals as any[]).length - 2} more
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
