"use client";

import { cn } from "@/utils/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { LayoutDashboard, Package } from "lucide-react";
import { useTranslations } from "next-intl";

const Sidebar = () => {
  const t = useTranslations("dashboard.sidebar");
  const pathname = usePathname();

  const sidebarItems = [
    { name: t("dashboard"), href: "/dashboard", icon: LayoutDashboard },
    {
      name: t("companies"),
      href: "/dashboard/companies",
      icon: LayoutDashboard,
    },
    { name: t("products"), href: "/dashboard/products", icon: Package },
  ];

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
