"use client";

import { cn } from "@/utils/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { LayoutDashboard, Package } from "lucide-react";

const sidebarItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Companies", href: "/dashboard/companies", icon: LayoutDashboard },
  { name: "Products", href: "/dashboard/products", icon: Package },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="bg-background w-52 border-r">
      <nav className="space-y-2 p-4">
        {sidebarItems.map((item) => (
          <Button
            key={item.name}
            variant="ghost"
            className={cn(
              "w-full justify-start",
              pathname === item.href && "bg-muted"
            )}
            asChild
          >
            <Link href={item.href}>
              <item.icon />
              {item.name}
            </Link>
          </Button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
