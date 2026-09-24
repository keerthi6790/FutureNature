import apiClient from "./apiClient";

export interface Banner {
  id: string;
  title?: string;
  imageUrl?: string;
  href?: string;
  device?: string;
  desktopImageUrl: string;
  mobileImageUrl?: string;
  desktopHref?: string;
  mobileHref?: string;
  isActive: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BannerPayload {
  title?: string;
  desktopImageUrl: string;
  mobileImageUrl?: string;
  desktopHref?: string;
  mobileHref?: string;
  isActive?: boolean;
  order?: number;
}

export const bannerApi = {
  getBanners: async (activeOnly: boolean = false) => {
    const response = await apiClient.get<{ status: boolean; data: Banner[] }>(
      `/banner${activeOnly ? "?activeOnly=true" : ""}`
    );
    return response.data;
  },

  getBannersByDevice: async (device: "desktop" | "mobile" = "desktop") => {
    const response = await apiClient.get<{
      status: boolean;
      device: string;
      data: Banner[];
    }>(`/banner/device?device=${device}`);
    return response.data;
  },

  addBanner: async (data: BannerPayload) => {
    const response = await apiClient.post<{
      status: boolean;
      message: string;
      data: Banner;
    }>("/banner", data);
    return response.data;
  },

  updateBanner: async (id: string, data: Partial<BannerPayload>) => {
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
