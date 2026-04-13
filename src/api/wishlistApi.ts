import apiClient from "./apiClient";

export const wishlistApi = {
  toggleWishlist: (productId: string) =>
    apiClient.post(`/wishlist/toggle/${productId}`),
  getWishlist: () => apiClient.get("/wishlist"),
};
