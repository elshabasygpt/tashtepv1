import { algoliasearch } from 'algoliasearch';
import { type Product as UIProduct } from "@/features/products/components/product-card";

// Note: Ensure these are set in .env
// NEXT_PUBLIC_ALGOLIA_APP_ID=...
// ALGOLIA_ADMIN_KEY=...
const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "MOCK_APP_ID";
const adminKey = process.env.ALGOLIA_ADMIN_KEY || "MOCK_ADMIN_KEY";
const isMock = appId === "MOCK_APP_ID";

// We use the admin key here because this service is only used on the server side to update the index.
const client = algoliasearch(appId, adminKey);

const INDEX_NAME = "tashtep_products";

export const AlgoliaService = {
  /**
   * Sync a single product to Algolia
   */
  async saveProduct(product: UIProduct) {
    if (isMock) return; // Skip if no real keys
    
    try {
      await client.saveObject({
        indexName: INDEX_NAME,
        body: {
          objectID: product.id,
          name: product.name,
          description: product.description || "",
          price: product.price,
          originalPrice: product.originalPrice,
          category: product.category,
          image: product.image,
          rating: product.rating,
          isNew: product.isNew,
          stock: product.stock,
        }
      });
      console.log(`[Algolia] Synced product ${product.id}`);
    } catch (error) {
      console.error("[Algolia] Failed to save product", error);
    }
  },

  /**
   * Delete a product from Algolia
   */
  async deleteProduct(productId: string) {
    if (isMock) return;
    
    try {
      await client.deleteObject({
        indexName: INDEX_NAME,
        objectID: productId
      });
      console.log(`[Algolia] Deleted product ${productId}`);
    } catch (error) {
      console.error("[Algolia] Failed to delete product", error);
    }
  },

  /**
   * Sync multiple products at once (for the initial sync script)
   */
  async saveProductsBatch(products: UIProduct[]) {
    if (isMock) return;

    try {
      const objects = products.map((product) => ({
        objectID: product.id,
        name: product.name,
        description: product.description || "",
        price: product.price,
        originalPrice: product.originalPrice,
        category: product.category,
        image: product.image,
        rating: product.rating,
        isNew: product.isNew,
        stock: product.stock,
      }));

      // In v5, batch operations
      // Wait, client.saveObjects exists in v4. In v5 it might be different, let's use a simple loop or chunking.
      // v5 syntax for multiple objects is usually saveObjects, let's just loop for simplicity if batching is not immediately available.
      // But let's check v5 docs. For now we will just loop for safety since it's a one-time script for 10-20 products.
      for (const obj of objects) {
        await client.saveObject({
            indexName: INDEX_NAME,
            body: obj
        });
      }
      
      console.log(`[Algolia] Batch synced ${products.length} products`);
    } catch (error) {
      console.error("[Algolia] Failed to batch save products", error);
    }
  },

  /**
   * Search Algolia and return matching object IDs
   */
  async search(query: string): Promise<string[]> {
    if (isMock || !client) return [];
    try {
      const response = await client.search({
        requests: [
          {
            indexName: INDEX_NAME,
            query,
            hitsPerPage: 100, // Fetch up to 100 matching IDs
          }
        ]
      });
      const hits = (response.results[0] as { hits?: { objectID: string }[] })?.hits || [];
      return hits.map((hit) => hit.objectID);
    } catch (error) {
      console.error("[Algolia] Search failed", error);
      return [];
    }
  }
};
