import { useState } from "react";
import Image from "next/image";
import OtpInput from "react-otp-input";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import CustomInputError from "./CustomInputError";
import { userApi } from "../api/userApi";
import styles from "../styles/AuthModal.module.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess?: () => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
    const [step, setStep] = useState<"PHONE" | "OTP" | "REGISTER">("PHONE");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [signupData, setSignupData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        dob: "",
        isWhatsappOptIn: false,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    if (!isOpen) return null;

    const formatPhoneNumber = (value: string) => {
        const digits = value.replace(/\D/g, "");
        const truncated = digits.slice(0, 10);
        if (truncated.length > 5) {
            return `${truncated.slice(0, 5)} ${truncated.slice(5)}`;
        }
        return truncated;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhoneNumber(e.target.value);
        setPhoneNumber(formatted);
        if (errors.phoneNumber) {
            setErrors((prev) => ({ ...prev, phoneNumber: "" }));
        }
    };

    const validateIndianMobile = (phone: string) => {
        const cleanPhone = phone.replace(/\s/g, "");
        return /^[6-9]\d{9}$/.test(cleanPhone);
    };

    const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setSignupData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleDateChange = (date: Date | null) => {
        setSignupData((prev) => ({
            ...prev,
            dob: date ? date.toISOString().split('T')[0] : "",
        }));
        if (errors.dob) {
            setErrors((prev) => ({ ...prev, dob: "" }));
        }
    };

    const validateRegistration = () => {
        const newErrors: Record<string, string> = {};
        if (!signupData.firstName.trim())
            newErrors.firstName = "First name is required";
        if (!signupData.lastName.trim())
            newErrors.lastName = "Last name is required";
        if (!signupData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email)) {
            newErrors.email = "Invalid email format";
        }
        if (!signupData.dob)
            newErrors.dob = "Date of birth is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const triggerOtp = async () => {
        const cleanPhone = phoneNumber.replace(/\s/g, "");
        if (!validateIndianMobile(cleanPhone)) {
            setErrors((prev) => ({
                ...prev,
                phoneNumber: "Please enter a valid 10-digit Indian mobile number",
            }));
            return;
        }

        try {
            await userApi.triggerOtp(cleanPhone);
            toast.success("OTP sent successfully");
            setStep("OTP");
            setErrors({});
        } catch (error) {
            console.error(error);
            toast.error("Error sending OTP");
        }
    };

    const verifyOtp = async () => {
        if (otp.length !== 6) {
            setErrors((prev) => ({
                ...prev,
                otp: "Please enter a valid 6-digit OTP",
            }));
            return;
        }

        const cleanPhone = phoneNumber.replace(/\s/g, "");
        try {
            const response = await userApi.verifyOtp(cleanPhone, otp);
            const data = response.data;

            if (!data.status) {
                setErrors((prev) => ({ ...prev, otp: data.message || "Invalid OTP" }));
                return;
            }

            if (data.data.code === "EXISTING_CUSTOMER") {
                Cookies.set("token", data.data.token, { expires: 7 });
                toast.success("Login successful");
                if (onLoginSuccess) {
                    onLoginSuccess();
                }
                onClose();
                resetState();
            } else if (data.data.code === "NEW_CUSTOMER") {
                setStep("REGISTER");
                toast.success("OTP verified. Please complete your profile.");
                setErrors({});
            }
        } catch (error) {
            console.error(error);
            toast.error("Error verifying OTP");
        }
    };

    const registerUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateRegistration()) return;

        const cleanPhone = phoneNumber.replace(/\s/g, "");

        try {
            const response = await userApi.register({
                ...signupData,
                mobileNumber: cleanPhone,
            });

            const data = response.data;
            if (data.status && data.data?.token) {
                Cookies.set("token", data.data.token, { expires: 7 });
            }

            toast.success("Registration successful");
            if (onLoginSuccess) {
                onLoginSuccess();
            }
            onClose();
            resetState();
        } catch (error) {
            console.error(error);
            toast.error("Registration failed");
        }
    };

    const resetState = () => {
        setStep("PHONE");
        setPhoneNumber("");
        setOtp("");
        setSignupData({
            firstName: "",
            lastName: "",
            email: "",
            dob: "",
            isWhatsappOptIn: false,
        });
        setErrors({});
    };

    const handleOtpChange = (otpValue: string) => {
        setOtp(otpValue);
        if (errors.otp) {
            setErrors((prev) => ({ ...prev, otp: "" }));
        }
    };

    return (
        <>
            <Toaster />
            {/* Overlay */}
            <div
                onClick={onClose}
                className={styles.overlay}
            />

            {/* Modal */}
            <div className={styles.modal}>
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className={styles.closeButton}
                >
                    &times;
                </button>

                {/* Logo */}
                <div className={styles.logoContainer}>
                    <Image
                        src="/Assets/logo.png"
                        alt="FutureNature Logo"
                        width={130}
                        height={65}
                        style={{ objectFit: "contain" }}
                    />
                </div>

                {/* Title */}
                <h2 className={styles.title}>
                    {step === "REGISTER" ? "Complete Profile" : "Login / Sign up"}
                </h2>

                {step === "PHONE" && (
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={handlePhoneChange}
                            placeholder="XXXXX XXXXX"
                            maxLength={11} // 10 digits + 1 space
                            className={`${styles.input} ${errors.phoneNumber ? styles.error : ""}`}
                        />
                        <CustomInputError message={errors.phoneNumber} />
                        <button
                            onClick={triggerOtp}
                            className={styles.submitButton}
                        >
                            Send OTP
                        </button>
                    </div>
                )}

                {step === "OTP" && (
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            Enter OTP sent to <b>{phoneNumber}</b>
                        </label>
                        <div className={styles.otpContainer}>
                            <OtpInput
                                value={otp}
                                onChange={handleOtpChange}
                                numInputs={6}
                                renderSeparator={<span style={{ width: "8px" }}></span>}
                                renderInput={(props) => (
                                    <input
                                        {...props}
                                        type="number"
                                        className={`${styles.otpInput} ${errors.otp ? styles.error : ""}`}
                                    />
                                )}
                            />
                            <CustomInputError message={errors.otp} />
                        </div>
                        <button
                            onClick={verifyOtp}
                            className={styles.submitButton}
                        >
                            Verify & Login
                        </button>
                        <p className={styles.changeNumberText}>
                            <button
                                onClick={() => setStep("PHONE")}
                                className={styles.changeNumberButton}
                            >
                                Change Number
                            </button>
                        </p>
                    </div>
                )}

                {step === "REGISTER" && (
                    <form onSubmit={registerUser}>
                        <div className={styles.registerForm}>
                            <div className={styles.nameRow}>
                                <div className={styles.nameField}>
                                    <label className={styles.label}>
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={signupData.firstName}
                                        onChange={handleSignupChange}
                                        placeholder="John"
                                        className={`${styles.registerInput} ${errors.firstName ? styles.error : ""}`}
                                    />
                                    <CustomInputError message={errors.firstName} />
                                </div>
                                <div className={styles.nameField}>
                                    <label className={styles.label}>
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={signupData.lastName}
                                        onChange={handleSignupChange}
                                        placeholder="Doe"
                                        className={`${styles.registerInput} ${errors.lastName ? styles.error : ""}`}
                                    />
                                    <CustomInputError message={errors.lastName} />
                                </div>
                            </div>

                            <div>
                                <label className={styles.label}>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={signupData.email}
                                    onChange={handleSignupChange}
                                    placeholder="john.doe@example.com"
                                    className={`${styles.registerInput} ${errors.email ? styles.error : ""}`}
                                />
                                <CustomInputError message={errors.email} />
                            </div>

                            <div>
                                <label className={styles.label}>
                                    Date of Birth
                                </label>
                                <div className={styles.datePickerWrapper} style={{
                                    width: "100%"
                                }}>
                                    <DatePicker
                                        selected={signupData.dob ? new Date(signupData.dob) : null}
                                        onChange={handleDateChange}
                                        dateFormat="dd/MM/yyyy"
                                        placeholderText="DD/MM/YYYY"

                                        maxDate={new Date()}
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        className={`${styles.registerInput} ${errors.dob ? styles.error : ""}`}

                                    />
                                </div>
                                <CustomInputError message={errors.dob} />
                            </div>

                            <div className={styles.optInContainer}>
                                <label className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        name="isWhatsappOptIn"
                                        checked={signupData.isWhatsappOptIn}
                                        onChange={handleSignupChange}
                                        className={styles.checkbox}
                                    />
                                    <span>Opt-in for WhatsApp Marketing & Updates</span>
                                </label>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            style={{ marginTop: "20px" }}
                        >
                            Complete Registration
                        </button>
                    </form>
                )}
            </div>
        </>
    );
}
