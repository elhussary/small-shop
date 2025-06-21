"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteCompany } from "@/features/dashboard/dashboard.actions";
import { formatDate } from "@/utils/formatDate";
import { TrashIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { getLocalized } from "@/utils/getLocalized";
import { getCompanies } from "../../dashboadrd.queires";
import EditCompanyDialog from "./edit-company-dialog";

type Companies = NonNullable<Awaited<ReturnType<typeof getCompanies>>>;

const CompaniesTable = ({ companies }: { companies: Companies }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const locale = useLocale();
  const t = useTranslations("dashboard.companies");

  const filteredCompanies = companies.filter((company) => {
    const search = searchTerm.toLowerCase();
    const name = getLocalized(company, "name", locale)?.toLowerCase() || "";
    const desc =
      getLocalized(company, "description", locale)?.toLowerCase() || "";
    const btn =
      getLocalized(company, "buttonText", locale)?.toLowerCase() || "";
    return (
      name.includes(search) || desc.includes(search) || btn.includes(search)
    );
  });

  return (
    <>
      <section className="flex items-center space-x-2 mb-4">
        <Input
          placeholder={t("searchPlaceholder")}
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </section>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("table.companyName")}</TableHead>
            <TableHead>{t("table.description")}</TableHead>
            <TableHead>{t("table.slug")}</TableHead>
            <TableHead>{t("table.buttonText")}</TableHead>
            <TableHead>{t("table.video")}</TableHead>
            <TableHead>{t("table.createdAt")}</TableHead>
            <TableHead>{t("table.actions")}</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredCompanies.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                {t("table.noCompanies")}
              </TableCell>
            </TableRow>
          ) : (
            filteredCompanies.map((company) => (
              <TableRow key={company.id}>
                <TableCell className="font-medium">
                  {getLocalized(company, "name", locale)}
                </TableCell>

                <TableCell className="max-w-[300px] truncate">
                  {getLocalized(company, "description", locale)}
                </TableCell>

                <TableCell className="text-muted-foreground text-sm">
                  {company.slug}
                </TableCell>

                <TableCell>
                  <Badge variant="secondary">
                    {getLocalized(company, "buttonText", locale)}
                  </Badge>
                </TableCell>

                <TableCell>
                  <a
                    href={company.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-sm"
                  >
                    {t("actions.view")}
                  </a>
                </TableCell>

                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(company.createdAt)}
                </TableCell>

                <TableCell className="flex gap-2">
                  <EditCompanyDialog company={company} />

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <TrashIcon className="w-4 h-4 mr-1" />
                        {t("actions.delete")}
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-destructive">
                          {t("actions.confirmDelete")} &quot;
                          {getLocalized(company, "name", locale)}
                          &quot;
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                          {t("actions.deleteWarning")}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>
                          {t("actions.cancel")}
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                          <Button
                            onClick={async () => {
                              await deleteCompany(company.id);
                            }}
                          >
                            <TrashIcon className="w-4 h-4 mr-1" />
                            {t("actions.confirm")}
                          </Button>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default CompaniesTable;
