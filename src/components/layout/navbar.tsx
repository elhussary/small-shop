import { Badge } from "@/components/ui/badge";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import { getCompanies } from "@/features/dashboard/dashboadrd.queires";

import { getLocalized } from "@/utils/getLocalized";
import { ShoppingCartIcon } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import LanguageSwitcher from "../common/language-switcher";
import SearchBar from "../common/search-bar";
import { ThemeToggle } from "../common/theme-toggle";
import MobileNav from "./mobile-nav";

const Navbar = async () => {
  const locale = await getLocale();

  const t = await getTranslations("common.navbar");
  const companies = await getCompanies();

  return (
    <NavigationMenu
      viewport={false}
      className="bg-background fixed top-0 right-0 left-0 z-50 block max-w-full border-b"
    >
      <section className="container flex h-12 items-center justify-between pt-0.5">
        <MobileNav />

        {/* Left MenuList */}
        <NavigationMenuList className="hidden sm:flex">
          {/* LOGO */}
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/" className="text-primary !text-2xl font-bold">
                Shop
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          {/* Men's Fashion */}
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              {t("companies.title")}
            </NavigationMenuTrigger>

            <NavigationMenuContent>
              {companies.length === 0 ? (
                <div className="p-4 text-muted-foreground text-nowrap">
                  {t("companies.empty")}
                </div>
              ) : (
                <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b p-6 no-underline outline-none select-none focus:shadow-md"
                        href={`/company/${companies[0]?.slug}`}
                      >
                        <div className="mt-4 mb-2 text-lg font-medium">
                          {getLocalized(companies[0], "name", locale)}
                        </div>
                        <p className="text-muted-foreground text-sm leading-tight">
                          {getLocalized(companies[0], "description", locale)}
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>

                  {companies.slice(1).map((company) => (
                    <ListItem
                      title={getLocalized(company, "name", locale)}
                      key={company.id}
                      href={`/company/${company.slug}`}
                    >
                      {getLocalized(company, "description", locale)}
                    </ListItem>
                  ))}
                </ul>
              )}
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>

        {/* Right MenuList */}
        <NavigationMenuList>
          {/* Language Switcher */}
          <NavigationMenuItem>
            <LanguageSwitcher />
          </NavigationMenuItem>

          {/* Search Bar*/}
          <NavigationMenuItem>
            <SearchBar companies={companies} />
          </NavigationMenuItem>

          {/* Cart */}
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/cart">
                <ShoppingCartIcon />
                <Badge className="absolute -top-1.5 -right-1.5 size-5.5">
                  0
                </Badge>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          {/* Theme Toggle */}
          <NavigationMenuItem className="ml-2">
            <ThemeToggle />
          </NavigationMenuItem>
        </NavigationMenuList>
      </section>
    </NavigationMenu>
  );
};

export default Navbar;

const ListItem = ({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) => {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
};
