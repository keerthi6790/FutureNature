import apiClient from "./apiClient";

interface UserData {
    firstName: string;
    lastName: string;
    mobileNumber: string;
    email: string;
    dob: string;
    isWhatsappOptIn: boolean;
}

export const userApi = {
    triggerOtp: (mobileNumber: string) =>
        apiClient.post("/user/triggerOtp", { mobileNumber }),
    verifyOtp: (mobileNumber: string, otp: string) =>
        apiClient.post("/user/verifyOtp", { mobileNumber, otp }),
    register: (userData: UserData) => apiClient.post("/user/register", userData),
};
