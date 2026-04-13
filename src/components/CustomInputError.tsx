import React from "react";

interface CustomInputErrorProps {
  message?: string;
}

const CustomInputError: React.FC<CustomInputErrorProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div
      style={{
        color: "#ef4444", // Red-500
        fontSize: "12px",
        marginTop: "4px",
        fontWeight: "500",
        display: "flex",
        alignItems: "center",
        gap: "4px",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        style={{ width: "12px", height: "12px" }}
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      {message}
    </div>
  );
};

export default CustomInputError;
