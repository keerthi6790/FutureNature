import apiClient from "./apiClient";

export interface Category {
  id: string;
  category_name: string;
  category_id?: string;
  category_image?: string;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    products: number;
  };
}

export interface CategoryPayload {
  categoryName: string;
  categoryId?: string;
  categoryImage?: string;
}

export const categoryApi = {
  getCategories: async () => {
    const response = await apiClient.get<{ status: boolean; data: Category[] }>(
      "/category"
    );
    return response.data;
  },

  getCategoryById: async (id: string) => {
    const response = await apiClient.get<{ status: boolean; data: Category }>(
      `/category/${id}`
    );
    return response.data;
  },

  addCategory: async (data: CategoryPayload) => {
    const response = await apiClient.post<{
      status: boolean;
      message: string;
      data: Category;
    }>("/category", data);
    return response.data;
  },

  updateCategory: async (id: string, data: Partial<CategoryPayload>) => {
    const response = await apiClient.put<{
      status: boolean;
      message: string;
      data: Category;
    }>(`/category/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: string) => {
    const response = await apiClient.delete<{
      status: boolean;
      message: string;
    }>(`/category/${id}`);
    return response.data;
  },
};
