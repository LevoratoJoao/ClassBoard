import React, { createContext, useContext, useState } from "react";
import { handleDownloadRelatorio } from "../utils/handleDownloadRelatorio";

const DownloadContext = createContext();

export const useDownload = () => {
  const context = useContext(DownloadContext);
  if (!context) {
    throw new Error("useDownload deve ser usado dentro de um DownloadProvider");
  }
  return context;
};

export const DownloadProvider = ({ children }) => {
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadType, setDownloadType] = useState("relatorio");

  // Função de download com pop-up global
  const startDownload = async (type = "relatorio") => {
    if (isDownloading) return;

    setDownloadType(type);
    setIsDownloading(true);
    setShowDownloadPopup(true);
    setDownloadProgress(0);

    try {
      // Simular progresso de download
      const progressInterval = setInterval(() => {
        setDownloadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Executar download baseado no tipo
      if (type === "relatorio") {
        await handleDownloadRelatorio();
      }

      // Finalizar progresso
      clearInterval(progressInterval);
      setDownloadProgress(100);

      // Mostrar sucesso por um momento antes de fechar
      setTimeout(() => {
        setShowDownloadPopup(false);
        setIsDownloading(false);
        setDownloadProgress(0);
      }, 1500);
    } catch (error) {
      setShowDownloadPopup(false);
      setIsDownloading(false);
      setDownloadProgress(0);
      throw error; // Repassar erro para que o componente possa tratar
    }
  };

  // Função para cancelar download
  const cancelDownload = () => {
    setShowDownloadPopup(false);
    setIsDownloading(false);
    setDownloadProgress(0);
  };

  const value = {
    showDownloadPopup,
    downloadProgress,
    isDownloading,
    downloadType,
    startDownload,
    cancelDownload,
  };

  return (
    <DownloadContext.Provider value={value}>
      {children}
    </DownloadContext.Provider>
  );
};
