// import { useEffect } from "react";
// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
// import { useRouter } from "next/navigation";

import { TabsNavigation } from "@/components/Dashboard/Architecture/TabsNavigation";

export default async function ArchitectureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <TabsNavigation />
      {children}
    </div>
  );
}

// const supabase = createClientComponentClient();
// const router = useRouter();

// useEffect(() => {
//   const checkUser = async () => {
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();
//     if (!user) {
//       router.push("/signin");
//     }
//   };

//   checkUser();
// }, [router, supabase.auth]);
