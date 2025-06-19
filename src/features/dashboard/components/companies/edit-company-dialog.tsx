"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { EditIcon, InfoIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { updateCompany } from "@/features/dashboard/dashboard.actions";
import { companySchema } from "@/lib/zodSchemas";
import { generateSlug } from "@/utils/generateSlug";

type CompanyFormData = z.infer<typeof companySchema>;

const EditCompanyDialog = ({ company }: { company: Company }) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: company.name,
      slug: company.slug,
      description: company.description || "",
      videoUrl: company.videoUrl,
      buttonText: company.buttonText,
    },
  });

  const { watch, setValue } = form;
  const name = watch("name");

  useEffect(() => {
    setValue("slug", generateSlug(name), { shouldValidate: true });
  }, [name, setValue]);

  const onSubmit = async (data: CompanyFormData) => {
    toast.loading("Saving company...");
    try {
      const result = await updateCompany(company.id, data);
      if (result.success) {
        toast.success("Company updated!");
        setIsOpen(false);
      } else {
        toast.error(result.error || "Failed to update company.");
      }
    } catch (err) {
      toast.error("Unexpected error occurred.");
      console.error(err);
    } finally {
      toast.dismiss();
    }
  };

  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button
            className="inline-flex items-center justify-center rounded border px-3 py-1 text-sm gap-1.5"
            aria-label="Edit Company"
          >
            <EditIcon className="h-4 w-4" /> Edit
          </button>
        </DialogTrigger>

        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
            <DialogDescription>
              Update the company information below.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. TechFlow Solutions" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      URL Slug
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoIcon className="ml-1.5 h-3 w-3 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          Auto-generated from company name
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <Input readOnly {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="buttonText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Button Text</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. View Products" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full mt-4">
                Save Changes
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default EditCompanyDialog;
