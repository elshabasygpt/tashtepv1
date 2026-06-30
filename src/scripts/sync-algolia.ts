import { prisma } from "../lib/prisma";
import { AlgoliaService } from "../services/algolia.service";
import { ProductService } from "../services/product.service";

/**
 * Run this script once to synchronize all existing products to Algolia.
 * Execute via: npx tsx src/scripts/sync-algolia.ts
 */
async function run() {
  console.log("Starting Algolia Sync...");
  
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: true,
        images: true,
        variants: true
      }
    });

    console.log(`Found ${products.length} active products to sync.`);

    const uiProducts = products.map(ProductService.mapToUIProduct);
    
    await AlgoliaService.saveProductsBatch(uiProducts);
    
    console.log("Algolia Sync completed successfully!");
  } catch (error) {
    console.error("Error during sync:", error);
  } finally {
    await prisma.$disconnect();
  }
}

run();
