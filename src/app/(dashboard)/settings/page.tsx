"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useUser } from "@/hooks/use-user";
import { useCurrency } from "@/components/providers/currency-provider";
import Link from "next/link";
import {
  User,
  Palette,
  DollarSign,
  LogOut,
  Moon,
  Sun,
  Monitor,
  Mail,
  Loader2,
  Globe,
  Clock,
  Search,
  Check,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CURRENCIES, getPopularCurrencies, getOtherCurrencies, getCurrencyByCode, type CurrencyInfo } from "@/lib/currencies";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { user, loading, signOut } = useUser();
  const { theme, setTheme } = useTheme();
  const { currency, currencyInfo, changeCurrency } = useCurrency();
  const router = useRouter();

  const [currencySearch, setCurrencySearch] = useState("");
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingCurrency, setPendingCurrency] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  const filteredPopular = getPopularCurrencies().filter(c =>
    currencySearch === "" ||
    c.name.toLowerCase().includes(currencySearch.toLowerCase()) ||
    c.code.toLowerCase().includes(currencySearch.toLowerCase())
  );

  const filteredOther = getOtherCurrencies().filter(c =>
    currencySearch === "" ||
    c.name.toLowerCase().includes(currencySearch.toLowerCase()) ||
    c.code.toLowerCase().includes(currencySearch.toLowerCase())
  );

  const handleCurrencySelect = async (code: string) => {
    setCurrencyOpen(false);
    setCurrencySearch("");
    if (code === currency) return;

    setPendingCurrency(code);

    // Fetch exchange rate for confirmation dialog
    try {
      const res = await fetch(`/api/currency/convert?from=${currency}&to=${code}`);
      if (res.ok) {
        const data = await res.json();
        setExchangeRate(data.rate);
      }
    } catch {
      setExchangeRate(null);
    }

    setConfirmOpen(true);
  };

  const handleConfirmConvert = async () => {
    if (!pendingCurrency) return;

    setConverting(true);
    try {
      await changeCurrency(pendingCurrency);
      toast.success(`Currency changed to ${pendingCurrency}! All data has been converted.`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to convert currency");
    } finally {
      setConverting(false);
      setConfirmOpen(false);
      setPendingCurrency(null);
      setExchangeRate(null);
    }
  };

  const renderCurrencyItem = (c: CurrencyInfo) => (
    <button
      key={c.code}
      type="button"
      onClick={() => handleCurrencySelect(c.code)}
      className="flex items-center gap-3 w-full px-3 py-2 text-left text-sm rounded-lg hover:bg-accent/50 transition-colors"
    >
      <span className="text-lg">{c.flag}</span>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{c.code}</p>
        <p className="text-xs text-muted-foreground truncate">{c.name}</p>
      </div>
      {currency === c.code && (
        <Check className="h-4 w-4 text-primary shrink-0" />
      )}
    </button>
  );

  const pendingCurrencyInfo = pendingCurrency ? getCurrencyByCode(pendingCurrency) : null;

  return (
    <div className="flex flex-col">
      <div className="flex-1 p-4 sm:p-6 space-y-6 max-w-2xl">
        {/* Profile */}
        <Card className="border-border/40 animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-base">Profile</CardTitle>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/settings/profile">
                Edit Profile
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-semibold uppercase">
                  {user?.email?.[0] || "?"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    <p className="text-sm font-medium">{user?.email}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Joined{" "}
                    {user?.created_at
                      ? new Date(user.created_at).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })
                      : "—"}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Currency & Language */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Currency */}
          <Card className="border-border/40 animate-fade-in stagger-1">
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <DollarSign className="h-5 w-5 text-emerald-500" />
              </div>
              <CardTitle className="text-base">Currency</CardTitle>
            </CardHeader>
            <CardContent>
              <Popover open={currencyOpen} onOpenChange={setCurrencyOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start font-normal"
                  >
                    <span className="text-lg mr-2">{currencyInfo.flag}</span>
                    <span className="font-medium">{currencyInfo.code}</span>
                    <span className="text-muted-foreground ml-2 truncate">
                      ({currencyInfo.symbol})
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[320px] p-0" align="start">
                  <div className="p-3 border-b border-border/40">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search currency..."
                        value={currencySearch}
                        onChange={(e) => setCurrencySearch(e.target.value)}
                        className="pl-9 h-9"
                      />
                    </div>
                  </div>
                  <div className="max-h-[280px] overflow-y-auto p-2">
                    {filteredPopular.length > 0 && (
                      <>
                        <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Popular
                        </p>
                        {filteredPopular.map(renderCurrencyItem)}
                      </>
                    )}
                    {filteredOther.length > 0 && (
                      <>
                        <div className="my-2 border-t border-border/40" />
                        <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          All Currencies
                        </p>
                        {filteredOther.map(renderCurrencyItem)}
                      </>
                    )}
                    {filteredPopular.length === 0 && filteredOther.length === 0 && (
                      <p className="text-center text-sm text-muted-foreground py-4">
                        No currency found
                      </p>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </CardContent>
          </Card>

          {/* Language */}
          <Card className="border-border/40 animate-fade-in stagger-1">
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                <Globe className="h-5 w-5 text-blue-500" />
              </div>
              <CardTitle className="text-base">Language</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">English (US)</p>
                  <p className="text-xs text-muted-foreground">
                    Default app language
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  EN
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Theme & Timezone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Timezone */}
          <Card className="border-border/40 animate-fade-in stagger-2">
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10">
                <Clock className="h-5 w-5 text-orange-500" />
              </div>
              <CardTitle className="text-base">Timezone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Asia/Jakarta</p>
                  <p className="text-xs text-muted-foreground">
                    GMT+7
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Theme */}
          <Card className="border-border/40 animate-fade-in stagger-2">
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
                <Palette className="h-5 w-5 text-purple-500" />
              </div>
              <CardTitle className="text-base">Appearance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {themes.map((t) => {
                  const Icon = t.icon;
                  const isActive = theme === t.value;
                  return (
                    <button
                      key={t.value}
                      onClick={() => setTheme(t.value)}
                      className={cn(
                        "flex flex-col items-center gap-1 rounded-xl border-2 p-2 transition-all duration-200 cursor-pointer",
                        isActive
                          ? "border-primary bg-primary/5"
                          : "border-border/40 hover:border-border hover:bg-accent/50"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4",
                          isActive ? "text-primary" : "text-muted-foreground"
                        )}
                      />
                      <span
                        className={cn(
                          "text-[10px] font-medium",
                          isActive ? "text-primary" : "text-muted-foreground"
                        )}
                      >
                        {t.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Logout */}
        <Card className="border-border/40 animate-fade-in stagger-3">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Sign out</p>
                <p className="text-xs text-muted-foreground">
                  Sign out of your account on this device
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={signOut}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Currency Conversion Confirmation Dialog */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Change Currency
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>
                  Are you sure you want to change your currency? All your financial data will be converted.
                </p>
                <div className="flex items-center justify-center gap-3 py-3 px-4 rounded-lg bg-muted/50">
                  <div className="text-center">
                    <p className="text-lg">{currencyInfo.flag}</p>
                    <p className="text-sm font-bold">{currencyInfo.code}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  <div className="text-center">
                    <p className="text-lg">{pendingCurrencyInfo?.flag}</p>
                    <p className="text-sm font-bold">{pendingCurrencyInfo?.code}</p>
                  </div>
                </div>
                {exchangeRate && (
                  <p className="text-sm text-center text-muted-foreground">
                    Exchange rate: 1 {currencyInfo.code} = {exchangeRate.toFixed(6)} {pendingCurrency}
                  </p>
                )}
                <p className="text-xs text-amber-500">
                  ⚠️ This will convert all expenses, budgets, goals, and recurring expenses. Original values will be saved as backup.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={converting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmConvert}
              disabled={converting}
              className="bg-primary"
            >
              {converting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Converting...
                </>
              ) : (
                "Convert & Change"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
