import { jsPDF } from "jspdf";
import type { ECharts } from "echarts";

export interface DividendReportItem {
  DataPagamento: string;
  ValorPagamento: number | string;
  Quantidade: number | string;
  Ticker: string;
  Descricao: string;
}

export interface ReportData {
  carteiraNome: string;
  tipo: string;
  dataInicial: string;
  dataFinal: string;
  chartInstance?: ECharts | null;
  dividendosAcoes?: DividendReportItem[];
  dividendosFii?: DividendReportItem[];
}

export function generateClientPdf(data: ReportData): string {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const acoes = data.dividendosAcoes || [];
  const fiis = data.dividendosFii || [];
  const itens = [...acoes, ...fiis];
  const totalAcoes = totalValue(acoes);
  const totalFiis = totalValue(fiis);
  const totalGeral = totalAcoes + totalFiis;

  drawHeader(doc, data);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text("Resumo do período", 15, 61);

  drawMetricCard(doc, 15, 67, 42, "Total recebido", formatCurrency(totalGeral), "#2563eb");
  drawMetricCard(doc, 61, 67, 42, "Ações", formatCurrency(totalAcoes), "#0f766e");
  drawMetricCard(doc, 107, 67, 42, "FIIs", formatCurrency(totalFiis), "#7c3aed");
  drawMetricCard(doc, 153, 67, 42, "Lançamentos", String(itens.length), "#475569");

  let nextY = 119;
  if (data.tipo.startsWith("chart_") && data.chartInstance) {
    try {
      const imgData = data.chartInstance.getDataURL({
        type: "png",
        pixelRatio: 2,
        backgroundColor: "#0f172a",
      });

      doc.setFillColor(15, 23, 42);
      doc.roundedRect(15, nextY, 180, 82, 3, 3, "F");
      doc.addImage(imgData, "PNG", 18, nextY + 3, 174, 76);
      nextY += 92;
    } catch (error) {
      console.error("Falha ao renderizar imagem do gráfico no PDF:", error);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(185, 28, 28);
      doc.text("Não foi possível renderizar o gráfico.", 15, nextY);
      nextY += 12;
    }
  }

  if (itens.length > 0) {
    nextY = drawDividendTable(doc, nextY, "Detalhamento de dividendos", itens);
  } else {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text("Nenhum dividendo encontrado no período selecionado.", 15, nextY);
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Gerado pelo DiviSmart em ${new Date().toLocaleDateString("pt-BR")}`,
    15,
    288,
  );

  const pdfBlob = doc.output("blob");
  return URL.createObjectURL(pdfBlob);
}

function drawHeader(doc: jsPDF, data: ReportData) {
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 50, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(21);
  doc.setTextColor(248, 250, 252);
  doc.text("Relatório de Investimentos", 15, 20);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(203, 213, 225);
  doc.text("Análise consolidada de proventos da carteira", 15, 28);
  doc.setFontSize(11);
  doc.setTextColor(248, 250, 252);
  doc.text(data.carteiraNome, 195, 19, { align: "right" });
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225);
  doc.text(`${formatDate(data.dataInicial)} a ${formatDate(data.dataFinal)}`, 195, 27, {
    align: "right",
  });
  doc.text(reportType(data.tipo), 195, 35, { align: "right" });
}

function drawMetricCard(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  label: string,
  value: string,
  color: string,
) {
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(x, y, width, 38, 2, 2, "FD");
  doc.setFillColor(color);
  doc.roundedRect(x, y, 2.5, 38, 1, 1, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(label, x + 6, y + 10);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(value.length > 14 ? 9 : 11);
  doc.setTextColor(30, 41, 59);
  doc.text(value, x + 6, y + 25);
}

function drawDividendTable(
  doc: jsPDF,
  startY: number,
  title: string,
  items: DividendReportItem[],
) {
  let y = startY;
  if (y > 254) {
    doc.addPage();
    y = 20;
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text(title, 15, y);
  y += 7;
  drawTableHeader(doc, y);
  y += 8;

  items.forEach((item) => {
    if (y > 274) {
      doc.addPage();
      y = 20;
      drawTableHeader(doc, y);
      y += 8;
    }
    if (Math.round(y) % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(15, y - 5, 180, 8, "F");
    }
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    doc.text(formatDate(item.DataPagamento), 17, y);
    doc.text(item.Ticker || "-", 49, y);
    doc.text((item.Descricao || "-").slice(0, 36), 74, y);
    doc.text(String(item.Quantidade), 143, y, { align: "right" });
    doc.text(formatCurrency(itemValue(item)), 193, y, { align: "right" });
    y += 8;
  });
  return y + 3;
}

function drawTableHeader(doc: jsPDF, y: number) {
  doc.setFillColor(226, 232, 240);
  doc.rect(15, y - 5, 180, 9, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  doc.text("DATA", 17, y);
  doc.text("ATIVO", 49, y);
  doc.text("DESCRIÇÃO", 74, y);
  doc.text("QTD.", 143, y, { align: "right" });
  doc.text("TOTAL", 193, y, { align: "right" });
}

function itemValue(item: DividendReportItem) {
  return Number(item.ValorPagamento || 0) * Number(item.Quantidade || 0);
}

function totalValue(items: DividendReportItem[]) {
  return items.reduce((total, item) => total + itemValue(item), 0);
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(value: string) {
  if (!value) return "-";
  const [year, month, day] = value.slice(0, 10).split("-");
  return year && month && day ? `${day}/${month}/${year}` : value;
}

function reportType(type: string) {
  return type.replace("chart_", "Gráfico de ").replace(/_/g, " ").toUpperCase();
}