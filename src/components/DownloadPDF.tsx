import { ContentSection } from "@/utils/markdownParser";
import { PDFDownloadLink } from "@react-pdf/renderer";
import React, { useEffect, useState } from "react";
import PDFDocument from "./PDFDocument";

interface DownloadPDFProps {
  title: string;
  content: ContentSection[];
  author?: string;
  className?: string;
}

const DownloadPDF: React.FC<DownloadPDFProps> = ({
  title,
  content,
  author = "Autor do Ebook",
  className,
}) => {
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

  // Nome do arquivo baixado formatado com base no título
  const fileName =
    title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]/g, "") + ".pdf";

  return (
    <PDFDownloadLink
      document={<PDFDocument title={title} content={content} author={author} />}
      fileName={fileName}
      className={`inline-flex items-center justify-center 
                 ${isMobile ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-sm"} 
                 border border-transparent font-medium rounded-md 
                 text-white bg-blue-600 hover:bg-blue-700 focus:outline-none 
                 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors
                 ${className || ""}`}
    >
      {({ loading }) =>
        loading ? (
          <span className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {isMobile ? "Preparando..." : "Preparando documento..."}
          </span>
        ) : (
          <span className="flex items-center">
            <svg
              className="mr-1.5 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            {isMobile ? "Baixar" : "Baixar PDF"}
          </span>
        )
      }
    </PDFDownloadLink>
  );
};

export default DownloadPDF;
