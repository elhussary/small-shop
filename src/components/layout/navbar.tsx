import { Badge } from "@/components/ui/badge";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import { HeartIcon, ShoppingCartIcon } from "lucide-react";
import Link from "next/link";
import SearchBar from "../common/search-bar";
import { ThemeToggle } from "../common/theme-toggle";
import MobileNav from "./mobile-nav";

const Navbar = async () => {
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
            <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <Link
                      className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b p-6 no-underline outline-none select-none focus:shadow-md"
                      href="/men/apparel"
                    >
                      <div className="mt-4 mb-2 text-lg font-medium">
                      Electronics Collection
                      </div>
                      <p className="text-muted-foreground text-sm leading-tight">
                        Discover your unique style with our handpicked
                        selections for men.
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <ListItem href="/men/sportswear" title="Sportswear">
                  Stylish and functional dresses, tops, and bottoms for active
                  and casual wear.
                </ListItem>
                <ListItem href="/men/footwear" title="Footwear">
                  Explore shoes for every occasion—from casual sneakers to
                  formal dress shoes.
                </ListItem>
                <ListItem href="/men/accessories" title="Accessories">
                  Elevate your outfit with our range of bags, jewelry, and
                  statement pieces.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* Women's Fashion */}
          <NavigationMenuItem>
            <NavigationMenuLink href="/products">Products</NavigationMenuLink>
          </NavigationMenuItem>

          {/* Kids' Fashion */}
        </NavigationMenuList>

        {/* Right MenuList */}
        <NavigationMenuList>
          {/* Search Bar*/}
          <NavigationMenuItem>
            <SearchBar />
          </NavigationMenuItem>

          {/* Wishlist */}
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/wishlist">
                <HeartIcon />

                <Badge className="absolute -top-1.5 -right-1.5 size-5.5">
                  0
                </Badge>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          {/* Cart */}
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/cart" className="ml-2">
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
