import { ContentSection } from "@/utils/markdownParser";
import { PDFDownloadLink } from "@react-pdf/renderer";
import React from "react";
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
      className={`inline-flex items-center justify-center px-4 py-2 
                 border border-transparent text-sm font-medium rounded-md 
                 text-white bg-blue-600 hover:bg-blue-700 focus:outline-none 
                 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors
                 ${className || ""}`}
    >
      {({ loading }) => (loading ? "Preparando documento..." : "Baixar PDF")}
    </PDFDownloadLink>
  );
};

export default DownloadPDF;
