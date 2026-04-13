import apiClient from "./apiClient";

export const reviewApi = {
  getReviewsByProductId: (id: string) =>
    apiClient.get(`/review/getProductReviews/${id}`),
  postReview: (id: string, data: { message: string; rating: number }) =>
    apiClient.post(`/review/post/${id}`, data),
};
