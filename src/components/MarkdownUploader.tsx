import React, { useEffect, useRef, useState } from "react";

interface MarkdownUploaderProps {
  onFileUploaded: (file: File) => void;
  onReset?: () => void;
  className?: string;
}

const MarkdownUploader: React.FC<MarkdownUploaderProps> = ({
  onFileUploaded,
  onReset,
  className,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (
      file.name.toLowerCase().endsWith(".md") ||
      file.type === "text/markdown"
    ) {
      setFileName(file.name);
      onFileUploaded(file);
    } else {
      alert("Por favor, faça upload apenas de arquivos Markdown (.md)");
    }
  };

  const handleReset = () => {
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onReset) onReset();
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`w-full ${className || ""}`}>
      {!fileName ? (
        <div
          className={`border-2 border-dashed rounded-lg p-4 md:p-6 text-center transition-colors
                     ${
                       dragActive
                         ? "border-blue-500 bg-blue-50"
                         : "border-gray-300"
                     }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".md"
            onChange={handleChange}
            className="hidden"
          />

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`${
              isMobile ? "h-10 w-10" : "h-12 w-12"
            } mx-auto text-gray-400`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>

          <p className={`${isMobile ? "mt-3 text-sm" : "mt-4"} text-gray-600`}>
            {isMobile
              ? "Selecione um arquivo ou arraste aqui"
              : "Arraste e solte um arquivo Markdown aqui, ou"}
          </p>
          <button
            type="button"
            onClick={handleButtonClick}
            className={`${
              isMobile ? "mt-2 px-3 py-1.5 text-sm" : "mt-3 px-4 py-2"
            } bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium`}
          >
            Selecione um arquivo
          </button>
          <p className={`${isMobile ? "mt-2" : "mt-3"} text-xs text-gray-500`}>
            Apenas arquivos .md são aceitos
          </p>
        </div>
      ) : (
        <div className="border rounded-lg p-3 md:p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center max-w-[80%]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 md:h-6 md:w-6 text-green-500 mr-2 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-gray-800 font-medium text-sm md:text-base truncate">
                {fileName}
              </span>
            </div>
            <button
              onClick={handleReset}
              className="text-gray-500 hover:text-red-500 p-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarkdownUploader;
