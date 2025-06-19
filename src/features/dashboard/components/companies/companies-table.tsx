"use client";

import { useState } from "react";

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

import { getCompanies } from "../../dashboadrd.queires";
import EditCompanyDialog from "./edit-company-dialog";

type Companies = NonNullable<Awaited<ReturnType<typeof getCompanies>>>;

const CompaniesTable = ({ companies }: { companies: Companies }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCompanies = companies.filter((company) => {
    const search = searchTerm.toLowerCase();
    return (
      company.name.toLowerCase().includes(search) ||
      company.description?.toLowerCase().includes(search) ||
      company.buttonText.toLowerCase().includes(search)
    );
  });

  return (
    <>
      <section className="flex items-center space-x-2 mb-4">
        <Input
          placeholder="Search companies..."
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </section>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Button Text</TableHead>
            <TableHead>Video</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredCompanies.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No companies found.
              </TableCell>
            </TableRow>
          ) : (
            filteredCompanies.map((company) => (
              <TableRow key={company.id}>
                <TableCell className="font-medium">{company.name}</TableCell>
                <TableCell className="max-w-[300px] truncate">
                  {company.description}
                </TableCell>

                <TableCell className="text-muted-foreground text-sm">
                  {company.slug}
                </TableCell>

                <TableCell>
                  <Badge variant="secondary">{company.buttonText}</Badge>
                </TableCell>

                <TableCell>
                  <a
                    href={company.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-sm"
                  >
                    View
                  </a>
                </TableCell>

                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(company.createdAt)}
                </TableCell>

                <TableCell className="flex gap-2">
                  {/* Edit */}
                  <EditCompanyDialog company={company} />

                  {/* Delete */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <TrashIcon className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-destructive">
                          Delete &quot{company.name}&quot?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone and will remove the
                          company from your records.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction asChild>
                          <Button
                            onClick={async () => {
                              await deleteCompany(company.id);
                            }}
                          >
                            <TrashIcon className="w-4 h-4 mr-1" />
                            Confirm
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
