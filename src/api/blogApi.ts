import apiClient from "./apiClient";

export interface BlogItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  redirectionLink?: string | null;
  order?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogPayload {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  redirectionLink?: string | null;
  order?: number;
  isActive?: boolean;
}

export const blogApi = {
  getBlogs: async (includeInactive: boolean = false) => {
    const response = await apiClient.get<{ status: boolean; data: BlogItem[] }>(
      `/blog${includeInactive ? "?includeInactive=true" : ""}`
    );
    return response.data;
  },

  getBlogById: async (id: string) => {
    const response = await apiClient.get<{ status: boolean; data: BlogItem }>(
      `/blog/${id}`
    );
    return response.data;
  },

  addBlog: async (data: BlogPayload) => {
    const response = await apiClient.post<{
      status: boolean;
      message: string;
      data: BlogItem;
    }>("/blog", data);
    return response.data;
  },

  updateBlog: async (id: string, data: Partial<BlogPayload>) => {
    const response = await apiClient.put<{
      status: boolean;
      message: string;
      data: BlogItem;
    }>(`/blog/${id}`, data);
    return response.data;
  },

  deleteBlog: async (id: string) => {
    const response = await apiClient.delete<{
      status: boolean;
      message: string;
    }>(`/blog/${id}`);
    return response.data;
  },
};
