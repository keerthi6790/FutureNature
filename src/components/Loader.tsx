import React from "react";

const Loader = () => {
    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(4px)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999,
                transition: "opacity 0.3s ease-in-out",
            }}
        >
            <div className="loader-container">
                <div className="honey-spinner"></div>
                <style jsx>{`
          .loader-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }
          .honey-spinner {
            width: 60px;
            height: 60px;
            border: 4px solid #f3f4f6;
            border-top: 4px solid #f59e0b;
            border-radius: 50%;
            animation: spin 1s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
            box-shadow: 0 0 15px rgba(245, 158, 11, 0.3);
          }
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
            </div>
        </div>
    );
};

export default Loader;
