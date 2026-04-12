import { useState, useEffect } from "react";
import Input from "./Input";
import { AddressData } from "../api/addressApi";
import styles from "@/styles/AddressForm.module.scss";

interface AddressFormProps {
  initialData?: AddressData;
  onSubmit: (data: AddressData) => Promise<void>;
  onCancel: () => void;
}

export default function AddressForm({
  initialData,
  onSubmit,
  onCancel,
}: AddressFormProps) {
  const [formData, setFormData] = useState<AddressData>({
    receiverName: "",
    label: "Home",
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
      setFormData({
        ...initialData,
        receiverName: initialData.receiverName || "",
        label: initialData.label || "Home",
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
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

    if (!formData.address1.trim())
      newErrors.address1 = "Address Line 1 is required";
    if (!formData.address2.trim())
      newErrors.address2 = "Address Line 2 is required";
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
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.grid2}>
        <Input
          label="Receiver's Name"
          name="receiverName"
          value={formData.receiverName || ""}
          onChange={handleChange}
          placeholder="e.g. John Doe"
        />
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label
            style={{ fontSize: "14px", fontWeight: 600, color: "#374151" }}
          >
            Address Label
          </label>
          <select
            name="label"
            value={formData.label}
            onChange={handleChange}
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              fontSize: "14px",
              backgroundColor: "white",
            }}
          >
            <option value="Home">Home</option>
            <option value="Work">Work</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className={styles.grid2}>
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

      <div className={styles.grid2}>
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

      <div className={styles.grid3}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label
            style={{ fontSize: "14px", fontWeight: 600, color: "#374151" }}
          >
            State
          </label>
          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: errors.state ? "1px solid #ef4444" : "1px solid #d1d5db",
              fontSize: "14px",
              width: "100%",
              backgroundColor: "white",
              color: formData.state ? "#111827" : "#6b7280",
            }}
            required
          >
            <option value="" disabled>
              Select State
            </option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
            <option value="Arunachal Pradesh">Arunachal Pradesh</option>
            <option value="Assam">Assam</option>
            <option value="Bihar">Bihar</option>
            <option value="Chhattisgarh">Chhattisgarh</option>
            <option value="Goa">Goa</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Haryana">Haryana</option>
            <option value="Himachal Pradesh">Himachal Pradesh</option>
            <option value="Jharkhand">Jharkhand</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Kerala">Kerala</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Manipur">Manipur</option>
            <option value="Meghalaya">Meghalaya</option>
            <option value="Mizoram">Mizoram</option>
            <option value="Nagaland">Nagaland</option>
            <option value="Odisha">Odisha</option>
            <option value="Punjab">Punjab</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Sikkim">Sikkim</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Telangana">Telangana</option>
            <option value="Tripura">Tripura</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Uttarakhand">Uttarakhand</option>
            <option value="West Bengal">West Bengal</option>
            <option value="Andaman and Nicobar Islands">
              Andaman and Nicobar Islands
            </option>
            <option value="Chandigarh">Chandigarh</option>
            <option value="Dadra and Nagar Haveli and Daman and Diu">
              Dadra and Nagar Haveli and Daman and Diu
            </option>
            <option value="Delhi">Delhi</option>
            <option value="Jammu and Kashmir">Jammu and Kashmir</option>
            <option value="Ladakh">Ladakh</option>
            <option value="Lakshadweep">Lakshadweep</option>
            <option value="Puducherry">Puducherry</option>
          </select>
          {errors.state && (
            <span
              style={{ color: "#ef4444", fontSize: "12px", marginTop: "2px" }}
            >
              {errors.state}
            </span>
          )}
        </div>
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

      <div className={styles.actions}>
        <button
          type="button"
          onClick={onCancel}
          className={styles.cancelButton}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={styles.saveButton}
        >
          {isSubmitting
            ? "Saving..."
            : initialData?.id
              ? "Update Address"
              : "Save Address"}
        </button>
      </div>
    </form>
  );
}
