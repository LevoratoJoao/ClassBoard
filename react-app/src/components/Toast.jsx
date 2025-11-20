import React, { useState, useEffect } from "react";

const Toast = ({ show, message, type = "success", onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const bgColor = type === "success" ? "bg-success" : "bg-danger";

  return (
    <div
      className="position-fixed top-0 start-50 translate-middle-x"
      style={{ zIndex: 1055, marginTop: "20px" }}
    >
      <div className={`toast show ${bgColor} text-white`}>
        <div className="toast-body d-flex justify-content-between align-items-center">
          <span>{message}</span>
          <button
            type="button"
            className="btn-close btn-close-white"
            onClick={onClose}
          ></button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
