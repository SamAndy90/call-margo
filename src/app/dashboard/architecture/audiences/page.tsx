import { Title } from "@/common";
import { Button } from "@/common/UI/Buttons";
import { AudienceForm } from "@/components/Forms/AudienceForm";

// type AudienceProfile = Database["public"]["Tables"]["audience_profiles"]["Row"];

export default function AudiencePage() {
  // const router = useRouter();
  // const [audienceProfiles, setAudienceProfiles] = useState<AudienceProfile[]>(
  //   []
  // );
  // const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  // const supabase = createClientComponentClient<Database>();

  // const fetchData = useCallback(async () => {
  //   try {
  //     const {
  //       data: { user },
  //     } = await supabase.auth.getUser();
  //     if (!user) {
  //       router.push("/signin");
  //       return;
  //     }

  //     // Fetch audience profiles
  //     const { data: profiles, error: profilesError } = await supabase
  //       .from("audience_profiles")
  //       .select("*")
  //       .order("created_at", { ascending: false });

  //     if (profilesError) throw profilesError;
  //     setAudienceProfiles(profiles || []);
  //   } catch (err) {
  //     console.error("Error fetching data:", err);
  //     setError(
  //       err instanceof Error
  //         ? err.message
  //         : "An error occurred while fetching data"
  //     );
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, [supabase, router]);

  // useEffect(() => {
  //   fetchData();
  // }, [fetchData]);

  // if (isLoading) return <Skeleton />;

  // if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Title className={"mb-8"}>Audiences</Title>

        <div className="space-y-8">
          <div>
            <div className="flex justify-between items-center mb-4">
              <Title component={"h3"} size={"lg"}>
                Your audiences
              </Title>
              <Button>Add Audience</Button>
            </div>

            <div className="bg-white rounded-md px-3 py-2">
              Your audiences list...
            </div>
          </div>

          <AudienceForm />
        </div>
      </div>
    </div>
  );
}
