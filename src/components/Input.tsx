import React from "react";
import styles from "@/styles/Input.module.scss";

interface InputProps {
    label: string;
    name: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    placeholder?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    autoComplete?: string;
}

export default function Input({
    label,
    name,
    type = "text",
    value,
    onChange,
    onBlur,
    placeholder,
    error,
    required = false,
    disabled = false,
    className = "",
    autoComplete,
}: InputProps) {
    return (
        <div className={`${styles.inputGroup} ${className}`}>
            <label htmlFor={name} className={styles.label}>
                {label}
                {required && <span className={styles.required}>*</span>}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                autoComplete={autoComplete}
                className={`${styles.input} ${error ? styles.error : ""}`}
            />
            {error && <span className={styles.errorText}>{error}</span>}
        </div>
    );
}
