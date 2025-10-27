import React from "react";
import { useDownload } from "../context/DownloadContext";

const GlobalDownloadPopup = () => {
  const { 
    showDownloadPopup, 
    downloadProgress, 
    downloadType, 
    downloadMessage, 
    cancelDownload 
  } = useDownload();

  if (!showDownloadPopup) return null;

  const getDownloadTitle = () => {
    switch (downloadType) {
      case "relatorio":
        return "📄 Gerando Relatório";
      default:
        return "📄 Gerando Download";
    }
  };

  const getStatusMessage = () => {
    if (downloadProgress === 100) {
      return "✅ Concluído!";
    }
    
    // Se há uma mensagem específica, usar ela
    if (downloadMessage && downloadMessage.trim()) {
      return downloadMessage;
    }
    
    return `Progresso: ${downloadProgress}%`;
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "20px",
        width: "320px",
        backgroundColor: "white",
        border: "1px solid #dee2e6",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        zIndex: 9999, // Z-index muito alto para ficar acima de tudo
        padding: "16px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h6 className="mb-0" style={{ fontSize: "14px", fontWeight: "600" }}>
          {getDownloadTitle()}
        </h6>
        <button
          onClick={cancelDownload}
          style={{
            background: "none",
            border: "none",
            fontSize: "18px",
            cursor: "pointer",
            color: "#6c757d",
            padding: "0",
            width: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title="Cancelar"
        >
          ×
        </button>
      </div>

      <div className="mb-2">
        <div
          style={{
            fontSize: "12px",
            color: "#6c757d",
            marginBottom: "8px",
          }}
        >
          {getStatusMessage()}
        </div>
        <div
          style={{
            width: "100%",
            height: "6px",
            backgroundColor: "#e9ecef",
            borderRadius: "3px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${downloadProgress}%`,
              height: "100%",
              backgroundColor: downloadProgress === 100 ? "#28a745" : "#007bff",
              transition: "width 0.3s ease, background-color 0.3s ease",
            }}
          />
        </div>
      </div>

      <div className="d-flex justify-content-end">
        <button
          onClick={cancelDownload}
          className="btn btn-sm btn-outline-secondary"
          style={{ fontSize: "12px" }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default GlobalDownloadPopup;
