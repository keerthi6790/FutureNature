import apiClient from "./apiClient";

export interface AddressData {
    id?: string;
    receiverName?: string;
    label?: string;
    address1: string;
    address2: string;
    address3?: string;
    address4?: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
    mobileNumber: string;
}

export const addressApi = {
    addAddress: (addressData: Omit<AddressData, "id">) =>
        apiClient.post("/address/add", addressData),

    getAllAddresses: () =>
        apiClient.get("/address/alladdress"),

    editAddress: (id: string, addressData: AddressData) =>
        apiClient.put(`/address/edit/${id}`, addressData),

    deleteAddress: (id: string) =>
        apiClient.delete(`/address/delete/${id}`),
};
