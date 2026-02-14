import { useState, useEffect } from "react";
import Input from "./Input";
import { AddressData } from "../api/addressApi";

interface AddressFormProps {
    initialData?: AddressData;
    onSubmit: (data: AddressData) => Promise<void>;
    onCancel: () => void;
}

export default function AddressForm({ initialData, onSubmit, onCancel }: AddressFormProps) {
    const [formData, setFormData] = useState<AddressData>({
        address1: "",
        address2: "",
        address3: "",
        city: "",
        district: "",
        state: "",
        pincode: "",
        mobileNumber: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.address1.trim()) newErrors.address1 = "Address Line 1 is required";
        if (!formData.address2.trim()) newErrors.address2 = "Address Line 2 is required";
        if (!formData.city.trim()) newErrors.city = "City is required";
        if (!formData.district.trim()) newErrors.district = "District is required";
        if (!formData.state.trim()) newErrors.state = "State is required";

        if (!formData.pincode) {
            newErrors.pincode = "Pincode is required";
        } else if (!/^\d{6}$/.test(formData.pincode)) {
            newErrors.pincode = "Invalid 6-digit Pincode";
        }

        if (!formData.mobileNumber) {
            newErrors.mobileNumber = "Mobile Number is required";
        } else if (!/^[6-9]\d{9}$/.test(formData.mobileNumber.replace(/\s/g, ""))) {
            newErrors.mobileNumber = "Invalid 10-digit Indian mobile number";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            await onSubmit(formData);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <Input
                    label="Flat/House No/Building"
                    name="address1"
                    value={formData.address1}
                    onChange={handleChange}
                    placeholder="e.g. Flat 101, Galaxy Apts"
                    error={errors.address1}
                    required
                />
                <Input
                    label="Street/Area/Colony"
                    name="address2"
                    value={formData.address2}
                    onChange={handleChange}
                    placeholder="e.g. MG Road, Indiranagar"
                    error={errors.address2}
                    required
                />
            </div>

            <Input
                label="Landmark"
                name="address3"
                value={formData?.address3 || ""}
                onChange={handleChange}
                placeholder="e.g. Near Metro Station"
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <Input
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    error={errors.city}
                    required
                />
                <Input
                    label="District"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    error={errors.district}
                    required
                />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
                <Input
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    error={errors.state}
                    required
                />
                <Input
                    label="Pincode"
                    name="pincode"
                    type="text"
                    value={formData.pincode}
                    onChange={handleChange}
                    error={errors.pincode || undefined}
                    required
                />
                <Input
                    label="Mobile Number"
                    name="mobileNumber"
                    type="tel"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    error={errors.mobileNumber}
                    required
                />
            </div>

            <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
                <button
                    type="button"
                    onClick={onCancel}
                    style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #d1d5db",
                        backgroundColor: "white",
                        color: "#374151",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontSize: '14px'
                    }}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "8px",
                        border: "none",
                        backgroundColor: "#fbbf24",
                        color: "#000",
                        fontWeight: 700,
                        cursor: isSubmitting ? "not-allowed" : "pointer",
                        opacity: isSubmitting ? 0.7 : 1,
                        fontSize: '14px',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        if (!isSubmitting) {
                            e.currentTarget.style.backgroundColor = '#000';
                            e.currentTarget.style.color = '#fff';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!isSubmitting) {
                            e.currentTarget.style.backgroundColor = '#fbbf24';
                            e.currentTarget.style.color = '#000';
                        }
                    }}
                >
                    {isSubmitting ? "Saving..." : (initialData?.id ? "Update Address" : "Save Address")}
                </button>
            </div>
        </form>
    );
}
