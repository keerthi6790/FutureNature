import apiClient from "./apiClient";

export interface Banner {
  id: string;
  imageUrl: string;
  isActive: boolean;
}

export const bannerApi = {
  getBanners: async (activeOnly: boolean = false) => {
    const response = await apiClient.get<{ status: boolean; data: Banner[] }>(
      `/banner${activeOnly ? "?activeOnly=true" : ""}`,
    );
    return response.data;
  },

  addBanner: async (data: { imageUrl: string; isActive?: boolean }) => {
    const response = await apiClient.post<{
      status: boolean;
      message: string;
      data: Banner;
    }>("/banner", data);
    return response.data;
  },

  updateBanner: async (
    id: string,
    data: { imageUrl?: string; isActive?: boolean },
  ) => {
    const response = await apiClient.put<{
      status: boolean;
      message: string;
      data: Banner;
    }>(`/banner/${id}`, data);
    return response.data;
  },

  deleteBanner: async (id: string) => {
    const response = await apiClient.delete<{
      status: boolean;
      message: string;
    }>(`/banner/${id}`);
    return response.data;
  },
};
