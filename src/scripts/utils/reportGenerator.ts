import { jsPDF } from "jspdf";
import type { ECharts } from "echarts";

interface ReportData {
  carteiraNome: string;
  tipo: string;
  dataInicial: string;
  dataFinal: string;
  chartInstance?: ECharts | null;
}

export function generateClientPdf(data: ReportData): string {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(30, 41, 59);
  doc.text("Relatório de Investimentos", 15, 20);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Carteira: ${data.carteiraNome}`, 15, 30);
  doc.text(`Período: ${data.dataInicial} até ${data.dataFinal}`, 15, 36);
  doc.text(`Tipo: ${data.tipo.replace("chart_", "Gráfico de ").toUpperCase()}`, 15, 42);

  doc.setDrawColor(226, 232, 240);
  doc.line(15, 48, 195, 48);

  if (data.tipo.startsWith("chart_") && data.chartInstance) {
    try {
      const imgData = data.chartInstance.getDataURL({
        type: "png",
        pixelRatio: 2,
        backgroundColor: "#1e293b", 
      });

      doc.addImage(imgData, "PNG", 15, 55, 180, 100);
    } catch (error) {
      console.error("Falha ao renderizar imagem do gráfico no PDF:", error);
      doc.text("Erro ao renderizar imagem do gráfico.", 15, 60);
    }
  } else {
    doc.text("Dados tabulares detalhados não implementados localmente.", 15, 60);
  }

  const pdfBlob = doc.output("blob");
  return URL.createObjectURL(pdfBlob);
}