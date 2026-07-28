"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileJson, FileSpreadsheet, FileText, Loader2, Table } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  notes: string | null;
  type?: "INCOME" | "EXPENSE";
}

export function ExportButton() {
  const [isExporting, setIsExporting] = useState(false);

  const fetchExpenses = async (): Promise<Expense[]> => {
    const res = await fetch("/api/export?format=json");
    if (!res.ok) throw new Error("Failed to fetch data");
    return res.json();
  };

  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      const data = await fetchExpenses();
      const csv = Papa.unparse(data.map(d => ({
        ...d,
        date: new Date(d.date).toLocaleDateString()
      })));
      
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `financeai-export-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("CSV Export successful!");
    } catch (error) {
      toast.error("Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      setIsExporting(true);
      const data = await fetchExpenses();
      
      // Sort data chronologically (oldest to newest) to calculate running balance
      const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("KEUANGAN KESELURUHAN");

      // Set Title
      worksheet.mergeCells('A1:G1');
      const titleCell = worksheet.getCell('A1');
      titleCell.value = "KEUANGAN KESELURUHAN";
      titleCell.font = { bold: true, size: 14 };
      titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
      
      // Leave row 2 and 3 blank as per user example (optional but looks nice)
      
      // Define Columns at row 4
      const columns = [
        { header: 'NO', key: 'no', width: 5 },
        { header: 'HARI/TANGGAL', key: 'tanggal', width: 15 },
        { header: 'KETERANGAN', key: 'keterangan', width: 35 },
        { header: 'KATEGORI', key: 'kategori', width: 20 },
        { header: 'DEBIT (Rp)', key: 'debit', width: 20 },
        { header: 'KREDIT (Rp)', key: 'kredit', width: 20 },
        { header: 'SALDO (Rp)', key: 'saldo', width: 20 },
      ];
      
      worksheet.getRow(4).values = columns.map(col => col.header);
      
      // Style Header
      const headerRow = worksheet.getRow(4);
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFD9E1F2' } // Light blue like image or pinkish
        };
        cell.font = { bold: true };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
          top: {style:'thin'},
          left: {style:'thin'},
          bottom: {style:'thin'},
          right: {style:'thin'}
        };
      });

      let runningBalance = 0;
      
      // Add Data
      sortedData.forEach((row, index) => {
        const isIncome = row.type === "INCOME";
        const amount = Number(row.amount);
        
        const debit = isIncome ? amount : null;
        const kredit = !isIncome ? amount : null;
        
        if (isIncome) {
          runningBalance += amount;
        } else {
          runningBalance -= amount;
        }

        // Format Date to short format like dd/mm/yyyy
        const dateObj = new Date(row.date);
        const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;

        const addedRow = worksheet.addRow([
          index + 1,
          formattedDate,
          row.title,
          row.category,
          debit,
          kredit,
          runningBalance
        ]);
        
        // Style Data Row
        addedRow.eachCell((cell, colNumber) => {
          cell.border = {
            top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'}
          };
          if (colNumber >= 5) {
            // Currency formatting
            cell.numFmt = 'Rp#,##0.00;[Red]-Rp#,##0.00';
          }
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(blob, `financeai-export-${new Date().toISOString().split('T')[0]}.xlsx`);

      toast.success("Excel Export successful!");
    } catch (error) {
      console.error(error);
      toast.error("Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      const data = await fetchExpenses();
      
      const doc = new jsPDF();
      doc.text("FinanceAI - Expense Report", 14, 15);
      
      const tableData = data.map(d => [
        new Date(d.date).toLocaleDateString(),
        d.title,
        d.category,
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(d.amount),
        d.notes || ""
      ]);

      autoTable(doc, {
        head: [['Date', 'Title', 'Category', 'Amount', 'Notes']],
        body: tableData,
        startY: 20,
      });

      doc.save(`financeai-export-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success("PDF Export successful!");
    } catch (error) {
      toast.error("Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportJSON = async () => {
    try {
      setIsExporting(true);
      window.location.href = "/api/export?format=json";
      toast.success("JSON Export started!");
    } catch (error) {
      toast.error("Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isExporting}>
          {isExporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Export Data
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Choose format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleExportCSV}>
          <Table className="mr-2 h-4 w-4 text-emerald-500" />
          CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportExcel}>
          <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600" />
          Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPDF}>
          <FileText className="mr-2 h-4 w-4 text-red-500" />
          PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportJSON}>
          <FileJson className="mr-2 h-4 w-4 text-amber-500" />
          JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
