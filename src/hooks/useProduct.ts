import { useQuery } from "@tanstack/react-query";
import { ProductService } from "@/services/product.service";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => ProductService.getProducts(),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => ProductService.getProductById(id),
    enabled: !!id,
  });
}

export function useProductsByCategory(category: string) {
  return useQuery({
    queryKey: ["products", { category }],
    queryFn: () => ProductService.getProductsByCategory(category),
    enabled: !!category,
  });
}
