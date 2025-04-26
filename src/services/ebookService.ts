/**
 * Processa o conteúdo de um arquivo markdown enviado pelo usuário
 * @param file Arquivo markdown enviado pelo usuário
 * @returns Promise com o conteúdo do markdown
 */
export async function processUploadedMarkdown(file: File): Promise<string> {
  try {
    return await file.text();
  } catch (error) {
    console.error("Erro ao processar o arquivo:", error);
    throw new Error(
      "Não foi possível processar o arquivo. Verifique se é um arquivo markdown válido."
    );
  }
}

/**
 * Carrega o conteúdo de um arquivo markdown de exemplo
 * Mantido para compatibilidade, mas agora o foco é no upload de arquivos
 * @returns Promise com o conteúdo do markdown
 */
export async function loadEbookContent(): Promise<string> {
  try {
    const response = await fetch("/caminhos-de-intimidade-70-formas.md");
    if (!response.ok) {
      throw new Error(`Erro ao carregar o arquivo: ${response.status}`);
    }

    const markdownContent = await response.text();
    return markdownContent;
  } catch (error) {
    console.error("Erro ao carregar o ebook:", error);
    throw error;
  }
}
