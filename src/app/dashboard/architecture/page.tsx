"use client";

import { useCallback, useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { useRouter } from "next/navigation";
import AudienceProfileDetails from "@/components/marketing-architecture/AudienceProfileDetails";
import { ErrorMessage } from "@/common";
import { ArchitectureSkeleton } from "@/components/Dashboard/Architecture/ArchitectureSkeleton";

type AudienceProfile = Database["public"]["Tables"]["audience_profiles"]["Row"];

export default function ArchitecturePage() {
  const router = useRouter();
  const [audienceProfiles, setAudienceProfiles] = useState<AudienceProfile[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient<Database>();

  const fetchData = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/signin");
        return;
      }

      // Fetch audience profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("audience_profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;
      setAudienceProfiles(profiles || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching data"
      );
    } finally {
      setIsLoading(false);
    }
  }, [supabase, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) return <ArchitectureSkeleton />;

  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">
          Marketing Architecture
        </h1>

        <div className="space-y-8">
          {/* Audience Profiles Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Audience Profiles
              </h2>
              <button
                type="button"
                onClick={() => {
                  // Handle create audience profile
                }}
                className="inline-flex items-center rounded-md bg-coral-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-coral-400/90"
              >
                Add Profile
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {audienceProfiles.map((profile) => (
                <AudienceProfileDetails key={profile.id} profile={profile} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
