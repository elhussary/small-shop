"use server";

import { db } from "@/db/drizzle";
import { isPostgresErrorWithCode, PostgresErrorCode } from "@/db/handleDbError";
import { companies, productImages, products } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

function getFileKeyFromUrl(url: string): string | null {
  const parts = url.split("/f/");
  return parts.length > 1 ? parts[1] : null;
}

// Companies
type CompanyFormData = {
  name_en: string;
  name_ar: string;
  description_en: string | null;
  description_ar: string | null;
  slug: string;
  videoUrl: string;
  buttonText_en: string;
  buttonText_ar: string;
};

export async function addCompany(data: CompanyFormData) {
  try {
    await db.insert(companies).values({
      name_en: data.name_en,
      name_ar: data.name_ar,
      description_en: data.description_en,
      description_ar: data.description_ar,
      slug: data.slug,
      videoUrl: data.videoUrl,
      buttonText_en: data.buttonText_en,
      buttonText_ar: data.buttonText_ar,
    });

    revalidatePath("/dashboard/companies");
    return { success: true };
  } catch (error) {
    console.error("Failed to add company:", error);
    return { success: false, error: "Something went wrong." };
  }
}

export async function updateCompany(companyId: number, data: CompanyFormData) {
  try {
    await db
      .update(companies)
      .set({
        name_en: data.name_en,
        name_ar: data.name_ar,
        description_en: data.description_en,
        description_ar: data.description_ar,
        slug: data.slug,
        videoUrl: data.videoUrl,
        buttonText_en: data.buttonText_en,
        buttonText_ar: data.buttonText_ar,
      })
      .where(eq(companies.id, companyId));

    revalidatePath("/dashboard/companies");
    return { success: true };
  } catch (error) {
    console.error("Failed to update company:", error);
    return { success: false, error: "Failed to update company." };
  }
}

export async function deleteCompany(companyId: number) {
  try {
    await db.delete(companies).where(eq(companies.id, companyId));
    revalidatePath("/dashboard/companies");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete company:", error);
    return {
      success: false,
      error: "Failed to delete company. Please try again.",
    };
  }
}

// Products
export async function addProduct(
  data: Omit<Product, "id"> & { images: string[] }
) {
  try {
    const [insertedProduct] = await db
      .insert(products)
      .values({
        name_en: data.name_en,
        name_ar: data.name_ar,
        slug: data.slug,
        description_en: data.description_en,
        description_ar: data.description_ar,
        price: data.price,
        companyId: data.companyId,
      })
      .returning({ id: products.id });

    const productId = insertedProduct.id;

    if (data.images.length > 0) {
      await db.insert(productImages).values(
        data.images.map((url) => ({
          productId,
          url,
        }))
      );
    }

    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error) {
    if (isPostgresErrorWithCode(error, PostgresErrorCode.UniqueViolation)) {
      return {
        success: false,
        error: "A Product with this name already exists.",
      };
    }
    console.error("Failed to add product:", error);
    return { success: false, error: "Failed to add product." };
  }
}

export async function updateProduct(
  productId: number,
  data: Omit<Product, "id"> & { images: string[] }
) {
  try {
    const currentImages = await db
      .select({ url: productImages.url })
      .from(productImages)
      .where(eq(productImages.productId, productId));

    const currentImageUrls = currentImages.map((img) => img.url);
    const newImageUrls = data.images;

    const imagesToDelete = currentImageUrls.filter(
      (url) => !newImageUrls.includes(url)
    );
    const imagesToAdd = newImageUrls.filter(
      (url) => !currentImageUrls.includes(url)
    );

    if (imagesToDelete.length > 0) {
      const fileKeysToDelete = imagesToDelete
        .map(getFileKeyFromUrl)
        .filter((key): key is string => key !== null);

      if (fileKeysToDelete.length > 0) {
        await utapi.deleteFiles(fileKeysToDelete);
      }
    }

    await db.transaction(async (tx) => {
      await tx
        .update(products)
        .set({
          name_en: data.name_en,
          name_ar: data.name_ar,
          slug: data.slug,
          description_en: data.description_en,
          description_ar: data.description_ar,
          price: data.price,
          companyId: data.companyId,
        })
        .where(eq(products.id, productId));

      if (imagesToDelete.length > 0) {
        await tx
          .delete(productImages)
          .where(
            and(
              eq(productImages.productId, productId),
              inArray(productImages.url, imagesToDelete)
            )
          );
      }

      if (imagesToAdd.length > 0) {
        await tx.insert(productImages).values(
          imagesToAdd.map((url) => ({
            productId: productId,
            url,
          }))
        );
      }
    });

    revalidatePath("/dashboard/products");

    return { success: true };
  } catch (error) {
    console.error("Failed to update product:", error);

    return {
      success: false,
      error: `Failed to update product`,
    };
  }
}

export async function deleteProductAndImages(productId: number) {
  try {
    const images = await db
      .select({ url: productImages.url })
      .from(productImages)
      .where(eq(productImages.productId, productId));

    const fileKeys = images.map((img) => img.url.split("/").pop() || "");

    await db.delete(products).where(eq(products.id, productId));

    if (fileKeys.length > 0) {
      await utapi.deleteFiles(fileKeys);
    }

    revalidatePath("/dashboard/products");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete product and images:", error);
    return { success: false, error: "Something went wrong." };
  }
}
