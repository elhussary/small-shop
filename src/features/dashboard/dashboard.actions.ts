"use server";

import { db } from "@/db/drizzle";
import { isPostgresErrorWithCode, PostgresErrorCode } from "@/db/handleDbError";
import { productImages, products } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

function getFileKeyFromUrl(url: string): string | null {
  const parts = url.split("/f/");
  return parts.length > 1 ? parts[1] : null;
}

export async function addProduct(
  data: Omit<Product, "id"> & { images: string[] }
) {
  try {
    const [insertedProduct] = await db
      .insert(products)
      .values({
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
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
          name: data.name,
          slug: data.slug,
          description: data.description,
          price: data.price,
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
