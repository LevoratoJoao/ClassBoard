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
  const [downloadMessage, setDownloadMessage] = useState("");

  // Função de download com pop-up global
  const startDownload = async (type = "relatorio") => {
    if (isDownloading) return;

    setDownloadType(type);
    setIsDownloading(true);
    setShowDownloadPopup(true);
    setDownloadProgress(0);
    setDownloadMessage("Iniciando download...");

    try {
      // Executar download baseado no tipo
      if (type === "relatorio") {
        await handleDownloadRelatorio((message) => {
          setDownloadMessage(message);
          
          // Atualizar progresso baseado na mensagem
          if (message.includes("Carregando dados")) {
            setDownloadProgress(10);
          } else if (message.includes("análises de IA para matérias")) {
            setDownloadProgress(20);
          } else if (message.includes("Analisando") && message.includes("matérias")) {
            setDownloadProgress(30);
          } else if (message.includes("análises de IA para alunos")) {
            setDownloadProgress(50);
          } else if (message.includes("Analisando") && message.includes("alunos")) {
            setDownloadProgress(60);
          } else if (message.includes("estatísticas")) {
            setDownloadProgress(70);
          } else if (message.includes("gráficos")) {
            setDownloadProgress(80);
          } else if (message.includes("documento PDF")) {
            setDownloadProgress(85);
          } else if (message.includes("análise geral")) {
            setDownloadProgress(90);
          } else if (message.includes("Finalizando")) {
            setDownloadProgress(95);
          } else if (message.includes("sucesso")) {
            setDownloadProgress(100);
          }
        });
      }

      // Finalizar progresso
      setDownloadProgress(100);
      setDownloadMessage("Download concluído com sucesso!");

      // Mostrar sucesso por um momento antes de fechar
      setTimeout(() => {
        setShowDownloadPopup(false);
        setIsDownloading(false);
        setDownloadProgress(0);
        setDownloadMessage("");
      }, 1500);
    } catch (error) {
      setShowDownloadPopup(false);
      setIsDownloading(false);
      setDownloadProgress(0);
      setDownloadMessage("");
      throw error; // Repassar erro para que o componente possa tratar
    }
  };

  // Função para cancelar download
  const cancelDownload = () => {
    setShowDownloadPopup(false);
    setIsDownloading(false);
    setDownloadProgress(0);
    setDownloadMessage("");
  };

  const value = {
    showDownloadPopup,
    downloadProgress,
    isDownloading,
    downloadType,
    downloadMessage,
    startDownload,
    cancelDownload,
  };

  return (
    <DownloadContext.Provider value={value}>
      {children}
    </DownloadContext.Provider>
  );
};
