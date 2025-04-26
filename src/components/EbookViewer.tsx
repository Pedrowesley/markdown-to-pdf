import { PDFViewer } from "@react-pdf/renderer";
import React, { useEffect, useState } from "react";
import { processUploadedMarkdown } from "../services/ebookService";
import { ContentSection, loadMarkdownContent } from "../utils/markdownParser";
import DownloadPDF from "./DownloadPDF";
import MarkdownUploader from "./MarkdownUploader";
import PDFDocument from "./PDFDocument";

interface EbookViewerProps {
  className?: string;
}

const EbookViewer: React.FC<EbookViewerProps> = ({ className }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<ContentSection[]>([]);
  const [hasUploadedFile, setHasUploadedFile] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar se é um dispositivo móvel
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Verificar inicialmente
    checkIfMobile();

    // Adicionar listener para redimensionamento de tela
    window.addEventListener("resize", checkIfMobile);

    // Limpar listener ao desmontar
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const handleFileUpload = async (file: File) => {
    try {
      setLoading(true);
      setError(null);

      const markdownText = await processUploadedMarkdown(file);
      const { title, content } = await loadMarkdownContent(markdownText);

      setTitle(title || file.name.replace(/\.md$/, ""));
      setContent(content);
      setHasUploadedFile(true);
      setLoading(false);
    } catch (err) {
      console.error("Erro ao processar arquivo:", err);
      setError(
        "Não foi possível processar o arquivo. Verifique se é um arquivo markdown válido."
      );
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTitle("");
    setContent([]);
    setHasUploadedFile(false);
    setError(null);
  };

  // Render estados de carregamento e erro
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Processando arquivo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        <div className="text-center text-red-500 mb-6">
          <p>{error}</p>
        </div>
        <MarkdownUploader
          onFileUploaded={handleFileUpload}
          className="max-w-md w-full px-4"
        />
      </div>
    );
  }

  if (!hasUploadedFile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] px-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          Carregue um arquivo Markdown para visualizá-lo como PDF
        </h2>
        <MarkdownUploader
          onFileUploaded={handleFileUpload}
          className="max-w-md w-full"
        />
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${className || ""}`}>
      {/* Barra superior com título e ações - adaptada para mobile */}
      <div
        className={`mb-4 p-4 bg-gradient-to-r from-blue-100 to-white rounded-lg shadow ${
          isMobile
            ? "flex flex-col space-y-3"
            : "flex justify-between items-center"
        }`}
      >
        <div className={`${isMobile ? "w-full" : ""}`}>
          <h2 className="text-xl font-semibold text-gray-800 break-words">
            {title}
          </h2>
          <p className="text-sm text-gray-600">
            Visualize e baixe o arquivo em PDF
          </p>
        </div>
        <div
          className={`${
            isMobile ? "w-full flex justify-between" : "flex space-x-3"
          }`}
        >
          <button
            onClick={handleReset}
            className={`px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center ${
              isMobile ? "flex-1 justify-center mr-2" : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {isMobile ? "Trocar" : "Trocar arquivo"}
          </button>
          <DownloadPDF
            title={title}
            content={content}
            className={`px-3 py-1.5 flex items-center ${
              isMobile ? "flex-1 justify-center" : ""
            }`}
          />
        </div>
      </div>

      {/* Em dispositivos móveis, mostrar apenas mensagem e botão de download */}
      {isMobile ? (
        <div className="w-full bg-gray-100 rounded-lg overflow-hidden shadow-inner p-6 text-center">
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-blue-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Pré-visualização não disponível
            </h3>
            <p className="text-gray-600 mb-6 max-w-md">
              Em dispositivos móveis, a pré-visualização do PDF não está
              disponível. Use o botão abaixo para baixar o arquivo e
              visualizá-lo no seu aplicativo de PDF.
            </p>
            <DownloadPDF
              title={title}
              content={content}
              className="px-6 py-2.5 text-base"
            />
          </div>
        </div>
      ) : (
        <div className="w-full h-[calc(100vh-220px)] md:h-[calc(100vh-180px)] bg-gray-100 rounded-lg overflow-hidden shadow-inner">
          <PDFViewer style={{ width: "100%", height: "100%" }}>
            <PDFDocument title={title} content={content} author="" />
          </PDFViewer>
        </div>
      )}
    </div>
  );
};

export default EbookViewer;
