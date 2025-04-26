"use client";

import EbookViewer from "@/components/EbookViewer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-blue-700 text-white p-6 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">
            Visualizador de Markdown para PDF
          </h1>
          <p className="text-sm mt-2 opacity-90">
            Carregue qualquer arquivo markdown e converta para PDF
          </p>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <div className="bg-white rounded-xl shadow-2xl p-6 min-h-[80vh] border border-gray-100">
          <EbookViewer />
        </div>
      </main>

      <footer className="bg-gray-800 text-white p-4 mt-8">
        <div className="container mx-auto text-center">
          <p>
            &copy; {new Date().getFullYear()} Visualizador de Markdown para PDF
          </p>
          <p className="text-sm mt-2 text-gray-400">
            Criado com Next.js, React-PDF e Tailwind CSS - By{" "}
            <a
              href="https://github.com/PedroWesley"
              className="hover:text-gray-300"
            >
              Pedro Wesley
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
