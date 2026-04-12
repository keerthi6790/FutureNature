import apiClient from "./apiClient";

export interface AddCartRequest {
  productId: string;
  cartId?: string;
}

export interface DeleteCartRequest {
  cartItemId: string;
  cartId: string;
}

export interface UpdateCartQuantityRequest {
  cartItemId: string;
  cartId: string;
  quantity: number;
}

export const cartApi = {
  addToCart: (data: AddCartRequest) => apiClient.post("/cart/add", data),
  getCart: () => apiClient.get("/cart/all"),
  deleteCartItem: (data: DeleteCartRequest) =>
    apiClient.delete("/cart/delete", { data }),
  updateQuantity: (data: UpdateCartQuantityRequest) =>
    apiClient.put("/cart/update-quantity", data),
  updateAddress: (data: any) => apiClient.put("/cart/update-address", data),
};
