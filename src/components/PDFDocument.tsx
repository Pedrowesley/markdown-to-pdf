import { paginateContent } from "@/utils/markdownParser";
import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import React from "react";

// Definindo as fontes personalizadas
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
      fontWeight: "normal",
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: "bold",
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-italic-webfont.ttf",
      fontStyle: "italic",
    },
  ],
});

// Definindo estilos para o documento
const styles = StyleSheet.create({
  page: {
    padding: 50,
    paddingTop: 60,
    paddingBottom: 60,
    backgroundColor: "#FFFFFF",
    fontFamily: "Roboto",
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  subtitle: {
    fontSize: 18,
    marginTop: 15,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#444",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 5,
  },
  subsubtitle: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 8,
    fontWeight: "bold",
    color: "#555",
  },
  text: {
    fontSize: 12,
    marginBottom: 8,
    lineHeight: 1.6,
    textAlign: "justify",
  },
  quote: {
    fontSize: 12,
    marginVertical: 12,
    paddingLeft: 12,
    paddingRight: 10,
    paddingVertical: 5,
    borderLeftWidth: 3,
    borderLeftColor: "#999",
    fontStyle: "italic",
    color: "#555",
    backgroundColor: "#f9f9f9",
  },
  list: {
    marginLeft: 15,
    marginBottom: 10,
  },
  listItem: {
    fontSize: 12,
    marginBottom: 5,
    lineHeight: 1.5,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 10,
    color: "#666",
  },
  header: {
    position: "absolute",
    top: 30,
    left: 50,
    right: 50,
    textAlign: "center",
    fontSize: 10,
    color: "#666",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 5,
  },
  divisor: {
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
    marginVertical: 15,
  },
  pageNumber: {
    position: "absolute",
    bottom: 30,
    right: 50,
    fontSize: 10,
    color: "#666",
  },
  coverImage: {
    width: 300,
    height: 300,
    marginBottom: 20,
    alignSelf: "center",
  },
  coverTitle: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    color: "#222",
    marginBottom: 20,
  },
  coverSubtitle: {
    fontSize: 18,
    textAlign: "center",
    color: "#555",
    marginBottom: 40,
    fontStyle: "italic",
  },
  coverAuthor: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginTop: 40,
  },
  contentHeader: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#444",
  },
  tocItem: {
    fontSize: 12,
    marginBottom: 5,
    lineHeight: 1.5,
    textDecoration: "none",
    color: "#444",
  },
});

// Tipos para o conteúdo
interface ContentSection {
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

interface PDFDocumentProps {
  title: string;
  author?: string;
  content: ContentSection[];
}

// Componente de cabeçalho e rodapé fixos
const PageHeader = ({ title }: { title: string }) => (
  <View style={styles.header} fixed>
    <Text>{title}</Text>
  </View>
);

const PageFooter = () => (
  <Text
    style={styles.pageNumber}
    render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
    fixed
  />
);

// Componente principal do documento PDF
const PDFDocument: React.FC<PDFDocumentProps> = ({
  title,
  author,
  content,
}) => {
  // Dividimos o conteúdo em páginas menores para melhor renderização
  const paginatedContent = paginateContent(content, 25);

  // Filtramos seções para o sumário
  const tocItems = content.filter((item) =>
    ["section", "subsection", "subsubsection"].includes(item.type)
  );

  return (
    <Document>
      {/* Capa do livro */}
      <Page size="A4" style={styles.page}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={styles.coverTitle}>{title}</Text>
          <Text style={styles.coverSubtitle}>
            Um guia para aprofundar sua fé
          </Text>
          {author && <Text style={styles.coverAuthor}>Por: {author}</Text>}
        </View>
        <PageFooter />
      </Page>

      {/* Sumário */}
      <Page size="A4" style={styles.page}>
        <PageHeader title={title} />
        <Text style={styles.contentHeader}>Sumário</Text>
        <View style={styles.divisor} />

        {tocItems.map((item, index) => {
          let marginLeft = 0;
          if (item.type === "subsection") marginLeft = 15;
          if (item.type === "subsubsection") marginLeft = 30;

          return (
            <Text key={`toc-${index}`} style={[styles.tocItem, { marginLeft }]}>
              {item.content}
            </Text>
          );
        })}

        <PageFooter />
      </Page>

      {/* Páginas de conteúdo */}
      {paginatedContent.map((pageContent, pageIndex) => (
        <Page key={`page-${pageIndex}`} size="A4" style={styles.page}>
          <PageHeader title={title} />

          {pageIndex === 0 && <Text style={styles.title}>{title}</Text>}

          {pageContent.map((section, sectionIndex) => {
            const key = `${pageIndex}-${sectionIndex}`;

            switch (section.type) {
              case "section":
                return (
                  <View key={key} style={styles.section}>
                    <Text style={styles.subtitle}>{section.content}</Text>
                  </View>
                );
              case "subsection":
                return (
                  <View key={key} style={styles.section}>
                    <Text style={styles.subsubtitle}>{section.content}</Text>
                  </View>
                );
              case "subsubsection":
                return (
                  <View key={key} style={styles.section}>
                    <Text style={[styles.subsubtitle, { fontSize: 14 }]}>
                      {section.content}
                    </Text>
                  </View>
                );
              case "paragraph":
                return (
                  <Text key={key} style={styles.text}>
                    {section.content}
                  </Text>
                );
              case "quote":
                return (
                  <Text key={key} style={styles.quote}>
                    {section.content}
                  </Text>
                );
              case "list":
                return (
                  <View key={key} style={styles.list}>
                    {section.items?.map((item, itemIndex) => (
                      <Text
                        key={`item-${key}-${itemIndex}`}
                        style={styles.listItem}
                      >
                        • {item}
                      </Text>
                    ))}
                  </View>
                );
              case "divisor":
                return <View key={key} style={styles.divisor} />;
              default:
                return null;
            }
          })}

          <PageFooter />
        </Page>
      ))}
    </Document>
  );
};

export default PDFDocument;
