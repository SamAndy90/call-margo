import { Database } from '@/types/supabase';
import { CalendarIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import GrowthPlanActions from './GrowthPlanActions';

type GrowthPlan = Database['public']['Tables']['growth_plans']['Row'];

interface GrowthPlanCardProps {
  plan: GrowthPlan;
  onUpdate: () => void;
}

export default function GrowthPlanCard({ plan, onUpdate }: GrowthPlanCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-teal-50 text-teal-700';
      case 'archived':
        return 'bg-gray-100 text-gray-700';
      case 'draft':
        return 'bg-coral/10 text-coral';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition duration-200 ease-in-out hover:shadow-md hover:border-coral">
      <div className="flex items-center justify-between">
        <Link href={`/growth-plan/${plan.id}`} className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 hover:text-coral">{plan.name}</h3>
        </Link>
        <div className="flex items-center space-x-2">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
              plan.status
            )}`}
          >
            {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
          </span>
          <GrowthPlanActions growthPlan={plan} onUpdate={onUpdate} />
        </div>
      </div>
      
      <Link href={`/growth-plan/${plan.id}`} className="block">
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

        <div className="mt-4 flex flex-wrap gap-2">
          {(plan.goals as any[]).slice(0, 2).map((goal, index) => (
            <span
              key={index}
              className="inline-flex items-center rounded-full bg-coral/10 px-2.5 py-1 text-xs font-medium text-coral"
            >
              {goal.name}
            </span>
          ))}
          {(plan.goals as any[]).length > 2 && (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
              +{(plan.goals as any[]).length - 2} more
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}
