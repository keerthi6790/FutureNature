import apiClient from "./apiClient";

interface IAddProductPayload {
  productName: string;
  productNameTamil: string;
  description: string;
  descriptionTamil: string;
  price: string;
  discountedType: string;
  discountedAmount: string;
  imageUrl: string[];
  availableQuantity: string;
  categoryId?: string;
}

export const productApi = {
  getAllProducts: (categories?: string | string[]) => {
    if (Array.isArray(categories) && categories.length > 0) {
      return apiClient.get(`/product/products?categories=${categories.join(",")}`);
    }
    if (typeof categories === "string" && categories.length > 0 && categories !== "all") {
      return apiClient.get(`/product/products?categories=${categories}`);
    }
    return apiClient.get("/product/products");
  },
  getProductById: (id: string) =>
    apiClient.get(`/product/getProductInfo/${id}`),
  addProduct: (data: IAddProductPayload) =>
    apiClient.post("/product/add", data),
  updateProduct: (id: string, data: Partial<IAddProductPayload>) =>
    apiClient.put(`/product/update/${id}`, data),
  deleteProduct: (id: string) => apiClient.delete(`/product/delete/${id}`),
  restoreProduct: (id: string) => apiClient.post(`/product/restore/${id}`),
  getDailyDeals: () => apiClient.get("/product/daily-deals"),
  toggleDailyDeal: (id: string, isDailyDeals: boolean) =>
    apiClient.post(`/product/toggle-daily-deal/${id}`, { isDailyDeals }),
};
