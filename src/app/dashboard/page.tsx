"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Skeleton } from "@/common";

type GrowthPlan = Database["public"]["Tables"]["growth_plans"]["Row"];

interface Stats {
  totalGrowthPlans: number;
  activeGrowthPlans: number;
}

export default function DashboardPage() {
  const [growthPlans, setGrowthPlans] = useState<GrowthPlan[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalGrowthPlans: 0,
    activeGrowthPlans: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: plans } = await supabase
          .from("growth_plans")
          .select("*")
          .order("created_at", { ascending: false });

        if (!plans) {
          return;
        }

        setGrowthPlans(plans);

        setStats({
          totalGrowthPlans: plans.length,
          activeGrowthPlans: plans.filter((p) => p.status === "active").length,
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(
          err instanceof Error ? err.message : "Error fetching dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase]);

  if (loading) return <Skeleton />;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error: {error}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-sm text-gray-700">
              Welcome to your marketing dashboard. Let&apos;s grow your business
              together.
            </p>
          </div>
        </div>

        <dl className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">
              Growth Plans
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {stats.totalGrowthPlans}
            </dd>
            <dd className="mt-1 text-sm text-gray-500">
              {stats.activeGrowthPlans} active plans
            </dd>
          </div>
        </dl>

        <div className="mt-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Growth Plans
              </h2>
              <p className="mt-2 text-sm text-gray-700">
                View and manage your growth plans
              </p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <Link
                className="inline-flex items-center rounded-md bg-coral-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-coral-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-600"
                href="/dashboard/growth-plan"
              >
                View all
                <ArrowRightIcon className="ml-1 h-5 w-5" aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                      >
                        <span className="sr-only">View</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {growthPlans.slice(0, 5).map((plan) => (
                      <tr key={plan.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                          {plan.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              plan.status === "active"
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-50 text-gray-700"
                            }`}
                          >
                            {plan.status.charAt(0).toUpperCase() +
                              plan.status.slice(1)}
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                          <Link
                            href={`/dashboard/growth-plan/${plan.id}`}
                            className="hover:text-coral-400"
                          >
                            View<span className="sr-only">, {plan.name}</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
