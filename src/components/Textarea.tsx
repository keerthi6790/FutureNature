import React from "react";
import styles from "@/styles/Input.module.scss";

interface TextareaProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    rows?: number;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
}

export default function Textarea({
    label,
    name,
    value,
    onChange,
    onBlur,
    placeholder,
    rows = 4,
    error,
    required = false,
    disabled = false,
    className = "",
}: TextareaProps) {
    return (
        <div className={`${styles.inputGroup} ${className}`}>
            <label htmlFor={name} className={styles.label}>
                {label}
                {required && <span className={styles.required}>*</span>}
            </label>
            <textarea
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                rows={rows}
                disabled={disabled}
                required={required}
                className={`${styles.textarea} ${error ? styles.error : ""}`}
            />
            {error && <span className={styles.errorText}>{error}</span>}
        </div>
    );
}
