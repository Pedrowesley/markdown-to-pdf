import { PDFViewer } from "@react-pdf/renderer";
import React, { useState } from "react";
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
          className="max-w-md"
        />
      </div>
    );
  }

  if (!hasUploadedFile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Carregue um arquivo Markdown para visualizá-lo como PDF
        </h2>
        <MarkdownUploader
          onFileUploaded={handleFileUpload}
          className="max-w-md"
        />
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${className || ""}`}>
      {/* Barra superior com título e ações */}
      <div className="flex justify-between items-center mb-4 p-4 bg-gradient-to-r from-blue-100 to-white rounded-lg shadow">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-600">
            Visualize e baixe o ebook em PDF
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center"
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
            Trocar arquivo
          </button>
          <DownloadPDF
            title={title}
            content={content}
            className="px-3 py-1.5 flex items-center"
          />
        </div>
      </div>

      {/* Visualizador de PDF */}
      <div className="w-full h-[calc(100vh-180px)] bg-gray-100 rounded-lg overflow-hidden shadow-inner">
        <PDFViewer style={{ width: "100%", height: "100%" }}>
          <PDFDocument title={title} content={content} author="" />
        </PDFViewer>
      </div>
    </div>
  );
};

export default EbookViewer;
