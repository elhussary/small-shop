"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

const SearchBar = () => {
  const router = useRouter();

  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const query = inputValue.trim();
    const newUrl = query
      ? `/products?search=${encodeURIComponent(query)}`
      : "/products";

    startTransition(() => {
      router.push(newUrl);
      setInputValue("");
      setOpen(false);
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <SearchIcon />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="top"
        className="dark:dark-glass border-none bg-none p-5 shadow-none [&>button:first-of-type]:hidden"
      >
        <SheetHeader className="hidden">
          <SheetTitle>Search</SheetTitle>
        </SheetHeader>

        <form className="relative" onSubmit={handleSearchSubmit}>
          <Input
            type="text"
            name="q"
            placeholder="Search products..."
            className="dark:bg-secondary/50 dark:hover:bg-secondary/70 w-full pl-9 transition-colors"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />

          <SearchIcon
            className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 transform"
            size={18}
          />
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default SearchBar;
