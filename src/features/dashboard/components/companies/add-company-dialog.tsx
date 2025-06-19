"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { InfoIcon, PlusCircle } from "lucide-react";
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
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { addCompany } from "@/features/dashboard/dashboard.actions";
import { companySchema } from "@/lib/zodSchemas";
import { generateSlug } from "@/utils/generateSlug";
import { useEffect, useState } from "react";

type CompanyFormData = z.infer<typeof companySchema>;

const AddCompanyDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      description: "",
      slug: "",
      videoUrl: "",
      buttonText: "",
    },
  });

  const { control, handleSubmit, formState, reset, watch, setValue } = form;
  const name = watch("name");

  useEffect(() => {
    setValue("slug", generateSlug(name), { shouldValidate: true });
  }, [name, setValue]);

  const onSubmit = async (data: CompanyFormData) => {
    const toastId = toast.loading("Adding company...");
    try {
      const result = await addCompany(data);

      if (result.success) {
        toast.success("Company added!", { id: toastId });
        reset();
        setIsOpen(false);
      } else {
        toast.error(result.error || "Failed to add company.", { id: toastId });
      }
    } catch (err) {
      console.error("Add company error:", err);
      toast.error("Unexpected error. Please try again.", { id: toastId });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Company
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Company</DialogTitle>
          <DialogDescription>Enter company details below</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-3">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. GreenLife Organics" {...field} />
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
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      {...field}
                      placeholder="Write a short description..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
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
              control={control}
              name="buttonText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CTA Button Text</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Shop Now" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={formState.isSubmitting}
              className="w-full mt-5"
            >
              {formState.isSubmitting ? "Adding..." : "Add Company"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCompanyDialog;
