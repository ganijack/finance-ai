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
import * as XLSX from "xlsx";
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
      const formattedData = data.map(d => ({
        ...d,
        date: new Date(d.date).toLocaleDateString()
      }));
      
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");
      XLSX.writeFile(workbook, `financeai-export-${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success("Excel Export successful!");
    } catch (error) {
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
