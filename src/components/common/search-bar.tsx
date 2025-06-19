"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const SearchBar = ({ companies }: { companies: Company[] }) => {
  const router = useRouter();

  const [inputValue, setInputValue] = useState("");
  const [companyId, setCompanyId] = useState<string | undefined>();

  const [open, setOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const query = inputValue.trim();

    if (!companyId) return;

    const searchParams = new URLSearchParams();
    if (query) searchParams.set("search", query);

    const newUrl = `/company/${companyId}/products${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;

    startTransition(() => {
      router.push(newUrl);
      // setInputValue("");
      // setCompanyId(undefined);
      // setOpen(false);
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

        <form onSubmit={handleSearchSubmit}>
          <div className="relative flex w-full">
            {/*  Company Select */}
            <div className="h-full">
              <Select value={companyId} onValueChange={setCompanyId}>
                <SelectTrigger className="h-full w-full rounded-none px-2 text-sm">
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.slug}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Input
              type="text"
              name="q"
              placeholder="Search products..."
              autoFocus
              className="w-full rounded-none focus-visible:ring-0 focus-visible:border-gray-200"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default SearchBar;
