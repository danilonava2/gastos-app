import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as ExcelJS from 'exceljs';
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

const CURRENCY_FORMAT = '"$"#,##0';
const PERCENT_FORMAT = '0.0%';
const BRAND_COLOR = 'FF17798C';
const STRIPE_COLOR = 'FFF0F4F5';
const WHITE = 'FFFFFFFF';

function styleHeaderRow(row: ExcelJS.Row) {
  row.eachCell((cell: ExcelJS.Cell) => {
    cell.font = { bold: true, color: { argb: WHITE } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BRAND_COLOR } };
    cell.alignment = { vertical: 'middle' };
  });
  row.height = 20;
}

function stripeRow(row: ExcelJS.Row) {
  row.eachCell((cell: ExcelJS.Cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: STRIPE_COLOR } };
  });
}

async function triggerDownload(wb: ExcelJS.Workbook, filename: string) {
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export async function generateExcelReport(expenses: Expense[], meta: ReportMeta) {
  const { totals, grandTotal } = buildCategoryTotals(expenses);
  const sorted = [...expenses].sort((a, b) => a.date.localeCompare(b.date));

  const wb = new ExcelJS.Workbook();
  wb.creator = 'Control de Gastos';
  wb.created = new Date();

  const summaryHeaderRowNum = 6;
  const summary = wb.addWorksheet('Resumen', {
    views: [{ state: 'frozen', ySplit: summaryHeaderRowNum }],
  });
  summary.columns = [{ width: 26 }, { width: 16 }, { width: 14 }];

  summary.mergeCells('A1:C1');
  const title = summary.getCell('A1');
  title.value = 'Informe de Gastos';
  title.font = { bold: true, size: 16, color: { argb: BRAND_COLOR } };
  summary.getRow(1).height = 26;

  summary.getCell('A2').value = 'Usuario';
  summary.getCell('B2').value = `${meta.userName} (${meta.userEmail})`;
  summary.getCell('A3').value = 'Período';
  summary.getCell('B3').value = `${meta.startDate} a ${meta.endDate}`;
  summary.getCell('A4').value = 'Generado';
  summary.getCell('B4').value = new Date().toLocaleString('es-AR');
  for (const addr of ['A2', 'A3', 'A4']) summary.getCell(addr).font = { bold: true };

  const headerRow = summary.getRow(summaryHeaderRowNum);
  headerRow.values = ['Categoría', 'Monto', '% del total'];
  styleHeaderRow(headerRow);

  totals.forEach((t, i) => {
    const row = summary.getRow(summaryHeaderRowNum + 1 + i);
    row.values = [t.category, t.amount, t.pct / 100];
    if (i % 2 === 1) stripeRow(row);
  });

  const totalRowNum = summaryHeaderRowNum + 1 + totals.length;
  const totalRow = summary.getRow(totalRowNum);
  totalRow.values = ['Total', grandTotal, 1];
  totalRow.font = { bold: true };
  totalRow.eachCell((cell: ExcelJS.Cell) => {
    cell.border = { top: { style: 'thin', color: { argb: BRAND_COLOR } } };
  });

  summary.getColumn(2).numFmt = CURRENCY_FORMAT;
  summary.getColumn(3).numFmt = PERCENT_FORMAT;
  summary.autoFilter = { from: `A${summaryHeaderRowNum}`, to: `C${totalRowNum}` };

  const detail = wb.addWorksheet('Detalle', { views: [{ state: 'frozen', ySplit: 1 }] });
  detail.columns = [{ width: 14 }, { width: 20 }, { width: 32 }, { width: 14 }];

  const detailHeaderRow = detail.getRow(1);
  detailHeaderRow.values = ['Fecha', 'Categoría', 'Nota', 'Monto'];
  styleHeaderRow(detailHeaderRow);

  sorted.forEach((e, i) => {
    const row = detail.getRow(i + 2);
    row.values = [e.date, e.category, e.note, e.amount];
    if (i % 2 === 1) stripeRow(row);
  });

  detail.getColumn(4).numFmt = CURRENCY_FORMAT;
  detail.autoFilter = { from: 'A1', to: `D${sorted.length + 1}` };

  await triggerDownload(wb, `gastos_${meta.startDate}_${meta.endDate}.xlsx`);
}
