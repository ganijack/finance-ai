"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandLogo } from "@/components/shared/brand-logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Search, Check } from "lucide-react";
import { CURRENCIES, getPopularCurrencies, getOtherCurrencies, type CurrencyInfo } from "@/lib/currencies";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currency, setCurrency] = useState("IDR");
  const [currencySearch, setCurrencySearch] = useState("");
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const selectedCurrency = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      // Save currency preference
      try {
        await fetch("/api/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currency }),
        });
      } catch {
        // Non-critical, settings will default to IDR
      }

      toast.success("Account created! Redirecting...");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderCurrencyItem = (c: CurrencyInfo) => (
    <button
      key={c.code}
      type="button"
      onClick={() => {
        setCurrency(c.code);
        setCurrencyOpen(false);
        setCurrencySearch("");
      }}
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

  return (
    <Card className="border-border/40 shadow-xl">
      <CardHeader className="space-y-3 text-center">
        <div className="flex justify-center mb-8">
          <BrandLogo />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">
          Create an account
        </CardTitle>
        <CardDescription>
          Get started with FinanceAI for free
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleRegister}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              minLength={6}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              minLength={6}
            />
          </div>

          {/* Currency Selector */}
          <div className="space-y-2">
            <Label>Currency</Label>
            <Popover open={currencyOpen} onOpenChange={setCurrencyOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start font-normal"
                >
                  <span className="text-lg mr-2">{selectedCurrency.flag}</span>
                  <span className="font-medium">{selectedCurrency.code}</span>
                  <span className="text-muted-foreground ml-2 truncate">
                    — {selectedCurrency.name}
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
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
