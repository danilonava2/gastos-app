import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import type { Expense } from '../types';
import { formatCurrency } from './format';
import { LOGO_BASE64 } from './logoBase64';

export interface ReportMeta {
  userName: string;
  userEmail: string;
  startDate: string;
  endDate: string;
}

interface CategoryTotal {
  category: string;
  amount: number;
  pct: number;
}

function buildCategoryTotals(expenses: Expense[]): { totals: CategoryTotal[]; grandTotal: number } {
  const map = new Map<string, number>();
  for (const e of expenses) map.set(e.category, (map.get(e.category) ?? 0) + e.amount);
  const grandTotal = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totals = Array.from(map.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      pct: grandTotal > 0 ? (amount / grandTotal) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
  return { totals, grandTotal };
}

export function generatePdfReport(expenses: Expense[], meta: ReportMeta) {
  const { totals, grandTotal } = buildCategoryTotals(expenses);
  const sorted = [...expenses].sort((a, b) => a.date.localeCompare(b.date));

  const doc = new jsPDF();

  doc.addImage(LOGO_BASE64, 'PNG', 14, 10, 16, 16);
  doc.setFontSize(18);
  doc.setTextColor(15, 76, 92);
  doc.text('Informe de Gastos', 36, 20);

  doc.setFontSize(10);
  doc.setTextColor(80);
  doc.text(`Usuario: ${meta.userName} (${meta.userEmail})`, 14, 34);
  doc.text(`Período: ${meta.startDate} a ${meta.endDate}`, 14, 40);
  doc.text(`Generado: ${new Date().toLocaleString('es-AR')}`, 14, 46);

  autoTable(doc, {
    startY: 54,
    head: [['Categoría', 'Monto', '% del total']],
    body: totals.map((t) => [t.category, formatCurrency(t.amount), `${t.pct.toFixed(1)}%`]),
    foot: [['Total', formatCurrency(grandTotal), '100%']],
    headStyles: { fillColor: [15, 76, 92] },
    footStyles: { fillColor: [230, 230, 230], textColor: 20, fontStyle: 'bold' },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const afterSummaryY = (doc as any).lastAutoTable.finalY + 12;

  doc.setFontSize(12);
  doc.setTextColor(15, 76, 92);
  doc.text('Detalle de movimientos', 14, afterSummaryY);

  autoTable(doc, {
    startY: afterSummaryY + 6,
    head: [['Fecha', 'Categoría', 'Nota', 'Monto']],
    body: sorted.map((e) => [e.date, e.category, e.note || '-', formatCurrency(e.amount)]),
    headStyles: { fillColor: [15, 76, 92] },
    styles: { fontSize: 9 },
  });

  doc.save(`gastos_${meta.startDate}_${meta.endDate}.pdf`);
}

export function generateExcelReport(expenses: Expense[], meta: ReportMeta) {
  const { totals, grandTotal } = buildCategoryTotals(expenses);
  const sorted = [...expenses].sort((a, b) => a.date.localeCompare(b.date));

  const summarySheet = XLSX.utils.aoa_to_sheet([
    ['Informe de Gastos'],
    ['Usuario', `${meta.userName} (${meta.userEmail})`],
    ['Período', `${meta.startDate} a ${meta.endDate}`],
    ['Generado', new Date().toLocaleString('es-AR')],
    [],
    ['Categoría', 'Monto', '% del total'],
    ...totals.map((t) => [t.category, t.amount, `${t.pct.toFixed(1)}%`]),
    ['Total', grandTotal, '100%'],
  ]);

  const detailSheet = XLSX.utils.aoa_to_sheet([
    ['Fecha', 'Categoría', 'Nota', 'Monto'],
    ...sorted.map((e) => [e.date, e.category, e.note, e.amount]),
  ]);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, summarySheet, 'Resumen');
  XLSX.utils.book_append_sheet(wb, detailSheet, 'Detalle');

  XLSX.writeFile(wb, `gastos_${meta.startDate}_${meta.endDate}.xlsx`);
}
