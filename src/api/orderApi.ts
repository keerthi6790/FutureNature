import apiClient from "./apiClient";

export interface OrderItem {
    id: string;
    productId: string;
    product: {
        product_name: string;
        imageUrl: string[];
        price: string;
    };
    selected_quantity: string;
    total_price: string;
}

export interface OrderData {
    id: string;
    total_price: string;
    discounted_price: string;
    mrp_price: string;
    paymentStatus: string;
    createdAt: string;
    items: OrderItem[];
    address: {
        address1: string;
        city: string;
        state: string;
        pincode: string;
    };
}

export const orderApi = {
    getMyOrders: () => apiClient.get("/order/all"),
    getOrderById: (id: string) => apiClient.get(`/order/${id}`),
};
