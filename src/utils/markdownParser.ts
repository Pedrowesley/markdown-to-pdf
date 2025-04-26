import { marked } from "marked";

// Interface para os itens de uma lista
interface ListItem {
  text?: string;
  tokens?: Array<{ type: string; text: string }>;
}

// Interface para o conteúdo processado
export interface ContentSection {
  type:
    | "section"
    | "subsection"
    | "subsubsection"
    | "paragraph"
    | "quote"
    | "list"
    | "divisor";
  content: string;
  items?: string[];
}

/**
 * Analisa um conteúdo markdown e o converte em um formato estruturado para o PDF
 * @param markdown Conteúdo markdown a ser analisado
 * @returns Array de seções formatadas para o componente PDF
 */
export function parseMarkdown(markdown: string): {
  title: string;
  content: ContentSection[];
} {
  const tokens = marked.lexer(markdown);
  const content: ContentSection[] = [];
  let title = "";

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    switch (token.type) {
      case "heading":
        // Extrair o título principal do documento
        if (token.depth === 1 && !title) {
          title = token.text;
        }
        // Seções e subseções
        else if (token.depth === 2) {
          content.push({
            type: "section",
            content: token.text,
          });
        } else if (token.depth === 3) {
          content.push({
            type: "subsection",
            content: token.text,
          });
        } else if (token.depth === 4) {
          content.push({
            type: "subsubsection",
            content: token.text,
          });
        }
        break;

      case "paragraph":
        content.push({
          type: "paragraph",
          content: token.text,
        });
        break;

      case "blockquote":
        if ("text" in token) {
          content.push({
            type: "quote",
            content: token.text,
          });
        }
        break;

      case "list":
        const items = token.items.map((item: ListItem) => {
          // Simplificar para extrair apenas o texto sem formatação
          if (item.text) {
            return item.text;
          } else if (item.tokens) {
            const textTokens = item.tokens.filter((t) => t.type === "text");
            return textTokens.map((t) => t.text).join(" ");
          }
          return "";
        });

        content.push({
          type: "list",
          content: "",
          items,
        });
        break;

      case "hr":
        content.push({
          type: "divisor",
          content: "",
        });
        break;

      default:
        // Ignorar outros tipos de tokens
        break;
    }
  }

  return { title, content };
}

/**
 * Divide o conteúdo em páginas para melhorar a renderização do PDF
 * @param content Array de seções de conteúdo
 * @param itemsPerPage Número aproximado de itens por página
 * @returns Array de arrays, onde cada array interno representa uma página
 */
export function paginateContent(
  content: ContentSection[],
  itemsPerPage: number = 20
): ContentSection[][] {
  const pages: ContentSection[][] = [];
  let currentPage: ContentSection[] = [];
  let itemCount = 0;

  for (const section of content) {
    // Inicia uma nova seção sempre no início de uma página
    if (section.type === "section" && itemCount > 0) {
      pages.push([...currentPage]);
      currentPage = [];
      itemCount = 0;
    }

    currentPage.push(section);
    itemCount++;

    // Verificar se é hora de iniciar uma nova página
    if (itemCount >= itemsPerPage && section.type !== "subsection") {
      pages.push([...currentPage]);
      currentPage = [];
      itemCount = 0;
    }
  }

  // Adicionar a última página se houver conteúdo restante
  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return pages;
}

/**
 * Carrega o conteúdo do markdown a partir de um arquivo ou string
 * @param markdownPath Caminho para o arquivo markdown ou conteúdo markdown direto
 * @returns Promise com o resultado do parsing
 */
export async function loadMarkdownContent(markdownContent: string) {
  try {
    return parseMarkdown(markdownContent);
  } catch (error) {
    console.error("Erro ao processar o markdown:", error);
    throw error;
  }
}
