"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ChevronLeft,
  ChevronRight,
  Phone,
  ExternalLink,
  MessageSquare,
} from "lucide-react";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  active: boolean;
  createdAt: string;
  _count: { orderItems: number };
};

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  product: { name: string };
};

type Order = {
  id: string;
  customerPhone: string;
  customerName: string | null;
  totalAmount: number;
  status: string;
  paymentLink: string | null;
  createdAt: string;
  items: OrderItem[];
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    PAID: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/25",
    PENDING: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/25",
    CANCELED: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/25",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variants[status] || "bg-muted text-muted-foreground"}`}>
      {status === "PAID" ? "✅ Lunas" : status === "PENDING" ? "⏳ Menunggu" : "❌ Batal"}
    </span>
  );
}

// ========== STAT CARD ==========
function StatCard({ icon: Icon, label, value, subtitle, color }: {
  icon: any;
  label: string;
  value: string;
  subtitle?: string;
  color: string;
}) {
  return (
    <Card className="shadow-sm border-border/40">
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground font-medium">{label}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ========== PRODUCT DIALOG ==========
function ProductDialog({ open, onOpenChange, product, onSubmit }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  product: Product | null;
  onSubmit: (data: { name: string; description: string; price: string }) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description || "");
      setPrice(product.price.toString());
    } else {
      setName("");
      setDescription("");
      setPrice("");
    }
  }, [product, open]);

  const handleSubmit = async () => {
    if (!name || !price) {
      toast.error("Nama dan harga wajib diisi");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({ name, description, price });
      onOpenChange(false);
    } catch {
      // handled in parent
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Produk" : "Tambah Produk Baru"}</DialogTitle>
          <DialogDescription>
            {product ? "Ubah detail produk yang akan ditampilkan di WhatsApp." : "Produk ini akan muncul di menu WhatsApp bot."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Nama Produk</label>
            <Input placeholder="Kopi Susu Gula Aren" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Deskripsi (opsional)</label>
            <Input placeholder="Kopi susu dengan gula aren asli" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Harga (Rp)</label>
            <Input type="number" placeholder="25000" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Menyimpan..." : product ? "Simpan" : "Tambah"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ========== MAIN PAGE ==========
export default function WACommercePage() {
  // Products
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState("all");
  const [orderPage, setOrderPage] = useState(1);
  const [orderTotalPages, setOrderTotalPages] = useState(1);
  const [orderTotal, setOrderTotal] = useState(0);

  // Tab
  const [activeTab, setActiveTab] = useState<"orders" | "products">("orders");

  // ===== FETCH PRODUCTS =====
  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products);
      }
    } catch {
      toast.error("Gagal memuat produk");
    } finally {
      setProductsLoading(false);
    }
  }, []);

  // ===== FETCH ORDERS =====
  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("status", orderStatus);
      params.set("page", orderPage.toString());
      params.set("limit", "10");
      const res = await fetch(`/api/orders?${params}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
        setOrderTotal(data.total);
        setOrderTotalPages(data.totalPages);
      }
    } catch {
      toast.error("Gagal memuat pesanan");
    } finally {
      setOrdersLoading(false);
    }
  }, [orderStatus, orderPage]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { fetchOrders(); }, [fetchOrders]);
  useEffect(() => { setOrderPage(1); }, [orderStatus]);

  // ===== PRODUCT ACTIONS =====
  const handleCreateProduct = async (data: { name: string; description: string; price: string }) => {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed");
    toast.success("Produk berhasil ditambahkan!");
    fetchProducts();
  };

  const handleUpdateProduct = async (data: { name: string; description: string; price: string }) => {
    if (!editingProduct) return;
    const res = await fetch(`/api/products/${editingProduct.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed");
    toast.success("Produk berhasil diperbarui!");
    setEditingProduct(null);
    fetchProducts();
  };

  const handleToggleProduct = async (product: Product) => {
    const res = await fetch(`/api/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !product.active }),
    });
    if (res.ok) {
      toast.success(product.active ? "Produk dinonaktifkan" : "Produk diaktifkan");
      fetchProducts();
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Produk dihapus");
      fetchProducts();
    }
  };

  // ===== STATS =====
  const totalRevenue = orders.reduce((sum, o) => o.status === "PAID" ? sum + o.totalAmount : sum, 0);
  const paidOrders = orders.filter(o => o.status === "PAID").length;
  const activeProducts = products.filter(p => p.active).length;

  return (
    <div className="flex flex-col">
      <div className="flex-1 p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-emerald-500" />
              WA Commerce
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Kelola produk dan pantau pesanan dari WhatsApp bot
            </p>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Package}
            label="Produk Aktif"
            value={activeProducts.toString()}
            subtitle={`dari ${products.length} total`}
            color="bg-blue-500/15 text-blue-600 dark:text-blue-400"
          />
          <StatCard
            icon={ShoppingCart}
            label="Total Pesanan"
            value={orderTotal.toString()}
            subtitle="semua status"
            color="bg-purple-500/15 text-purple-600 dark:text-purple-400"
          />
          <StatCard
            icon={DollarSign}
            label="Pesanan Lunas"
            value={paidOrders.toString()}
            subtitle="sudah dibayar"
            color="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
          />
          <StatCard
            icon={TrendingUp}
            label="Pendapatan"
            value={formatCurrency(totalRevenue)}
            subtitle="dari pesanan lunas"
            color="bg-amber-500/15 text-amber-600 dark:text-amber-400"
          />
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1 p-1 bg-muted/50 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "orders"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShoppingCart className="h-4 w-4 inline mr-2" />
            Pesanan ({orderTotal})
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "products"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Package className="h-4 w-4 inline mr-2" />
            Produk ({products.length})
          </button>
        </div>

        {/* =================== ORDERS TAB =================== */}
        {activeTab === "orders" && (
          <Card className="shadow-sm border-border/40">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-lg">Daftar Pesanan</CardTitle>
                  <CardDescription>Pesanan masuk dari pelanggan WhatsApp</CardDescription>
                </div>
                <Select value={orderStatus} onValueChange={setOrderStatus}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="PAID">✅ Lunas</SelectItem>
                    <SelectItem value="PENDING">⏳ Menunggu</SelectItem>
                    <SelectItem value="CANCELED">❌ Batal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full rounded-lg" />
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">Belum ada pesanan</p>
                  <p className="text-sm mt-1">Pesanan akan muncul di sini saat pelanggan memesan via WhatsApp</p>
                </div>
              ) : (
                <>
                  <div className="rounded-lg border border-border/40 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30">
                          <TableHead className="font-semibold">Pesanan</TableHead>
                          <TableHead className="font-semibold">Pelanggan</TableHead>
                          <TableHead className="font-semibold">Produk</TableHead>
                          <TableHead className="font-semibold text-right">Total</TableHead>
                          <TableHead className="font-semibold">Status</TableHead>
                          <TableHead className="font-semibold">Waktu</TableHead>
                          <TableHead className="font-semibold"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order.id} className="hover:bg-muted/20 transition-colors">
                            <TableCell className="font-mono text-xs">
                              #{order.id.slice(-8)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1.5">
                                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="text-sm">+{order.customerPhone}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-0.5">
                                {order.items.map((item) => (
                                  <div key={item.id} className="text-sm">
                                    {item.product.name} x{item.quantity}
                                  </div>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              {formatCurrency(order.totalAmount)}
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={order.status} />
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatDate(order.createdAt)}
                            </TableCell>
                            <TableCell>
                              {order.paymentLink && (
                                <a
                                  href={order.paymentLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:text-blue-400 transition-colors"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {orderTotalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setOrderPage((p) => Math.max(1, p - 1))}
                        disabled={orderPage <= 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm text-muted-foreground px-4">
                        Hal {orderPage} dari {orderTotalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setOrderPage((p) => Math.min(orderTotalPages, p + 1))}
                        disabled={orderPage >= orderTotalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* =================== PRODUCTS TAB =================== */}
        {activeTab === "products" && (
          <Card className="shadow-sm border-border/40">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-lg">Daftar Produk</CardTitle>
                  <CardDescription>Produk yang ditampilkan di menu WhatsApp bot</CardDescription>
                </div>
                <Button
                  onClick={() => {
                    setEditingProduct(null);
                    setProductDialogOpen(true);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Produk
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {productsLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full rounded-lg" />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">Belum ada produk</p>
                  <p className="text-sm mt-1">Tambahkan produk agar muncul di menu WhatsApp</p>
                </div>
              ) : (
                <div className="rounded-lg border border-border/40 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="font-semibold">Nama Produk</TableHead>
                        <TableHead className="font-semibold">Deskripsi</TableHead>
                        <TableHead className="font-semibold text-right">Harga</TableHead>
                        <TableHead className="font-semibold text-center">Pesanan</TableHead>
                        <TableHead className="font-semibold text-center">Status</TableHead>
                        <TableHead className="font-semibold text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id} className="hover:bg-muted/20 transition-colors">
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                            {product.description || "—"}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatCurrency(product.price)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary">{product._count.orderItems}</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <button
                              onClick={() => handleToggleProduct(product)}
                              className="transition-colors"
                              title={product.active ? "Nonaktifkan" : "Aktifkan"}
                            >
                              {product.active ? (
                                <ToggleRight className="h-6 w-6 text-emerald-500" />
                              ) : (
                                <ToggleLeft className="h-6 w-6 text-muted-foreground" />
                              )}
                            </button>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingProduct(product);
                                  setProductDialogOpen(true);
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Product Dialog */}
      <ProductDialog
        open={productDialogOpen}
        onOpenChange={(v) => {
          setProductDialogOpen(v);
          if (!v) setEditingProduct(null);
        }}
        product={editingProduct}
        onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
      />
    </div>
  );
}
