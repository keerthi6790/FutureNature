import apiClient from "./apiClient";

export interface ICategory {
  id: string;
  name: string;
  image_url?: string | null;
  category_name?: string;
  category_image?: string | null;
  category_id?: string;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    products: number;
  };
  products?: any[];
}

export interface ICategoryPayload {
  name?: string;
  categoryName?: string;
  image_url?: string | null;
  imageUrl?: string | null;
  categoryImage?: string | null;
  categoryId?: string;
}

export const categoryApi = {
  getAllCategories: () => apiClient.get("/category"),
  getCategoryById: (id: string) => apiClient.get(`/category/${id}`),
  addCategory: (data: ICategoryPayload) => apiClient.post("/category", data),
  updateCategory: (id: string, data: ICategoryPayload) =>
    apiClient.put(`/category/${id}`, data),
  deleteCategory: (id: string) => apiClient.delete(`/category/${id}`),
  assignProducts: (categoryId: string, productIds: string[]) =>
    apiClient.post(`/category/${categoryId}/assign`, { productIds }),
};
