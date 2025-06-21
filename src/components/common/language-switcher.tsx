"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "next/navigation";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (lang: string) => {
    const newPath = `/${lang}${pathname.replace(/^\/(en|ar)/, "")}`;
    router.push(newPath);
  };

  return (
    <Select
      onValueChange={handleChange}
      defaultValue={pathname.startsWith("/ar") ? "ar" : "en"}
    >
      <SelectTrigger className="w-90px]">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="ar">العربية</SelectItem>
      </SelectContent>
    </Select>
  );
}
