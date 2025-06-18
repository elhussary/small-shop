import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";

const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="sm:hidden">
          <MenuIcon />
        </Button>
      </SheetTrigger>

      <SheetContent side="top" className="dark:dark-glass h-full">
        <SheetHeader>
          <SheetTitle>
            <Link href="/" className="text-2xl font-bold">
              Shop
            </Link>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-5 text-sm">
          <SheetClose asChild>
            <Link href="/">Home</Link>
          </SheetClose>
          <SheetClose asChild>
            <Link href="/products">Products</Link>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
