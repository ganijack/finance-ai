"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDateShort } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Receipt, FileText, Plus, RefreshCw, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useCurrency } from "@/components/providers/currency-provider";

type ReceiptWithExpenses = {
  id: string;
  store: string | null;
  date: string | Date | null;
  total: number | null;
  status: string;
  expenses: { id: string }[];
};

export default function ReceiptsPage() {
  const { format } = useCurrency();
  const [receipts, setReceipts] = useState<ReceiptWithExpenses[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReceipts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/receipts?limit=50");
      if (response.ok) {
        const { data } = await response.json();
        setReceipts(data || []);
      }
    } catch (error) {
      console.error("Failed to fetch receipts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this receipt and all its extracted expenses?")) return;

    try {
      const res = await fetch(`/api/receipts/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Receipt deleted successfully");
        setReceipts((prev) => prev.filter((r) => r.id !== id));
      } else {
        toast.error("Failed to delete receipt");
      }
    } catch {
      toast.error("Failed to delete receipt");
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Receipt History</h1>
          <p className="text-muted-foreground mt-1">
            View all receipts processed by AI and their extracted items.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={fetchReceipts} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button asChild className="bg-gradient-to-r from-violet-600 to-indigo-600">
            <Link href="/receipts/scan">
              <Plus className="mr-2 h-4 w-4" />
              Scan New Receipt
            </Link>
          </Button>
        </div>
      </div>

      <Card className="border-border/40 shadow-xl overflow-hidden">
        <CardHeader className="bg-muted/30 border-b border-border/40">
          <CardTitle>Recent Receipts</CardTitle>
          <CardDescription>Your recently scanned and processed receipts.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[180px]">Date</TableHead>
                <TableHead>Store</TableHead>
                <TableHead>Items Count</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
                  </TableRow>
                ))
              ) : receipts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Receipt className="h-12 w-12 mb-4 opacity-20" />
                      <p>No receipts found</p>
                      <Button variant="link" asChild className="mt-2">
                        <Link href="/receipts/scan">Scan your first receipt</Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                receipts.map((receipt) => (
                  <TableRow key={receipt.id} className="group cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {receipt.date ? formatDateShort(receipt.date) : "Unknown Date"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <FileText className="h-4 w-4" />
                        </div>
                        {receipt.store || "Unknown Store"}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {receipt.expenses?.length || 0} items
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        {receipt.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {format(receipt.total || 0)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={(e) => handleDelete(receipt.id, e)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
