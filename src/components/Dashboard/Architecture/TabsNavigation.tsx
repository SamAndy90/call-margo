"use client";

import { cn } from "@/lib/utils";
import { ArchitectureUrls } from "@/route-urls";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    label: "Brand Guide",
    href: ArchitectureUrls.getBrandGuide(),
  },
  {
    label: "Channels",
    href: ArchitectureUrls.getChannels(),
  },
  {
    label: "Audiences",
    href: ArchitectureUrls.getAudiences(),
  },
  {
    label: "Product",
    href: ArchitectureUrls.getProduct(),
  },
  {
    label: "Market",
    href: ArchitectureUrls.getMarket(),
  },
  {
    label: "Tech Stack",
    href: ArchitectureUrls.getTechStack(),
  },
];

export function TabsNavigation() {
  const pathname = usePathname();
  return (
    <nav
      className={
        "text-gray-600 bg-gray-50 flex w-full divide-x-[1px] divide-gray-100"
      }
    >
      {links.map((link) => (
        <Link
          className={cn("flex-auto text-center py-3 px-3 bg-white", {
            "hover:text-gray-900 hover:bg-gray-100": pathname !== link.href,
            "bg-coral-400 text-white": pathname === link.href,
          })}
          key={link.href}
          href={link.href}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
